const User = require('../models/User');
const Setting = require('../models/Setting');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register (Public)
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'employee' 
        });

        if (user) {
            res.status(201).json({ 
                _id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                token: generateToken(user._id) 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check Maintenance Mode
        const settings = await Setting.findOne();
        const user = await User.findOne({ email });

        if (settings?.maintenanceMode && user?.role !== 'admin') {
             return res.status(503).json({ message: 'System is under maintenance. Please try again later.' });
        }

        // 2. Validate Password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Token
const verify = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Update Profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 👇 CRITICAL: Make sure ALL functions are exported here!
module.exports = { register, login, verify, updateProfile };