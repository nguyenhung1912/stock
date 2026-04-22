const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ quiet: true });

const routes = require("./routes");
const { notFoundHandler } = require("./middlewares/notFoundHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", routes);
app.use(notFoundHandler);

module.exports = app;
