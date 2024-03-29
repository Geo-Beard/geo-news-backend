const db = require("../db/connection");

//GET REQUESTS
exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderOptions = ["asc", "desc"];
  if (
    !validSortOptions.includes(sort_by) ||
    !validOrderOptions.includes(order)
  ) {
    return Promise.reject({ status: 400, message: "400 - Invalid query" });
  }

  const queryValues = [];
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryValues.push(topic);
    queryStr += " WHERE articles.topic=$1";
  }

  queryStr += ` GROUP BY articles.article_id, comments.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    const articleRows = rows;
    //if no articles but topic - no articles returned but topic
    if (articleRows.length === 0 && topic) {
      return db
        .query("SELECT * FROM topics WHERE slug=$1", [topic])
        .then(({ rows }) => {
          const topicRows = rows;
          if (topicRows[0]) {
            return articleRows;
          }
          return Promise.reject({
            status: 400,
            message: "400 - Invalid topic",
          });
        });
    }
    return rows;
  });
};

exports.fetchArticle = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id, comments.article_id;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404 - Article not found",
        });
      } else {
        return rows[0];
      }
    });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404 - Article not found",
        });
      } else {
        return db
          .query(
            "SELECT author, body, comment_id, created_at, votes FROM comments WHERE article_id=$1;",
            [article_id]
          )
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};

//PATCH REQUESTS
exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404 - Article not found",
        });
      } else {
        const updatedVotes = rows[0].votes + inc_votes;
        const articleId = rows[0].article_id;
        return db
          .query(
            "UPDATE articles SET votes=$2 WHERE article_id=$1 RETURNING *;",
            [articleId, updatedVotes]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

//POST REQUESTS
exports.createArticleComment = (article_id, newComment) => {
  const { username, body } = newComment;
  if (
    username === undefined ||
    body === undefined ||
    username.length === 0 ||
    body.length === 0
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Bad request",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404 - Article not found",
        });
      } else {
        return db
          .query("SELECT * FROM users WHERE username=$1;", [username])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 400,
                message: "400 - User not found",
              });
            } else {
              return db
                .query(
                  "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
                  [username, body, article_id]
                )
                .then(({ rows }) => {
                  return rows[0];
                });
            }
          });
      }
    });
};
