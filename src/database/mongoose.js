const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL_PROD;
  try {
    mongoose
      .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then( ( ) => console.log('Database Connected'))
      .catch((err) => console.log("MongoDb error: " + err));
  } catch (err) {
    console.log(err)
    process.exit(1);
};
