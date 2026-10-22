const express = require("express");
const cors = require("cors");
const errorHandler = require("./src/middlewares/error.middleware");
const ApiResponse = require("./src/utils/apiResponse");

const DOMAINS = require("./src/config/domain");

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      DOMAINS.CLOUD_MATE.UI,
      DOMAINS.ONE_LOGIN.UI,
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());

// Initialize Database connection
require("./src/database/mongoose");

// Routers
const userRouter = require("./src/login/router/UserRouter");
const projectRouter = require("./src/router/ProjectRouter");
const fileRouter = require("./src/router/FileRouter");

app.use("/users", userRouter);
app.use("/project", projectRouter);
app.use("/file", fileRouter);

// Health check endpoints
app.get("/startserver", (req, res) => res.send("<h1>Server started</h1>"));
app.get("/checkserver", (req, res) =>
  res.send(`<h1>Hey Developer! Server is working fine, Go aHead! ${req.ip}</h1>`)
);

// Catch-all 404 handler for undefined routes
app.use((req, res) => {
  return ApiResponse.error(res, `Route ${req.method} ${req.originalUrl} not found`, "NOT_FOUND", 404);
});

// Centralized error-handling middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
