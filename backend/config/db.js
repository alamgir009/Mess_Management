const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const dataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDb connected...");
  } catch (error) {
    return console.error({ error: "Database connection failed!" });
  }
};

module.exports = dataBase;
