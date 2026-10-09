const mongoose = require("mongoose");
const Service = require("../models/Service");

const createService = async (req, res) => {
    try {
        const { name, description = "", duration, price } = req.body;

        if (typeof name !== "string" || !name.trim() ||
            typeof description !== "string" ||
            !Number.isInteger(duration) || duration < 5 ||
            !Number.isFinite(price) || price < 0) {
            return res.status(400).json({ message: "Invalid service details" });
        }

        const service = await Service.create({
            name: name.trim(), description, duration, price
        });

        res.status(201).json({ message: "Service created successfully", service });
    } catch (error) {
        res.status(500).json({ message: "Failed to create service" });
    }
};

const getServices = async (req, res) => {
    try {
        const services = await Service.find({ active: true }).sort({ createdAt: -1 });
        res.json(services);
    } catch {
        res.status(500).json({ message: "Failed to fetch services" });
    }
};

const getServiceById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid service ID" });
        }

        const service = await Service.findOne({ _id: req.params.id, active: true });
        if (!service) return res.status(404).json({ message: "Service not found" });

        res.json(service);
    } catch {
        res.status(500).json({ message: "Failed to fetch service" });
    }
};

const updateService = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid service ID" });
        }

        const allowed = ["name", "description", "duration", "price", "active"];
        const updates = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: "No updates provided" });
        }

        if ("name" in updates &&
            (typeof updates.name !== "string" || !updates.name.trim())) {
            return res.status(400).json({ message: "Invalid service name" });
        }
        if ("description" in updates && typeof updates.description !== "string") {
            return res.status(400).json({ message: "Invalid description" });
        }
        if ("duration" in updates &&
            (!Number.isInteger(updates.duration) || updates.duration < 5)) {
            return res.status(400).json({ message: "Duration must be at least 5 minutes" });
        }
        if ("price" in updates &&
            (!Number.isFinite(updates.price) || updates.price < 0)) {
            return res.status(400).json({ message: "Price must be zero or more" });
        }
        if ("active" in updates && typeof updates.active !== "boolean") {
            return res.status(400).json({ message: "Active must be true or false" });
        }

        if (updates.name) updates.name = updates.name.trim();

        const service = await Service.findByIdAndUpdate(
            req.params.id, { $set: updates },
            { new: true, runValidators: true }
        );

        if (!service) return res.status(404).json({ message: "Service not found" });

        res.json({ message: "Service updated successfully", service });
    } catch {
        res.status(500).json({ message: "Failed to update service" });
    }
};

const deactivateService = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid service ID" });
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id, { $set: { active: false } },
            { new: true }
        );

        if (!service) return res.status(404).json({ message: "Service not found" });

        res.json({ message: "Service deactivated successfully", service });
    } catch {
        res.status(500).json({ message: "Failed to deactivate service" });
    }
};

module.exports = {
    createService,
    getServices,
    getServiceById,
    updateService,
    deactivateService
};
