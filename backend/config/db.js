//connect to mongo database

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //connect here-- returns promise, and takes in mongo URI in env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo db connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};
module.exports = connectDB