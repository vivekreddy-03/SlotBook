const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
connectDB();
const healthRoutes = require("./routes/healthRoutes");
app.use(express.json());
app.use("/", healthRoutes);
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("SlotBook API is running");
});

app.listen(PORT, () => {
    console.log(`SlotBook backend running on port ${PORT}`);
});