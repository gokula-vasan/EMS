const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    month: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    increment: { type: Number, default: 0 }, // 👈 NEW FIELD
    netPay: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);