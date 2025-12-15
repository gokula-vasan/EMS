const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// 1. Dashboard Stats
const getDashboardStats = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const presentToday = await Attendance.countDocuments({ date: today, status: 'Present' });
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const onLeave = await Leave.countDocuments({ status: 'Approved' }); 

    res.json({ totalEmployees, presentToday, pendingLeaves, onLeave });
};

// 2. Get Employees List (THIS WAS LIKELY MISSING)
const getEmployees = async (req, res) => {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
};

// 3. Export BOTH functions
module.exports = { getDashboardStats, getEmployees };