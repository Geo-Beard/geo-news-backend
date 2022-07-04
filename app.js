const express = require("express");
const app = express();
const { getTopics } = require("./controllers/index");

app.use(express.json());

app.get("/api/topics", getTopics);

//ERROR HANDLING

//Pathing errors
app.use("*", (req, res) => {
  res.status(404).send({ message: "404 - Path not found" });
});

//PSQL errors

//Custom errors

//Server errors
app.use((err, req, res, next) => {
  res.status(500).send({ message: "500 - Internal server error" });
});

module.exports = app;
