const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const { getProduct, buyProduct, addProduct, webhook } = require("./controller");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });
const app = express();
app.use(cors());
app.use(express.json());

app.get("/products", getProduct);
app.post("/add", addProduct);
app.get("/buy", buyProduct);
app.post("/webhook", webhook);

app.listen(5000, () => {
  console.log("server running on port 5000");
});
