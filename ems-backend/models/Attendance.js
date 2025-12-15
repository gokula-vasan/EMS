const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    clockIn: { type: Date },
    clockOut: { type: Date },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);