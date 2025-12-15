const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, addUser, deleteUser, getDashboardStats } = require('../controllers/adminController');

// User Management
router.get('/users', protect, admin, getUsers);
router.post('/users/add', protect, admin, addUser); // Matches the frontend call
router.delete('/users/:id', protect, admin, deleteUser);

// Dashboard Data
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;