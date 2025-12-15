const Leave = require('../models/Leave');
const Setting = require('../models/Setting'); // 👈 Import Settings Model

// @desc    Apply for Leave
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // 1. Fetch Global Settings
        const settings = await Setting.findOne();
        
        // 2. Determine Status
        // If Auto-Approve is ON and it's Sick Leave, approve immediately.
        let initialStatus = 'Pending';
        if (settings?.autoApproveLeave && leaveType === 'Sick Leave') {
            initialStatus = 'Approved';
        }

        const leave = await Leave.create({
            userId: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
            status: initialStatus // 👈 Use dynamic status
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not apply for leave' });
    }
};

// @desc    Get My Leaves
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user._id }).sort({ appliedOn: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Pending Leaves (For Manager/Admin)
const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'Pending' }).populate('userId', 'name email').sort({ appliedOn: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Leave Status
const updateLeaveStatus = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (leave) {
            leave.status = req.body.status;
            await leave.save();
            res.json(leave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyLeave, getMyLeaves, getPendingLeaves, updateLeaveStatus };