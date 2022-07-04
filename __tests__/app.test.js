const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GENERAL ERROR HANDLING", () => {
  test("404 - Path not found", () => {
    return request(app)
      .get("/api/badtopicpath")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("404 - Path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("responds with an array of topic objects each of which should have the properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  describe("HAPPY PATHS", () => {
    test("responds with an article object which has the properties: author, title, article_id, body, topic, created_at, votes", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            })
          );
        });
    });
  });
  describe("SAD PATHS", () => {
    test("responds with 404 if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/42")
        .expect(404)
        .then(({ body: { message } }) => {
          console.log(message);
          expect(message).toBe("404 - Article not found");
        });
    });
    test("responds with 400 if article_id is not a number", () => {
      return request(app)
        .get("/api/articles/notanumber")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad request");
        });
    });
  });
});
