exports.articles = require("../controllers/articles-controllers");
exports.comments = require("../controllers/comments-controllers");
exports.topics = require("../controllers/topics-controllers");
exports.users = require("../controllers/users-controllers");
exports.errors = require("../controllers/errors-controllers");

const endpoints = require("../endpoints.json");

exports.getHomePage = (req, res, next) => {
  res.status(200).send({ message: "Root OK - for README check /api" });
};

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};
