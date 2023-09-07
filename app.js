const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

const userRouter = require('./src/login/router/UserRouter');
require("./src/database/mongoose");
app.use("/users",userRouter);

app.get("/checkserver", (req, res) => res.send("<h1>Hey Developer! Server is working fine, Go aHead!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
