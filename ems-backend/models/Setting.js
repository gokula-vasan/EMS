const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
    companyName: { type: String, default: 'EMS Nexus' },
    contactEmail: { type: String, default: 'admin@nexus.io' },
    address: { type: String, default: '123 Tech Park' },
    allowRemoteClockIn: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    autoApproveLeave: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Setting', settingSchema);