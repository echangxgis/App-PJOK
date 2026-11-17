# PJOK Kelas 4 — Bola Voli Mini

Repositori ini berisi **materi pembelajaran, instrumen penilaian, dan aplikasi web interaktif** untuk mata pelajaran PJOK kelas 4 SD.

**Unit 2: Kingdom Character in Play** — *Integritas dan Nilai Kerajaan dalam Permainan*

> Dalam permainan, kita belajar menggunakan kemampuan gerak, bersikap jujur dan adil, serta menunjukkan kasih Kristus melalui kerja sama.

---

## 📂 Struktur Repositori

```
├── dokumen/                              # Dokumen pembelajaran dan penilaian
│   ├── Materi_Bola_Voli_Mini_Kelas_4.docx      # Materi lengkap 16 halaman untuk murid
│   ├── Soal_Sumatif_Tertulis_Bola_Voli_Kelas_4.docx  # 10 PG + 5 esai situasi + kunci guru
│   ├── Penilaian_Praktik_Bola_Voli_Mini_Kelas_4.xlsx  # Rubrik + lembar observasi (data demo)
│   └── Template_Daftar_Murid.xlsx               # Template kosong untuk daftar murid
│
├── scripts/                              # Kode PowerShell pembuat dokumen
│   ├── buat_materi.ps1                          # Membuat file Word materi pembelajaran
│   └── buat_penilaian.ps1                       # Membuat file Excel rubrik penilaian
│
├── css/style.css                         # Stylesheet aplikasi web utama
├── js/
│   ├── app.js                                   # Logika aplikasi web utama
│   └── data.js                                  # Data materi dan soal
│
├── voli-cerdas/                          # Aplikasi web interaktif mandiri
│   ├── index.html
│   ├── app.js
│   ├── data.js
│   ├── styles.css
│   └── README.md
│
├── index.html                            # Halaman utama aplikasi web
└── serve.ps1                             # Server statis sederhana (PowerShell)
```

---

## 📘 Dokumen Pembelajaran

### 1. Materi Bola Voli Mini (`dokumen/Materi_Bola_Voli_Mini_Kelas_4.docx`)

Buku belajar **16 halaman** untuk murid, mencakup:

- Sikap siap, passing bawah, passing atas, dan servis bawah
- Mengatur arah dan kekuatan bola
- Strategi posisi, komunikasi, dan pengambilan keputusan
- Aturan permainan dan fair play
- Kerja sama dan partisipasi positif
- Integrasi nilai Kristiani (Creation–Fall–Redemption–Consummation)
- Latihan persiapan praktikum dan ringkasan teori
- Daftar cek kesiapan dan ruang refleksi murid

Tampilan menggunakan judul berwarna, tabel berarsir, kotak pengingat, dan diagram posisi pemain.

### 2. Soal Sumatif Tertulis (`dokumen/Soal_Sumatif_Tertulis_Bola_Voli_Kelas_4.docx`)

- **10 soal pilihan ganda** — teknik dasar bola voli (kalimat sederhana kelas 4)
- **5 soal jawaban singkat berbasis situasi** — strategi, kontrol bola, kejujuran, kerja sama, dan nilai Kristiani
- Ruang jawaban murid
- **Kunci jawaban, rubrik penskoran, dan rumus nilai** di bagian khusus guru (pisahkan sebelum dibagikan)

### 3. Rubrik Penilaian Praktikum (`dokumen/Penilaian_Praktik_Bola_Voli_Mini_Kelas_4.xlsx`)

- Dua sheet kelas: **4 Alexandria** dan **4 Antiokhia**
- Empat aspek penilaian: Keterampilan, Strategi, Fair play, Kerja sama (masing-masing 25%)
- Skor 1–4 pada sel kuning; nilai dan tindak lanjut dihitung otomatis
- Kolom opsional nilai teori dan gabungan 70:30
- Sheet **Panduan dan Rubrik** berisi deskriptor lengkap

> ⚠️ **Versi publik ini menggunakan nama demo.** Isi data murid asli hanya pada salinan privat.

---

## 💻 Aplikasi Web

### Cara Menjalankan

1. Buka folder proyek
2. Jalankan server statis:
   ```powershell
   .\serve.ps1
   ```
   lalu buka http://localhost:8080/
3. Atau buka `index.html` langsung di browser

### Deploy ke Vercel

1. Masuk ke [Vercel](https://vercel.com/) menggunakan akun GitHub.
2. Pilih **Add New → Project**, lalu impor `echangxgis/App-PJOK`.
3. Gunakan branch `main` dan **Root Directory** kosong (root repositori).
4. Pilih **Framework Preset: Other**. Konfigurasi `vercel.json` menetapkan build `node scripts/build.mjs` dan output `dist` secara otomatis.
5. Klik **Deploy**. Tidak memerlukan environment variable atau API key.

Alamat setelah deploy:
- `/` — aplikasi PJOK utama.
- `/voli-cerdas/` — aplikasi VOLI Cerdas (gunakan garis miring terakhir agar aset relatif dimuat dengan benar).
- `/voli` — pintasan menuju VOLI Cerdas.
- `/dokumen/namafile.docx` atau `.xlsx` — unduhan dokumen publik.

Build hanya menyalin halaman, aset, dan dokumen publik ke `dist/`; skrip PowerShell tidak dijalankan di Vercel. Perubahan berikutnya yang di-push ke branch `main` memicu deployment otomatis jika integrasi GitHub Vercel aktif.

Untuk memeriksa build lokal, instal Node.js 22 atau lebih baru lalu jalankan `npm run build`. Tidak ada dependensi npm tambahan.

**Penting:** deployment Vercel tidak menambahkan database atau autentikasi produksi. Data tetap di localStorage per browser/per domain. Data lokal pada alamat lama tidak otomatis berpindah ke domain Vercel. Semua dokumen dalam `dokumen/` dapat diakses publik, termasuk kunci jawaban; jangan unggah data murid atau materi rahasia.

### Mode Pengguna

| Mode | Akses | Fitur |
|------|-------|-------|
| **Murid** | Pilih "Mulai Belajar", isi nama dan kelas | Materi, kuis, simulasi, misi, refleksi, rapor |
| **Guru** | Pilih "Mode Guru", kata sandi demo `guru123` | Dashboard, input rubrik, rekap, ekspor CSV |

### Cara Menguji

1. Login sebagai murid (Andi, kelas 4)
2. Buka Materi → tandai selesai
3. Kerjakan Kuis Topik dan Diagnostik
4. Mainkan Simulasi (pilih tindakan, cek skor)
5. Selesaikan Misi
6. Isi Refleksi
7. Lihat Rapor
8. Login sebagai guru → cek Dashboard, input rubrik praktik, lihat rekap, ekspor CSV

---

## 🛠️ Scripts

Script PowerShell untuk membuat ulang dokumen Word dan Excel menggunakan COM Automation (memerlukan Microsoft Office di Windows):

```powershell
# Membuat materi Word
powershell -ExecutionPolicy Bypass -File scripts\buat_materi.ps1

# Membuat Excel rubrik penilaian (memerlukan Template_Daftar_Murid.xlsx)
powershell -ExecutionPolicy Bypass -File scripts\buat_penilaian.ps1
```

---

## 📋 Capaian Pembelajaran (CP)

**Elemen:** Belajar Melalui Gerak

Menerapkan strategi gerak sederhana dan memecahkan masalah gerak; menerapkan peraturan untuk menumbuhkan fair play di dalam berbagai aktivitas jasmani; dan berpartisipasi secara positif dalam kelompok atau tim di dalam berbagai aktivitas jasmani.

---

## ⚖️ Privasi Data

- Dokumen publik tidak memuat nama asli, jenis kelamin asli, atau nilai murid; template generator memakai JK fiktif `L` untuk data demo.
- Nama diganti kode demo (Murid 01, Murid 02, dst.)
- **Jangan mengunggah data pribadi murid ke repositori publik**
- Gunakan salinan privat untuk data asli sesuai kebijakan sekolah

---

## Batasan aplikasi dan keamanan

Aplikasi ini merupakan prototipe pembelajaran. Progres tersimpan di `localStorage` browser, bukan basis data bersama. Login dan kata sandi guru bersifat demo, bukan pengamanan data. Jangan gunakan untuk data pribadi atau nilai resmi murid pada hosting publik. Simulasi layar tidak menggantikan penilaian gerak nyata oleh guru. Pengujian fungsi web menyeluruh belum dilakukan dalam penyiapan paket ini.

## Hak penggunaan

Lisensi distribusi belum ditetapkan oleh pemilik repositori. Konfirmasikan izin sebelum mendistribusikan ulang materi atau kode.
