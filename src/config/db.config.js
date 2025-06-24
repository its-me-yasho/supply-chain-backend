
const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supplychain';

exports.connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};