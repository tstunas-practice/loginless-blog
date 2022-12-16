const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use("/", (req, res, next) => {
  res.status(404).send("Not Found");
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

mongoose.connect("mongodb://localhost:27017/test");

app.listen(3000, () => {
  console.log("app listen on port 3000");
});
