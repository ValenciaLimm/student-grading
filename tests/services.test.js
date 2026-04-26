"use strict";
const db = require("../src/db");
const { StudentService, CourseService, EnrollmentService, ValidationError } = require("../src/services");

beforeEach(() => db.reset());

describe("StudentService", () => {
  test("create student success", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia Lim", semester: 3 });
    expect(s.id).toBeDefined();
    expect(s.name).toBe("Valencia Lim");
  });
  test("create student invalid NIM", () => {
    expect(() => StudentService.create({ nim: "123", name: "Test", semester: 1 })).toThrow(ValidationError);
  });
  test("create student duplicate NIM", () => {
    StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    expect(() => StudentService.create({ nim: "03081230045", name: "Other", semester: 1 })).toThrow(/already exists/);
  });
  test("search students", () => {
    StudentService.create({ nim: "03081230045", name: "Valencia Lim", semester: 3 });
    StudentService.create({ nim: "03081230041", name: "Delvin Tanjaya", semester: 3 });
    expect(StudentService.search("valencia").length).toBe(1);
  });
});

describe("CourseService", () => {
  test("create course success", () => {
    const c = CourseService.create({ code: "IF101", name: "Pemrograman Dasar", credits: 3 });
    expect(c.id).toBeDefined();
    expect(c.code).toBe("IF101");
  });
  test("create course invalid code", () => {
    expect(() => CourseService.create({ code: "bad", name: "Test", credits: 3 })).toThrow(ValidationError);
  });
  test("create course duplicate code", () => {
    CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    expect(() => CourseService.create({ code: "IF101", name: "PD2", credits: 3 })).toThrow(/already exists/);
  });
});

describe("EnrollmentService", () => {
  test("enroll success", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    const c = CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    const e = EnrollmentService.enroll({ studentId: s.id, courseId: c.id, score: 90 });
    expect(e.grade).toBe("A");
  });
  test("enroll invalid score", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    const c = CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    expect(() => EnrollmentService.enroll({ studentId: s.id, courseId: c.id, score: 150 })).toThrow(/Invalid score/);
  });
  test("enroll duplicate", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    const c = CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    EnrollmentService.enroll({ studentId: s.id, courseId: c.id, score: 80 });
    expect(() => EnrollmentService.enroll({ studentId: s.id, courseId: c.id, score: 90 })).toThrow(/already enrolled/);
  });
  test("update score success", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    const c = CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    const e = EnrollmentService.enroll({ studentId: s.id, courseId: c.id, score: 60 });
    const updated = EnrollmentService.updateScore(e.id, 90);
    expect(updated.grade).toBe("A");
    expect(updated.score).toBe(90);
  });
  test("get transcript", () => {
    const s = StudentService.create({ nim: "03081230045", name: "Valencia", semester: 1 });
    const c1 = CourseService.create({ code: "IF101", name: "PD", credits: 3 });
    const c2 = CourseService.create({ code: "IF201", name: "Algo", credits: 3 });
    EnrollmentService.enroll({ studentId: s.id, courseId: c1.id, score: 90 });
    EnrollmentService.enroll({ studentId: s.id, courseId: c2.id, score: 80 });
    const t = EnrollmentService.getTranscript(s.id);
    expect(t.enrollments.length).toBe(2);
    expect(t.gpa).toBe(3.5);
  });
});
