
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const User = require('../models/user.model');
const { connectDB } = require('../config/db.config');
const { ROLES } = require('../config/constants');
require('../utils/loadEnv');

const seedAdminUser = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin already exists');
    } else {
      const admin = new User({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
        role: ROLES.ADMIN
      });

      await admin.save();
      console.log('Admin created successfully');
    }

    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

seedAdminUser();
