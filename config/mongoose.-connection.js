const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')("development:mongoose");

const uri = `${config.get("MONGODB_URI")}/pintrest`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    dbgr("✅ MongoDB connected successfully:", uri);
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("⚠️  Make sure MongoDB server is running and Compass is connected.");
});

module.exports = mongoose.connection;
