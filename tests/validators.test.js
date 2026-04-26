"use strict";
const {
  validateNim, validateName, validateScore,
  validateCourseCode, validateSemester,
  calculateGrade, calculateGPA,
} = require("../src/validators");

describe("validateNim", () => {
  test("valid NIM 11 digits", () => expect(validateNim("03081230045")).toBe(true));
  test("valid NIM 8 digits", () => expect(validateNim("12345678")).toBe(true));
  test("invalid too short", () => expect(validateNim("1234567")).toBe(false));
  test("invalid non-digit", () => expect(validateNim("ABCDEFGH")).toBe(false));
  test("invalid non-string", () => expect(validateNim(12345678)).toBe(false));
});

describe("validateName", () => {
  test("valid name", () => expect(validateName("Valencia Lim")).toBe(true));
  test("too short", () => expect(validateName("A")).toBe(false));
  test("contains numbers", () => expect(validateName("Val123")).toBe(false));
});

describe("validateScore", () => {
  test("valid 85", () => expect(validateScore(85)).toBe(true));
  test("valid 0", () => expect(validateScore(0)).toBe(true));
  test("valid 100", () => expect(validateScore(100)).toBe(true));
  test("invalid negative", () => expect(validateScore(-1)).toBe(false));
  test("invalid over 100", () => expect(validateScore(101)).toBe(false));
  test("invalid string", () => expect(validateScore("85")).toBe(false));
});

describe("validateCourseCode", () => {
  test("valid IF101", () => expect(validateCourseCode("IF101")).toBe(true));
  test("valid MATH201", () => expect(validateCourseCode("MATH201")).toBe(true));
  test("invalid lowercase", () => expect(validateCourseCode("if101")).toBe(false));
  test("invalid no number", () => expect(validateCourseCode("IFABC")).toBe(false));
});

describe("validateSemester", () => {
  test("valid 1", () => expect(validateSemester(1)).toBe(true));
  test("valid 8", () => expect(validateSemester(8)).toBe(true));
  test("invalid 0", () => expect(validateSemester(0)).toBe(false));
  test("invalid string", () => expect(validateSemester("3")).toBe(false));
});

describe("calculateGrade", () => {
  test("A for 85", () => expect(calculateGrade(85)).toBe("A"));
  test("A for 100", () => expect(calculateGrade(100)).toBe("A"));
  test("B for 75", () => expect(calculateGrade(75)).toBe("B"));
  test("C for 65", () => expect(calculateGrade(65)).toBe("C"));
  test("D for 50", () => expect(calculateGrade(50)).toBe("D"));
  test("E for 49", () => expect(calculateGrade(49)).toBe("E"));
  test("throws for string", () => expect(() => calculateGrade("85")).toThrow(TypeError));
  test("throws for out of range", () => expect(() => calculateGrade(101)).toThrow(RangeError));
});

describe("calculateGPA", () => {
  test("perfect GPA", () => {
    expect(calculateGPA([{ grade: "A", credits: 3 }, { grade: "A", credits: 3 }])).toBe(4.0);
  });
  test("mixed grades", () => {
    expect(calculateGPA([{ grade: "A", credits: 3 }, { grade: "C", credits: 3 }])).toBe(3.0);
  });
  test("throws for empty", () => expect(() => calculateGPA([])).toThrow(TypeError));
  test("throws for invalid grade", () => {
    expect(() => calculateGPA([{ grade: "X", credits: 3 }])).toThrow(RangeError);
  });
});
