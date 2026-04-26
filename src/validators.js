"use strict";

function validateNim(nim) {
  if (typeof nim !== "string") return false;
  const cleaned = nim.replace(/\s/g, "");
  if (!/^\d+$/.test(cleaned)) return false;
  return cleaned.length >= 8 && cleaned.length <= 15;
}

function validateName(name) {
  if (typeof name !== "string") return false;
  const s = name.trim();
  if (s.length < 2 || s.length > 100) return false;
  return /^[A-Za-z\s]+$/.test(s);
}

function validateScore(score) {
  if (typeof score !== "number" || isNaN(score)) return false;
  return score >= 0 && score <= 100;
}

function validateCourseCode(code) {
  if (typeof code !== "string") return false;
  return /^[A-Z]{2,5}\d{3,4}$/.test(code.trim());
}

function validateSemester(semester) {
  if (typeof semester !== "number" || !Number.isInteger(semester)) return false;
  return semester >= 1 && semester <= 14;
}

function calculateGrade(score) {
  if (typeof score !== "number" || isNaN(score)) throw new TypeError("score must be number");
  if (score < 0 || score > 100) throw new RangeError("score must be 0-100");
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "E";
}

function calculateGPA(grades) {
  if (!Array.isArray(grades) || grades.length === 0) {
    throw new TypeError("grades must be non-empty array");
  }
  const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0 };
  let totalCredits = 0;
  let totalPoints = 0;
  for (const g of grades) {
    if (!g.grade || !g.credits) throw new TypeError("each grade needs grade and credits");
    const point = gradePoints[g.grade];
    if (point === undefined) throw new RangeError(`invalid grade: ${g.grade}`);
    totalCredits += g.credits;
    totalPoints += point * g.credits;
  }
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

module.exports = {
  validateNim,
  validateName,
  validateScore,
  validateCourseCode,
  validateSemester,
  calculateGrade,
  calculateGPA,
};
