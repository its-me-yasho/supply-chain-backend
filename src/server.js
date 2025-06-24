const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const checklistRoutes = require("./routes/checklist.routes");
const uploadRoutes = require("./routes/upload.routes");
const orderRoutes = require("./routes/order.routes");
const { connectDB } = require("./config/db.config");

require("./utils/loadEnv");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Supply Chain API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes); 
app.use("/api/checklist", checklistRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
