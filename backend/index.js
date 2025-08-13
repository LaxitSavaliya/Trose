require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const HoldingModel = require("./model/HoldingModel");
const PositionModel = require("./model/PositionModel");
const OrderModel = require('./model/OrderModel');
const StockModel = require('./model/StockModel');

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not set in environment variables.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};


const updatePrices = async () => {
  try {
    const stocks = await StockModel.find({});

    if (stocks.length === 0) {
      return;
    }

    const bulkUpdates = stocks.map(stock => {
      const priceChange = Number((Math.random() - 0.5).toFixed(2));
      let newPrice = Number((stock.price + priceChange).toFixed(2));

      if (newPrice <= 1) {
        newPrice = 1.01;
      }

      return {
        updateOne: {
          filter: { _id: stock._id },
          update: { $set: { price: newPrice } }
        }
      };
    });

    await StockModel.bulkWrite(bulkUpdates);
  } catch (err) {
    console.error("Error updating stock prices:", err);
  }
};

const updateHoldings = async () => {
  try {
    const holdings = await HoldingModel.find({});

    if (holdings.length === 0) {
      return;
    }

    const stocks = await StockModel.find();

    const stockPriceMap = new Map(stocks.map(stock => [stock.name, stock.price]));

    const bulkUpdates = holdings
      .filter(holding => stockPriceMap.has(holding.name))
      .map(holding => ({
        updateOne: {
          filter: { _id: holding._id },
          update: { $set: { price: stockPriceMap.get(holding.name) } }
        }
      }));

    if (bulkUpdates.length > 0) {
      await HoldingModel.bulkWrite(bulkUpdates);
      console.log('Updated holdings.');
    } else {
      console.log('No holdings matched with current stock prices for an update.');
    }
  } catch (error) {
    console.error("Error updating holdings:", error);
  }
};


app.get("/", (req, res) => {
  res.send("Hello, Traders 👋");
});

app.get('/stocks', async (req, res) => {
  try {
    const stocks = await StockModel.find({});
    res.json(stocks);
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ message: "Failed to fetch stocks.", error: err.message });
  }
});

app.get('/holdings', async (req, res) => {
  try {
    const holdings = await HoldingModel.find({});
    res.json(holdings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    res.status(500).json({ message: "Failed to fetch holdings.", error: err.message });
  }
});

app.post('/holdings', async (req, res) => {
  try {
    const { name, qty, avg } = req.body;
    if (!name || !qty || !avg) {
      return res.status(400).json({ message: "All fields (name, qty, avg) are required." });
    }

    const quantity = Number(qty);
    const averagePrice = Number(avg);

    const stock = await StockModel.findOne({ name });
    if (!stock) {
      return res.status(404).json({ message: `Stock with name '${name}' not found.` });
    }

    const newHolding = new HoldingModel({
      name,
      qty: quantity,
      avg: averagePrice,
      price: stock.price
    });
    await newHolding.save();

    res.status(201).json({ message: "Holding created successfully.", holding: newHolding });
  } catch (error) {
    console.error("Error creating holding:", error);
    res.status(500).json({ message: "Failed to create holding.", error: error.message });
  }
});

app.get('/positions', async (req, res) => {
  try {
    const positions = await PositionModel.find({});
    res.json(positions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ message: "Failed to fetch positions.", error: err.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields (name, qty, price, mode) are required." });
    }

    const newOrder = new OrderModel({
      name,
      qty: Number(qty),
      price: Number(price),
      mode
    });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully.", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order.", error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
  }
});


const startServer = async () => {
  await connectDB();
  (function runUpdatePrices() {
    updatePrices();
    setTimeout(runUpdatePrices, 1000);
  })();

  (function runUpdateHoldings() {
    updateHoldings();
    setTimeout(runUpdateHoldings, 1000);
  })();

  app.listen(PORT, () => {
    console.log(`🚀 App started at http://localhost:${PORT}`);
  });
};

startServer();