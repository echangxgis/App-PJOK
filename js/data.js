/* VOLI Cerdas - Data (konten pembelajaran, bank soal, rubrik) */
window.VOLI_DATA = window.VOLI_DATA || {};

// ---------- Kelas & profil ----------
VOLI_DATA.classes = [
  { id: 4, name: "Kelas 4", tagline: "Ayo kenali bola voli!", color: "#2f6df6", emoji: "🌱" },
  { id: 5, name: "Kelas 5", tagline: "Bangun keterampilanmu!", color: "#8b5cf6", emoji: "🚀" },
  { id: 6, name: "Kelas 6", tagline: "Jadi pemain cerdas!", color: "#f43f8c", emoji: "🏆" }
];

// ---------- Materi pembelajaran ----------
// Struktur materi: setiap item memiliki id, kategori, judul, kelasTarget (array), tujuan, penjelasan, langkah, benar, salah, tips, aktivitas, pemantik, refleksi, kuis (array), tantangan, indikator, kaitan
VOLI_DATA.materials = [
  {
    id: "pengenalan",
    kategori: "A. Pengenalan Bola Voli",
    judul: "Mengenal Permainan Bola Voli",
    kelas: [4,5,6],
    tujuan: "Murid dapat menjelaskan pengertian, tujuan, dan manfaat bola voli, serta mengenali perlengkapan dan bagian lapangan.",
    penjelasan: "Bola voli adalah permainan beregu yang dimainkan dengan tangan. Dua regu saling mengirim bola melewati net. Tujuannya agar bola jatuh di area lawan. Permainan ini melatih kebugaran, kerja sama, dan keberanian.",
    langkah: ["Dengarkan penjelasan guru.", "Lihat gambar lapangan dan posisi pemain.", "Coba gerakan menangkap bola lembut.", "Diskusikan manfaat olahraga bersama teman."],
    benar: "Bola dikirim dengan tangan, bukan kaki. Tim bekerja sama membangun hingga 3 sentuhan.",
    salah: "Menendang bola, memegang bola terlalu lama, atau bermain sendirian tanpa komunikasi.",
    tips: "Selalu siap dalam sikap siap. Jaga mata pada bola. Komunikasi dengan teman.",
    aktivitas: "Murid berpasangan melempar bola ringan dengan tangan, lalu tangkap. Buat aturan: harus menyebut nama teman sebelum melempar.",
    pemantik: "Mengapa bola voli disebut permainan beregu?",
    refleksi: "Apa yang kamu rasakan saat bermain bersama teman?",
    kuis: [
      { q: "Bola voli dimainkan dengan menggunakan...", opts: ["Kaki", "Tangan", "Kepala", "Tongkat"], ans: 1, explain: "Bola voli dimainkan dengan tangan." },
      { q: "Jumlah sentuhan maksimal satu tim sebelum bola dikembalikan adalah...", opts: ["1", "2", "3", "4"], ans: 2, explain: "Maksimal 3 sentuhan tim." }
    ],
    tantangan: "Kelas 4: sebut 3 manfaat bola voli. Kelas 5: jelaskan posisi pemain. Kelas 6: bandingkan voli standar dan mini-voli.",
    indikator: "Murid menyebut tujuan permainan, manfaat, dan bagian lapangan.",
    kaitan: "Kerja sama dalam voli seperti kerja sama dalam kelompok belajar."
  },
  {
    id: "lapangan",
    kategori: "A. Pengenalan Bola Voli",
    judul: "Lapangan, Net, dan Posisi Pemain",
    kelas: [4,5,6],
    tujuan: "Murid dapat menyebut bagian lapangan, ukuran umum, dan posisi pemain.",
    penjelasan: "Lapangan voli berbentuk persegi panjang. Di tengah ada net. Ada garis tengah, garis serang, dan garis batas. Pemain berada di depan dan belakang net. Untuk anak, ukuran lapangan dan net disesuaikan agar aman.",
    langkah: ["Amati diagram lapangan.", "Tunjuk garis batas, garis tengah, dan net.", "Sebut posisi depan dan belakang.", "Bandingkan dengan lapangan mini di sekolah."],
    benar: "Mengetahui batas lapangan dan posisi aman.",
    salah: "Lupa garis batas atau berdiri terlalu dekat net.",
    tips: "Gunakan warna berbeda untuk garis. Latihan berjalan mengikuti garis.",
    aktivitas: "Murid berjalan mengikuti garis lapangan, lalu berhenti di posisi yang ditunjuk guru.",
    pemantik: "Mengapa kita tidak boleh berdiri terlalu dekat net?",
    refleksi: "Posisi mana yang paling nyaman bagimu?",
    kuis: [
      { q: "Net berada di...", opts: ["Sisi kiri", "Tengah lapangan", "Sisi kanan", "Luar lapangan"], ans: 1, explain: "Net di tengah lapangan." },
      { q: "Garis yang membatasi lapangan disebut...", opts: ["Garis tengah", "Garis batas", "Garis serang", "Garis finish"], ans: 1, explain: "Garis batas." }
    ],
    tantangan: "Kelas 4: tunjuk 3 bagian lapangan. Kelas 5: jelaskan posisi depan/belakang. Kelas 6: jelaskan rotasi sederhana.",
    indikator: "Murid menunjuk bagian lapangan dengan benar.",
    kaitan: "Memahami batas seperti memahami aturan di rumah."
  },
  {
    id: "aturan",
    kategori: "B. Aturan Permainan",
    judul: "Aturan Dasar dan Aturan Belajar (Mini-Voli)",
    kelas: [4,5,6],
    tujuan: "Murid membedakan aturan standar dengan aturan pembelajaran yang dimodifikasi.",
    penjelasan: "Aturan standar: 6 pemain per regu, servis, maksimal 3 sentuhan, bola masuk/keluar, rotasi, sistem reli (setiap reli menghasilkan poin). Aturan belajar (mini-voli): jumlah pemain lebih sedikit, lapangan lebih kecil, bola lebih ringan, servis dari jarak dekat, dan fokus pada kerja sama. Jangan samakan dengan voli dewasa.",
    langkah: ["Baca aturan belajar.", "Latih servis dari jarak dekat.", "Main mini-voli 3 lawan 3.", "Catat kesalahan umum."],
    benar: "Menggunakan aturan mini-voli yang aman untuk anak.",
    salah: "Menerapkan aturan voli dewasa pada anak kecil.",
    tips: "Guru menyesuaikan aturan. Fokus pada proses, bukan hanya skor.",
    aktivitas: "Permainan mini 3v3 dengan bola ringan, servis dari garis dekat net.",
    pemantik: "Mengapa aturan untuk anak berbeda dengan dewasa?",
    refleksi: "Aturan mana yang paling membantu belajarmu?",
    kuis: [
      { q: "Dalam voli, setiap reli menghasilkan...", opts: ["Tidak ada poin", "Poin untuk salah satu regu", "Poin untuk kedua regu", "Poin hanya saat servis"], ans: 1, explain: "Sistem reli: setiap reli ada poin." },
      { q: "Aturan mini-voli berbeda dengan voli dewasa karena...", opts: ["Lebih sulit", "Disesuaikan untuk anak", "Tidak ada aturan", "Hanya untuk guru"], ans: 1, explain: "Disesuaikan untuk anak." }
    ],
    tantangan: "Kelas 4: sebut 2 aturan mini-voli. Kelas 5: jelaskan sistem reli. Kelas 6: buat aturan permainan mini sendiri.",
    indikator: "Murid membedakan aturan standar dan belajar.",
    kaitan: "Aturan yang adil seperti aturan di rumah yang melindungi."
  },
  {
    id: "teknik-siap",
    kategori: "C. Teknik Dasar",
    judul: "Sikap Siap dan Gerak Kaki",
    kelas: [4,5,6],
    tujuan: "Murid dapat menunjukkan sikap siap dan gerak kaki yang benar.",
    penjelasan: "Sikap siap: kaki selebar bahu, lutut sedikit menekuk, berat badan di depan, tangan di depan dada, mata ke bola. Gerak kaki: langkah kecil, jangan menyilang, dekat bola.",
    langkah: ["Berdiri tegak, kaki selebar bahu.", "Tekuk lutut sedikit.", "Tangan di depan dada.", "Mata ke bola.", "Langkah kecil menuju bola."],
    benar: "Lutut menekuk, tangan siap, langkah kecil.",
    salah: "Kaki lurus, tangan turun, langkah menyilang.",
    tips: "Latih di depan cermin. Hitung 1-2-3 siap.",
    aktivitas: "Permainan 'siap-gerak': guru menunjuk arah, murid langkah kecil ke arah itu.",
    pemantik: "Mengapa lutut harus menekuk?",
    refleksi: "Bagian tubuh mana yang paling sulit dikontrol?",
    kuis: [
      { q: "Sikap siap yang benar adalah...", opts: ["Kaki rapat, tangan turun", "Kaki selebar bahu, lutut menekuk", "Berdiri tegak kaku", "Duduk"], ans: 1, explain: "Kaki selebar bahu, lutut menekuk." },
      { q: "Gerak kaki yang benar...", opts: ["Langkah besar menyilang", "Langkah kecil tanpa menyilang", "Melompat", "Berlari"], ans: 1, explain: "Langkah kecil tanpa menyilang." }
    ],
    tantangan: "Kelas 4: tahan sikap siap 10 detik. Kelas 5: gerak kaki mengikuti aba-aba. Kelas 6: kombinasi siap + gerak + passing.",
    indikator: "Sikap siap stabil dan gerak kaki aman.",
    kaitan: "Siap seperti siap belajar di kelas."
  },
  {
    id: "passing-bawah",
    kategori: "C. Teknik Dasar",
    judul: "Passing Bawah",
    kelas: [4,5,6],
    tujuan: "Murid dapat melakukan passing bawah dengan posisi tubuh dan kontrol bola yang baik.",
    penjelasan: "Passing bawah: tangan digenggam, lengan lurus membentuk platform, bola mengenai lengan bawah. Tubuh menghadap target. Dorong dengan kaki dan lengan.",
    langkah: ["Sikap siap.", "Genggam tangan, lengan lurus.", "Dekatkan bola.", "Bola mengenai lengan bawah.", "Dorong ke target dengan kaki."],
    benar: "Lengan lurus, bola mengenai lengan bawah, tubuh menghadap target.",
    salah: "Lengan bengkok, bola mengenai tangan, badan memutar.",
    tips: "Latih tanpa bola dulu. Gunakan bola ringan. Fokus pada arah, bukan keras.",
    aktivitas: "Berlatih passing bawah berpasangan dengan bola ringan, 10 kali per teman.",
    pemantik: "Apa yang terjadi jika lengan bengkok?",
    refleksi: "Seberapa konsisten passingmu hari ini?",
    kuis: [
      { q: "Bola mengenai bagian...", opts: ["Telapak tangan", "Lengan bawah", "Dada", "Kepala"], ans: 1, explain: "Lengan bawah." },
      { q: "Untuk mengarahkan bola, tubuh harus...", opts: ["Memutar", "Menghadap target", "Membelakangi target", "Miring"], ans: 1, explain: "Menghadap target." }
    ],
    tantangan: "Kelas 4: 5 passing benar. Kelas 5: 8 passing terarah. Kelas 6: passing dalam rally 3 sentuhan.",
    indikator: "Posisi tubuh dan kontrol bola saat passing.",
    kaitan: "Kontrol seperti mengontrol emosi."
  },
  {
    id: "passing-atas",
    kategori: "C. Teknik Dasar",
    judul: "Passing Atas (Set-Up)",
    kelas: [4,5,6],
    tujuan: "Murid dapat melakukan passing atas sederhana sesuai kemampuan.",
    penjelasan: "Passing atas: tangan membentuk mangkuk di atas dahi, jari-jari terbuka, bola didorong dengan jari. Gunakan untuk mengumpan. Untuk kelas 4 cukup pengenalan.",
    langkah: ["Sikap siap.", "Tangan di atas dahi membentuk mangkuk.", "Jari terbuka.", "Bola mengenai jari.", "Dorong ke target."],
    benar: "Jari terbuka, dorongan lembut.",
    salah: "Menampar bola, tangan kaku.",
    tips: "Latih dengan bola ringan/soft. Fokus akurasi.",
    aktivitas: "Lempar bola ke atas sendiri lalu passing atas ke teman.",
    pemantik: "Kapan kita menggunakan passing atas?",
    refleksi: "Apakah passing atasmu sudah lembut?",
    kuis: [
      { q: "Passing atas menggunakan...", opts: ["Lengan bawah", "Jari tangan", "Kepala", "Kaki"], ans: 1, explain: "Jari tangan." },
      { q: "Bentuk tangan saat passing atas...", opts: ["Genggam", "Mangkuk di atas dahi", "Telapak terbuka ke bawah", "Tinju"], ans: 1, explain: "Mangkuk di atas dahi." }
    ],
    tantangan: "Kelas 4: kenali bentuk tangan. Kelas 5: 5 passing atas benar. Kelas 6: umpan ke target.",
    indikator: "Teknik passing atas sesuai kemampuan.",
    kaitan: "Ketelitian seperti menulis rapi."
  },
  {
    id: "servis-bawah",
    kategori: "C. Teknik Dasar",
    judul: "Servis Bawah",
    kelas: [4,5,6],
    tujuan: "Murid dapat melakukan servis bawah dengan konsistensi dan arah.",
    penjelasan: "Servis bawah: bola ditahan di tangan non-dominan, tangan dominan memukul bola dengan telapak/lengan bawah. Ayunan dari bawah. Fokus pada arah dan konsistensi.",
    langkah: ["Berdiri di belakang garis servis.", "Tahan bola di tangan non-dominan.", "Ayunkan tangan dominan dari bawah.", "Pukul bola.", "Ikuti arah bola."],
    benar: "Ayunkan dari bawah, pukul tengah bola.",
    salah: "Melempar bola terlalu tinggi, memukul dengan kepalan.",
    tips: "Mulai jarak dekat. Fokus arah. Jangan terburu-buru.",
    aktivitas: "Servis bawah ke target (kerucut) dari jarak yang disesuaikan.",
    pemantik: "Mengapa servis harus dari belakang garis?",
    refleksi: "Berapa servis yang masuk hari ini?",
    kuis: [
      { q: "Servis bawah dimulai dari...", opts: ["Atas", "Bawah", "Samping", "Depan"], ans: 1, explain: "Dari bawah." },
      { q: "Tangan yang menahan bola adalah...", opts: ["Tangan dominan", "Tangan non-dominan", "Kedua tangan", "Tidak ada"], ans: 1, explain: "Tangan non-dominan." }
    ],
    tantangan: "Kelas 4: servis masuk dari jarak dekat. Kelas 5: servis terarah ke zona. Kelas 6: servis konsisten 7/10.",
    indikator: "Konsistensi dan ketepatan arah servis.",
    kaitan: "Konsistensi seperti kebiasaan belajar."
  },
  {
    id: "servis-atas",
    kategori: "C. Teknik Dasar",
    judul: "Servis Atas (Pengayaan)",
    kelas: [5,6],
    tujuan: "Murid mengenal servis atas sebagai pengayaan.",
    penjelasan: "Servis atas: lempar bola ke atas, pukul dengan telapak tangan dari atas. Lebih sulit. Hanya untuk yang siap. Tidak wajib untuk semua.",
    langkah: ["Berdiri siap.", "Lempar bola ke atas.", "Ayunkan tangan dari atas.", "Pukul bola.", "Ikuti arah."],
    benar: "Lemparan stabil, pukulan bersih.",
    salah: "Lemparan terlalu jauh, pukulan dengan kepalan.",
    tips: "Mulai tanpa net. Latih lemparan dulu.",
    aktivitas: "Latihan lempar-pukul ke dinding.",
    pemantik: "Kapan servis atas dipakai?",
    refleksi: "Apakah kamu siap mencoba servis atas?",
    kuis: [
      { q: "Servis atas lebih sulit karena...", opts: ["Bola lebih berat", "Butuh timing lempar-pukul", "Tidak ada aturan", "Hanya guru"], ans: 1, explain: "Butuh timing." }
    ],
    tantangan: "Kelas 5: kenali gerakan. Kelas 6: coba 3 servis atas.",
    indikator: "Pengenalan servis atas.",
    kaitan: "Tantangan baru seperti belajar hal baru."
  },
  {
    id: "mengumpan",
    kategori: "C. Teknik Dasar",
    judul: "Mengumpan (Set-Up)",
    kelas: [5,6],
    tujuan: "Murid dapat mengumpan bola ke target.",
    penjelasan: "Mengumpan: setelah menerima bola, kirim bola ke area yang memudahkan teman menyerang. Fokus pada akurasi dan komunikasi.",
    langkah: ["Terima bola.", "Lihat posisi teman.", "Pilih target.", "Umpan dengan passing atas/bawah.", "Panggil nama teman."],
    benar: "Umpan ke area aman dan tepat.",
    salah: "Umpan sembarangan tanpa melihat teman.",
    tips: "Komunikasi. Lihat lapangan sebelum mengumpan.",
    aktivitas: "Latihan 3 sentuhan: terima, umpan, kirim.",
    pemantik: "Mengapa harus melihat teman sebelum mengumpan?",
    refleksi: "Apakah umpanmu membantu teman?",
    kuis: [
      { q: "Saat mengumpan, yang penting adalah...", opts: ["Kekuatan", "Akurasi dan komunikasi", "Kecepatan", "Tinggi bola"], ans: 1, explain: "Akurasi dan komunikasi." }
    ],
    tantangan: "Kelas 5: umpan ke target. Kelas 6: bangun 3 sentuhan.",
    indikator: "Pengambilan keputusan mengumpan.",
    kaitan: "Membantu teman seperti membantu teman belajar."
  },
  {
    id: "serangan",
    kategori: "C. Teknik Dasar",
    judul: "Serangan Sederhana dan Pengenalan Blocking",
    kelas: [6],
    tujuan: "Murid mengenal serangan sederhana dan blocking.",
    penjelasan: "Serangan sederhana: kirim bola ke ruang kosong dengan kontrol. Blocking: melompat di depan net untuk menghalangi bola. Pengenalan saja, tidak wajib sempurna.",
    langkah: ["Baca situasi.", "Pilih ruang kosong.", "Kirim bola terkontrol.", "Untuk blocking: berdiri dekat net, lompat dengan tangan terangkat."],
    benar: "Menempatkan bola ke ruang kosong.",
    salah: "Memukul keras tanpa arah.",
    tips: "Fokus penempatan, bukan kekuatan.",
    aktivitas: "Game: cari ruang kosong dan kirim bola.",
    pemantik: "Mengapa penempatan lebih penting dari kekuatan?",
    refleksi: "Apakah kamu bisa membaca ruang kosong?",
    kuis: [
      { q: "Serangan sederhana sebaiknya...", opts: ["Se keras mungkin", "Ke ruang kosong", "Ke net", "Ke teman sendiri"], ans: 1, explain: "Ke ruang kosong." }
    ],
    tantangan: "Kelas 6: 3 serangan ke ruang kosong.",
    indikator: "Membaca ruang kosong.",
    kaitan: "Strategi seperti strategi belajar."
  },
  {
    id: "komunikasi",
    kategori: "C. Teknik Dasar",
    judul: "Komunikasi dan Posisi Bertahan",
    kelas: [4,5,6],
    tujuan: "Murid berkomunikasi dan menjaga posisi bertahan.",
    penjelasan: "Komunikasi: panggil 'saya' atau nama teman. Posisi bertahan: siap, sebar, jaga ruang. Hindari dua orang ke bola yang sama.",
    langkah: ["Sebar posisi.", "Panggil bola.", "Satu orang ambil bola.", "Yang lain siap backup."],
    benar: "Komunikasi jelas, posisi seimbang.",
    salah: "Diam, dua orang mengejar bola.",
    tips: "Gunakan kata sederhana. Latih panggilan.",
    aktivitas: "Permainan 'panggil bola' dengan bola lembut.",
    pemantik: "Apa yang terjadi jika tidak ada yang memanggil bola?",
    refleksi: "Apakah kamu sudah berani memanggil bola?",
    kuis: [
      { q: "Kata yang baik saat bola datang adalah...", opts: ["Diam", "Saya / nama teman", "Tidak tahu", "Lari"], ans: 1, explain: "Panggil 'saya' atau nama." }
    ],
    tantangan: "Kelas 4: panggil bola 5 kali. Kelas 5: jaga posisi. Kelas 6: pimpin komunikasi tim.",
    indikator: "Komunikasi dan kerja sama.",
    kaitan: "Komunikasi seperti dalam kelompok."
  },
  {
    id: "taktik",
    kategori: "D. Taktik Sederhana",
    judul: "Taktik Sederhana dan Pengambilan Keputusan",
    kelas: [4,5,6],
    tujuan: "Murid menerapkan taktik sederhana: mencari ruang kosong, membangun 3 sentuhan, transisi.",
    penjelasan: "Taktik sederhana: cari ruang kosong, bangun 3 sentuhan (terima-umpan-kirim), komunikasi, transisi menyerang-bertahan. Keputusan berdasarkan situasi, bukan kekuatan.",
    langkah: ["Amati situasi.", "Pilih keputusan aman.", "Bangun 3 sentuhan.", "Transisi ke bertahan."],
    benar: "Keputusan aman dan kerja sama.",
    salah: "Pukul keras sembarangan.",
    tips: "Tanya: 'Ke mana bola harus pergi?'",
    aktivitas: "Simulasi keputusan dalam rally.",
    pemantik: "Kapan harus menyerang dan kapan bertahan?",
    refleksi: "Keputusan apa yang paling sulit?",
    kuis: [
      { q: "Taktik yang baik adalah...", opts: ["Pukul sekeras mungkin", "Cari ruang kosong", "Main sendiri", "Abaikan teman"], ans: 1, explain: "Cari ruang kosong." }
    ],
    tantangan: "Kelas 4: bangun 2 sentuhan. Kelas 5: 3 sentuhan. Kelas 6: transisi dan strategi tim.",
    indikator: "Pengambilan keputusan.",
    kaitan: "Keputusan seperti memilih jawaban ujian."
  },
  {
    id: "keselamatan",
    kategori: "E. Keselamatan",
    judul: "Keselamatan dan Pencegahan Cedera",
    kelas: [4,5,6],
    tujuan: "Murid memahami pemanasan, pendinginan, dan penanganan awal cedera.",
    penjelasan: "Keselamatan: pemanasan sebelum bermain, pendinginan setelah, cek lapangan, jarak aman, bola sesuai kemampuan, hidrasi, hindari benturan, laporkan cedera ke guru.",
    langkah: ["Pemanasan 5 menit.", "Cek lapangan.", "Main dengan jarak aman.", "Minum air.", "Pendinginan 3 menit.", "Lapor jika cedera."],
    benar: "Pemanasan dan pendinginan dilakukan.",
    salah: "Langsung bermain tanpa pemanasan.",
    tips: "Jangan memaksa. Dengarkan tubuh.",
    aktivitas: "Rangkaian pemanasan dan pendinginan bersama.",
    pemantik: "Mengapa perlu pemanasan?",
    refleksi: "Apakah kamu sudah peduli keselamatan?",
    kuis: [
      { q: "Sebelum bermain harus...", opts: ["Langsung main", "Pemanasan", "Minum soda", "Lari cepat"], ans: 1, explain: "Pemanasan." },
      { q: "Jika cedera, yang dilakukan...", opts: ["Lanjut main", "Lapor guru", "Sembunyi", "Paksa"], ans: 1, explain: "Lapor guru." }
    ],
    tantangan: "Kelas 4: sebut 3 keselamatan. Kelas 5: pimpin pemanasan. Kelas 6: buat rencana keselamatan tim.",
    indikator: "Keselamatan dan sportivitas.",
    kaitan: "Menjaga tubuh seperti menjaga kesehatan."
  },
  {
    id: "sportivitas",
    kategori: "F. Sportivitas",
    judul: "Sportivitas dan Karakter",
    kelas: [4,5,6],
    tujuan: "Murid menunjukkan sportivitas: menghormati, jujur, menerima kekalahan, mengapresiasi.",
    penjelasan: "Sportivitas: hormati lawan dan wasit, jujur skor, terima kekalahan, apresiasi teman, disiplin, selesaikan konflik damai. Integrasi karakter: kasih, disiplin, berdaya guna, kepemimpinan melayani.",
    langkah: ["Sapa lawan.", "Jujur skor.", "Apresiasi teman.", "Terima hasil.", "Selesaikan konflik damai."],
    benar: "Menghormati dan jujur.",
    salah: "Curang, menyalahkan teman.",
    tips: "Ingat: menang kalah bagian dari permainan.",
    aktivitas: "Refleksi karakter dan jurnal belajar.",
    pemantik: "Apa arti menang yang sesungguhnya?",
    refleksi: "Karakter mana yang ingin kamu kembangkan?",
    kuis: [
      { q: "Sportivitas berarti...", opts: ["Menang dengan curang", "Menghormati dan jujur", "Marah saat kalah", "Membully"], ans: 1, explain: "Menghormati dan jujur." }
    ],
    tantangan: "Semua kelas: refleksi karakter.",
    indikator: "Sikap dan sportivitas.",
    kaitan: "Karakter seperti cahaya."
  }
];

// Fix trailing syntax issue in last quiz by ensuring array closed
// We'll patch in app if needed; but keep valid JS. The above has missing ']'? Let's ensure valid: add closing bracket.
// Actually line: kuis array has one object then ']'? We wrote `],`? Check: 
// kuis: [ { ... } // no closing ]. Need fix. We'll fix via edit after.

// ---------- Bank soal formatif (per topik) ----------
VOLI_DATA.quizBank = {
  diagnostik: [
    { q: "Bola voli dimainkan dengan...", opts: ["Kaki", "Tangan", "Kepala", "Tongkat"], ans: 1 },
    { q: "Jumlah sentuhan maksimal tim adalah...", opts: ["1", "2", "3", "4"], ans: 2 },
    { q: "Net berada di...", opts: ["Sisi", "Tengah", "Luar", "Belakang"], ans: 1 },
    { q: "Sistem reli berarti...", opts: ["Poin hanya servis", "Setiap reli ada poin", "Tidak ada poin", "Poin ganda"], ans: 1 },
    { q: "Sikap siap: kaki...", opts: ["Rapat", "Selebar bahu", "Silang", "Duduk"], ans: 1 },
    { q: "Passing bawah mengenai...", opts: ["Telapak", "Lengan bawah", "Dada", "Kepala"], ans: 1 },
    { q: "Servis bawah dari...", opts: ["Atas", "Bawah", "Samping", "Depan"], ans: 1 },
    { q: "Sebelum bermain harus...", opts: ["Langsung main", "Pemanasan", "Minum soda", "Lari"], ans: 1 },
    { q: "Sportivitas adalah...", opts: ["Curang", "Menghormati", "Marah", "Membully"], ans: 1 },
    { q: "Komunikasi dalam voli...", opts: ["Diam", "Panggil bola", "Lari", "Menendang"], ans: 1 }
  ],
  formatif: []
};

// ---------- Rubrik praktik ----------
VOLI_DATA.rubric = {
  indicators: [
    { id: "sikap", name: "Sikap siap dan gerak kaki", weight: 10 },
    { id: "posisiPB", name: "Ketepatan posisi tubuh saat passing bawah", weight: 12 },
    { id: "kontrolPB", name: "Kontrol dan arah bola saat passing", weight: 12 },
    { id: "passingAtas", name: "Teknik passing atas sesuai kemampuan", weight: 10 },
    { id: "konsistensiServis", name: "Konsistensi servis bawah", weight: 12 },
    { id: "arahServis", name: "Ketepatan arah servis", weight: 10 },
    { id: "keputusan", name: "Pengambilan keputusan dalam permainan", weight: 12 },
    { id: "komunikasi", name: "Komunikasi dan kerja sama", weight: 12 },
    { id: "keselamatan", name: "Keselamatan dan sportivitas", weight: 10 }
  ],
  levels: {
    4: "Sangat Berkembang", 3: "Berkembang Sesuai Harapan", 2: "Mulai Berkembang", 1: "Memerlukan Bimbingan"
  },
  descriptors: {
    sikap: {
      4: "Sikap siap stabil, lutut menekuk, tangan siap, gerak kaki cepat dan tepat.",
      3: "Sikap siap cukup baik, gerak kaki kadang menyilang.",
      2: "Sikap siap belum stabil, gerak kaki lambat.",
      1: "Belum menunjukkan sikap siap, perlu bimbingan."
    },
    posisiPB: {
      4: "Posisi tubuh selalu menghadap target, platform stabil.",
      3: "Posisi cukup baik, kadang tidak menghadap target.",
      2: "Posisi sering salah, platform tidak stabil.",
      1: "Belum memahami posisi, perlu bimbingan."
    },
    kontrolPB: {
      4: "Kontrol dan arah bola konsisten ke target.",
      3: "Kontrol cukup, arah kadang meleset.",
      2: "Kontrol lemah, arah sering meleset.",
      1: "Belum mengontrol bola, perlu bimbingan."
    },
    passingAtas: {
      4: "Passing atas lembut dan akurat sesuai tujuan.",
      3: "Passing atas cukup, kadang terlalu keras.",
      2: "Passing atas belum akurat.",
      1: "Belum mampu, perlu bimbingan."
    },
    konsistensiServis: {
      4: "Servis masuk konsisten 8/10.",
      3: "Servis masuk 5-7/10.",
      2: "Servis masuk 2-4/10.",
      1: "Servis jarang masuk, perlu bimbingan."
    },
    arahServis: {
      4: "Arah servis tepat ke zona target.",
      3: "Arah cukup, kadang meleset.",
      2: "Arah sering meleset.",
      1: "Belum mengarahkan servis."
    },
    keputusan: {
      4: "Keputusan tepat dan aman dalam rally.",
      3: "Keputusan cukup, kadang terburu-buru.",
      2: "Keputusan sering kurang tepat.",
      1: "Belum mengambil keputusan, perlu bimbingan."
    },
    komunikasi: {
      4: "Komunikasi jelas, kerja sama baik.",
      3: "Komunikasi cukup, kadang diam.",
      2: "Komunikasi kurang.",
      1: "Belum berkomunikasi."
    },
    keselamatan: {
      4: "Selalu aman dan sportif.",
      3: "Cukup aman dan sportif.",
      2: "Kadang lupa keselamatan.",
      1: "Perlu bimbingan keselamatan."
    }
  }
};

// ---------- Peta tujuan pembelajaran ----------
VOLI_DATA.learningMap = {
  4: [
    { elemen: "Pengenalan", tp: "Menjelaskan tujuan permainan dan manfaat bola voli", materi: "pengenalan", formatif: "Kuis 5 soal", sumatif: "Tes pengetahuan", waktu: "2 JP" },
    { elemen: "Lapangan", tp: "Menyebut bagian lapangan dan posisi", materi: "lapangan", formatif: "Kuis 5 soal", sumatif: "Tes pengetahuan", waktu: "1 JP" },
    { elemen: "Teknik", tp: "Melakukan sikap siap, gerak kaki, passing bawah sederhana", materi: "teknik-siap,passing-bawah", formatif: "Observasi", sumatif: "Rubrik praktik", waktu: "4 JP" },
    { elemen: "Servis", tp: "Melakukan servis bawah dari jarak disesuaikan", materi: "servis-bawah", formatif: "Tantangan", sumatif: "Rubrik praktik", waktu: "2 JP" },
    { elemen: "Permainan", tp: "Bermain mini dengan bola ringan dan kerja sama", materi: "aturan,komunikasi", formatif: "Observasi", sumatif: "Penerapan", waktu: "3 JP" },
    { elemen: "Keselamatan", tp: "Memahami pemanasan dan keselamatan", materi: "keselamatan", formatif: "Kuis", sumatif: "Tes pengetahuan", waktu: "1 JP" }
  ],
  5: [
    { elemen: "Pengenalan", tp: "Menjelaskan posisi dan aturan sederhana", materi: "pengenalan,lapangan,aturan", formatif: "Kuis", sumatif: "Tes pengetahuan", waktu: "2 JP" },
    { elemen: "Teknik", tp: "Konsistensi passing bawah dan atas", materi: "passing-bawah,passing-atas", formatif: "Observasi", sumatif: "Rubrik praktik", waktu: "4 JP" },
    { elemen: "Servis", tp: "Servis bawah terarah", materi: "servis-bawah", formatif: "Tantangan", sumatif: "Rubrik praktik", waktu: "2 JP" },
    { elemen: "Mengumpan", tp: "Membangun 2-3 sentuhan", materi: "mengumpan,taktik", formatif: "Simulasi", sumatif: "Penerapan", waktu: "3 JP" },
    { elemen: "Karakter", tp: "Sportivitas dan kerja sama", materi: "sportivitas,komunikasi", formatif: "Refleksi", sumatif: "Sikap", waktu: "1 JP" }
  ],
  6: [
    { elemen: "Teknik", tp: "Kombinasi teknik dan servis terarah", materi: "passing-bawah,passing-atas,servis-bawah,servis-atas", formatif: "Observasi", sumatif: "Rubrik praktik", waktu: "4 JP" },
    { elemen: "Taktik", tp: "Membaca ruang kosong dan transisi", materi: "taktik,serangan", formatif: "Simulasi", sumatif: "Penerapan", waktu: "3 JP" },
    { elemen: "Rotasi", tp: "Rotasi dasar dan strategi tim", materi: "lapangan,aturan", formatif: "Kuis", sumatif: "Tes pengetahuan", waktu: "2 JP" },
    { elemen: "Kepemimpinan", tp: "Kepemimpinan melayani dan refleksi", materi: "sportivitas,komunikasi", formatif: "Refleksi", sumatif: "Sikap", waktu: "2 JP" }
  ]
};

// ---------- Sumatif questions (25) ----------
VOLI_DATA.sumatif = [
  { q: "Bola voli adalah permainan...", opts: ["Sendiri", "Beregu dengan tangan", "Sepak bola", "Lari"], ans: 1 },
  { q: "Tujuan permainan adalah...", opts: ["Menjatuhkan bola di area sendiri", "Menjatuhkan bola di area lawan", "Menahan bola", "Melempar jauh"], ans: 1 },
  { q: "Manfaat voli bagi kesehatan...", opts: ["Tidak ada", "Kebugaran dan kerja sama", "Hanya kekuatan", "Hanya kecepatan"], ans: 1 },
  { q: "Bagian lapangan yang membagi dua sisi adalah...", opts: ["Garis batas", "Garis tengah", "Net", "Garis serang"], ans: 2 },
  { q: "Net berada di...", opts: ["Sisi", "Tengah", "Luar", "Belakang"], ans: 1 },
  { q: "Jumlah pemain standar per regu adalah...", opts: ["3", "4", "6", "8"], ans: 2 },
  { q: "Maksimal sentuhan tim sebelum mengembalikan bola adalah...", opts: ["1", "2", "3", "4"], ans: 2 },
  { q: "Sistem reli berarti...", opts: ["Poin hanya servis", "Setiap reli ada poin", "Tidak ada poin", "Poin ganda"], ans: 1 },
  { q: "Servis dilakukan dari...", opts: ["Depan net", "Belakang garis servis", "Tengah lapangan", "Luar lapangan"], ans: 1 },
  { q: "Bola masuk jika...", opts: ["Menyentuh garis batas", "Keluar lapangan", "Menyentuh net lalu keluar", "Tidak melewati net"], ans: 0 },
  { q: "Rotasi dilakukan saat...", opts: ["Setiap poin lawan", "Regu mendapat hak servis", "Setiap set", "Tidak pernah"], ans: 1 },
  { q: "Sikap siap yang benar...", opts: ["Kaki rapat", "Kaki selebar bahu, lutut menekuk", "Berdiri kaku", "Duduk"], ans: 1 },
  { q: "Gerak kaki yang benar...", opts: ["Menyilang", "Langkah kecil tanpa menyilang", "Melompat", "Berlari"], ans: 1 },
  { q: "Passing bawah mengenai...", opts: ["Telapak", "Lengan bawah", "Dada", "Kepala"], ans: 1 },
  { q: "Untuk mengarahkan passing, tubuh harus...", opts: ["Memutar", "Menghadap target", "Membelakangi", "Miring"], ans: 1 },
  { q: "Passing atas menggunakan...", opts: ["Lengan bawah", "Jari tangan", "Kepala", "Kaki"], ans: 1 },
  { q: "Bentuk tangan passing atas...", opts: ["Genggam", "Mangkuk di atas dahi", "Telapak ke bawah", "Tinju"], ans: 1 },
  { q: "Servis bawah dimulai dari...", opts: ["Atas", "Bawah", "Samping", "Depan"], ans: 1 },
  { q: "Tangan yang menahan bola saat servis...", opts: ["Dominan", "Non-dominan", "Kedua", "Tidak ada"], ans: 1 },
  { q: "Sebelum bermain harus...", opts: ["Langsung main", "Pemanasan", "Minum soda", "Lari cepat"], ans: 1 },
  { q: "Jika cedera, yang dilakukan...", opts: ["Lanjut main", "Lapor guru", "Sembunyi", "Paksa"], ans: 1 },
  { q: "Sportivitas berarti...", opts: ["Curang", "Menghormati dan jujur", "Marah", "Membully"], ans: 1 },
  { q: "Komunikasi yang baik...", opts: ["Diam", "Panggil bola", "Lari", "Menendang"], ans: 1 },
  { q: "Taktik yang baik...", opts: ["Pukul sekeras mungkin", "Cari ruang kosong", "Main sendiri", "Abaikan teman"], ans: 1 },
  { q: "Mini-voli untuk anak...", opts: ["Sama dengan dewasa", "Disesuaikan untuk anak", "Tidak ada aturan", "Hanya guru"], ans: 1 },
  { q: "Studi kasus: bola datang ke area kosong antara dua teman. Keputusan terbaik adalah...", opts: ["Diam saja", "Salah satu memanggil dan mengambil, yang lain backup", "Kedua-duanya mengejar bola", "Biarkan bola jatuh"], ans: 1 },
  { q: "Situasi: temanmu servis gagal 3 kali. Kamu sebaiknya...", opts: ["Menertawakan", "Memberi semangat dan tips", "Marah", "Mengabaikan"], ans: 1 }
];

// ---------- Mis i (levels) ----------
VOLI_DATA.missions = [
  { id: "m1", level: 1, title: "Pemula: Siap dan Gerak", desc: "Lakukan sikap siap dan gerak kaki 10 kali.", badge: "🌱 Pemula", target: 10 },
  { id: "m2", level: 2, title: "Passing Bawah 5x", desc: "Lakukan 5 passing bawah benar ke teman.", badge: "🎯 Penjelajah", target: 5 },
  { id: "m3", level: 3, title: "Servis Masuk", desc: "Servis bawah masuk 3 kali berturut-turut.", badge: "🚀 Peluncur", target: 3 },
  { id: "m4", level: 4, title: "Bangun 3 Sentuhan", desc: "Bangun rally 3 sentuhan bersama tim.", badge: "🤝 Tim", target: 1 },
  { id: "m5", level: 5, title: "Penempatan Bola", desc: "Tempatkan bola ke ruang kosong 3 kali.", badge: "🧠 Strategis", target: 3 },
  { id: "m6", level: 6, title: "Mahir: Pemimpin", desc: "Pimpin komunikasi tim dalam permainan mini.", badge: "🏆 Pemimpin", target: 1 }
];

// ---------- Modul ajar contoh ----------
VOLI_DATA.teachingModule = {
  title: "Modul Pelaksanaan Pembelajaran (Contoh)",
  steps: [
    "Pembukaan: salam, doa, cek kesiapan (5 menit).",
    "Pemanasan: gerak dinamis dan peregangan (5 menit).",
    "Apersepsi: tanya pengalaman bermain voli (3 menit).",
    "Inti: demonstrasi teknik, latihan bertahap, permainan mini (25 menit).",
    "Penutup: pendinginan, refleksi, tugas rumah (7 menit)."
  ]
};

// ---------- Demo murid ----------
VOLI_DATA.demoStudents = [
  { id: "s1", name: "Andi", kelas: 4 },
  { id: "s2", name: "Budi", kelas: 4 },
  { id: "s3", name: "Citra", kelas: 5 },
  { id: "s4", name: "Dewi", kelas: 5 },
  { id: "s5", name: "Eko", kelas: 6 },
  { id: "s6", name: "Fani", kelas: 6 }
];

// ---------- Perbaikan typo materi sportivitas ----------
// Patch quiz sportivitas to valid array
(function(){
  const m = VOLI_DATA.materials.find(x=>x.id==="sportivitas");
  if(m){ m.kuis = [{ q: "Sportivitas berarti...", opts: ["Curang", "Menghormati dan jujur", "Marah saat kalah", "Membully"], ans: 1, explain: "Menghormati dan jujur." }]; }
})();