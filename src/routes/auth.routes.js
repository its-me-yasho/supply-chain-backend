const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// POST /api/auth/login
router.post("/login", authController.login);

// Register: only authenticated creators can register someone
router.post("/register", authController.register);


module.exports = router;
