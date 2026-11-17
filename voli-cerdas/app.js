const STORAGE = {
  role: 'voli_role',
  user: 'voli_user',
  progress: 'voli_progress',
  scores: 'voli_scores',
  teacher: 'voli_teacher',
  weights: 'voli_weights',
  threshold: 'voli_threshold',
  journal: 'voli_journal',
  missions: 'voli_missions'
};

const defaultUser = { name: 'Demo Murid', grade: 4, avatar: '👧' };
const defaultWeights = { pengetahuan: 30, keterampilan: 50, penerapan: 10, sikap: 10 };
const defaultThreshold = 75;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    let val = JSON.parse(raw);
    if (typeof val === 'string') { try { val = JSON.parse(val); } catch {} }
    return val;
  }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

let state = {
  role: localStorage.getItem(STORAGE.role) || 'student',
  user: load(STORAGE.user, defaultUser),
  progress: load(STORAGE.progress, {}),
  scores: load(STORAGE.scores, {}),
  teacher: load(STORAGE.teacher, null),
  weights: load(STORAGE.weights, defaultWeights),
  threshold: load(STORAGE.threshold, defaultThreshold),
  journal: load(STORAGE.journal, []),
  missions: load(STORAGE.missions, [])
};

if (!state.teacher || !Array.isArray(state.teacher.classes) || state.teacher.classes.length === 0) {
  state.teacher = {
    classes: [
      { id: '4A', grade: 4, name: 'Kelas 4A (Demo)', students: [
        { id:'s1', name:'Alya (Demo)', grade:4, diag:60, topic:{pengenalan:70,aturan:65,teknik:60,taktik:55,keselamatan:80,sportivitas:85}, skill:3, apply:70, attitude:80 },
        { id:'s2', name:'Bima (Demo)', grade:4, diag:45, topic:{pengenalan:50,aturan:48,teknik:45,taktik:40,keselamatan:70,sportivitas:75}, skill:2, apply:55, attitude:70 }
      ]},
      { id: '5B', grade: 5, name: 'Kelas 5B (Demo)', students: [
        { id:'s3', name:'Citra (Demo)', grade:5, diag:75, topic:{pengenalan:80,aturan:78,teknik:75,taktik:70,keselamatan:85,sportivitas:90}, skill:4, apply:80, attitude:90 },
        { id:'s4', name:'Dito (Demo)', grade:5, diag:55, topic:{pengenalan:60,aturan:58,teknik:55,taktik:50,keselamatan:75,sportivitas:80}, skill:2, apply:60, attitude:75 }
      ]},
      { id: '6C', grade: 6, name: 'Kelas 6C (Demo)', students: [
        { id:'s5', name:'Eka (Demo)', grade:6, diag:85, topic:{pengenalan:90,aturan:88,teknik:85,taktik:82,keselamatan:90,sportivitas:95}, skill:4, apply:90, attitude:95 },
        { id:'s6', name:'Fajar (Demo)', grade:6, diag:65, topic:{pengenalan:70,aturan:68,teknik:65,taktik:60,keselamatan:80,sportivitas:85}, skill:3, apply:70, attitude:80 }
      ]}
    ]
  };
  save(STORAGE.teacher, state.teacher);
}

function persist() {
  localStorage.setItem(STORAGE.role, state.role);
  save(STORAGE.user, state.user);
  save(STORAGE.progress, state.progress);
  save(STORAGE.scores, state.scores);
  save(STORAGE.teacher, state.teacher);
  save(STORAGE.weights, state.weights);
  save(STORAGE.threshold, state.threshold);
  save(STORAGE.journal, state.journal);
  save(STORAGE.missions, state.missions);
}

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2600);
}

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

const routes = ['home','learn','materials','technique','sim','missions','quiz','summative','reflection','report','teacher'];
function setActiveNav(name) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.route === name));
}
function navigate(name) {
  if (!routes.includes(name)) name = 'home';
  setActiveNav(name);
  const view = document.getElementById('view');
  view.innerHTML = '';
  const fn = window['view_' + name];
  if (fn) fn(view);
  else view.innerHTML = '<div class="empty">Halaman belum tersedia.</div>';
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', ()=>navigate(b.dataset.route)));
document.getElementById('roleSelect').value = state.role;
document.getElementById('roleSelect').addEventListener('change', e => {
  state.role = e.target.value; persist(); updateHeader(); navigate('home'); toast('Peran diubah ke ' + e.target.value);
});
function updateHeader() {
  const label = state.role === 'student' ? `Murid: ${state.user.name} (Kelas ${state.user.grade})` :
    state.role === 'teacher' ? 'Guru (Demo)' : 'Administrator (Demo)';
  document.getElementById('userLabel').textContent = label;
}

window.addEventListener('hashchange', () => {
  const h = (location.hash || '#home').replace('#','');
  navigate(h);
});

// ---------- Helpers ----------
function progressKey(topicId) { return `${state.user.grade}:${topicId}`; }
function setProgress(topicId, value) {
  state.progress[progressKey(topicId)] = Math.max(state.progress[progressKey(topicId)] || 0, value);
  persist();
}
function getProgress(topicId) { return state.progress[progressKey(topicId)] || 0; }
function overallProgress() {
  const topics = VOLI_DATA.topics.length;
  let sum = 0;
  VOLI_DATA.topics.forEach(t => sum += getProgress(t.id));
  return Math.round(sum / topics);
}

// ---------- Views ----------
function view_home(root) {
  root.appendChild(el(`
    <div class="hero">
      <h1>Selamat datang di VOLI Cerdas! 🏐</h1>
      <p>Belajar bola voli dengan cara yang berkesadaran, bermakna, dan menggembirakan. Pilih kelas, ikuti peta belajar, latihan simulasi, dan kumpulkan lencana.</p>
      <div class="controls">
        <button class="btn accent" onclick="navigate('learn')">Mulai Belajar</button>
        <button class="btn secondary" onclick="navigate('sim')">Coba Simulasi</button>
      </div>
    </div>
  `));
  const gradeCards = VOLI_DATA.grades.map(g => `
    <div class="card">
      <h3>Kelas ${g}</h3>
      <p>${VOLI_DATA.learningMap[g].slice(0,4).join(', ')}...</p>
      <button class="btn ${state.user.grade===g?'success':'secondary'}" onclick="setGrade(${g})">Pilih Kelas ${g}</button>
    </div>
  `).join('');
  root.appendChild(el(`<div class="grid grid-3">${gradeCards}</div>`));
  root.appendChild(el(`
    <div class="card">
      <h3>Profil Murid</h3>
      <div class="field-row">
        <div><label class="label">Nama</label><input class="input" id="nameInput" value="${state.user.name}" /></div>
        <div><label class="label">Avatar</label>
          <select class="input" id="avatarInput">
            ${['👧','👦','🧕','👦🏽','👧🏾'].map(a=>`<option ${state.user.avatar===a?'selected':''}>${a}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="margin-top:10px"><button class="btn" onclick="saveProfile()">Simpan Profil</button></div>
      <p class="quote">"Kepemimpinan yang melayani: membantu teman yang kesulitan."</p>
    </div>
  `));
  root.appendChild(el(`
    <div class="card">
      <h3>Progres Keseluruhan</h3>
      <div class="progress"><span style="width:${overallProgress()}%"></span></div>
      <p>${overallProgress()}% selesai</p>
      <div class="scorecard">
        <div class="scorebox"><strong>${state.missions.length}</strong><span>Misi selesai</span></div>
        <div class="scorebox"><strong>${Object.keys(state.scores).length}</strong><span>Skor kuis</span></div>
        <div class="scorebox"><strong>${state.journal.length}</strong><span>Refleksi</span></div>
        <div class="scorebox"><strong>${state.user.grade}</strong><span>Kelas</span></div>
      </div>
    </div>
  `));
}
window.setGrade = function(g) { state.user.grade = g; persist(); updateHeader(); toast('Kelas diubah ke ' + g); navigate('home'); };
window.saveProfile = function() {
  state.user.name = document.getElementById('nameInput').value || state.user.name;
  state.user.avatar = document.getElementById('avatarInput').value;
  persist(); updateHeader(); toast('Profil disimpan');
};

function view_learn(root) {
  const items = VOLI_DATA.learningMap[state.user.grade].map((x,i)=>`<li><strong>Langkah ${i+1}:</strong> ${x}</li>`).join('');
  root.appendChild(el(`
    <div class="card">
      <h2>Peta Belajar Kelas ${state.user.grade}</h2>
      <ul class="list">${items}</ul>
      <div class="progress"><span style="width:${overallProgress()}%"></span></div>
      <p>Progres keseluruhan: ${overallProgress()}%</p>
    </div>
  `));
  root.appendChild(el(`
    <div class="card">
      <h3>Peta Tujuan Pembelajaran (Kelas ${state.user.grade})</h3>
      <p>Rujukan: Kurikulum Merdeka (guru dapat menyesuaikan dengan kurikulum sekolah). Elemen: gerak, pengetahuan, sikap.</p>
      <table class="table">
        <tr><th>Tujuan</th><th>Materi</th><th>Aktivitas</th><th>Asesmen</th><th>Indikator</th><th>Waktu</th></tr>
        ${VOLI_DATA.learningMap[state.user.grade].map((x,i)=>`<tr><td>TP ${i+1}</td><td>${x}</td><td>Praktik & simulasi</td><td>Kuis/observasi</td><td>Proses gerakan</td><td>1-2 JP</td></tr>`).join('')}
      </table>
    </div>
  `));
  const cards = VOLI_DATA.topics.map(t => {
    const p = getProgress(t.id);
    return `<div class="card">
      <h3>${t.icon} ${t.title}</h3>
      <div class="progress"><span style="width:${p}%"></span></div>
      <p>${p}% selesai</p>
      <button class="btn secondary" onclick="openTopic('${t.id}')">Buka Materi</button>
    </div>`;
  }).join('');
  root.appendChild(el(`<div class="grid grid-2">${cards}</div>`));
}
window.openTopic = function(id) { state.selectedTopic = id; navigate('materials'); };

function view_materials(root) {
  const topic = VOLI_DATA.topics.find(t => t.id === (state.selectedTopic || VOLI_DATA.topics[0].id));
  state.selectedTopic = topic.id;
  const sel = VOLI_DATA.topics.map(t => `<option value="${t.id}" ${t.id===topic.id?'selected':''}>${t.title}</option>`).join('');
  root.appendChild(el(`
    <div class="card">
      <label class="label">Pilih Materi</label>
      <select class="input" onchange="state.selectedTopic=this.value; navigate('materials')">${sel}</select>
    </div>
  `));
  const t = topic;
  root.appendChild(el(`
    <div class="card">
      <h2>${t.icon} ${t.title}</h2>
      <p><strong>Tujuan Pembelajaran:</strong> ${t.tujuan}</p>
      <h3>Penjelasan</h3><p>${t.penjelasan}</p>
      <svg class="diagram" viewBox="0 0 400 200" aria-label="Diagram lapangan voli">
        <rect x="20" y="30" width="360" height="140" fill="#e0f2fe" stroke="#1f6feb" stroke-width="3"/>
        <line x1="200" y1="30" x2="200" y2="170" stroke="#ff7a18" stroke-width="4"/>
        <text x="100" y="105" text-anchor="middle" fill="#1f6feb" font-size="16">Area Tim A</text>
        <text x="300" y="105" text-anchor="middle" fill="#1f6feb" font-size="16">Area Tim B</text>
        <text x="200" y="20" text-anchor="middle" fill="#ff7a18" font-size="12">Net</text>
      </svg>
      <h3>Langkah</h3><ol class="list">${t.langkah.map(x=>`<li>${x}</li>`).join('')}</ol>
      <h3>Contoh Benar</h3><p>${t.benar}</p>
      <h3>Kesalahan Umum</h3><p>${t.salah}</p>
      <h3>Tips Memperbaiki</h3><p>${t.tips}</p>
      <h3>Aktivitas Praktik</h3><p>${t.aktivitas}</p>
      <h3>Pertanyaan Pemantik</h3><p class="quote">${t.pemantik}</p>
      <h3>Refleksi</h3><p>${t.refleksi}</p>
      <h3>Tantangan Kelas ${state.user.grade}</h3><p>${t.tantangan[state.user.grade]}</p>
      <h3>Indikator Keberhasilan</h3><p>${t.indikator}</p>
      <h3>Kaitan Kehidupan Sehari-hari</h3><p>${t.kaitan}</p>
      <div class="controls">
        <button class="btn success" onclick="markProgress('${t.id}',100)">Tandai Selesai</button>
        <button class="btn secondary" onclick="navigate('quiz')">Kuis Topik</button>
      </div>
    </div>
  `));
  // short quiz
  const qs = VOLI_DATA.topicQuiz[t.id] || [];
  if (qs.length) {
    const qhtml = qs.map((q,i)=>`
      <div class="card">
        <p><strong>${i+1}. ${q.q}</strong></p>
        ${q.a.map((opt,oi)=>`<label><input type="radio" name="${t.id}q${i}" value="${oi}"> ${opt}</label><br>`).join('')}
      </div>
    `).join('');
    root.appendChild(el(`
      <div class="card">
        <h3>Kuis Singkat (5 soal)</h3>
        ${qhtml}
        <button class="btn" onclick="gradeTopicQuiz('${t.id}')">Periksa</button>
        <div id="topicQuizResult"></div>
      </div>
    `));
  }
}
window.markProgress = function(id,val){ setProgress(id,val); toast('Progres diperbarui'); navigate('materials'); };
window.gradeTopicQuiz = function(topicId) {
  const qs = VOLI_DATA.topicQuiz[topicId];
  let score = 0;
  qs.forEach((q,i) => {
    const sel = document.querySelector(`input[name="${topicId}q${i}"]:checked`);
    if (sel && parseInt(sel.value) === q.correct) score++;
  });
  const pct = Math.round(score/qs.length*100);
  setProgress(topicId, Math.max(getProgress(topicId), pct));
  state.scores['topic_'+topicId] = pct;
  persist();
  document.getElementById('topicQuizResult').innerHTML = `<p><strong>Skor: ${score}/${qs.length} (${pct}%)</strong></p>` +
    qs.map((q,i)=>`<p>${i+1}. Jawaban benar: ${q.a[q.correct]}</p>`).join('');
  toast('Kuis selesai');
};

function view_technique(root) {
  root.appendChild(el(`
    <div class="card">
      <h3>Aktivitas Mengurutkan Langkah (Passing Bawah)</h3>
      <p>Urutkan langkah berikut:</p>
      ${['Sikap siap','Gerak kaki ke arah bola','Bentuk platform lengan','Pukul bola dengan kontrol'].map((s,i)=>`
        <div class="field-row">
          <div><label class="label">Langkah ${i+1}</label>
            <select class="input" id="order${i}">
              <option value="">Pilih...</option>
              ${['Sikap siap','Gerak kaki ke arah bola','Bentuk platform lengan','Pukul bola dengan kontrol'].map(o=>`<option>${o}</option>`).join('')}
            </select>
          </div>
        </div>
      `).join('')}
      <div class="controls"><button class="btn" onclick="checkOrder()">Periksa</button></div>
      <div id="orderResult"></div>
    </div>
  `));
  root.appendChild(el(`
    <div class="card">
      <h3>Aktivitas Mencocokkan</h3>
      <p>Cocokkan istilah dengan makna.</p>
      ${[
        {term:'Sikap siap', def:'Posisi awal siap bergerak'},
        {term:'Passing bawah', def:'Teknik menerima bola dengan platform lengan'},
        {term:'Servis bawah', def:'Servis dengan ayunan lengan bawah'},
        {term:'Rotasi', def:'Perpindahan posisi pemain'}
      ].map((x,i)=>`
        <div class="field-row">
          <div><strong>${x.term}</strong></div>
          <div><select class="input" id="match${i}">
            <option value="">Pilih makna...</option>
            <option>Posisi awal siap bergerak</option>
            <option>Teknik menerima bola dengan platform lengan</option>
            <option>Servis dengan ayunan lengan bawah</option>
            <option>Perpindahan posisi pemain</option>
          </select></div>
        </div>
      `).join('')}
      <div class="controls"><button class="btn" onclick="checkMatch()">Periksa</button></div>
      <div id="matchResult"></div>
    </div>
  `));
  const cards = VOLI_DATA.topics.filter(t=>t.id==='teknik').concat(VOLI_DATA.topics.filter(t=>t.id!=='teknik')).map(t=>`
    <div class="card">
      <h3>${t.icon} ${t.title}</h3>
      <p>${t.penjelasan}</p>
      <ol class="list">${t.langkah.map(x=>`<li>${x}</li>`).join('')}</ol>
    </div>
  `).join('');
  root.appendChild(el(`<div class="grid grid-2">${cards}</div>`));
}

// ---------- Simulation ----------
let sim = { mode:'latihan', difficulty:'mudah', running:false, paused:false, player:0, opp:0, phase:'serve', ballZone:'tengah', targetZone:'tengah', timer:60, interval:null, log:[] };
function resetSim() {
  sim.running = false; sim.paused = false; sim.player = 0; sim.opp = 0; sim.phase = 'serve'; sim.ballZone = 'tengah'; sim.log = [];
  if (sim.interval) clearInterval(sim.interval);
  sim.interval = null;
}
function simProb(base, diff) {
  const m = diff === 'mudah' ? 0.25 : diff === 'sedang' ? 0 : -0.2;
  return Math.min(0.95, Math.max(0.1, base + m));
}
function addSimLog(reason) { sim.log.unshift(reason); sim.log = sim.log.slice(0,6); renderSimLog(); }
function renderSimLog() {
  const box = document.getElementById('simLog');
  if (box) box.innerHTML = sim.log.map(x=>`<li>${x}</li>`).join('') || '<li>Belum ada aksi.</li>';
}
function updateSimScore() {
  const p = document.getElementById('simPlayer'); const o = document.getElementById('simOpp');
  if (p) p.textContent = sim.player; if (o) o.textContent = sim.opp;
  const t = document.getElementById('simTimer'); if (t) t.textContent = sim.timer;
  const ph = document.getElementById('simPhase'); if (ph) ph.textContent = sim.phase;
}
function startSimTimer() {
  if (sim.interval) clearInterval(sim.interval);
  sim.interval = setInterval(() => {
    if (sim.paused || !sim.running) return;
    sim.timer--;
    updateSimScore();
    if (sim.timer <= 0) {
      sim.running = false; clearInterval(sim.interval); sim.interval=null;
      toast(`Waktu habis. Skor Anda ${sim.player}-${sim.opp}`);
      saveSimScore();
    }
  }, 1000);
}
function saveSimScore() {
  const key = `sim_${sim.mode}_${sim.difficulty}`;
  const best = state.scores[key] || 0;
  if (sim.player > best) { state.scores[key] = sim.player; persist(); toast('Skor terbaik baru!'); }
}
function view_sim(root) {
  resetSim();
  root.appendChild(el(`
    <div class="card">
      <h2>Laboratorium Simulasi Permainan</h2>
      <p>Simulasi layar melatih pengetahuan dan pengambilan keputusan, tetapi tidak menggantikan asesmen gerak nyata di lapangan.</p>
      <div class="field-row">
        <div><label class="label">Mode</label>
          <select class="input" id="simMode">
            <option value="latihan">Latihan</option>
            <option value="pertandingan">Pertandingan Mini</option>
            <option value="tantangan">Tantangan Waktu</option>
          </select>
        </div>
        <div><label class="label">Kesulitan Lawan</label>
          <select class="input" id="simDiff">
            <option value="mudah">Mudah</option>
            <option value="sedang">Sedang</option>
            <option value="menantang">Menantang</option>
          </select>
        </div>
      </div>
      <div class="controls">
        <button class="btn success" onclick="simStart()">Mulai</button>
        <button class="btn secondary" onclick="simPause()">Jeda</button>
        <button class="btn secondary" onclick="simRepeat()">Ulangi</button>
        <button class="btn secondary" onclick="simHint()">Petunjuk</button>
        <button class="btn danger" onclick="navigate('home')">Keluar</button>
      </div>
    </div>
  `));
  root.appendChild(el(`
    <div class="card">
      <div class="scorecard">
        <div class="scorebox"><strong id="simPlayer">0</strong><span>Anda</span></div>
        <div class="scorebox"><strong id="simOpp">0</strong><span>Lawan</span></div>
        <div class="scorebox"><strong id="simTimer">60</strong><span>Waktu</span></div>
        <div class="scorebox"><strong id="simPhase">serve</strong><span>Fase</span></div>
      </div>
      <svg class="diagram" viewBox="0 0 500 260" aria-label="Lapangan voli">
        <rect x="30" y="40" width="440" height="180" fill="#e0f2fe" stroke="#1f6feb" stroke-width="3"/>
        <line x1="250" y1="40" x2="250" y2="220" stroke="#ff7a18" stroke-width="4"/>
        <text x="140" y="20" text-anchor="middle" fill="#1f6feb" font-weight="bold">Tim Anda</text>
        <text x="360" y="20" text-anchor="middle" fill="#1f6feb" font-weight="bold">Lawan</text>
        <circle id="ball" cx="140" cy="130" r="12" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
      </svg>
      <h3>Aksi</h3>
      <div id="simActions"></div>
      <h3>Riwayat</h3>
      <ul id="simLog" class="list"><li>Belum ada aksi.</li></ul>
    </div>
  `));
  renderSimActions();
}
function renderSimActions() {
  const box = document.getElementById('simActions');
  if (!box) return;
  if (!sim.running) { box.innerHTML = '<p class="empty">Tekan Mulai untuk bermain.</p>'; return; }
  if (sim.paused) { box.innerHTML = '<p class="empty">Permainan dijeda.</p>'; return; }
  if (sim.phase === 'serve') {
    box.innerHTML = `
      <div class="field-row">
        <div><label class="label">Jenis Servis</label>
          <select class="input" id="serveType"><option>bawah</option><option>atas</option></select>
        </div>
        <div><label class="label">Target</label>
          <select class="input" id="serveTarget"><option>kiri</option><option>tengah</option><option>kanan</option></select>
        </div>
      </div>
      <div style="margin-top:8px"><label class="label">Kekuatan</label>
        <select class="input" id="servePower"><option>rendah</option><option>sedang</option><option>tinggi</option></select>
      </div>
      <div class="controls"><button class="btn accent" onclick="doServe()">Lakukan Servis</button></div>
    `;
  } else if (sim.phase === 'receive') {
    box.innerHTML = `
      <p>Bola datang ke zona: <strong>${sim.ballZone}</strong>. Pilih posisi terima.</p>
      <div class="controls">
        <button class="btn" onclick="doReceive('kiri')">Kiri</button>
        <button class="btn" onclick="doReceive('tengah')">Tengah</button>
        <button class="btn" onclick="doReceive('kanan')">Kanan</button>
      </div>
    `;
  } else if (sim.phase === 'set') {
    box.innerHTML = `
      <p>Pilih arah umpan.</p>
      <div class="controls">
        <button class="btn" onclick="doSet('kiri')">Umpan Kiri</button>
        <button class="btn" onclick="doSet('tengah')">Umpan Tengah</button>
        <button class="btn" onclick="doSet('kanan')">Umpan Kanan</button>
      </div>
    `;
  } else if (sim.phase === 'attack') {
    box.innerHTML = `
      <p>Pilih target serangan ke ruang kosong lawan.</p>
      <div class="controls">
        <button class="btn" onclick="doAttack('kiri')">Serang Kiri</button>
        <button class="btn" onclick="doAttack('tengah')">Serang Tengah</button>
        <button class="btn" onclick="doAttack('kanan')">Serang Kanan</button>
      </div>
    `;
  }
}
window.simStart = function() {
  sim.mode = document.getElementById('simMode').value;
  sim.difficulty = document.getElementById('simDiff').value;
  resetSim();
  sim.running = true;
  sim.player = 0; sim.opp = 0; sim.phase = 'serve';
  if (sim.mode === 'tantangan') { sim.timer = 60; startSimTimer(); } else sim.timer = 0;
  updateSimScore();
  addSimLog('Permainan dimulai. Mode: ' + sim.mode + ', kesulitan: ' + sim.difficulty);
  renderSimActions();
};
window.simPause = function() {
  if (!sim.running) return;
  sim.paused = !sim.paused;
  toast(sim.paused ? 'Dijeda' : 'Lanjut');
  renderSimActions(); updateSimScore();
};
window.simRepeat = function() {
  const mode = sim.mode; const diff = sim.difficulty;
  resetSim(); sim.mode = mode; sim.difficulty = diff; toast('Diulang');
  navigate('sim');
};
window.simHint = function() {
  toast('Petunjuk: servis bawah lebih konsisten; cari ruang kosong; bangun 3 sentuhan; komunikasi.');
};
window.doServe = function() {
  const type = document.getElementById('serveType').value;
  const target = document.getElementById('serveTarget').value;
  const power = document.getElementById('servePower').value;
  let base = type === 'bawah' ? 0.85 : 0.65;
  if (power === 'tinggi') base -= 0.15;
  if (power === 'rendah') base += 0.05;
  const success = Math.random() < simProb(base, sim.difficulty);
  if (!success) {
    sim.opp++; addSimLog('Servis gagal melewati net/keluar. Poin lawan. Alasan: teknik servis kurang tepat.');
    checkWin(); sim.phase = 'serve'; renderSimActions(); updateSimScore(); return;
  }
  // opponent receive
  const receiveProb = sim.difficulty === 'mudah' ? 0.55 : sim.difficulty === 'sedang' ? 0.75 : 0.9;
  const received = Math.random() < receiveProb;
  if (!received) {
    sim.player++; addSimLog('Servis bagus, lawan gagal menerima. Poin Anda.');
    checkWin(); sim.phase='serve'; renderSimActions(); updateSimScore(); return;
  }
  sim.ballZone = ['kiri','tengah','kanan'][Math.floor(Math.random()*3)];
  sim.phase = 'receive';
  addSimLog('Lawan mengembalikan bola. Siapkan passing di zona ' + sim.ballZone + '.');
  renderSimActions(); updateSimScore();
};
window.doReceive = function(zone) {
  if (zone !== sim.ballZone) {
    sim.opp++; addSimLog('Posisi terima salah (' + zone + ' vs ' + sim.ballZone + '). Poin lawan.');
    checkWin(); sim.phase='serve'; renderSimActions(); updateSimScore(); return;
  }
  const ok = Math.random() < 0.85;
  if (!ok) { sim.opp++; addSimLog('Passing gagal dikontrol. Poin lawan.'); checkWin(); sim.phase='serve'; renderSimActions(); updateSimScore(); return; }
  sim.phase = 'set';
  addSimLog('Passing baik. Bangun umpan.');
  renderSimActions(); updateSimScore();
};
window.doSet = function(zone) {
  const ok = Math.random() < 0.9;
  if (!ok) { sim.opp++; addSimLog('Umpan tidak akurat. Poin lawan.'); checkWin(); sim.phase='serve'; renderSimActions(); updateSimScore(); return; }
  sim.targetZone = zone;
  sim.phase = 'attack';
  addSimLog('Umpan siap. Serang ke ruang kosong.');
  renderSimActions(); updateSimScore();
};
window.doAttack = function(zone) {
  // opponent coverage random
  const zones = ['kiri','tengah','kanan'];
  const cover = zones[Math.floor(Math.random()*3)];
  if (zone !== cover) {
    sim.player++; addSimLog('Serangan ke ' + zone + ' menemukan ruang kosong. Poin Anda.');
  } else {
    // dig
    const digProb = sim.difficulty === 'mudah' ? 0.4 : sim.difficulty === 'sedang' ? 0.6 : 0.8;
    if (Math.random() < digProb) {
      sim.opp++; addSimLog('Lawan berhasil bertahan dan menyerang balik. Poin lawan.');
    } else {
      sim.player++; addSimLog('Lawan gagal bertahan. Poin Anda.');
    }
  }
  checkWin(); sim.phase='serve'; renderSimActions(); updateSimScore();
};
function checkWin() {
  if (sim.mode === 'pertandingan') {
    if (sim.player >= 5 || sim.opp >= 5) {
      sim.running = false; if (sim.interval) { clearInterval(sim.interval); sim.interval=null; }
      const msg = sim.player >= 5 ? 'Anda menang! 🎉' : 'Lawan menang. Coba lagi!';
      toast(msg); saveSimScore();
    }
  }
}

window.checkOrder = function() {
  const expected = ['Sikap siap','Gerak kaki ke arah bola','Bentuk platform lengan','Pukul bola dengan kontrol'];
  let ok = true;
  for (let i=0;i<4;i++) {
    const v = document.getElementById('order'+i).value;
    if (v !== expected[i]) ok = false;
  }
  document.getElementById('orderResult').innerHTML = ok ? '<p class="badge green">Urutan benar!</p>' : '<p class="badge orange">Urutan belum tepat. Coba lagi.</p>';
};
window.checkMatch = function() {
  const expected = ['Posisi awal siap bergerak','Teknik menerima bola dengan platform lengan','Servis dengan ayunan lengan bawah','Perpindahan posisi pemain'];
  let ok = true;
  for (let i=0;i<4;i++) {
    if (document.getElementById('match'+i).value !== expected[i]) ok = false;
  }
  document.getElementById('matchResult').innerHTML = ok ? '<p class="badge green">Semua cocok!</p>' : '<p class="badge orange">Masih ada yang salah.</p>';
};

// ---------- Missions ----------
function view_missions(root) {
  const completed = state.missions;
  const cards = VOLI_DATA.missions.map(m => {
    const done = completed.includes(m.id);
    return `<div class="card">
      <h3>${m.title} <span class="badge ${done?'green':'orange'}">${done?'Selesai':'Belum'}</span></h3>
      <p>Sasaran: ${m.goal}</p>
      <p>Kelas: ${m.grade} • Poin: ${m.reward}</p>
      <button class="btn ${done?'secondary':'success'}" onclick="completeMission('${m.id}')" ${done?'disabled':''}>${done?'Sudah Selesai':'Tandai Selesai'}</button>
    </div>`;
  }).join('');
  root.appendChild(el(`<div class="grid grid-2">${cards}</div>`));
  root.appendChild(el(`<div class="card"><h3>Total Poin Misi: ${missionPoints()}</h3></div>`));
}
window.completeMission = function(id) {
  if (state.missions.includes(id)) return;
  state.missions.push(id); persist(); toast('Misi selesai!'); navigate('missions');
};
function missionPoints() { return state.missions.reduce((s,id)=>{ const m=VOLI_DATA.missions.find(x=>x.id===id); return s+(m?m.reward:0);},0); }

// ---------- Quiz ----------
function view_quiz(root) {
  root.appendChild(el(`
    <div class="card">
      <h2>Kuis dan Asesmen Formatif</h2>
      <p>Pilih jenis asesmen. Soal diacak agar tidak sekadar menghafal.</p>
      <div class="controls">
        <button class="btn" onclick="startQuiz('diagnostic')">Diagnostik (10 soal)</button>
        <button class="btn secondary" onclick="startQuiz('topic')">Kuis Topik</button>
        <button class="btn secondary" onclick="startNoncog()">Diagnostik Nonkognitif</button>
      </div>
      <div id="quizArea"></div>
    </div>
  `));
}
window.startQuiz = function(type) {
  const area = document.getElementById('quizArea');
  area.innerHTML = '';
  let questions = [];
  let title = '';
  if (type === 'diagnostic') { questions = shuffle([...VOLI_DATA.diagnostic]); title = 'Diagnostik Pengetahuan'; }
  else {
    const tid = state.selectedTopic || VOLI_DATA.topics[0].id;
    questions = shuffle([...(VOLI_DATA.topicQuiz[tid] || [])]);
    title = 'Kuis Topik: ' + VOLI_DATA.topics.find(t=>t.id===tid).title;
  }
  area.appendChild(el(`<h3>${title}</h3>`));
  questions.forEach((q,i) => {
    area.appendChild(el(`
      <div class="card">
        <p><strong>${i+1}. ${q.q}</strong></p>
        ${shuffle(q.a.map((opt,oi)=>({opt,oi}))).map(x=>`<label><input type="radio" name="q${i}" value="${x.oi}"> ${x.opt}</label><br>`).join('')}
      </div>
    `));
  });
  area.appendChild(el(`<button class="btn" onclick="gradeQuiz(${JSON.stringify(questions).replace(/"/g,'&quot;')})">Periksa</button><div id="quizResult"></div>`));
};
window.gradeQuiz = function(questions) {
  let score = 0;
  questions.forEach((q,i) => {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if (sel && parseInt(sel.value) === q.correct) score++;
  });
  const pct = Math.round(score/questions.length*100);
  state.scores['quiz_'+Date.now()] = pct;
  persist();
  document.getElementById('quizResult').innerHTML = `<p><strong>Skor: ${score}/${questions.length} (${pct}%)</strong></p>` +
    (pct < 70 ? '<p class="badge orange">Rekomendasi: ulangi materi dan latihan remedial.</p>' : '<p class="badge green">Rekomendasi: tantangan pengayaan.</p>');
  toast('Kuis selesai');
};
function shuffle(arr) { return arr.sort(()=>Math.random()-0.5); }

window.startNoncog = function() {
  const area = document.getElementById('quizArea');
  area.innerHTML = '<h3>Diagnostik Nonkognitif (Minat, Pengalaman, Kepercayaan Diri)</h3><p>Tidak digunakan untuk memberi label negatif.</p>';
  const items = [
    'Saya suka bermain bola voli.',
    'Saya pernah bermain voli sebelumnya.',
    'Saya percaya diri melakukan passing.',
    'Saya suka bekerja sama dalam tim.',
    'Saya ingin meningkatkan servis saya.'
  ];
  items.forEach((it,i) => {
    area.appendChild(el(`
      <div class="card">
        <p>${it}</p>
        <select class="input" id="nc${i}">
          <option value="1">1 - Tidak setuju</option>
          <option value="2">2 - Kurang setuju</option>
          <option value="3" selected>3 - Setuju</option>
          <option value="4">4 - Sangat setuju</option>
        </select>
      </div>
    `));
  });
  area.appendChild(el(`<button class="btn" onclick="saveNoncog()">Simpan</button><div id="ncResult"></div>`));
};
window.saveNoncog = function() {
  let sum = 0;
  for (let i=0;i<5;i++) sum += parseInt(document.getElementById('nc'+i).value);
  state.scores.noncog = Math.round(sum/5*25);
  persist();
  document.getElementById('ncResult').innerHTML = '<p class="badge green">Terima kasih. Hasil digunakan untuk menyesuaikan pembelajaran.</p>';
  toast('Diagnostik nonkognitif disimpan');
};

// ---------- Summative ----------
function view_summative(root) {
  root.appendChild(el(`
    <div class="card">
      <h2>Asesmen Sumatif</h2>
      <p>Tes pengetahuan 25 soal seimbang: konsep, aturan, teknik, keselamatan, taktik. Gunakan kisi-kisi dan bobot yang dapat diatur guru.</p>
      <div class="controls"><button class="btn" onclick="startSummative()">Mulai Tes (25 soal)</button></div>
      <div id="sumArea"></div>
    </div>
  `));
  // blueprint
  root.appendChild(el(`
    <div class="card">
      <h3>Kisi-kisi (untuk guru)</h3>
      <table class="table">
        <tr><th>Topik</th><th>Jumlah Soal</th><th>Bobot</th></tr>
        <tr><td>Pengenalan</td><td>5</td><td>20%</td></tr>
        <tr><td>Aturan</td><td>5</td><td>20%</td></tr>
        <tr><td>Teknik</td><td>5</td><td>20%</td></tr>
        <tr><td>Taktik</td><td>5</td><td>20%</td></tr>
        <tr><td>Keselamatan & Sportivitas</td><td>5</td><td>20%</td></tr>
      </table>
      <p>Rumus nilai akhir: Pengetahuan 30% + Keterampilan 50% + Penerapan 10% + Sikap & Refleksi 10% (dapat diubah guru).</p>
    </div>
  `));
}
window.startSummative = function() {
  const area = document.getElementById('sumArea');
  area.innerHTML = '';
  const qs = shuffle([...VOLI_DATA.summative]);
  qs.forEach((q,i) => {
    area.appendChild(el(`
      <div class="card">
        <p><strong>${i+1}. ${q.q}</strong></p>
        ${shuffle(q.a.map((opt,oi)=>({opt,oi}))).map(x=>`<label><input type="radio" name="s${i}" value="${x.oi}"> ${x.opt}</label><br>`).join('')}
      </div>
    `));
  });
  area.appendChild(el(`<button class="btn" onclick="gradeSummative(${JSON.stringify(qs).replace(/"/g,'&quot;')})">Selesai & Periksa</button><div id="sumResult"></div>`));
};
window.gradeSummative = function(qs) {
  let score = 0;
  qs.forEach((q,i) => {
    const sel = document.querySelector(`input[name="s${i}"]:checked`);
    if (sel && parseInt(sel.value) === q.correct) score++;
  });
  const pct = Math.round(score/qs.length*100);
  state.scores.summative = pct;
  persist();
  document.getElementById('sumResult').innerHTML = `
    <p><strong>Skor Pengetahuan: ${score}/${qs.length} (${pct}%)</strong></p>
    <p>Pembahasan: setiap jawaban salah perlu ditinjau ulang pada topik terkait.</p>
    <p class="quote">Nilai akhir dihitung di Rapor/Dashboard Guru dengan bobot yang dapat diatur.</p>
  `;
  toast('Asesmen sumatif selesai');
};

// ---------- Reflection ----------
function view_reflection(root) {
  root.appendChild(el(`
    <div class="card">
      <h2>Refleksi Karakter dan Jurnal Belajar</h2>
      <label class="label">Apa yang sudah saya pelajari?</label>
      <textarea class="input" id="r1" rows="3"></textarea>
      <label class="label" style="margin-top:8px">Tantangan yang saya hadapi?</label>
      <textarea class="input" id="r2" rows="3"></textarea>
      <label class="label" style="margin-top:8px">Target berikutnya?</label>
      <textarea class="input" id="r3" rows="3"></textarea>
      <div class="controls"><button class="btn success" onclick="saveReflection()">Simpan Refleksi</button></div>
    </div>
  `));
  const list = state.journal.slice().reverse().map(j=>`
    <div class="card">
      <small>${j.date}</small>
      <p><strong>Pelajari:</strong> ${j.a}</p>
      <p><strong>Tantangan:</strong> ${j.b}</p>
      <p><strong>Target:</strong> ${j.c}</p>
    </div>
  `).join('');
  root.appendChild(el(`<div>${list || '<div class="empty">Belum ada refleksi.</div>'}</div>`));
}
window.saveReflection = function() {
  state.journal.push({
    date: new Date().toLocaleString('id-ID'),
    a: document.getElementById('r1').value,
    b: document.getElementById('r2').value,
    c: document.getElementById('r3').value
  });
  persist(); toast('Refleksi disimpan'); navigate('reflection');
};

// ---------- Report ----------
function view_report(root) {
  const sp = overallProgress();
  const ss = state.scores.summative || 0;
  const skillAvg = state.user.grade ? 3 : 3;
  const finalScore = Math.round(ss*0.3 + skillAvg*25*0.5 + 70*0.1 + 80*0.1);
  root.appendChild(el(`
    <div class="card">
      <h2>Rapor Hasil Belajar (Murid)</h2>
      <p>Nama: ${state.user.name} • Kelas: ${state.user.grade} • Avatar: ${state.user.avatar}</p>
      <div class="progress"><span style="width:${sp}%"></span></div>
      <p>Progres materi: ${sp}%</p>
      <p>Skor sumatif pengetahuan: ${ss}%</p>
      <p>Nilai akhir (contoh): ${finalScore} (ambang ${state.threshold})</p>
      <p>Status: ${finalScore >= state.threshold ? 'Mencapai target' : 'Perlu latihan'}</p>
      <div class="controls">
        <button class="btn secondary" onclick="window.print()">Cetak</button>
        <button class="btn secondary" onclick="exportStudentCSV()">Ekspor CSV</button>
      </div>
    </div>
  `));
  // rubric self checklist
  const rub = VOLI_DATA.rubric.indicators.map(ind=>`
    <div class="card">
      <p><strong>${ind}</strong></p>
      <select class="input" data-ind="${ind}">
        <option value="1">1 - Memerlukan Bimbingan</option>
        <option value="2">2 - Mulai Berkembang</option>
        <option value="3" selected>3 - Berkembang Sesuai Harapan</option>
        <option value="4">4 - Sangat Berkembang</option>
      </select>
    </div>
  `).join('');
  root.appendChild(el(`<div class="grid grid-2">${rub}</div>`));
}
window.exportStudentCSV = function() {
  const rows = [['Nama','Kelas','Progres','Sumatif'], [state.user.name, state.user.grade, overallProgress(), state.scores.summative||0]];
  downloadCSV('rapor-murid.csv', rows);
};

// ---------- Teacher ----------
function view_teacher(root) {
  if (state.role !== 'teacher' && state.role !== 'admin') {
    root.appendChild(el('<div class="card"><p>Mode Guru/Admin diperlukan. Pilih peran di atas.</p></div>'));
    return;
  }
  if (!state.teacher || !Array.isArray(state.teacher.classes)) {
    state.teacher = { classes: [] };
  }
  // class selector
  const classes = state.teacher.classes;
  const opts = classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  root.appendChild(el(`
    <div class="card">
      <h2>Dashboard Guru</h2>
      <label class="label">Pilih Kelas</label>
      <select class="input" id="classSel">${opts}</select>
      <div class="field-row" style="margin-top:10px">
        <div><label class="label">Bobot Pengetahuan %</label><input class="input" id="w1" type="number" value="${state.weights.pengetahuan}"></div>
        <div><label class="label">Bobot Keterampilan %</label><input class="input" id="w2" type="number" value="${state.weights.keterampilan}"></div>
      </div>
      <div class="field-row">
        <div><label class="label">Bobot Penerapan %</label><input class="input" id="w3" type="number" value="${state.weights.penerapan}"></div>
        <div><label class="label">Bobot Sikap %</label><input class="input" id="w4" type="number" value="${state.weights.sikap}"></div>
      </div>
      <div style="margin-top:10px"><label class="label">Ambang Ketuntasan %</label><input class="input" id="thr" type="number" value="${state.threshold}"></div>
      <div class="controls"><button class="btn" onclick="saveTeacherSettings()">Simpan Pengaturan</button>
        <button class="btn secondary" onclick="exportClassCSV()">Ekspor CSV</button>
        <button class="btn secondary" onclick="window.print()">Cetak</button>
      </div>
    </div>
  `));
  root.appendChild(el('<div id="classArea"></div>'));
  renderClassArea();
  // add student
  root.appendChild(el(`
    <div class="card">
      <h3>Tambah Murid (Demo)</h3>
      <div class="field-row">
        <input class="input" id="newStudentName" placeholder="Nama murid">
        <button class="btn success" onclick="addStudent()">Tambah</button>
      </div>
    </div>
  `));
  // lesson plan & observation
  root.appendChild(el(`
    <div class="card">
      <h3>Contoh Modul Pelaksanaan (Demo)</h3>
      <p><strong>Tujuan:</strong> Murid melakukan passing bawah dengan proses benar.</p>
      <p><strong>Alokasi Waktu:</strong> 2x35 menit.</p>
      <p><strong>Kegiatan:</strong> pemanasan, demonstrasi, latihan berpasangan, mini game, refleksi.</p>
      <h3>Lembar Observasi (Demo)</h3>
      <table class="table">
        <tr><th>Indikator</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
        ${VOLI_DATA.rubric.indicators.map(i=>`<tr><td>${i}</td><td></td><td></td><td></td><td></td></tr>`).join('')}
      </table>
    </div>
  `));
}
function renderClassArea() {
  const cid = document.getElementById('classSel').value;
  const cls = state.teacher.classes.find(c=>c.id===cid);
  const area = document.getElementById('classArea');
  if (!cls) return;
  const rows = cls.students.map(s => {
    const skillScore = s.skill * 25;
    const final = Math.round((s.diag||0)*0 + 0) ; // placeholder
    const knowledge = Math.round(Object.values(s.topic).reduce((a,b)=>a+b,0)/Object.values(s.topic).length);
    const finalVal = Math.round(knowledge*(state.weights.pengetahuan/100) + skillScore*(state.weights.keterampilan/100) + (s.apply||0)*(state.weights.penerapan/100) + (s.attitude||0)*(state.weights.sikap/100));
    return `<tr>
      <td>${s.name}</td>
      <td>${knowledge}</td>
      <td>
        <select onchange="updateStudentSkill('${cls.id}','${s.id}',this.value)">
          ${[1,2,3,4].map(v=>`<option value="${v}" ${s.skill==v?'selected':''}>${v}</option>`).join('')}
        </select>
      </td>
      <td><input type="number" value="${s.apply||0}" onchange="updateStudentField('${cls.id}','${s.id}','apply',this.value)" style="width:60px"></td>
      <td><input type="number" value="${s.attitude||0}" onchange="updateStudentField('${cls.id}','${s.id}','attitude',this.value)" style="width:60px"></td>
      <td><strong>${finalVal}</strong></td>
      <td>${finalVal >= state.threshold ? '<span class="badge green">Tuntas</span>' : '<span class="badge orange">Perlu latihan</span>'}</td>
    </tr>`;
  }).join('');
  area.innerHTML = `
    <div class="card">
      <h3>${cls.name} (Kelas ${cls.grade})</h3>
      <table class="table">
        <tr><th>Murid</th><th>Pengetahuan</th><th>Rubrik Praktik (1-4)</th><th>Penerapan</th><th>Sikap</th><th>Nilai Akhir</th><th>Status</th></tr>
        ${rows}
      </table>
      <p class="quote">Nilai rubrik praktik = rata-rata skor indikator (demo). Kekuatan/kebutuhan bantuan dapat dicatat di bawah.</p>
      ${cls.students.map(s=>`<div class="card"><strong>${s.name}</strong><textarea class="input" placeholder="Catatan guru / bukti observasi" rows="2"></textarea></div>`).join('')}
    </div>
  `;
  document.getElementById('classSel').addEventListener('change', renderClassArea);
}
window.saveTeacherSettings = function() {
  state.weights.pengetahuan = parseInt(document.getElementById('w1').value) || state.weights.pengetahuan;
  state.weights.keterampilan = parseInt(document.getElementById('w2').value) || state.weights.keterampilan;
  state.weights.penerapan = parseInt(document.getElementById('w3').value) || state.weights.penerapan;
  state.weights.sikap = parseInt(document.getElementById('w4').value) || state.weights.sikap;
  state.threshold = parseInt(document.getElementById('thr').value) || state.threshold;
  persist(); toast('Pengaturan disimpan'); renderClassArea();
};
window.updateStudentSkill = function(cid,sid,val) {
  const cls = state.teacher.classes.find(c=>c.id===cid);
  const s = cls.students.find(x=>x.id===sid);
  s.skill = parseInt(val); persist(); renderClassArea();
};
window.updateStudentField = function(cid,sid,field,val) {
  const cls = state.teacher.classes.find(c=>c.id===cid);
  const s = cls.students.find(x=>x.id===sid);
  s[field] = parseInt(val) || 0; persist(); renderClassArea();
};
window.addStudent = function() {
  const name = document.getElementById('newStudentName').value.trim();
  if (!name) return;
  const cid = document.getElementById('classSel').value;
  const cls = state.teacher.classes.find(c=>c.id===cid);
  cls.students.push({ id:'s'+Date.now(), name:name+' (Demo)', grade:cls.grade, diag:0, topic:{pengenalan:0,aturan:0,teknik:0,taktik:0,keselamatan:0,sportivitas:0}, skill:2, apply:0, attitude:0 });
  persist(); toast('Murid ditambahkan'); renderClassArea();
};
window.exportClassCSV = function() {
  const cid = document.getElementById('classSel').value;
  const cls = state.teacher.classes.find(c=>c.id===cid);
  const rows = [['Nama','Pengetahuan','Rubrik','Penerapan','Sikap','Nilai Akhir','Status']];
  cls.students.forEach(s => {
    const knowledge = Math.round(Object.values(s.topic).reduce((a,b)=>a+b,0)/Object.values(s.topic).length);
    const skillScore = s.skill * 25;
    const finalVal = Math.round(knowledge*(state.weights.pengetahuan/100) + skillScore*(state.weights.keterampilan/100) + (s.apply||0)*(state.weights.penerapan/100) + (s.attitude||0)*(state.weights.sikap/100));
    rows.push([s.name, knowledge, s.skill, s.apply||0, s.attitude||0, finalVal, finalVal>=state.threshold?'Tuntas':'Perlu latihan']);
  });
  downloadCSV('rekap-kelas.csv', rows);
};

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

window.state = state;
// ---------- Boot ----------
updateHeader();
const initial = (location.hash || '#home').replace('#','');
navigate(initial);
