const Attendance = require('../models/Attendance');

// @desc    Get status for today (Has user clocked in?)
// @route   GET /api/attendance/status
const getStatus = async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const attendance = await Attendance.findOne({ 
        userId: req.user._id, 
        date: today 
    });

    if (attendance) {
        res.json({ 
            clockedIn: true, 
            clockInTime: attendance.clockIn,
            clockOutTime: attendance.clockOut || null
        });
    } else {
        res.json({ clockedIn: false, clockInTime: null, clockOutTime: null });
    }
};

// @desc    Clock In
// @route   POST /api/attendance/clock-in
const clockIn = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = await Attendance.findOne({ userId: req.user._id, date: today });

    if (existingRecord) {
        return res.status(400).json({ message: 'You have already clocked in today.' });
    }

    const attendance = await Attendance.create({
        userId: req.user._id,
        date: today,
        clockIn: new Date(),
        status: 'Present'
    });

    res.status(201).json(attendance);
};

// @desc    Clock Out
// @route   PUT /api/attendance/clock-out
const clockOut = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ userId: req.user._id, date: today });

    if (!attendance) {
        return res.status(400).json({ message: 'You have not clocked in yet.' });
    }

    if (attendance.clockOut) {
        return res.status(400).json({ message: 'You have already clocked out today.' });
    }

    attendance.clockOut = new Date();
    await attendance.save();

    res.json(attendance);
};

// @desc    Get Attendance History
// @route   GET /api/attendance/history
const getHistory = async (req, res) => {
    const history = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
};

module.exports = { getStatus, clockIn, clockOut, getHistory };