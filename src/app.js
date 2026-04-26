"use strict";
const express = require("express");
const path = require("path");
const { StudentService, CourseService, EnrollmentService, ValidationError } = require("./services");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  // Students
  app.post("/students", (req, res, next) => {
    try { res.status(201).json(StudentService.create(req.body)); }
    catch (e) { next(e); }
  });
  app.get("/students", (req, res) => {
    const { q } = req.query;
    res.json(q ? StudentService.search(q) : StudentService.listAll());
  });

  // Courses
  app.post("/courses", (req, res, next) => {
    try { res.status(201).json(CourseService.create(req.body)); }
    catch (e) { next(e); }
  });
  app.get("/courses", (req, res) => res.json(CourseService.listAll()));

  // Enrollments
  app.post("/enrollments", (req, res, next) => {
    try { res.status(201).json(EnrollmentService.enroll(req.body)); }
    catch (e) { next(e); }
  });
  app.put("/enrollments/:id", (req, res, next) => {
    try { res.json(EnrollmentService.updateScore(parseInt(req.params.id, 10), req.body.score)); }
    catch (e) { next(e); }
  });
  app.get("/transcripts/:studentId", (req, res, next) => {
    try { res.json(EnrollmentService.getTranscript(parseInt(req.params.studentId, 10))); }
    catch (e) { next(e); }
  });

  // Error handler
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

const app = createApp();

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
