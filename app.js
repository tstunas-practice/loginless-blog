const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();

app.use("/api", routes);

mongoose.connect("mongodb://localhost:27017/test");

app.listen(3000, () => {
  console.log("app listen on port 3000");
});
