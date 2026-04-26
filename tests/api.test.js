"use strict";
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

beforeEach(() => db.reset());

describe("API integration", () => {
  test("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("POST /students then GET /students", async () => {
    const create = await request(app).post("/students").send({
      nim: "03081230045", name: "Valencia Lim", semester: 3,
    });
    expect(create.status).toBe(201);
    const list = await request(app).get("/students");
    expect(list.body.length).toBe(1);
    expect(list.body[0].name).toBe("Valencia Lim");
  });

  test("POST /students validation error", async () => {
    const res = await request(app).post("/students").send({
      nim: "123", name: "V", semester: 0,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("POST /courses then GET /courses", async () => {
    const create = await request(app).post("/courses").send({
      code: "IF101", name: "Pemrograman Dasar", credits: 3,
    });
    expect(create.status).toBe(201);
    const list = await request(app).get("/courses");
    expect(list.body.length).toBe(1);
  });

  test("full enroll and transcript flow", async () => {
    await request(app).post("/students").send({ nim: "03081230045", name: "Valencia Lim", semester: 3 });
    await request(app).post("/courses").send({ code: "IF101", name: "PD", credits: 3 });
    await request(app).post("/courses").send({ code: "IF201", name: "Algo", credits: 3 });

    const e1 = await request(app).post("/enrollments").send({ studentId: 1, courseId: 1, score: 90 });
    expect(e1.status).toBe(201);
    expect(e1.body.grade).toBe("A");

    await request(app).post("/enrollments").send({ studentId: 1, courseId: 2, score: 80 });

    const transcript = await request(app).get("/transcripts/1");
    expect(transcript.status).toBe(200);
    expect(transcript.body.enrollments.length).toBe(2);
    expect(transcript.body.gpa).toBe(3.5);
  });

  test("PUT /enrollments/:id update score", async () => {
    await request(app).post("/students").send({ nim: "03081230045", name: "Valencia", semester: 1 });
    await request(app).post("/courses").send({ code: "IF101", name: "PD", credits: 3 });
    await request(app).post("/enrollments").send({ studentId: 1, courseId: 1, score: 60 });

    const res = await request(app).put("/enrollments/1").send({ score: 92 });
    expect(res.status).toBe(200);
    expect(res.body.grade).toBe("A");
  });

  test("GET /students?q=search", async () => {
    await request(app).post("/students").send({ nim: "03081230045", name: "Valencia Lim", semester: 3 });
    await request(app).post("/students").send({ nim: "03081230041", name: "Budi Santoso", semester: 2 });
    const res = await request(app).get("/students?q=valencia");
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toContain("Valencia");
  });

  test("enroll nonexistent student", async () => {
    await request(app).post("/courses").send({ code: "IF101", name: "PD", credits: 3 });
    const res = await request(app).post("/enrollments").send({ studentId: 999, courseId: 1, score: 80 });
    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain("not found");
  });
});
