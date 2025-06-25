const { ROLES } = require("../config/constants");
const User = require("../models/user.model");

exports.getInspectorByPM = async (req, res) => {
    try {
        if (req.user.role !== ROLES.PROCUREMENT) {
            return res.status(403).json({ message: "Only procurement managers can fetch inspectors" });
        }
        const inspectors = await User.find({ role: ROLES.INSPECTION, reportTo: req.user.id }).select("-password");
        res.status(200).json({ inspectors});
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching inspectors", error: err.message });
    } 
};

exports.getInspectorByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const inspector = await User.findOne({ email, role: ROLES.INSPECTION }).select("-password").populate("reportTo", "name email role");
        if (!inspector) {
            return res.status(404).json({ message: "Inspector not found" });
        }
        res.status(200).json({ inspector });
    } catch (error) {
        res.status(500).json({ message: "Error fetching inspector", error: error.message });
    }
};

exports.assignInspector = async (req, res) => {
    const { inspectorEmail, procurementManagerEmail } = req.body;

    try {
        const inspector = await User.findOne({ email: inspectorEmail, role: ROLES.INSPECTION });
        if (!inspector || inspector.role !== ROLES.INSPECTION) {
            return res.status(404).json({ message: "Inspector not found or invalid role" });
        }
        const procurementManager = await User.findOne({ email: procurementManagerEmail, role: ROLES.PROCUREMENT });
        if (!procurementManager || procurementManager.role !== ROLES.PROCUREMENT) {
            return res.status(404).json({ message: "Procurement manager not found or invalid role" });
        }
        inspector.reportTo = procurementManager._id;

        const savedInspector = await inspector.save();
        savedInspector.password = undefined;

        res.status(200).json({ message: "Inspector assigned successfully", savedInspector });
    } catch (error) {
        res.status(500).json({ message: "Error assigning inspector", error: error.message });
    }
};

exports.unassignInspector = async (req, res) => {
    const { inspectorEmail } = req.body;

    try {
        const inspector = await User.findOne({ email: inspectorEmail, role: ROLES.INSPECTION });
        if (!inspector || inspector.role !== ROLES.INSPECTION) {
            return res.status(404).json({ message: "Inspector not found or invalid role" });
        }
        inspector.reportTo = null;
        await inspector.save();

        res.status(200).json({ message: "Inspector unassigned successfully", inspector });
    } catch (error) {
        res.status(500).json({ message: "Error unassigning inspector", error: error.message });
    }
};