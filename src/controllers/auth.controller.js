const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateToken } = require("../utils/tokenHelper");
const { ROLES, allowedCreation } = require("../config/constants");

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isMobile = /^\d{10}$/.test(identifier);

    if (!isEmail && !isMobile) {
      return res.status(400).json({ message: "Invalid Email/Mobile Number format" });
    }
    const user = await User.findOne({
      $or: [
        { email: isEmail ? identifier : "" },
        { mobile: isMobile ? identifier : "" }
      ]
    })
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === ROLES.INSPECTION && !isMobile) {
      return res.status(400).json({ message: "Inspection manager should login with mobile number" });
    }

    if (user.role !== ROLES.INSPECTION && !isEmail) {
      return res.status(400).json({ message: `Email is required for role ${user.role}` });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


exports.register = async (req, res) => {
  const {
    name,
    email = "",
    mobile = "",
    password,
    role,
    procurementManager,
  } = req.body;

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isMobile = /^\d{10}$/.test(mobile);
    if (!isEmail || !isMobile) {
      return res.status(400).json({ message: "Invalid Email/Mobile Number format" });
    }

    if ( !email && !mobile ) {
      return res.status(400).json({ message: "Email or mobile is required" });
    }
    if (!name || !password || !role) {
      return res.status(400).json({ message: "Name, password and role are required" });
    }
    if(!mobile && role === ROLES.INSPECTION) {
      return res.status(400).json({ message: "Mobile is required for inspection manager" });
    }
    if (!email && role !== ROLES.INSPECTION) {
      return res.status(400).json({ message: `Email is required for role ${role}` });
    }
    console.log("user", req.user);
    const creator = await User.findById(req.user.id);
    if (!creator) return res.status(400).json({ message: "Creator not found" });

    const canCreate = allowedCreation[creator.role] || [];
    if (!canCreate.includes(role)) {
      return res.status(403).json({
        message: `${creator.role} is not allowed to create user with role ${role}`,
      });
    }
    const existing = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User already exists. Contact admin." });
    }

    if (role === ROLES.INSPECTION) {
      const conflict = await User.findOne({ mobile });
      if (conflict) {
        return res.status(400).json({
          message: "Inspection Manager already exists. Contact admin.",
        });
      }
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email : email ? email : undefined,
      mobile : mobile ? mobile : undefined,
      password: hash,
      role,
      createdBy: req.user.id,
      reportTo: role === ROLES.INSPECTION && !procurementManager ? req.user?.id : procurementManager,
    });

    await user.save();
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Error during registration", error: err.message });
  }
};
