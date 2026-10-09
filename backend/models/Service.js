const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    duration: { type: Number, required: true, min: 5 },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
