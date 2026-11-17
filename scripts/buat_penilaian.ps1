$ErrorActionPreference='Stop'
$out=Join-Path $PSScriptRoot '..\dokumen'
$xl=New-Object -ComObject Excel.Application
$xl.Visible=$false
$xl.DisplayAlerts=$false
try {
$src=$xl.Workbooks.Open((Join-Path $PSScriptRoot '..\dokumen\Template_Daftar_Murid.xlsx'))
$book=$xl.Workbooks.Add()
while($book.Sheets.Count -gt 1){$book.Sheets.Item($book.Sheets.Count).Delete()}
$guide=$book.Sheets.Item(1); $guide.Name='Panduan dan Rubrik'
$lines=@(
'RUBRIK PRAKTIK BOLA VOLI MINI - KELAS 4',
'Unit 2: Kingdom Character in Play | Elemen: Belajar Melalui Gerak',
'Pelaksanaan: pemanasan, unjuk kerja passing dan servis singkat, lalu permainan 3 lawan 3 atau 4 lawan 4; dua babak 5-7 menit. Tambah sesi sesuai kebutuhan.',
'Gunakan bola lunak, lapangan dan net sesuai kemampuan, serta aturan modifikasi yang sudah dilatihkan. Nilai individu, bukan kemenangan tim.',
'Isi sel kuning dengan skor bulat 1-4. Kosong berarti belum dinilai/absen/bukti belum cukup, bukan skor 1. Nilai muncul setelah empat aspek lengkap.',
'Empat aspek berbobot sama, masing-masing 25%. Nilai praktik = jumlah skor / 16 x 100. Target awal tiap aspek 3; sesuaikan KKTP sekolah.',
'Amati sedikitnya tiga kesempatan relevan pada dua babak; gunakan unjuk kerja tambahan bila peluang menyentuh bola belum cukup. Catat bukti dan adaptasi.',
'Fair play: amati kepatuhan aturan dan respons terhadap keputusan; bila kesempatan mengakui pelanggaran belum muncul, jangan otomatis mengurangi skor.',
'Nilai perilaku teramati, bukan tingkat iman. Komunikasi dapat berupa suara atau isyarat. Jangan menilai sifat pendiam sebagai kurang bekerja sama.',
'Nama, urutan, dan JK mengikuti sumber; nomor diurutkan ulang. Gunakan hanya kode murid dan data fiktif pada repositori publik.',
'Nilai teori opsional diisi 0-100 dari dokumen tertulis. Nilai gabungan = 70% praktik + 30% teori, hanya muncul jika keduanya lengkap.',
'Tindak lanjut: semua aspek minimal 3 = Tercapai; jika ada skor di bawah 3 = Latihan terarah. Simpan bukti dan skor awal sebelum penilaian ulang.'
)
for($i=0;$i -lt $lines.Count;$i++){ $guide.Range("A$($i+1):E$($i+1)").Merge();$guide.Cells.Item($i+1,1)=$lines[$i];$guide.Rows.Item($i+1).RowHeight=42 }
$headers=@('Aspek (bobot)','4 - Sangat baik','3 - Baik','2 - Berkembang','1 - Perlu bimbingan')
for($c=1;$c -le 5;$c++){$guide.Cells.Item(14,$c)=$headers[$c-1]}
$rubric=@(
@('Keterampilan dasar (25%)','Mandiri memilih dan menggunakan passing serta servis; bola umumnya terarah dan dapat dimainkan.','Passing dan servis cukup sesuai; bola cukup sering terarah, kontrol belum stabil.','Teknik mulai sesuai; bola sering tidak terarah dan perlu beberapa arahan posisi/kekuatan.','Masih kesulitan melanjutkan permainan dengan teknik dasar walau sering dibimbing.'),
@('Strategi gerak (25%)','Mandiri mengambil posisi siap, menyesuaikan posisi terhadap bola/teman, dan memilih operan atau ruang kosong.','Umumnya menempatkan diri dan memilih tindakan tepat; sesekali terlambat merespons.','Kadang tepat; masih berkumpul mengejar bola atau ragu memilih tindakan dan perlu arahan.','Belum menyesuaikan posisi atau memilih tindakan sesuai situasi meski sering dibimbing.'),
@('Aturan dan fair play (25%)','Konsisten menaati aturan, mengakui pelanggaran saat terjadi, dan berbeda pendapat dengan hormat tanpa pengingat.','Mengikuti aturan dan jujur; sesekali perlu pengingat agar menerima keputusan dengan tenang.','Belum konsisten menaati aturan atau menerima keputusan; membaik setelah beberapa pengingat.','Berulang kali mengabaikan aturan atau merespons tidak hormat; perlu pendampingan intensif.'),
@('Kerja sama (25%)','Aktif berkomunikasi, menjalankan peran, memberi kesempatan dan mendukung teman setelah kesalahan.','Menjalankan peran dan berkomunikasi; sesekali perlu pengingat untuk melibatkan/mendukung teman.','Cenderung pasif atau mendominasi; mulai berbagi peran dan mendukung setelah diarahkan.','Belum menjalankan peran atau mendukung keterlibatan teman meski beberapa kali diarahkan.')
)
for($i=0;$i -lt 4;$i++){for($c=1;$c -le 5;$c++){$guide.Cells.Item(15+$i,$c)=$rubric[$i][$c-1]};$guide.Rows.Item(15+$i).RowHeight=125}
$guide.Columns.Item('A:E').ColumnWidth=32
$guide.UsedRange.WrapText=$true
$guide.Range('A14:E14').Interior.Color=7951920
$guide.Range('A14:E14').Font.Color=16777215
$counts=@()
foreach($sw in $src.Worksheets){
if($sw.Name -notmatch '^4 '){continue}
$ws=$book.Worksheets.Add();$ws.Name=$sw.Name
$ws.Range('A1:M1').Merge();$ws.Cells.Item(1,1)="SUMATIF PRAKTIK BOLA VOLI MINI - $($sw.Name)"
$ws.Range('A2:M2').Merge();$ws.Cells.Item(2,1)='Unit 2: Kingdom Character in Play | Tanggal: __________ | Guru: __________'
$ws.Range('A3:M3').Merge();$ws.Cells.Item(3,1)='Kuning = input skor 1-4; kosong = belum dinilai. Empat aspek masing-masing 25%. Lihat sheet Panduan dan Rubrik.'
$hh=@('No.','Nama murid','JK','Keterampilan','Strategi','Fair play','Kerja sama','Nilai praktik','Tindak lanjut','Bukti / adaptasi / latihan berikutnya','Nilai teori (opsional)','Gabungan 70:30','Tanggal / hasil pengamatan ulang')
for($c=1;$c -le 13;$c++){$ws.Cells.Item(5,$c)=$hh[$c-1]}
$r=6
for($sr=8;$sr -le $sw.UsedRange.Rows.Count;$sr++){
$name=[string]$sw.Cells.Item($sr,2).Value2;$jk=[string]$sw.Cells.Item($sr,3).Value2
if(-not $name.Trim() -or $jk -notin @('L','P')){continue}
$ws.Cells.Item($r,1)=$r-5;$ws.Cells.Item($r,2)=$name;$ws.Cells.Item($r,3)=$jk
$ws.Cells.Item($r,8).Formula='=IF(COUNT(D'+$r+':G'+$r+')<4,"",ROUND(SUM(D'+$r+':G'+$r+')/16*100,1))'
$ws.Cells.Item($r,9).Formula='=IF(COUNT(D'+$r+':G'+$r+')<4,"Lengkapi observasi",IF(MIN(D'+$r+':G'+$r+')>=3,"Tercapai","Latihan terarah"))'
$ws.Cells.Item($r,12).Formula='=IF(AND(ISNUMBER(H'+$r+'),ISNUMBER(K'+$r+')),ROUND(H'+$r+'*0.7+K'+$r+'*0.3,1),"")'
$r++
}
$last=$r-1;$counts+="$($ws.Name): $($last-5) murid"
$input=$ws.Range("D6:G$last");$input.Interior.Color=13434879;$input.Validation.Add(1,1,1,1,4);$input.Validation.ShowError=$true;$input.Validation.ErrorMessage='Masukkan skor bulat 1 sampai 4; biarkan kosong jika belum dinilai.'
$theory=$ws.Range("K6:K$last");$theory.Interior.Color=13434879;$theory.Validation.Add(2,1,1,0,100);$theory.Validation.ShowError=$true
$ws.Range("H6:I$last").Interior.Color=15132390;$ws.Range("L6:L$last").Interior.Color=14483420
$ws.Cells.Item($r+1,2)='Rata-rata (data lengkap)';$ws.Cells.Item($r+1,8).Formula='=IF(COUNT(H6:H'+$last+')=0,"",AVERAGE(H6:H'+$last+'))'
$ws.Columns.Item('A:A').ColumnWidth=5;$ws.Columns.Item('B:B').ColumnWidth=43;$ws.Columns.Item('C:C').ColumnWidth=5;$ws.Columns.Item('D:H').ColumnWidth=13;$ws.Columns.Item('I:I').ColumnWidth=20;$ws.Columns.Item('J:J').ColumnWidth=40;$ws.Columns.Item('K:L').ColumnWidth=15;$ws.Columns.Item('M:M').ColumnWidth=35
$ws.UsedRange.WrapText=$true;$ws.UsedRange.Font.Size=10;$ws.Range('A5:M5').Font.Bold=$true;$ws.Range('A5:M5').Interior.Color=7951920;$ws.Range('A5:M5').Font.Color=16777215;$ws.Rows.Item(5).RowHeight=45
$ws.Range("A6:M$last").RowHeight=34;$ws.Range("A5:M$last").Borders.LineStyle=1
$ws.Range("A5:M$last").AutoFilter() | Out-Null
$ws.Activate();$ws.Range('D6').Select()|Out-Null;$xl.ActiveWindow.FreezePanes=$true
$ws.PageSetup.Orientation=2;$ws.PageSetup.Zoom=$false;$ws.PageSetup.FitToPagesWide=1;$ws.PageSetup.FitToPagesTall=1;$ws.PageSetup.PrintTitleRows='$1:$5';$ws.PageSetup.PrintArea="A1:M$last"
}
$guide.PageSetup.Orientation=2;$guide.PageSetup.Zoom=$false;$guide.PageSetup.FitToPagesWide=1;$guide.PageSetup.FitToPagesTall=2
$book.SaveAs("$out\Penilaian_Praktik_Bola_Voli_Mini_Kelas_4.xlsx",51)
$book.Close($false);$src.Close($false)
$counts | Out-File "$out\verifikasi_kelas.txt"
} finally {$xl.Quit();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl)}
$word=New-Object -ComObject Word.Application
$word.Visible=$false
try {
$doc=$word.Documents.Add();$sel=$word.Selection
$doc.PageSetup.TopMargin=50;$doc.PageSetup.BottomMargin=50;$doc.PageSetup.LeftMargin=55;$doc.PageSetup.RightMargin=55
$sel.Font.Name='Arial';$sel.Font.Size=11;$sel.ParagraphFormat.SpaceAfter=6
function Line([string]$t){$sel.TypeText($t);$sel.TypeParagraph()}
function Title([string]$t){$sel.Font.Bold=1;$sel.Font.Size=14;Line $t;$sel.Font.Bold=0;$sel.Font.Size=11}
Title 'SUMATIF TERTULIS PJOK - KELAS 4'
Line 'Unit 2: Kingdom Character in Play | Bola Voli Mini'
Line 'Nama: _________________________   Kelas: __________'
Line 'Tanggal: _______________________   No. absen: ______'
Line 'Waktu: 50-60 menit | Bacalah dengan teliti dan jawablah dengan jujur.'
Title 'A. Pilihan Ganda'
Line 'Lingkari satu jawaban yang paling tepat. Setiap jawaban benar mendapat 2 poin.'
$qs=@(
@('Pukulan untuk memulai permainan bola voli disebut ....','A. passing','B. servis','C. menangkap','D. menggiring'),
@('Saat melakukan passing bawah, bola mengenai ....','A. ujung jari','B. kepala','C. lengan bawah','D. lutut'),
@('Saat melakukan passing bawah, kedua lengan sebaiknya ....','A. dirapatkan dan diluruskan','B. disilangkan di dada','C. diletakkan di belakang','D. direntangkan ke samping'),
@('Sikap lutut saat bersiap menerima bola adalah ....','A. diangkat tinggi','B. dikunci lurus','C. ditekuk sampai duduk','D. sedikit ditekuk'),
@('Saat menerima bola, pandangan kita ke arah ....','A. penonton','B. bola','C. sepatu','D. luar lapangan'),
@('Saat melakukan passing atas, kedua tangan berada ....','A. di belakang punggung','B. di dekat lutut','C. di atas depan dahi','D. di samping pinggang'),
@('Saat passing atas, bagian tangan yang menyentuh bola adalah ....','A. jari-jari tangan','B. siku','C. punggung tangan','D. pergelangan tangan'),
@('Saat servis bawah, tangan yang memukul diayunkan ....','A. dari atas kepala ke bawah','B. ke belakang lalu berhenti','C. ke samping menjauhi bola','D. dari belakang ke depan'),
@('Bola datang rendah di depan badan. Teknik yang sesuai adalah ....','A. servis','B. passing bawah','C. menggiring','D. menendang'),
@('Setelah mengoper bola, sebaiknya kamu ....','A. keluar lapangan','B. membelakangi bola','C. kembali ke posisi siap','D. duduk menunggu')
)
for($i=0;$i -lt $qs.Count;$i++){Line "$($i+1). $($qs[$i][0])";Line ($qs[$i][1]+'     '+$qs[$i][2]);Line ($qs[$i][3]+'     '+$qs[$i][4])}
$sel.InsertBreak(7)
Title 'B. Jawaban Singkat Berdasarkan Situasi'
Line 'Jawab dengan kalimat sederhana. Setiap soal mendapat paling banyak 4 poin.'
$ess=@(
'Semua pemain timmu berkumpul di dekat bola. Bagian belakang lapangan menjadi kosong. Apa yang perlu timmu lakukan? Jelaskan pembagian posisi dan cara berkomunikasinya. Mengapa itu membantu?',
'Passing-mu terlalu kuat sehingga sulit diterima teman. Sebutkan dua hal yang dapat kamu perbaiki. Jelaskan manfaat setiap perbaikan.',
'Bola menyentuh tanganmu sebelum keluar. Guru tidak melihatnya. Temanmu meminta kamu diam agar mendapat poin. Apa yang kamu lakukan? Kepada siapa kamu menyampaikan kejadian itu? Bagaimana kamu menerima keputusan? Mengapa harus jujur?',
'Temanmu beberapa kali gagal menerima bola. Teman lain mulai menyalahkan dan tidak mau mengoper kepadanya. Sebutkan dua tindakan untuk membantu dan tetap melibatkannya. Jelaskan manfaat setiap tindakan.',
'Semua teman berharga sebagai ciptaan Tuhan. Keinginan menang kadang membuat kita egois. Tuliskan satu sikap egois dalam permainan. Bagaimana kita memperbaiki hubungan dengan meneladani kasih Kristus? Berikan contoh permainan yang adil dan penuh kasih.'
)
for($i=0;$i -lt 5;$i++){if($i -eq 3){$sel.InsertBreak(7);Title 'B. Jawaban Singkat (lanjutan)'};Line "$($i+11). $($ess[$i])";for($j=0;$j -lt 4;$j++){Line '_____________________________________________________________________'}}
Line 'Periksa kembali jawabanmu. Terima kasih sudah bekerja dengan jujur!'
$sel.InsertBreak(7)
Title 'KHUSUS GURU - KUNCI DAN PEDOMAN PENILAIAN'
Line 'Pisahkan bagian ini sebelum membagikan lembar soal kepada murid.'
Title 'Kunci pilihan ganda'
Line '1 B | 2 C | 3 A | 4 D | 5 B | 6 C | 7 A | 8 D | 9 B | 10 C'
Line 'Benar = 2 poin; salah/kosong = 0. Skor maksimal bagian A = 20.'
Title 'Unsur jawaban bagian B'
Line '11. (1) Menyebarkan posisi; (2) menjaga area belakang/kosong; (3) berkomunikasi siapa penerima bola; (4) alasan: bola lebih terjangkau dan tidak saling berebut/bertabrakan.'
Line '12. (1) Perbaikan pertama sesuai, misalnya mengurangi tenaga; (2) manfaat: bola tidak terlalu jauh; (3) perbaikan kedua sesuai, misalnya mengarahkan bidang lengan/menyesuaikan posisi tubuh; (4) manfaat: bola terarah dan mudah diterima. Terima pasangan tindakan-manfaat lain yang benar.'
Line '13. (1) Mengakui sentuhan; (2) menyampaikannya kepada guru/wasit dengan sopan; (3) menerima keputusan sesuai aturan; (4) alasan kejujuran/keadilan lebih penting daripada poin dari kecurangan.'
Line '14. (1) Tindakan mendukung seperti memberi semangat/tidak ikut menyalahkan; (2) manfaat bagi kepercayaan diri; (3) tindakan melibatkan seperti tetap mengoper/memberi giliran/membantu posisi; (4) manfaat agar semua dapat belajar dan berkontribusi.'
Line '15. (1) Menghargai setiap teman sebagai ciptaan Tuhan; (2) contoh keegoisan yang merusak relasi; (3) pemulihan dengan meminta maaf, mengampuni atau menolong karena meneladani kasih Kristus; (4) contoh komunitas adil dan penuh kasih, seperti kesempatan merata dan menghormati lawan.'
Title 'Rubrik jawaban singkat'
Line '4 = empat unsur benar; 3 = tiga unsur benar; 2 = dua unsur benar; 1 = satu unsur benar; 0 = kosong/tidak menunjukkan unsur yang sesuai. Setiap unsur dihitung sekali.'
Line 'Terima jawaban setara; satu kalimat dapat mencakup beberapa unsur. Nilai pemahaman, bukan panjang tulisan, ejaan, atau kadar iman. Skor maksimal bagian B = 20.'
Title 'Pengolahan nilai dan pelaksanaan'
Line 'Skor maksimal total = 40. Nilai teori = (skor A + skor B) / 40 x 100. Contoh: 16 + 15 = 31; nilai = 77,5.'
Line 'Jika digabung sesuai rekomendasi: nilai akhir = 70% nilai praktikum + 30% nilai teori. Sesuaikan kebijakan sekolah.'
Line 'Kisi-kisi: nomor 1-10 teknik dasar; 11 strategi posisi; 12 pemecahan masalah kontrol bola; 13 aturan dan integritas; 14 kerja sama; 15 nilai Kristiani/CFRC.'
Line 'Gunakan hanya materi yang sudah diajarkan; sesuaikan sebelum tes bila passing atas belum dilatihkan. Soal tidak menguji aturan modifikasi yang berbeda antar kelas.'
Line 'Penyesuaian: soal dapat dibacakan atau jawaban diberikan lisan bagi murid yang membutuhkan, dengan tuntutan dan pedoman skor yang sama.'
$doc.SaveAs2("$out\Soal_Sumatif_Tertulis_Bola_Voli_Kelas_4.docx",16)
Write-Output "Word pages: $($doc.ComputeStatistics(2))"
$doc.Close($false)
} finally {$word.Quit();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($word)}
Write-Output 'Selesai.'

