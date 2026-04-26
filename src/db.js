"use strict";
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data.json");

class Database {
  constructor() {
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const data = JSON.parse(raw);
        this.students = data.students || [];
        this.courses = data.courses || [];
        this.enrollments = data.enrollments || [];
        this.nextStudentId = data.nextStudentId || 1;
        this.nextCourseId = data.nextCourseId || 1;
        this.nextEnrollmentId = data.nextEnrollmentId || 1;
        return;
      } catch (e) {}
    }
    this.reset();
  }

  save() {
    if (process.env.NODE_ENV === "test") return;
    const data = {
      students: this.students,
      courses: this.courses,
      enrollments: this.enrollments,
      nextStudentId: this.nextStudentId,
      nextCourseId: this.nextCourseId,
      nextEnrollmentId: this.nextEnrollmentId,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  reset() {
    this.students = [];
    this.courses = [];
    this.enrollments = [];
    this.nextStudentId = 1;
    this.nextCourseId = 1;
    this.nextEnrollmentId = 1;
  }
}

module.exports = new Database();
