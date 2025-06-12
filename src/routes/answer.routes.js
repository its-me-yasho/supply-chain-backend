const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const controller = require("../controllers/answer.controller");

router.post("/", authenticate, controller.submitChecklistAnswer);

module.exports = router;
