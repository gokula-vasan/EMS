const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    // Return all users but exclude passwords
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Create a new User (Onboarding)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (Password hashing is handled in User model pre-save hook)
    const user = await User.create({
        name,
        email,
        password,
        role,
        department
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Update User (Promote/Demote/Edit)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete User (Offboarding)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };