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
      const priceChange = Number((Math.random() * 0.6 - 0.3).toFixed(2));
      let newPrice = Number((stock.price + priceChange).toFixed(2));

      if (newPrice <= 0.01) {
        newPrice = 0.01;
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
    } else {
      console.log('No holdings matched with current stock prices for an update.');
    }
  } catch (error) {
    console.error("Error updating holdings:", error);
  }
};

const processOrders = async () => {
  try {
    function timeToSeconds(timeStr) {
      const [hh, mm, ss] = timeStr.split(':').map(Number);
      return hh * 3600 + mm * 60 + ss;
    }

    const currentTime = new Date();
    const currentSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

    const orders = await OrderModel.find();
    const ordersToProcess = orders.filter(order => {
      const orderSeconds = timeToSeconds(order.createdAt);
      return currentSeconds >= orderSeconds + 30;
    });


    for (const order of ordersToProcess) {
      try {
        if (order.mode === "BUY") {
          const stock = await StockModel.findOne({ name: order.name });

          if (!stock) {
            console.error(`Stock '${order.name}' not found. Cannot process BUY order.`);
            await OrderModel.deleteOne({ _id: order._id });
            continue;
          }

          const existingHolding = await HoldingModel.findOne({ name: order.name });

          if (existingHolding) {
            const totalCost = (existingHolding.qty * existingHolding.orderPrice) + (order.qty * order.price);
            const newQty = existingHolding.qty + order.qty;
            const newAvgPrice = totalCost / newQty;

            await HoldingModel.findByIdAndUpdate(
              existingHolding._id,
              { $set: { qty: newQty, orderPrice: newAvgPrice } }
            );
          } else {
            const newHolding = new HoldingModel({
              name: order.name,
              qty: order.qty,
              orderPrice: order.price,
              price: stock.price,
            });
            await newHolding.save();
          }

        } else if (order.mode === "SELL") {
          const holding = await HoldingModel.findOne({ name: order.name });

          if (!holding) {
            console.error(`No holdings found for '${order.name}'. Cannot process SELL order.`);
            await OrderModel.deleteOne({ _id: order._id });
            continue;
          }

          const newQty = holding.qty - order.qty;

          if (newQty < 0) {
            console.error(`Insufficient holdings (${holding.qty} units) for SELL order of ${order.qty} units.`);
            await OrderModel.deleteOne({ _id: order._id });
            continue;
          }

          if (newQty === 0) {
            await HoldingModel.deleteOne({ _id: holding._id });
          } else {
            holding.qty = newQty;
            await holding.save();
          }
        }

        await OrderModel.deleteOne({ _id: order._id });
        console.log(`✅ Order for ${order.name} processed and removed from orders.`);

      } catch (innerError) {
        console.error(`Error processing order ${order._id}:`, innerError);
      }
    }

  } catch (error) {
    console.error("Error processing orders:", error);
  }
};


app.get("/", (req, res) => {
  res.send("Hello, Traders 👋");
});

const createRoute = (path, model) => {
  app.get(path, async (req, res) => {
    try {
      const data = await model.find({});
      res.json(data);
    } catch (err) {
      console.error(`Error fetching ${path.slice(1)}:`, err);
      res.status(500).json({ message: `Failed to fetch ${path.slice(1)}.`, error: err.message });
    }
  });
};

createRoute('/stocks', StockModel);
createRoute('/holdings', HoldingModel);
createRoute('/positions', PositionModel);
createRoute('/orders', OrderModel);


app.post('/orders', async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields (name, qty, price, mode) are required." });
    }

    const quantity = Number(qty);
    const stockPrice = Number(price);

    if (quantity <= 0 || stockPrice <= 0) {
      return res.status(400).json({ message: "Quantity and price must be positive numbers." });
    }

    const newOrder = new OrderModel({
      name,
      qty: quantity,
      price: stockPrice,
      mode
    });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully.", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order.", error: error.message });
  }
});

const startServer = async () => {
  await connectDB();

  setInterval(updatePrices, 1000);
  setInterval(updateHoldings, 1000);
  setInterval(processOrders, 1000);

  app.listen(PORT, () => {
    console.log(`🚀 App started at http://localhost:${PORT}`);
  });
};

startServer();