const { comments } = require("../models/index");

//DELETE REQUESTS
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  comments
    .removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
