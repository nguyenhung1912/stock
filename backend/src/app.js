const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { notFoundHandler } = require("./middlewares/notFoundHandler");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", routes);
app.use(notFoundHandler);

module.exports = app;
