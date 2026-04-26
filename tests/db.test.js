"use strict";
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data.json");
const origEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = origEnv;
  if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
  jest.resetModules();
});

describe("Database", () => {
  test("reset clears all data", () => {
    const db = require("../src/db");
    db.students.push({ id: 1, name: "Test" });
    db.reset();
    expect(db.students.length).toBe(0);
    expect(db.nextStudentId).toBe(1);
  });

  test("save writes to file in production", () => {
    process.env.NODE_ENV = "production";
    const db = require("../src/db");
    db.reset();
    db.students.push({ id: 1, name: "Valencia" });
    db.save();
    expect(fs.existsSync(DB_FILE)).toBe(true);
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    expect(data.students[0].name).toBe("Valencia");
  });

  test("save does nothing in test mode", () => {
    process.env.NODE_ENV = "test";
    const db = require("../src/db");
    db.students.push({ id: 1, name: "Test" });
    db.save();
    expect(fs.existsSync(DB_FILE)).toBe(false);
  });

  test("load reads from existing file", () => {
    const mockData = {
      students: [{ id: 1, name: "Loaded" }],
      courses: [], enrollments: [],
      nextStudentId: 2, nextCourseId: 1, nextEnrollmentId: 1,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(mockData));
    jest.resetModules();
    const db = require("../src/db");
    db.load();
    expect(db.students[0].name).toBe("Loaded");
    expect(db.nextStudentId).toBe(2);
  });

  test("load handles corrupt file", () => {
    fs.writeFileSync(DB_FILE, "not valid json{{{");
    jest.resetModules();
    const db = require("../src/db");
    db.load();
    expect(db.students.length).toBe(0);
  });

  test("load handles missing file", () => {
    if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
    jest.resetModules();
    const db = require("../src/db");
    db.load();
    expect(db.students).toEqual([]);
  });
});
