const mongoose = require('mongoose');
const { initialStocks, initialPositions } = require('./data');
const StockModel = require('../model/StockModel');
const PositionModel = require('../model/PositionModel');
const HoldingModel = require('../model/HoldingModel');
const OrderModel = require('../model/OrderModel');
require('dotenv').config({ path: '../.env' });

const dbUrl = process.env.MONGO_URL;

if (!dbUrl) {
    console.error("❌ DB_URL is not set in environment variables.");
    process.exit(1);
}

async function seedDatabase() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        await StockModel.deleteMany({});
        console.log('🗑️ Deleted old Stock data');

        await PositionModel.deleteMany({});
        console.log('🗑️ Deleted old Position data');

        await HoldingModel.deleteMany({});
        console.log('🗑️ Deleted old Holding data');

        await OrderModel.deleteMany({});
        console.log('🗑️ Deleted old Order data');

        await StockModel.insertMany(initialStocks);
        console.log(`📊 Stocks Data was initialized`);

        await PositionModel.insertMany(initialPositions);
        console.log(`💼 Positions Data was initialized`);

    } catch (err) {
        console.error('❌ Error connecting or seeding MongoDB:', err);
        throw err;
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedDatabase().catch(err => {
    console.error('An error occurred during seeding:', err);
});