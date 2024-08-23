const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.red.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); 
  }
};

module.exports = connectDB;
