# Student Grading System

Sistem penilaian mahasiswa berbasis REST API. Dibuat untuk Final Project mata kuliah Software Testing dengan fokus pada automated testing dan continuous integration.

---

## Deskripsi Aplikasi

Aplikasi menyediakan REST API dan UI web untuk mengelola data mahasiswa, mata kuliah, dan penilaian. Dibangun menggunakan Node.js dengan Express, diuji menggunakan Jest dan Supertest, dengan penyimpanan data berbasis file JSON.

---

## Fitur Utama

1. **Manajemen Mahasiswa** - menambah, melihat daftar, dan mencari mahasiswa berdasarkan nama atau NIM.
2. **Manajemen Mata Kuliah** - menambah dan melihat daftar mata kuliah dengan kode, nama, dan SKS.
3. **Penilaian dan Transkrip** - input nilai, hitung grade otomatis (A-E), update nilai, dan generate transkrip lengkap dengan IPK.

---

## Business Rules

- NIM harus valid (8-15 digit angka).
- Nama hanya boleh huruf dan spasi, minimal 2 karakter.
- Nilai harus 0-100.
- Kode mata kuliah format huruf kapital + angka (contoh: IF101).
- SKS antara 1-6.
- Semester antara 1-14.
- Grade otomatis: A (85-100), B (75-84), C (65-74), D (50-64), E (0-49).
- IPK dihitung berdasarkan bobot SKS.
- Satu mahasiswa tidak boleh enroll mata kuliah yang sama dua kali.

---

## Cara Menjalankan

Install dependencies:

    npm install

Jalankan server di localhost:3000:

    npm start

Jalankan semua test dengan coverage:

    npm test

Setelah server berjalan, buka browser ke http://localhost:3000 untuk mengakses UI web.

---

## Strategi Pengujian

Pengujian dibagi menjadi tiga lapisan:

1. **Unit Test Validators** (tests/validators.test.js) berisi 30 test untuk fungsi murni validasi NIM, nama, nilai, kode MK, semester, perhitungan grade, dan perhitungan IPK.
2. **Unit Test Services** (tests/services.test.js) berisi 12 test untuk logika bisnis StudentService, CourseService, dan EnrollmentService.
3. **Integration Test API** (tests/api.test.js) berisi 8 test untuk full HTTP flow menggunakan Supertest.

Total 50 test dengan coverage di atas 80 persen (target minimal 60 persen).

---

## Continuous Integration

GitHub Actions otomatis menjalankan test pada setiap push dan pull request. Pipeline: checkout kode, setup Node 20, install dependencies, run tests dengan coverage, dan upload coverage artifact.

---

## Struktur Repository

- .github/workflows/ci.yml - konfigurasi GitHub Actions
- src/app.js - Express app dan routes
- src/db.js - file-based JSON database
- src/services.js - business logic
- src/validators.js - input validators
- public/index.html - UI web
- tests/validators.test.js - unit test validators
- tests/services.test.js - unit test services
- tests/api.test.js - integration test API
- package.json - konfigurasi npm dan jest
- README.md - dokumentasi ini
- LAPORAN.md - laporan proyek
