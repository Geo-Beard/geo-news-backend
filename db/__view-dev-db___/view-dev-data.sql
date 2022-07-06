\c nc_news

SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
JOIN comments ON comments.article_id = articles.article_id
WHERE articles.article_id = 1
GROUP BY articles.article_id, comments.article_id;

SELECT * FROM comments;

SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.topic = 'invalid' GROUP BY articles.article_id, comments.article_id ORDER BY article_id ASC;

