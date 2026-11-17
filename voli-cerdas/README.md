# VOLI Cerdas

Aplikasi web pembelajaran interaktif bola voli untuk PJOK kelas 4, 5, dan 6 SD.

## Menjalankan
1. Buka folder `voli-cerdas`.
2. Buka `index.html` di browser (Chrome/Edge/Firefox). Tidak perlu server.
3. Atau jalankan server lokal: `python -m http.server 8000` lalu buka `http://localhost:8000`.

## Menguji
- Pilih peran Murid/Guru/Administrator di kanan atas.
- Uji alur: Beranda -> Peta Belajar -> Materi -> Kuis -> Simulasi -> Misi -> Asesmen Sumatif -> Refleksi -> Rapor.
- Simulasi: pilih mode dan kesulitan, Mulai, lakukan servis/passing/serangan, cek skor dan riwayat.
- Guru: buka Dashboard Guru, ubah bobot/ambang, input rubrik, ekspor CSV, cetak.

## Menerapkan
- Unggah folder `voli-cerdas` ke hosting statis (Netlify, Vercel, GitHub Pages).
- Data tersimpan di localStorage perangkat. Untuk multi-perangkat, tambahkan backend dan autentikasi.

## Catatan
- Data demo ditandai dengan "(Demo)".
- Simulasi layar melatih pengetahuan dan pengambilan keputusan, tetapi tidak menggantikan asesmen gerak nyata di lapangan.
- Semua bobot dan ambang ketuntasan dapat diubah guru.