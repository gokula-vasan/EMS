const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');

// Route for /api/admin/users
router.route('/users')
    .get(protect, admin, getUsers)    // Get all users
    .post(protect, admin, createUser); // Add new user

// Route for /api/admin/users/:id
router.route('/users/:id')
    .put(protect, admin, updateUser)     // Update user details
    .delete(protect, admin, deleteUser); // Delete user

module.exports = router;