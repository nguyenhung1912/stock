const { isValidObjectId } = require("mongoose");
const Stock = require("../models/Stock");
const exchanges = require("../constants/exchanges");
const STOCK_SELECT_FIELDS =
  "_id name code price previousPrice exchange favorite";

function serializeStock(stock) {
  if (!stock) {
    return null;
  }

  const object =
    typeof stock.toObject === "function" ? stock.toObject() : { ...stock };

  return {
    id: object._id.toString(),
    name: object.name,
    code: object.code,
    price: object.price,
    previousPrice: object.previousPrice,
    exchange: object.exchange,
    favorite: object.favorite,
  };
}

function getStockPayload(body) {
  const payload = {};

  if (body.name !== undefined) {
    payload.name = String(body.name).trim();
  }

  if (body.code !== undefined) {
    payload.code = String(body.code).trim().toUpperCase();
  }

  if (body.exchange !== undefined) {
    payload.exchange = String(body.exchange).trim().toUpperCase();
  }

  if (body.price !== undefined) {
    payload.price = Number(body.price) || 0;
  }

  if (body.previousPrice !== undefined) {
    payload.previousPrice = Number(body.previousPrice) || 0;
  }

  if (body.favorite !== undefined) {
    payload.favorite = Boolean(body.favorite);
  }

  return payload;
}

function getExchanges(req, res) {
  return res.json(exchanges);
}

async function getAllStocks(req, res) {
  try {
    const stocks = await Stock.find()
      .select(STOCK_SELECT_FIELDS)
      .sort({ updatedAt: -1 })
      .lean();
    return res.json(stocks.map(serializeStock));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get stocks" });
  }
}

async function getStockById(req, res) {
  try {
    const stockId = req.params.id;

    if (!isValidObjectId(stockId)) {
      return res.status(400).json({ message: "Invalid stock id" });
    }

    const stock = await Stock.findById(stockId)
      .select(STOCK_SELECT_FIELDS)
      .lean();

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json(serializeStock(stock));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get stock" });
  }
}

async function createStock(req, res) {
  try {
    const payload = getStockPayload(req.body);

    if (!payload.name || !payload.code || !payload.exchange) {
      return res.status(400).json({ message: "name, code and exchange are required" });
    }

    const stock = await Stock.create(payload);
    return res.status(201).json(serializeStock(stock));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot create stock" });
  }
}

async function updateStock(req, res) {
  try {
    const stockId = req.params.id;

    if (!isValidObjectId(stockId)) {
      return res.status(400).json({ message: "Invalid stock id" });
    }

    const payload = getStockPayload(req.body);

    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: "No data to update" });
    }

    const stock = await Stock.findByIdAndUpdate(stockId, payload, {
      new: true,
      runValidators: true,
      projection: STOCK_SELECT_FIELDS,
    }).lean();

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json(serializeStock(stock));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot update stock" });
  }
}

async function deleteStock(req, res) {
  try {
    const stockId = req.params.id;

    if (!isValidObjectId(stockId)) {
      return res.status(400).json({ message: "Invalid stock id" });
    }

    const stock = await Stock.findByIdAndDelete(stockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot delete stock" });
  }
}

module.exports = {
  getExchanges,
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};
