const mongoose = require('mongoose');
const db = require('./db');

const connectDB = async () => {
  try {
    await mongoose.connect(db.URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log('Databased connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
