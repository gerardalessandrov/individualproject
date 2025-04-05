const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());

app.use("/", require("./routes"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Z-Key"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(3001, function () {
      console.log("Aplicación ejemplo, escuchando el puerto!" + port);
    });
  }
});
