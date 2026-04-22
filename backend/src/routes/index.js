const express = require("express");
const authRoutes = require("./authRoutes");
const stockRoutes = require("./stockRoutes");

const router = express.Router();

router.use(authRoutes);
router.use(stockRoutes);

module.exports = router;
