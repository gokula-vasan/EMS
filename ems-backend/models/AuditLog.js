const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "User Added", "Payroll Run"
    details: { type: String }, 
    performedBy: { type: String, default: 'System' }, // Admin Name or ID
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);