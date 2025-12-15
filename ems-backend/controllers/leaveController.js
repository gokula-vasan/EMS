const Leave = require('../models/Leave');

// @desc    Apply for Leave (Employee)
// @route   POST /api/leaves/apply
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validation
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const leave = await Leave.create({
            userId: req.user._id, // This comes from the 'protect' middleware
            leaveType,
            startDate,
            endDate,
            reason
        });

        res.status(201).json(leave);
    } catch (error) {
        console.error("Apply Leave Error:", error);
        res.status(500).json({ message: 'Server Error: Could not apply for leave' });
    }
};

// @desc    Get My Leave History (Employee)
// @route   GET /api/leaves/my-leaves
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user._id }).sort({ appliedOn: -1 });
        res.json(leaves);
    } catch (error) {
        console.error("Get My Leaves Error:", error);
        res.status(500).json({ message: 'Server Error: Could not fetch leaves' });
    }
};

// @desc    Get Pending Approvals (Manager)
// @route   GET /api/leaves/pending
const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'Pending' })
            .populate('userId', 'name email department')
            .sort({ appliedOn: -1 });
        
        res.json(leaves);
    } catch (error) {
        console.error("Get Pending Leaves Error:", error);
        res.status(500).json({ message: 'Server Error: Could not fetch pending leaves' });
    }
};

// @desc    Approve/Reject Leave (Manager)
// @route   PUT /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.status = status;
        await leave.save();

        res.json(leave);
    } catch (error) {
        console.error("Update Leave Status Error:", error);
        res.status(500).json({ message: 'Server Error: Could not update leave' });
    }
};

module.exports = { applyLeave, getMyLeaves, getPendingLeaves, updateLeaveStatus };