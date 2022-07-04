const express = require("express");
const app = express();
const { getTopics, getArticle } = require("./controllers/index");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

//ERROR HANDLING

//Pathing errors
app.use("*", (req, res) => {
  res.status(404).send({ message: "404 - Path not found" });
});

//PSQL errors

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "400 - Bad request" });
  }
  next(err);
});

//Custom errors

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    console.log(err.status);
    console.log(err.message);
    res.status(err.status).send({ message: `${err.message}` });
  } else {
    next(err);
  }
});

//Server errors
app.use((err, req, res, next) => {
  res.status(500).send({ message: "500 - Internal server error" });
});

module.exports = app;
