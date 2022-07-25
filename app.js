const cors = require("cors");
const express = require("express");
const app = express();
const {
  getHomePage,
  getApi,
  articles,
  comments,
  topics,
  users,
  errors,
} = require("./controllers/index");

//CORS
app.use(cors());

//EXPRESS
app.use(express.json());

//ROOT
app.get("/", getHomePage);

//API
app.get("/api", getApi);

//ARTICLES
app.get("/api/articles", articles.getAllArticles);
app.get("/api/articles/:article_id", articles.getArticle);
app.get("/api/articles/:article_id/comments", articles.getArticleComments);

app.patch("/api/articles/:article_id", articles.patchArticle);

app.post("/api/articles/:article_id/comments", articles.postArticleComment);

//COMMENTS
app.delete("/api/comments/:comment_id", comments.deleteComment);

//TOPICS
app.get("/api/topics", topics.getTopics);

//USERS
app.get("/api/users", users.getUsers);

//ERROR HANDLING

app.use("*", errors.handleInvalidPath);

app.use(errors.handlePsqlErrors);

app.use(errors.handleCustomErrors);

app.use(errors.handleServerErrors);

module.exports = app;
