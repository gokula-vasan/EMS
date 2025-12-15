const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getEmployees } = require('../controllers/managerController'); // Import it

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/employees', protect, getEmployees); // 👈 New Route

module.exports = router;