const express = require('express');
const router = express.Router();
// 👇 Ensure these names match the exports in authController.js exactly
const { register, login, verify, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', register);
router.post('/login', login);
router.get('/verify', protect, verify);
router.put('/profile', protect, updateProfile);

module.exports = router;