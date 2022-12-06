const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth");

// we can set up the routes like in 'jobs' routes also
router.post("/register", register);
router.post("/login", login);

module.exports = router;
