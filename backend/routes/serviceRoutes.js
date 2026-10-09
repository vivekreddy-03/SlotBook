const express = require("express");
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deactivateService
} = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", protect, adminOnly, createService);
router.patch("/:id", protect, adminOnly, updateService);
router.delete("/:id", protect, adminOnly, deactivateService);

module.exports = router;
