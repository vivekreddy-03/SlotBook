const express = require("express");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

router.get("/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Admin access successful"
    });
});

module.exports = router;