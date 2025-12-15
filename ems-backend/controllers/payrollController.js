const Payroll = require('../models/Payroll');
const mongoose = require('mongoose'); // 👈 Import mongoose

// Get My History
const getMyPayroll = async (req, res) => {
    try {
        // Debugging: Log what we are searching for
        // console.log("Searching Payroll for User ID:", req.user._id);

        const payrolls = await Payroll.find({ userId: req.user._id }).sort({ paymentDate: -1 });
        res.json(payrolls);
    } catch (error) {
        console.error("Get Payroll Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create Record
const createPayroll = async (req, res) => {
    const { userId, month, basicSalary, allowances, deductions, increment } = req.body;
    
    const netPay = Number(basicSalary) + Number(allowances) - Number(deductions);

    try {
        const payroll = await Payroll.create({
            userId: new mongoose.Types.ObjectId(userId), // 👈 FORCE CAST TO OBJECTID
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
        res.status(400).json({ message: 'Could not create payroll record' });
    }
};

const getAllPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('userId', 'name email department');
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyPayroll, createPayroll, getAllPayroll };