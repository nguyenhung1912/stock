const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/exchanges", stockController.getExchanges);
router.use("/stocks", authenticate);
router.get("/stocks", stockController.getAllStocks);
router.get("/stocks/:id", stockController.getStockById);
router.post("/stocks", stockController.createStock);
router.put("/stocks/:id", stockController.updateStock);
router.patch("/stocks/:id", stockController.updateStock);
router.delete("/stocks/:id", stockController.deleteStock);

module.exports = router;
