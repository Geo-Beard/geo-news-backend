const db = require("../db/connection");

//DELETE REQUESTS
exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "404 - Comment not found",
        });
      }
      return rows;
    });
};
