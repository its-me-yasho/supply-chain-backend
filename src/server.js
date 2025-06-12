const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const checklistRoutes = require("./routes/checklist.routes");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => res.send("Supply Chain API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/checklist", checklistRoutes);

app.use("/uploads", express.static("uploads"));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
