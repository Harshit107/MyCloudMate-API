const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(cors({
  origin: 'https://mycloudmate.harshit107.in', // Replace with the actual origin of your frontend application
  allowedHeaders: ['Authorization', 'Content-Type'], // Add 'Authorization' to the list of allowed headers
}));

app.use(express.json());
require("./src/database/mongoose");

const userRouter = require('./src/login/router/UserRouter');
const projectRouter = require('./src/router/ProjectRouter');
const fileRouter = require('./src/router/FileRouter');

app.use("/users",userRouter);
app.use("/project",projectRouter);
app.use("/file",fileRouter);

app.get("/startserver", (req, res) => res.send("<h1>Server started </h1>"));
app.get("/checkserver", (req, res) => res.send("<h1>Hey Developer! Server is working fine, Go aHead!</h1>", req.ip));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
