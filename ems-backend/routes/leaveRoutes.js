const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { applyLeave, getMyLeaves, getPendingLeaves, updateLeaveStatus } = require('../controllers/leaveController');

// Employee Routes
router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);

// Manager Routes
router.get('/pending', protect, getPendingLeaves);
router.put('/:id', protect, updateLeaveStatus);

module.exports = router;