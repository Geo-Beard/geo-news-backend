const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
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

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id, comments.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
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

exports.createArticleComment = (article_id, newComment) => {
  const { username, body } = newComment;
  if (username === undefined || body === undefined) {
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
