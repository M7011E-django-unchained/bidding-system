require("dotenv").config();

const routes = require("./routes/routes");

const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1", routes);

app.listen(3000, () => {
  console.log(`Server Started at http://localhost:3000/api/v1`);
});
