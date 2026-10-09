const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

app.use(express.json());
app.use("/", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`SlotBook backend running on port ${PORT}`);
    });
};

if (require.main === module) {
    startServer().catch(error => {
        console.error("Failed to start SlotBook:", error.message);
        process.exit(1);
    });
}

module.exports = app;
