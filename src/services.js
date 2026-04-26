"use strict";
const db = require("./db");
const {
  validateNim, validateName, validateScore,
  validateCourseCode, validateSemester, calculateGrade, calculateGPA,
} = require("./validators");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

const StudentService = {
  create({ nim, name, semester = 1 }) {
    if (!validateNim(nim)) throw new ValidationError("Invalid NIM");
    if (!validateName(name)) throw new ValidationError("Invalid name");
    if (!validateSemester(semester)) throw new ValidationError("Invalid semester");
    if (db.students.find((s) => s.nim === nim)) {
      throw new ValidationError("NIM already exists");
    }
    const student = { id: db.nextStudentId++, nim, name: name.trim(), semester };
    db.students.push(student);
    db.save();
    return student;
  },
  listAll() {
    return db.students;
  },
  findById(id) {
    return db.students.find((s) => s.id === id);
  },
  search(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    return db.students.filter(
      (s) => s.name.toLowerCase().includes(k) || s.nim.includes(k)
    );
  },
};

const CourseService = {
  create({ code, name, credits }) {
    if (!validateCourseCode(code)) throw new ValidationError("Invalid course code");
    if (!name || typeof name !== "string") throw new ValidationError("Course name required");
    if (!Number.isInteger(credits) || credits < 1 || credits > 6) {
      throw new ValidationError("Credits must be 1-6");
    }
    if (db.courses.find((c) => c.code === code)) {
      throw new ValidationError("Course code already exists");
    }
    const course = { id: db.nextCourseId++, code, name: name.trim(), credits };
    db.courses.push(course);
    db.save();
    return course;
  },
  listAll() {
    return db.courses;
  },
  findById(id) {
    return db.courses.find((c) => c.id === id);
  },
};

const EnrollmentService = {
  enroll({ studentId, courseId, score }) {
    const student = StudentService.findById(studentId);
    if (!student) throw new ValidationError("Student not found");
    const course = CourseService.findById(courseId);
    if (!course) throw new ValidationError("Course not found");
    if (!validateScore(score)) throw new ValidationError("Invalid score (0-100)");

    const existing = db.enrollments.find(
      (e) => e.studentId === studentId && e.courseId === courseId
    );
    if (existing) throw new ValidationError("Student already enrolled in this course");

    const grade = calculateGrade(score);
    const enrollment = {
      id: db.nextEnrollmentId++,
      studentId,
      courseId,
      score,
      grade,
      courseName: course.name,
      courseCode: course.code,
      credits: course.credits,
    };
    db.enrollments.push(enrollment);
    db.save();
    return enrollment;
  },

  updateScore(enrollmentId, newScore) {
    const enrollment = db.enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) throw new ValidationError("Enrollment not found");
    if (!validateScore(newScore)) throw new ValidationError("Invalid score (0-100)");
    enrollment.score = newScore;
    enrollment.grade = calculateGrade(newScore);
    db.save();
    return enrollment;
  },

  getTranscript(studentId) {
    const student = StudentService.findById(studentId);
    if (!student) throw new ValidationError("Student not found");
    const enrollments = db.enrollments.filter((e) => e.studentId === studentId);
    let gpa = 0;
    if (enrollments.length > 0) {
      const gradeData = enrollments.map((e) => ({ grade: e.grade, credits: e.credits }));
      gpa = calculateGPA(gradeData);
    }
    return { student, enrollments, gpa };
  },
};

module.exports = {
  StudentService,
  CourseService,
  EnrollmentService,
  ValidationError,
};
