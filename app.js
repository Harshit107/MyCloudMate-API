const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend application
  allowedHeaders: ['Authorization', 'Content-Type'], // Add 'Authorization' to the list of allowed headers
}));

app.use(express.json());
const userRouter = require('./src/login/router/UserRouter');
require("./src/database/mongoose");
app.use("/users",userRouter);

app.get("/checkserver", (req, res) => res.send("<h1>Hey Developer! Server is working fine, Go aHead!</h1>"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
