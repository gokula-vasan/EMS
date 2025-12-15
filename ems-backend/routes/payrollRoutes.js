const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getMyPayroll, createPayroll, getAllPayroll } = require('../controllers/payrollController');

router.get('/my-history', protect, getMyPayroll);
router.get('/all', protect, admin, getAllPayroll); // Good for Admin Overview
router.post('/create', protect, admin, createPayroll);

module.exports = router;