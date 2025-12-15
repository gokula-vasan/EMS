const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStatus, clockIn, clockOut, getHistory } = require('../controllers/attendanceController');

// All routes here are protected
router.get('/status', protect, getStatus);
router.post('/clock-in', protect, clockIn);
router.put('/clock-out', protect, clockOut);
router.get('/history', protect, getHistory);

module.exports = router;