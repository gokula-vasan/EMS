const User = require('../models/User');
const Payroll = require('../models/Payroll');
const Leave = require('../models/Leave');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching users' });
    }
};

// @desc    Add new user
// @route   POST /api/admin/users/add
const addUser = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department: department || 'General'
        });

        // 📝 Create Audit Log
        await AuditLog.create({
            action: 'User Onboarded',
            details: `Added ${role}: ${email}`,
            performedBy: req.user.name
        });

        res.status(201).json(user);

    } catch (error) {
        console.error("AddUser Error:", error);
        res.status(500).json({ message: 'Server Error adding user' });
    }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            
            // 📝 Create Audit Log
            await AuditLog.create({
                action: 'User Removed',
                details: `Deleted user: ${user.email}`,
                performedBy: req.user.name
            });

            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting user' });
    }
};

// @desc    Get Full Admin Dashboard Data
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
    try {
        // 1. User Counts
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const admins = await User.countDocuments({ role: 'admin' });

        // 2. Financials
        const payrolls = await Payroll.find({});
        const totalPayroll = payrolls.reduce((acc, curr) => acc + curr.netPay, 0);

        // 3. System Alerts
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
        const alerts = [];
        if (pendingLeaves > 0) alerts.push(`${pendingLeaves} Leave Request(s) Pending Review`);
        if (totalEmployees === 0) alerts.push("System Empty: No Employees Found");
        
        // 4. Recent Logs
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            stats: {
                totalEmployees,
                totalPayroll,
                adminsCount: admins
            },
            alerts,
            logs
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: 'Server Error loading dashboard' });
    }
};

module.exports = { getUsers, addUser, deleteUser, getDashboardStats };