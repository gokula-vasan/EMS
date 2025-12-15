const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    res.json(settings);
};

const updateSettings = async (req, res) => {
    let settings = await Setting.findOne();
    if (!settings) settings = new Setting();
    
    Object.assign(settings, req.body); // Update all fields matched
    await settings.save();
    res.json(settings);
};

module.exports = { getSettings, updateSettings };