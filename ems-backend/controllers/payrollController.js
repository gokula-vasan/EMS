const Payroll = require('../models/Payroll');
const mongoose = require('mongoose'); // 👈 Required for ObjectId casting

// @desc    Get My Payroll History
const getMyPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find({ userId: req.user._id }).sort({ paymentDate: -1 });
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create Payroll Record (Admin)
const createPayroll = async (req, res) => {
    try {
        const { userId, month, basicSalary, allowances, deductions, increment } = req.body;
        
        const netPay = Number(basicSalary) + Number(allowances) - Number(deductions);

        // 👇 CRITICAL FIX: Cast string ID to mongoose ObjectId
        const payroll = await Payroll.create({
            userId: new mongoose.Types.ObjectId(userId), 
            month,
            basicSalary,
            allowances,
            deductions,
            increment,
            netPay
        });
        
        res.status(201).json(payroll);
    } catch (error) {
        console.error("Create Payroll Error:", error);
        res.status(400).json({ message: 'Could not create payroll record. Check User ID.' });
    }
};

// @desc    Get All (For Dashboard stats)
const getAllPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('userId', 'name email department');
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyPayroll, createPayroll, getAllPayroll };