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
      .then(({ body: { topic } }) => {
        topic.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
