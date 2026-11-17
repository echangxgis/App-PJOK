$ErrorActionPreference='Stop'
$out=(Join-Path $PSScriptRoot '..\dokumen\Materi_Bola_Voli_Mini_Kelas_4.docx')
$w=New-Object -ComObject Word.Application
$w.Visible=$false
try {
$d=$w.Documents.Add();$s=$w.Selection
$d.PageSetup.TopMargin=45;$d.PageSetup.BottomMargin=45;$d.PageSetup.LeftMargin=52;$d.PageSetup.RightMargin=52
$d.Styles.Item('Normal').Font.Name='Calibri';$d.Styles.Item('Normal').Font.Size=12;$d.Styles.Item('Normal').ParagraphFormat.SpaceAfter=7
$d.Sections.Item(1).Footers.Item(1).PageNumbers.Add()|Out-Null
function P([string]$t){$s.Font.Name='Calibri';$s.Font.Size=12;$s.Font.Bold=0;$s.Font.Color=3355443;$s.ParagraphFormat.SpaceAfter=7;$s.TypeText($t);$s.TypeParagraph()}
function Heading([string]$t){$s.Font.Size=21;$s.Font.Bold=1;$s.Font.Color=7951920;$s.TypeText($t);$s.TypeParagraph();$s.Font.Bold=0;$s.Font.Size=12}
function Sub([string]$t){$s.Font.Size=14;$s.Font.Bold=1;$s.Font.Color=10053120;$s.TypeText($t);$s.TypeParagraph();$s.Font.Bold=0;$s.Font.Size=12}
function Box([string]$label,[string]$text){$t=$d.Tables.Add($s.Range,1,1);$t.Cell(1,1).Range.Text="$label`r$text";$t.Shading.BackgroundPatternColor=15724527;$t.Range.Font.Size=12;$t.Range.ParagraphFormat.SpaceAfter=8;$t.Borders.Enable=0;$t.Cell(1,1).TopPadding=8;$t.Cell(1,1).BottomPadding=8;$end=$t.Range.End;$s.SetRange($end,$end);$s.MoveDown()|Out-Null;$s.TypeParagraph()}
function Table($heads,$rows){$t=$d.Tables.Add($s.Range,$rows.Count+1,$heads.Count);$t.Borders.Enable=1;$t.Range.Font.Size=11;$t.Range.ParagraphFormat.SpaceAfter=5;$t.Rows.Item(1).Shading.BackgroundPatternColor=7951920;$t.Rows.Item(1).Range.Font.Color=16777215;$t.Rows.Item(1).Range.Font.Bold=1;$t.Rows.Item(1).HeadingFormat=-1
for($c=0;$c -lt $heads.Count;$c++){$t.Cell(1,$c+1).Range.Text=$heads[$c]}
for($r=0;$r -lt $rows.Count;$r++){for($c=0;$c -lt $heads.Count;$c++){$t.Cell($r+2,$c+1).Range.Text=$rows[$r][$c]};if($r%2 -eq 0){$t.Rows.Item($r+2).Shading.BackgroundPatternColor=15921906}}
$t.Rows.AllowBreakAcrossPages=0;$t.AutoFitBehavior(2);$end=$t.Range.End;$s.SetRange($end,$end);$s.MoveDown()|Out-Null;$s.TypeParagraph()}
function Page{$s.InsertBreak(7)}
$s.ParagraphFormat.Alignment=1
P 'PJOK â€¢ FASE B â€¢ KELAS 4'
$s.Font.Size=34;$s.Font.Bold=1;$s.Font.Color=7951920;$s.TypeText("BOLA VOLI`rMINI");$s.TypeParagraph()
P 'TERAMPIL â€¢ JUJUR â€¢ SALING MENDUKUNG'
P 'Unit 2: Kingdom Character in Play'
P 'Integritas dan Nilai Kerajaan dalam Permainan'
$s.ParagraphFormat.Alignment=0
Box 'PERJALANAN BELAJARKU' 'KENALI TEKNIK  >  LATIH GERAK  >  PILIH STRATEGI  >  MAIN DENGAN KASIH'
P 'Nama: __________________________________________________'
P 'Kelas: ___________________   Tahun ajaran: ___________________'
P 'Buku belajar dan latihan untuk persiapan sumatif praktikum serta sumatif tertulis.'
Box 'GAGASAN UTAMA' 'Dalam permainan, kita belajar menggunakan kemampuan gerak, bersikap jujur dan adil, serta menunjukkan kasih Kristus melalui kerja sama.'
P 'Gunakan buku ini bersama guru. Baca, peragakan, berlatih dengan aman, lalu ceritakan apa yang kamu pelajari.'
Page
Heading '01 | Peta Perjalanan Belajar'
Table @('Bagian','Yang akan kupelajari') @(@('Kenal dan aman','Bola voli mini, pemanasan, dan keselamatan.'),@('Terampil bergerak','Sikap siap, passing bawah, passing atas, dan servis bawah.'),@('Cerdas bermain','Kontrol bola, pembagian posisi, komunikasi, dan keputusan.'),@('Berkarakter','Aturan, kejujuran, kerja sama, dan kasih Kristus.'),@('Siap sumatif','Latihan praktikum, ringkasan teori, dan cek kesiapan.'))
Sub 'Target belajarku'
P '1. Aku dapat menggunakan passing dan servis secara terkendali.'
P '2. Aku dapat mengatur posisi dan memilih tindakan sesuai arah bola.'
P '3. Aku dapat menjelaskan cara memperbaiki masalah permainan.'
P '4. Aku dapat menaati aturan dan mengakui pelanggaran dengan jujur.'
P '5. Aku dapat memberi kesempatan dan mendukung teman.'
P '6. Aku dapat menunjukkan kasih melalui tindakan saat bermain.'
Box 'CARA MENGGUNAKAN BUKU INI' 'BACA untuk memahami. COBA bersama guru. INGAT kata kuncinya. REFLEKSI untuk memperbaiki diri. Belajar bukan perlombaan menjadi sempurna!'
Page
Heading '02 | Kenali Permainan dan Jaga Aman'
P 'Bola voli mini adalah bola voli yang disesuaikan untuk anak-anak. Dua tim mengirim bola melewati net dan berusaha agar bola tidak jatuh di lapangannya.'
P 'Kita dapat bermain 3 lawan 3 atau 4 lawan 4. Lapangan lebih kecil, net lebih rendah, bola lebih lunak, dan garis servis dapat didekatkan sesuai arahan guru.'
Box 'ATURAN BELAJAR' 'Menangkap bola atau membiarkan satu pantulan hanya boleh jika guru sudah menjadikannya aturan kelas. Jangan menambah aturan sendiri.'
Table @('Waktu','Yang perlu kulakukan') @(@('Sebelum bermain','Pakai sepatu yang sesuai; ikat tali sepatu; lepas aksesori berbahaya; periksa lapangan; lakukan pemanasan.'),@('Saat bermain','Lihat bola dan teman; panggil bola; jangan mendorong atau menarik net; hindari masuk ke bawah net; berhenti saat ada aba-aba.'),@('Jika ada masalah','Beri tahu guru jika sakit, pusing, lapangan licin, atau ada bola lain masuk. Hentikan permainan dengan aman.'),@('Sesudah bermain','Lakukan pendinginan, minum air, kembalikan alat, dan ucapkan terima kasih.'))
Sub 'Pemanasan bersama guru'
P 'Berjalan atau lari kecil, gerakkan bahu dan pergelangan tangan, tekuk lutut perlahan, lalu lakukan langkah ke kanan, kiri, depan, dan belakang.'
Box 'INGAT' 'Aku menjaga keselamatan diriku, teman, dan lawan. Jangan memaksakan gerakan yang terasa sakit.'
Page
Heading '03 | Sikap Siap dan Passing Bawah'
Sub 'A. Sikap siap'
P '1. Buka kaki selebar bahu. Satu kaki boleh sedikit di depan.'
P '2. Tekuk lutut sedikit dan condongkan badan sedikit ke depan.'
P '3. Siapkan tangan di depan badan dan lihat bola.'
P '4. Bergerak mengikuti arah bola, lalu berhenti dengan seimbang.'
Box 'KUNCI GERAK' 'KAKI TERBUKA  â€¢  LUTUT LENTUR  â€¢  LIHAT BOLA  â€¢  SIAP BERGERAK'
Sub 'B. Passing bawah'
P 'Passing bawah digunakan untuk menerima atau mengoper bola, terutama bola rendah di depan badan. Bola menyentuh kedua lengan bawah: bagian di antara pergelangan tangan dan siku.'
P '1. Ambil sikap siap dan gerakkan kaki menuju posisi yang sesuai.'
P '2. Satukan tangan dengan pegangan yang dicontohkan guru.'
P '3. Rapatkan dan luruskan kedua lengan hingga membentuk bidang rata.'
P '4. Arahkan bidang lengan ke sasaran. Biarkan bola mengenai lengan bawah.'
P '5. Luruskan lutut secukupnya untuk membantu dorongan. Jangan mengayun terlalu kuat.'
P '6. Setelah mengoper, kembali ke sikap siap.'
Box 'KUNCI GERAK' 'DEKATI BOLA  >  RAPATKAN LENGAN  >  ARAHKAN  >  DORONG SECUKUPNYA'
P 'Coba ceritakan: Mengapa pandangan kita harus mengikuti bola?'
Page
Heading '04 | Passing Atas dan Servis Bawah'
Sub 'A. Passing atas'
P 'Passing atas menggunakan jari-jari kedua tangan dari posisi di atas depan dahi. Gunakan ketika bola cukup tinggi dan tubuh dapat berada di bawahnya dengan aman.'
P '1. Lihat bola dan bergerak ke bawahnya. Tekuk lutut sedikit.'
P '2. Angkat tangan di atas depan dahi. Renggangkan jari dengan nyaman.'
P '3. Sentuh bola dengan jari-jari kedua tangan.'
P '4. Dorong bola terarah dengan bantuan tangan dan kaki, lalu siap kembali.'
Box 'INGAT' 'TANGAN DEPAN DAHI â€¢ JARI MENYENTUH â€¢ DORONG TERARAH. Jangan menahan bola atau memaksakan posisi yang tidak aman.'
Sub 'B. Servis bawah'
P 'Servis adalah pukulan untuk memulai permainan atau reli. Pada servis bawah, tangan pemukul diayunkan dari belakang ke depan.'
P '1. Berdiri di garis servis belajar. Jika tangan kanan memukul, kaki kiri di depan; jika tangan kiri memukul, lakukan sebaliknya.'
P '2. Pegang bola dengan tangan lain di depan badan sekitar pinggang. Lihat bola.'
P '3. Ayunkan tangan pemukul ke belakang. Lepaskan bola sedikit dari penyangga.'
P '4. Ayunkan tangan dari belakang ke depan dan pukul bagian bawah-belakang bola. Ikuti bentuk tangan yang diajarkan guru.'
P '5. Lanjutkan ayunan ke arah sasaran. Masuk ke posisi siap sesuai aturan.'
Box 'KUNCI GERAK' 'SEIMBANG  >  LIHAT BOLA  >  AYUN BELAKANG KE DEPAN  >  ARAHKAN'
Page
Heading '05 | Bola Terarah, Bukan Sekadar Kuat'
P 'Operan yang baik adalah operan yang dapat dijangkau teman. Lihat sasaran, sesuaikan posisi tubuh, lalu atur arah dan tenaga.'
Table @('Masalah','Cara memperbaiki','Manfaat') @(@('Passing terlalu jauh','Kurangi tenaga dan ayunan.','Bola tidak melewati teman.'),@('Bola ke samping','Rapatkan lengan dan arahkan bidang lengan ke sasaran.','Arah bola lebih tepat.'),@('Bola sulit dikontrol','Gerakkan kaki agar tubuh lebih dekat ke posisi bola.','Perkenaan lebih terkendali.'),@('Servis belum melewati net','Perbaiki perkenaan; tambah tenaga secukupnya dari jarak belajar.','Bola lebih mudah melewati net.'),@('Servis terlalu jauh','Kurangi tenaga dan kendalikan ayunan.','Bola menuju area sasaran.'),@('Pukulan meleset','Lihat bola; jaga pelepasan tetap dekat dan terkendali.','Tangan lebih mudah mengenai bola.'))
Box 'JARAK DAN TENAGA' 'Teman dekat biasanya membutuhkan tenaga lebih kecil. Sasaran jauh dapat membutuhkan tenaga lebih besar. Sesuaikan, jangan asal memukul keras.'
Sub 'Latih cara menjelaskan'
P 'â€œSaya mengurangi tenaga agar bola tidak terlalu jauh. Saya juga mengarahkan bidang lengan ke teman agar bola mudah diterima.â€'
P 'Tulis satu masalahmu saat berlatih dan cara memperbaikinya:'
P '________________________________________________________'
P '________________________________________________________'
Page
Heading '06 | Strategi: Lihat, Pilih, Bergerak'
Sub 'A. Bagi posisi, jangan berkumpul'
P 'Jika semua mengejar bola, bagian belakang menjadi kosong. Pemain juga bisa berebut atau bertabrakan. Sebarkan posisi dan jaga area depan serta belakang.'
Table @('Contoh posisi awal 3 pemain','Apa artinya?') @(@('             NET / TALI','Arah lapangan lawan.'),@('       PEMAIN A     PEMAIN B','Dua pemain berbagi area depan.'),@('                 PEMAIN C','Satu pemain membantu menjaga belakang.'))
P 'Ini hanya contoh. Posisi berubah mengikuti bola, teman, dan arahan guru. Tidak ada pemain yang harus berdiri diam sepanjang permainan.'
Sub 'B. Komunikasi yang jelas'
P 'â€œSaya!â€ = aku siap mengambil bola. â€œBantu!â€ = aku perlu bantuan. â€œSiap!â€ = aku siap menerima. Gunakan juga isyarat yang disepakati.'
Sub 'C. Pilih tindakan yang sesuai'
P 'Bola rendah di depan badan: passing bawah jika memungkinkan. Bola cukup tinggi di depan dahi: passing atas jika aman. Teman lebih siap: oper jika memungkinkan. Area lawan kosong: kirim bola terarah jika memungkinkan.'
Box 'SETELAH MENGOPER' 'OPER  >  ATUR POSISI  >  SIAP LAGI. Tetap perhatikan bola dan bersiap membantu sentuhan berikutnya.'
P 'Pikirkan: Di mana bola? Di mana teman? Teknik apa yang sesuai? Ke mana bola akan kukirim?'
Page
Heading '07 | Fair Play: Jujur dan Adil'
P 'Fair play berarti bermain dengan jujur, adil, dan menghormati orang lain.'
Sub 'Aturan pokok'
P 'â€¢ Permainan dimulai dengan servis dan bola dikirim melewati net.'
P 'â€¢ Pada umumnya tim mendapat maksimal tiga sentuhan untuk mengembalikan bola, di luar ketentuan khusus blok.'
P 'â€¢ Bola menyentuh garis batas termasuk masuk. Bola jatuh di luar tanpa menyentuh garis termasuk keluar.'
P 'â€¢ Di kelas, ikuti aturan modifikasi yang sudah diajarkan: servis, sentuhan, pantulan/tangkapan, dan pergantian peran.'
Box 'SITUASI: BOLA MENYENTUH TANGANKU' 'Bola menyentuh tanganmu sebelum keluar, tetapi guru tidak melihat. Katakan dengan sopan: â€œPak/Bu, tadi bola menyentuh tangan saya.â€ Terima keputusan sesuai aturan dan lanjutkan permainan dengan jujur.'
Sub 'Mengapa tetap jujur?'
P 'Poin dari kecurangan merugikan orang lain dan merusak kepercayaan. Kejujuran dan keadilan lebih penting daripada menang dengan cara curang.'
Sub 'Jika tidak setuju dengan keputusan'
P 'Tenangkan diri > bertanya dengan sopan > jelaskan tanpa mengejek > dengarkan > lanjutkan sesuai keputusan.'
Box 'PILIHANKU' 'Aku boleh bertanya dengan hormat. Aku tidak boleh mengubah skor diam-diam, berteriak menghina, atau memaksa orang lain menyetujui pendapatku.'
Page
Heading '08 | Tim yang Saling Mendukung'
P 'Tim yang baik memberi kesempatan setiap anggota untuk berkontribusi. Berani mengambil peran, tetapi tetap beri ruang kepada teman.'
Table @('Tindakan baik','Manfaat bagi tim') @(@('Memanggil bola dan memberi isyarat.','Teman tahu siapa yang akan menerima.'),@('Menjalankan peran dan bergantian.','Semua mendapat kesempatan belajar.'),@('Memberi operan yang dapat dijangkau.','Teman lebih mudah memainkan bola.'),@('Mengatakan â€œCoba lagi, aku bantu!â€','Teman tetap percaya diri.'),@('Tidak ikut mengejek atau menyalahkan.','Hubungan tetap aman dan saling menghargai.'),@('Membantu mengingatkan posisi dengan sopan.','Tim lebih siap menjaga lapangan.'))
Sub 'Jangan mendominasi, jangan sengaja menghindar'
P 'Mendominasi berarti mengambil hampir semua kesempatan sehingga teman tersisih. Sengaja menghindari semua bola juga menyulitkan tim. Ambil peran sesuai posisi dan bantu teman.'
Box 'GANTI KALIMATMU' 'Bukan: â€œKita kalah gara-gara kamu!â€ Tetapi: â€œAyo kita atur posisi dan coba lagi.â€ Bukan: â€œJangan oper ke dia!â€ Tetapi: â€œKita buat operan yang lebih mudah diterima.â€'
P 'Komunikasi tidak harus keras. Panggilan singkat, isyarat, kesiapan menerima, dan tindakan membantu juga menunjukkan kerja sama.'
Page
Heading '09 | Kasih Kristus dalam Permainan'
Table @('Perjalanan CFRC','Makna dan tindakanku') @(@('CREATION - Diciptakan','Semua teman berharga sebagai ciptaan Tuhan. Aku menghargai kemampuan yang berbeda dan memberi kesempatan.'),@('FALL - Relasi rusak oleh dosa','Keegoisan dapat muncul ketika ingin menang: mengejek, mendominasi, curang, atau menyalahkan. Aku mengenali dampaknya bagi teman.'),@('REDEMPTION - Dipulihkan dalam Kristus','Kasih Kristus mengajak kita jujur, meminta maaf, mengampuni, dan menolong. Aku memperbaiki tindakan, bukan hanya berkata maaf.'),@('CONSUMMATION - Pengharapan pemulihan utuh','Kita menantikan pemulihan Tuhan yang sempurna. Permainan yang adil dan penuh kasih menjadi gambaran kecil, bukan kepenuhannya.'))
Box 'JIKA AKU SALAH' 'AKUI  >  MINTA MAAF  >  PERBAIKI. Contoh: â€œMaaf, tadi saya menyalahkanmu. Ayo kita atur posisi bersama.â€'
Box 'JIKA TEMANKU SALAH' 'Jangan membalas dengan ejekan. Bersedia memaafkan dan membantu. Mengampuni bukan berarti membiarkan bahaya: mintalah bantuan guru jika ada yang menyakiti.'
P 'Renungkan: Apakah tindakanku membantu teman atau hanya membuat diriku terlihat hebat?'
P 'Contoh kasih yang ingin kulakukan: __________________________'
Page
Heading '10 | Ayo Berlatih untuk Praktikum'
P 'Lakukan bersama guru dengan jarak, alat, dan aturan yang sudah dilatihkan. Jangan memperkenalkan aturan baru saat penilaian.'
Table @('Latihan','Cara dan fokus') @(@('1. Sikap siap dan bergerak','Ikuti aba-aba kanan, kiri, depan, belakang. Berhenti seimbang dan siap lagi.'),@('2. Passing bawah berpasangan','Terima umpan pelan, arahkan passing ke teman, lalu bergantian. Fokus pada bidang lengan dan tenaga.'),@('3. Passing atas terarah','Terima umpan aman; tangan depan dahi; dorong dengan jari; kembali siap.'),@('4. Servis ke sasaran','Servis dari garis belajar. Perhatikan hasil, lalu perbaiki arah atau tenaga.'),@('5. Oper lalu siap','Oper kepada teman, atur posisi, dan terus perhatikan bola.'),@('6. Menjaga area kosong','Bagi area depan-belakang. Panggil bola dan ubah posisi mengikuti permainan.'),@('7. Permainan mini','Main 3 lawan 3 atau 4 lawan 4. Bergantian, jujur, dukung teman, dan hormati lawan.'))
Box 'TANTANGAN KELOMPOK' 'Usahakan beberapa operan terarah secara berurutan. Utamakan kendali dan keselamatan, bukan memaksakan reli panjang.'
P 'Setelah latihan: Apa yang sudah berhasil? Apa satu hal yang ingin diperbaiki?'
Page
Heading '11 | Apa yang Dinilai Saat Praktikum?'
P 'Guru menilai setiap murid, bukan hanya kemenangan tim. Bukti diambil dari unjuk kerja singkat dan permainan. Kesempatan tambahan dapat diberikan jika belum cukup teramati.'
Table @('Aspek / bobot','Yang perlu kutunjukkan') @(@('Keterampilan - 25%','Menggunakan passing dan servis yang sesuai, dengan arah dan tenaga terkendali.'),@('Strategi - 25%','Mengambil posisi siap, menjaga area, serta memilih operan atau sasaran sesuai situasi.'),@('Fair play - 25%','Menaati aturan, jujur mengakui pelanggaran, dan merespons keputusan dengan hormat.'),@('Kerja sama - 25%','Berkomunikasi, menjalankan peran, memberi kesempatan, dan mendukung teman.'))
Sub 'Arti skor dalam rubrik'
Table @('Skor','Penjelasan') @(@('4 - Sangat baik','Mandiri dan konsisten.'),@('3 - Baik','Umumnya mandiri; sesekali perlu pengingat.'),@('2 - Berkembang','Mulai mampu; masih perlu beberapa arahan.'),@('1 - Perlu bimbingan','Masih membutuhkan bimbingan yang sering.'))
Box 'PENTING' 'Satu kesalahan tidak menentukan seluruh nilai. Tim yang kalah tetap dapat dinilai baik. Yang diamati adalah keterampilan, keputusan, dan perilaku, bukan kadar iman atau sifat pendiam.'
Page
Heading '12 | Ringkasan untuk Sumatif Tertulis'
P 'Bentuk soal: 10 pilihan ganda dan 5 jawaban singkat berdasarkan situasi permainan.'
Table @('Pertanyaan pengingat','Jawaban inti') @(@('Pukulan untuk memulai permainan?','Servis.'),@('Passing bawah menggunakan bagian apa?','Kedua lengan bawah.'),@('Bagaimana posisi lengan passing bawah?','Dirapatkan dan diluruskan.'),@('Bagaimana lutut saat siap?','Sedikit ditekuk.'),@('Ke mana pandangan saat menerima?','Ke bola.'),@('Di mana tangan saat passing atas?','Di atas depan dahi.'),@('Bagian tangan untuk passing atas?','Jari-jari kedua tangan.'),@('Ke mana ayunan servis bawah?','Dari belakang ke depan.'),@('Bola rendah di depan badan?','Passing bawah jika memungkinkan.'),@('Apa yang dilakukan setelah mengoper?','Atur posisi dan kembali siap.'))
Box 'JANGAN HANYA MENGHAFAL' 'Peragakan geraknya dengan aman dan jelaskan kegunaannya. Pahami kapan teknik digunakan, bukan hanya namanya.'
Page
Heading '13 | Menjawab Soal Situasi'
Box 'RUMUS JAWABAN JELAS' 'MASALAHNYA APA?  >  APA TINDAKANKU?  >  MENGAPA ITU MEMBANTU?'
Table @('Situasi','Isi yang perlu dijelaskan') @(@('Semua mengejar bola','Sebarkan posisi; jaga belakang; komunikasikan penerima; jelaskan agar bola terjangkau dan tidak berebut.'),@('Passing terlalu kuat','Dua perbaikan dan manfaat masing-masing. Contoh: kurangi tenaga agar tidak jauh; arahkan lengan agar menuju teman.'),@('Pelanggaran tidak terlihat guru','Akui; sampaikan kepada guru/wasit; terima keputusan; jelaskan pentingnya jujur dan adil.'),@('Teman gagal menerima bola','Dua tindakan dan manfaatnya: dukung agar percaya diri; tetap libatkan agar dapat belajar.'),@('Keegoisan dan kasih Kristus','Hargai ciptaan Tuhan; sebutkan egoisme; jelaskan pemulihan; beri contoh komunitas adil dan penuh kasih.'))
Sub 'Contoh jawaban lengkap tetapi singkat'
P 'â€œSaya memberi semangat agar teman tidak takut mencoba. Saya tetap memberinya operan yang mudah agar ia bisa belajar dan ikut membantu tim.â€'
P 'Jika soal meminta dua tindakan dan manfaatnya, tulis keduanya. Satu kalimat dapat memuat lebih dari satu gagasan. Jawaban tidak harus panjang.'
Box 'INGAT' 'Gunakan kata-katamu sendiri. Bacalah semua bagian pertanyaan sebelum menjawab.'
Page
Heading '14 | Latihan Pemahaman'
P 'Jawablah di buku tulis, atau diskusikan sesuai arahan guru.'
P '1. Apa perbedaan passing bawah dan passing atas?'
P '2. Mengapa lutut perlu sedikit ditekuk saat siap menerima bola?'
P '3. Mengapa kita kembali siap setelah mengoper?'
P '4. Apa akibatnya jika semua pemain berkumpul di dekat bola?'
P '5. Sebutkan dua perbaikan passing terlalu kuat dan manfaatnya.'
P '6. Apa tindakanmu jika menyentuh bola sebelum keluar tetapi guru tidak melihat?'
P '7. Sebutkan dua cara membantu teman yang sering gagal dan manfaatnya.'
P '8. Bagaimana bertanya jika belum memahami keputusan guru?'
P '9. Sebutkan contoh keegoisan dalam permainan dan cara memperbaikinya.'
P '10. Bagaimana menunjukkan bahwa setiap teman berharga sebagai ciptaan Tuhan?'
Box 'TANTANGAN CERITA' 'Ceritakan satu pengalaman bermain: situasinya, pilihanmu, dampaknya bagi teman, dan hal yang akan kamu perbaiki.'
P 'Catatan belajarku:'
P '________________________________________________________'
P '________________________________________________________'
P '________________________________________________________'
Page
Heading '15 | Cek Kesiapan dan Refleksi'
P 'Beri tanda centang. Gunakan untuk menentukan latihan berikutnya, bukan membandingkan diri dengan teman.'
Table @('Aku dapat ...','Mandiri','Perlu latihan') @(@('Sikap siap: lutut lentur dan melihat bola.','[  ]','[  ]'),@('Passing bawah dengan lengan rapat.','[  ]','[  ]'),@('Passing atas dari depan dahi.','[  ]','[  ]'),@('Servis bawah dengan ayunan yang benar.','[  ]','[  ]'),@('Mengatur arah dan tenaga bola.','[  ]','[  ]'),@('Kembali siap dan menjaga area kosong.','[  ]','[  ]'),@('Berkomunikasi dan menjalankan peran.','[  ]','[  ]'),@('Jujur serta menghormati keputusan.','[  ]','[  ]'),@('Memberi kesempatan dan mendukung teman.','[  ]','[  ]'),@('Menjelaskan tindakan dan manfaatnya.','[  ]','[  ]'),@('Menunjukkan kasih melalui tindakan.','[  ]','[  ]'))
P 'Kekuatanku: _____________________________________________'
P 'Yang ingin kulatih: ________________________________________'
P 'Langkah berikutnya: _______________________________________'
Box 'JANJI BERMAINKU' 'Aku bermain untuk belajar, bukan hanya menang. Aku menggunakan keterampilan dengan bijak, memilih jujur, menghargai teman dan lawan, serta menunjukkan kasih Kristus melalui tindakan.'
$d.SaveAs2($out,16)
Write-Output "Saved: $out"
Write-Output "Pages: $($d.ComputeStatistics(2))"
$d.Close($false)
} catch { $_ | Format-List * -Force | Out-String | Write-Output; Write-Output $_.ScriptStackTrace } finally {$w.Quit();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($w)}

