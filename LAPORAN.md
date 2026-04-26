# Laporan Final Project - Software Testing
## Student Grading System

**Nama:** Valencia Lim
**NIM:** 03081230045
**Mata Kuliah:** Software Testing

---

## 1. Deskripsi Sistem

Student Grading System adalah REST API sederhana untuk mengelola penilaian mahasiswa. Sistem menyediakan tiga fitur utama: manajemen mahasiswa, manajemen mata kuliah, dan penilaian serta transkrip. Aplikasi dibangun menggunakan Node.js dengan framework Express dan penyimpanan berbasis file JSON.

## 2. Arsitektur Aplikasi

Aplikasi menggunakan arsitektur berlapis: Express Routes (src/app.js) sebagai HTTP layer, Services (src/services.js) untuk business logic, Validators (src/validators.js) untuk fungsi validasi murni, dan Database (src/db.js) untuk persistent JSON storage.

## 3. Strategi Pengujian

Mengikuti prinsip testing pyramid dengan 30 unit test validator, 12 unit test service, dan 8 integration test API. Total 50 test case.

## 4. Test Coverage

Coverage di atas 80%, melebihi target minimum 60%.

## 5. Pipeline CI

GitHub Actions otomatis pada setiap push dan pull request: checkout, setup Node 20, npm install, npm test, upload coverage.

## 6. Kesimpulan

Proyek memenuhi seluruh ketentuan tugas dengan 50 test case dan coverage di atas 80%.
