/* Watch-only, stepped 3v3 demonstration. Court coordinates use metres. */
window.VOLI_OBSERVATION = function () {
  const root = document.createElement("section");
  root.className = "volisim vo-observation";
  root.innerHTML = `<header class="vs-heading"><div><span class="vs-eyebrow">AMATI GERAKAN · VERSI 2</span><h2>Lihat posisi. Ikuti alur bola.</h2><p>Demonstrasi 3 lawan 3: servis → passing bawah → umpan → kirim. Tanpa skor atau tuntutan timing.</p></div></header><div class="vs-panel"><div class="vs-toolbar"><button data-control="play" class="vs-primary">Putar animasi</button><button data-control="prev">Langkah sebelumnya</button><button data-control="next">Langkah berikutnya</button><button data-control="replay">Ulang dari servis</button><label>Kecepatan<select data-control="speed"><option value="0.5">0,5× · Perlahan</option><option value="1" selected>1× · Normal</option></select></label></div><div class="vo-caption" role="status" aria-live="polite" aria-atomic="true"><strong data-info="title"></strong><p data-info="caption"></p><span data-info="touch"></span></div><svg class="vo-court" viewBox="0 0 800 760" role="img" aria-label="Demonstrasi lapangan 3 lawan 3. Tim merah di atas, tim biru di bawah. Pemain aktif dilingkari kuning; bola putih bergerak antarpemain."></svg><p class="vo-rule"><strong>Ingat:</strong> Bola dipantulkan dengan sentuhan singkat, bukan ditangkap atau dibawa. Maksimal tiga sentuhan per tim sebelum menyeberang net. Lingkaran kuning = pemain yang menyentuh bola pada awal langkah.</p><ol class="vo-steps" aria-label="Urutan gerakan"></ol></div>`;
  const ui = key => root.querySelector(`[data-control="${key}"]`);
  const info = key => root.querySelector(`[data-info="${key}"]`);
  const svg = root.querySelector("svg");
  const homes = [[-2.5, 6], [0, 2.4], [2.7, 3.7], [-2.5, -5.7], [0, -2.4], [2.7, -3.7]];
  const serve = [[-2.5, 10.5], [0, 2.4], [2.7, 4.5], [-2.8, -5.8], [0, -2.5], [2.8, -4.8]];
  const far = [[-2.5, 5.8], [0, 2.4], [2.7, 4.5], [-2.3, -6], [.3, -2.2], [2.7, -2.7]];
  const near = [[-2.7, 5.8], [-.3, 2.2], [2.7, 2.7], [-2.5, -5.7], [0, -2.4], [2.7, -4.8]];
  const steps = [
    { title:"1 · Posisi servis", caption:"Biru 1 berdiri di daerah servis, di luar garis belakang (9 m). Kedua kaki tetap di belakang garis saat memukul. Merah bersiap menerima dengan lutut menekuk.", touch:"Servis · belum dihitung sebagai sentuhan penerimaan", active:0, pose:"serve", positions:serve, from:[-2.5,10.5], to:[-2.5,10.5], peak:0 },
    { title:"2 · Servis menyeberang net", caption:"Biru 1 mengayun dan memukul bola dari luar garis. Setelah kontak, server masuk untuk menjaga daerah belakang. Merah 1 bergerak ke arah datangnya bola.", touch:"Servis → tim merah", active:0, pose:"serve", positions:far, from:[-2.5,10.5], to:[-2.3,-6], peak:65 },
    { title:"3 · Merah: passing bawah", caption:"Merah 1 merendahkan badan, merapatkan lengan lurus, lalu memantulkan bola ke pengumpan. Bola tidak ditangkap. Dua teman membuka ruang dan bersiap.", touch:"Tim merah · sentuhan 1 / 3 · penerima", active:3, pose:"pass", positions:far, from:[-2.3,-6], to:[.3,-2.2], peak:55 },
    { title:"4 · Merah: umpan", caption:"Merah 2 berada di bawah bola dekat net. Sentuh singkat dengan jari di atas dahi untuk mengumpan ke Merah 3. Penyerang mendekati jalur umpan.", touch:"Tim merah · sentuhan 2 / 3 · pengumpan", active:4, pose:"set", positions:far, from:[.3,-2.2], to:[2.7,-2.7], peak:85 },
    { title:"5 · Merah: kirim ke seberang", caption:"Merah 3 memukul bola melewati net pada sentuhan ketiga. Biru 1 menyesuaikan posisi untuk menerima; Biru 2 siap mengumpan dan Biru 3 membuka ruang serangan.", touch:"Tim merah · sentuhan 3 / 3 · penyerang", active:5, pose:"hit", positions:near, from:[2.7,-2.7], to:[-2.7,5.8], peak:65 },
    { title:"6 · Biru: passing bawah", caption:"Biru 1 bergerak di belakang bola dan menekuk lutut. Pantulkan bola dengan bidang lengan bawah ke Biru 2, bukan menggenggamnya. Hitungan tim biru dimulai dari satu.", touch:"Tim biru · sentuhan 1 / 3 · penerima", active:0, pose:"pass", positions:near, from:[-2.7,5.8], to:[-.3,2.2], peak:55 },
    { title:"7 · Biru: umpan", caption:"Biru 2 menempatkan badan di bawah bola dan mengumpan tinggi ke Biru 3 dengan sentuhan singkat. Penerima kembali menjaga ruang belakang.", touch:"Tim biru · sentuhan 2 / 3 · pengumpan", active:1, pose:"set", positions:near, from:[-.3,2.2], to:[2.7,2.7], peak:85 },
    { title:"8 · Biru: kirim dan lanjutkan reli", caption:"Biru 3 memukul ke lapangan merah pada sentuhan ketiga. Merah kembali ke formasi penerimaan. Animasi berulang dari passing merah; servis hanya dilakukan untuk memulai reli.", touch:"Tim biru · sentuhan 3 / 3 · penyerang", active:2, pose:"hit", positions:far, from:[2.7,2.7], to:[-2.3,-6], peak:65 }
  ];
  const roles = ["Penerima", "Pengumpan", "Penyerang"];
  let index = 0, elapsed = 0, playing = false, last = 0, attached = false, raf;
  const abort = new AbortController();
  function select(n) { index = n; elapsed = 0; sync(); draw(); }
  function sync() {
    const s = steps[index];
    info("title").textContent = s.title; info("caption").textContent = s.caption; info("touch").textContent = s.touch;
    ui("play").textContent = playing ? "Jeda animasi" : "Putar animasi";
    ui("play").setAttribute("aria-pressed", String(playing));
    ui("prev").disabled = index === 0; ui("next").disabled = index === steps.length - 1;
    root.querySelectorAll("[data-step]").forEach((b, i) => { b.setAttribute("aria-current", i === index ? "step" : "false"); });
  }
  root.querySelector("ol").innerHTML = steps.map((s,i) => `<li><button data-step="${i}">${s.title}</button></li>`).join("");
  root.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.step !== undefined) { playing = false; select(Number(b.dataset.step)); }
    if (b === ui("play")) { playing = !playing; sync(); }
    if (b === ui("prev")) { playing = false; select(Math.max(0,index-1)); }
    if (b === ui("next")) { playing = false; select(Math.min(steps.length-1,index+1)); }
    if (b === ui("replay")) { playing = false; select(0); }
  }, {signal:abort.signal});
  document.addEventListener("visibilitychange", () => { if (document.hidden) { playing = false; sync(); } }, {signal:abort.signal});
  const point = ([x,y]) => [400 + x * 49, 365 + y * 27];
  function draw() {
    const s = steps[index], t = Math.min(1,elapsed / 3.6), move = Math.min(1,t*2);
    const previous = index === 0 ? serve : steps[index-1].positions;
    let html = `<rect width="800" height="760" rx="18" fill="#102b42"/><rect x="140" y="70" width="520" height="610" fill="#398b87"/><rect x="179.5" y="122" width="441" height="486" fill="#cf9063" stroke="white" stroke-width="4"/><path d="M180 284H620 M180 446H620" stroke="#fff0d7" stroke-width="2"/><path d="M160 365H640" stroke="white" stroke-width="7"/><text x="650" y="371" fill="white" font-size="17">NET</text><text x="400" y="49" fill="#ffb9b9" text-anchor="middle" font-size="20" font-weight="bold">TIM MERAH</text><text x="400" y="730" fill="#acd8ff" text-anchor="middle" font-size="20" font-weight="bold">TIM BIRU</text><text x="420" y="638" fill="white" font-size="16">Garis belakang · 9 m</text>`;
    s.positions.forEach((p,i) => {
      const pos = previous[i].map((v,j) => v+(p[j]-v)*move), [x,y] = point(pos);
      const active = i === s.active, contact = active && t < .22;
      const arms = contact && (s.pose === "set" || s.pose === "hit") ? "M-12 -12L-23 -42L-7 -48 M12 -12L23 -42L7 -48" : contact && s.pose === "pass" ? "M-12 -12L-8 8L0 13 M12 -12L8 8L0 13" : "M-12 -12L-24 1 M12 -12L24 1";
      html += `<g transform="translate(${x} ${y})">${active?'<circle r="32" fill="none" stroke="#ffe36a" stroke-width="4"/>':""}<ellipse cy="23" rx="22" ry="7" fill="#102b4244"/><path d="M-7 9L-15 23 M7 9L15 23" stroke="#142d46" stroke-width="7" stroke-linecap="round"/><path d="${arms}" stroke="#f3c49e" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="-13" y="-22" width="26" height="33" rx="6" fill="${i<3?"#2676cf":"#b73243"}"/><circle cy="-33" r="11" fill="#f3c49e"/><text y="0" text-anchor="middle" fill="white" font-weight="bold" font-size="17">${i%3+1}</text><rect x="-66" y="30" width="132" height="24" rx="5" fill="#102b42"/><text y="47" text-anchor="middle" fill="white" font-size="14">${index<2&&i===0?"Server":roles[i%3]}${active?" ★":""}</text></g>`;
    });
    const a = point(s.from), b = point(s.to), bx = a[0]+(b[0]-a[0])*t, by = a[1]+(b[1]-a[1])*t;
    html += `<path d="M${a[0]} ${a[1]} Q${(a[0]+b[0])/2} ${(a[1]+b[1])/2-s.peak*2} ${b[0]} ${b[1]}" stroke="#fff2ab" stroke-dasharray="7 8" fill="none" opacity=".6"/><ellipse cx="${bx}" cy="${by}" rx="12" ry="5" fill="#102b4266"/><circle cx="${bx}" cy="${by-13-Math.sin(Math.PI*t)*s.peak}" r="11" fill="#fffce4" stroke="#e0b32d" stroke-width="3"/>`;
    svg.innerHTML = html;
  }
  function frame(now) {
    if (root.isConnected) attached = true;
    else if (attached) { abort.abort(); cancelAnimationFrame(raf); return; }
    const dt = last ? Math.min(.05,(now-last)/1000) : 0; last = now;
    if (playing && root.isConnected) { elapsed += dt*Number(ui("speed").value); if (elapsed >= 3.6) select(index === 7 ? 2 : index+1); draw(); }
    raf = requestAnimationFrame(frame);
  }
  sync(); draw(); raf = requestAnimationFrame(frame);
  return root;
};
