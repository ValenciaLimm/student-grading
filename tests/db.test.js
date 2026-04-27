"use strict";
const fs = require("fs");
const path = require("path");
const DB_FILE = path.join(__dirname, "..", "data.json");

afterEach(() => {
  process.env.NODE_ENV = "test";
  try { fs.unlinkSync(DB_FILE); } catch(e) {}
  jest.resetModules();
});

describe("Database", () => {
  test("reset clears all data", () => {
    const db = require("../src/db");
    db.students.push({ id: 1, name: "Test" });
    db.reset();
    expect(db.students.length).toBe(0);
  });

  test("save writes file in production mode", () => {
    process.env.NODE_ENV = "production";
    jest.resetModules();
    const db = require("../src/db");
    db.reset();
    db.students.push({ id: 1, name: "Valencia" });
    db.save();
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const data = JSON.parse(raw);
    expect(data.students[0].name).toBe("Valencia");
  });

  test("save skips in test mode", () => {
    process.env.NODE_ENV = "test";
    jest.resetModules();
    const db = require("../src/db");
    db.students.push({ id: 1 });
    db.save();
    expect(fs.existsSync(DB_FILE)).toBe(false);
  });

  test("load from existing file", () => {
    const mock = { students: [{ id: 5, name: "Loaded" }], courses: [], enrollments: [], nextStudentId: 6, nextCourseId: 1, nextEnrollmentId: 1 };
    fs.writeFileSync(DB_FILE, JSON.stringify(mock));
    jest.resetModules();
    const db = require("../src/db");
    expect(db.students[0].name).toBe("Loaded");
    expect(db.nextStudentId).toBe(6);
  });

  test("load handles bad JSON", () => {
    fs.writeFileSync(DB_FILE, "NOT_JSON!!!");
    jest.resetModules();
    const db = require("../src/db");
    expect(db.students.length).toBe(0);
  });

  test("load handles no file", () => {
    try { fs.unlinkSync(DB_FILE); } catch(e) {}
    jest.resetModules();
    const db = require("../src/db");
    expect(db.students).toEqual([]);
    expect(db.nextStudentId).toBe(1);
  });
});
