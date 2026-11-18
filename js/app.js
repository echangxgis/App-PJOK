/* VOLI Cerdas - App logic */
(function(){
  const D = window.VOLI_DATA;
  const STORAGE_KEY = "voli_cerdas_v1";

  // ---------- State ----------
  const state = {
    role: null, // 'student' | 'teacher'
    user: null, // {name, id, kelas}
    view: "home",
    params: {},
    sound: true,
    data: null // persisted data
  };

  // ---------- Persistence ----------
  function defaultData(){
    return {
      students: D.demoStudents.map(s=>({...s})),
      progress: {}, // studentId -> {completed:[], quiz:{}, missions:{}, reflection:{}, summative:null, diagnostic:null, noncog:null, practice:{}}
      teacher: { weights: {pengetahuan:30,keterampilan:50,penerapan:10,sikap:10}, threshold: 75 },
      classes: [4,5,6]
    };
  }
  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){ state.data = JSON.parse(raw); }
      else { state.data = defaultData(); save(); }
    } catch(e){ state.data = defaultData(); }
    // ensure structure
    if(!state.data.progress) state.data.progress = {};
    state.data.students.forEach(s=>{
      if(!state.data.progress[s.id]) state.data.progress[s.id] = { completed:[], quiz:{}, missions:{}, reflection:null, summative:null, diagnostic:null, noncog:null, practice:{} };
    });
  }
  function save(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); } catch(e){} }

  function progressOf(sid){ 
    if(!state.data.progress[sid]) state.data.progress[sid] = { completed:[], quiz:{}, missions:{}, reflection:null, summative:null, diagnostic:null, noncog:null, practice:{} };
    return state.data.progress[sid];
  }

  // ---------- Utilities ----------
  function el(html){ const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function toast(msg){
    const t = document.createElement("div"); t.className="toast"; t.textContent=msg;
    document.getElementById("toastRoot").appendChild(t);
    setTimeout(()=>t.remove(), 2600);
  }
  function showModal(html){
    const root = document.getElementById("modalRoot");
    root.classList.add("active");
    root.innerHTML = `<div class="modal-backdrop" id="mb"><div class="modal-card">${html}</div></div>`;
    document.getElementById("mb").addEventListener("click", e=>{ if(e.target.id==="mb") closeModal(); });
  }
  function closeModal(){ const root=document.getElementById("modalRoot"); root.classList.remove("active"); root.innerHTML=""; }

  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function diagramFor(id){
    const court = `<svg viewBox="0 0 320 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="300" height="140" fill="#7dd3a8" stroke="#fff" stroke-width="3" rx="8"/>
      <line x1="160" y1="10" x2="160" y2="150" stroke="#fff" stroke-width="4"/>
      <line x1="10" y1="80" x2="310" y2="80" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-dasharray="6,4"/>
      <text x="80" y="100" fill="#fff" font-size="12" font-weight="bold">Tim Kamu</text>
      <text x="210" y="100" fill="#fff" font-size="12" font-weight="bold">Lawan</text>
    </svg>`;
    const map = {
      "lapangan": court,
      "pengenalan": court,
      "aturan": court,
      "teknik-siap": `<svg viewBox="0 0 200 120" width="100%" height="120"><circle cx="100" cy="30" r="14" fill="#2f6df6"/><line x1="100" y1="44" x2="100" y2="80" stroke="#2f6df6" stroke-width="4"/><line x1="100" y1="55" x2="70" y2="70" stroke="#2f6df6" stroke-width="4"/><line x1="100" y1="55" x2="130" y2="70" stroke="#2f6df6" stroke-width="4"/><line x1="100" y1="80" x2="80" y2="110" stroke="#2f6df6" stroke-width="4"/><line x1="100" y1="80" x2="120" y2="110" stroke="#2f6df6" stroke-width="4"/><text x="10" y="115" font-size="11" fill="#6b7280">Sikap siap: kaki selebar bahu, lutut menekuk</text></svg>`,
      "passing-bawah": `<svg viewBox="0 0 220 120" width="100%" height="120"><circle cx="60" cy="60" r="14" fill="#8b5cf6"/><line x1="60" y1="74" x2="60" y2="100" stroke="#8b5cf6" stroke-width="4"/><line x1="60" y1="80" x2="30" y2="95" stroke="#8b5cf6" stroke-width="4"/><line x1="60" y1="80" x2="90" y2="95" stroke="#8b5cf6" stroke-width="4"/><path d="M120 50 L180 50" stroke="#f43f8c" stroke-width="3" marker-end="url(#a)"/><circle cx="150" cy="40" r="8" fill="#fbbf24"/><defs><marker id="a" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f43f8c"/></marker></defs><text x="100" y="115" font-size="11" fill="#6b7280">Lengan lurus membentuk platform</text></svg>`,
      "passing-atas": `<svg viewBox="0 0 220 120" width="100%" height="120"><circle cx="60" cy="70" r="14" fill="#17b890"/><line x1="60" y1="84" x2="60" y2="110" stroke="#17b890" stroke-width="4"/><path d="M50 55 Q60 40 70 55" stroke="#17b890" stroke-width="3" fill="none"/><circle cx="60" cy="35" r="8" fill="#fbbf24"/><text x="90" y="60" font-size="11" fill="#6b7280">Mangkuk jari di atas dahi</text></svg>`,
      "servis-bawah": `<svg viewBox="0 0 240 120" width="100%" height="120"><circle cx="40" cy="80" r="14" fill="#ff7a3d"/><line x1="40" y1="94" x2="40" y2="115" stroke="#ff7a3d" stroke-width="4"/><circle cx="90" cy="60" r="9" fill="#fbbf24"/><path d="M55 80 Q90 90 120 50" stroke="#ff7a3d" stroke-width="3" fill="none"/><text x="125" y="60" font-size="11" fill="#6b7280">Ayunkan dari bawah</text></svg>`,
    };
    return map[id] || `<div class="subtle">Ilustrasi teknik tersedia di Galeri Teknik. 🏐</div>`;
  }

  // ---------- Navigation ----------
  const NAV_ITEMS = [
    { id:"home", label:"Beranda", icon:"🏠" },
    { id:"classSelect", label:"Pilih Kelas", icon:"🎓" },
    { id:"learnMap", label:"Peta Belajar", icon:"🗺️" },
    { id:"material", label:"Materi", icon:"📚" },
    { id:"gallery", label:"Galeri Teknik", icon:"🎬" },
    { id:"simulation", label:"Simulasi", icon:"🎮" },
    { id:"missions", label:"Misi", icon:"⭐" },
    { id:"quiz", label:"Kuis", icon:"❓" },
    { id:"summative", label:"Asesmen", icon:"📝" },
    { id:"reflection", label:"Refleksi", icon:"💭" },
    { id:"report", label:"Rapor", icon:"📊" },
    { id:"teacher", label:"Guru", icon:"👩‍🏫" }
  ];

  function renderNav(){
    const top = document.getElementById("topnav");
    const bot = document.getElementById("bottomNav");
    const items = state.role==="teacher" ? NAV_ITEMS : NAV_ITEMS.filter(n=>n.id!=="teacher" || true);
    // show teacher only if role teacher
    const visible = state.role==="teacher" ? NAV_ITEMS : NAV_ITEMS.filter(n=>n.id!=="teacher");
    top.innerHTML = visible.map(n=>`<button class="${state.view===n.id?'active':''}" data-view="${n.id}">${n.label}</button>`).join("");
    top.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
    bot.innerHTML = visible.slice(0,6).map(n=>`<button class="${state.view===n.id?'active':''}" data-view="${n.id}"><span class="bn-icon">${n.icon}</span>${n.label}</button>`).join("");
    bot.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
  }

  function navigate(view, params={}){
    state.view = view; state.params = params;
    render();
  }

  // ---------- Render dispatcher ----------
  function render(){
    renderNav();
    const main = document.getElementById("main");
    main.innerHTML = "";
    const fn = views[state.view] || views.home;
    main.appendChild(fn(state.params));
    window.scrollTo(0,0);
  }

  // ---------- Views ----------
  const views = {};

  // Home / Landing
  views.home = function(){
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="school-identity">
        <img src="assets/logo-kalam-kudus.png" alt="Logo Kalam Kudus" width="100" height="96" fetchpriority="high">
        <div><strong>Sekolah Kristen Kalam Kudus Sentani</strong><p>Media Pembelajaran PJOK · Bola Voli</p></div>
      </div>
      <div class="hero">
        <div class="hero-art">🏐</div>
        <h1>VOLI Cerdas</h1>
        <p>Belajar bola voli PJOK untuk kelas 4, 5, 6 SD. Belajar, berlatih, dan bermain dengan ceria!</p>
        <div class="flex gap-8 flex-wrap">
          <button class="btn btn-secondary" id="btnMulai">Mulai Belajar</button>
          <button class="btn btn-outline" style="background:rgba(255,255,255,0.2);color:#fff;border-color:#fff;" id="btnGuru">Mode Guru</button>
        </div>
      </div>
      <div class="grid grid-3 mt-16">
        <div class="card card-hover"><div style="font-size:32px">📚</div><h3>Materi Lengkap</h3><p class="subtle">Pengenalan, aturan, teknik, taktik, keselamatan, sportivitas.</p></div>
        <div class="card card-hover"><div style="font-size:32px">🎮</div><h3>Simulasi Interaktif</h3><p class="subtle">Latihan passing, servis, rally dengan skor otomatis.</p></div>
        <div class="card card-hover"><div style="font-size:32px">📊</div><h3>Asesmen & Rapor</h3><p class="subtle">Kuis, rubrik praktik, laporan per murid dan kelas.</p></div>
      </div>
      <div class="card mt-16">
        <h3 class="section-title">Cara Pakai</h3>
        <p class="subtle">Pilih peran murid atau guru. Murid dapat memilih kelas, belajar materi, bermain simulasi, mengerjakan kuis, dan melihat rapor. Guru dapat mengelola kelas, input nilai praktik, dan melihat laporan.</p>
        <p class="subtle">Catatan masuk disimpan di Supabase. Progres belajar dan nilai masih lokal pada browser ini.</p>
      </div>
    `;
    div.querySelector("#btnMulai").addEventListener("click", ()=>navigate("auth", {role:"student"}));
    div.querySelector("#btnGuru").addEventListener("click", ()=>navigate("auth", {role:"teacher"}));
    return div;
  };

  // Auth
  views.auth = function(p){
    const div = document.createElement("div");
    const role = p.role || "student";
    div.innerHTML = `<div class="card" style="max-width:520px;margin:auto"><h2>Masuk ${role==='teacher'?'Guru':'Murid'}</h2><div id="cloudForm"></div><p id="cloudStatus" role="status"></p><button class="btn" id="cloudBack">Kembali</button></div>`;
    const form=div.querySelector('#cloudForm'), status=div.querySelector('#cloudStatus');
    div.querySelector('#cloudBack').onclick=()=>navigate('home');
    const cloud=window.PJOK_CLOUD;
    if(!cloud){ status.textContent='Koneksi database belum tersedia. Muat ulang halaman.'; return div; }
    if(role==='teacher'){
      form.innerHTML='<label>Email guru</label><input class="input" type="email" id="email" autocomplete="username"><label>Kata sandi</label><input class="input" type="password" id="password" autocomplete="current-password"><button class="btn btn-primary" id="login">Masuk Guru</button>';
      form.querySelector('#login').onclick=async()=>{
        const button=form.querySelector('#login'); button.disabled=true;
        try{
          const {error}=await cloud.auth.signInWithPassword({email:form.querySelector('#email').value.trim(),password:form.querySelector('#password').value});
          if(error) throw error;
          const {data:teachers,error:te}=await cloud.from('pjok_teachers').select('user_id');
          if(te || !teachers.length){ await cloud.auth.signOut(); throw new Error('Akun belum terdaftar sebagai guru.'); }
          state.role='teacher'; state.user={id:'teacher',name:'Guru'}; navigate('teacher');
        }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
      };
    }else{
      form.innerHTML='<p>Pilih kelas dan namamu. Tanpa PIN: catatan ini bukan kehadiran terverifikasi. Nama dalam daftar terlihat oleh pengunjung.</p><label>Kelas</label><select class="input" id="class"></select><label>Nama murid</label><select class="input" id="student"></select><button class="btn btn-primary" id="login" disabled>Masuk</button>';
      status.textContent='Memuat daftar murid...';
      cloud.rpc('pjok_roster').then(({data,error})=>{
        if(error){status.textContent='Daftar belum tersedia. Guru perlu menjalankan SQL pengaturan database.';return;}
        const roster=data||[], cls=form.querySelector('#class'), student=form.querySelector('#student'), button=form.querySelector('#login');
        for(const name of [...new Set(roster.map(s=>s.class_name))]) cls.add(new Option(name,name));
        function refresh(){student.replaceChildren();for(const s of roster.filter(s=>s.class_name===cls.value)) student.add(new Option(s.name,s.id));button.disabled=!student.value;}
        cls.onchange=refresh;refresh();status.textContent=roster.length?'':'Daftar murid masih kosong. Hubungi guru.';
        button.onclick=async()=>{
          button.disabled=true;status.textContent='Mencatat waktu masuk...';
          try{
            const stu=roster.find(s=>s.id===student.value);if(!stu) throw new Error('Pilih nama dahulu.');
            const {error}=await cloud.rpc('pjok_enter',{p_student_id:stu.id});if(error) throw error;
            state.role='student';state.user={id:stu.id,name:stu.name,kelas:stu.grade};
            if(!state.data.students.some(s=>s.id===stu.id)) state.data.students.push(state.user);
            progressOf(stu.id);navigate('studentHome');
          }catch(e){status.textContent='Gagal mencatat masuk: '+e.message;button.disabled=false;}
        };
      }).catch(()=>{status.textContent='Tidak dapat menghubungi database. Periksa internet.';});
    }
    return div;
  };

  // Student home
  views.studentHome = function(){
    const div = document.createElement("div");
    const sid = state.user.id;
    const p = progressOf(sid);
    const kelas = state.user.kelas;
    const cls = D.classes.find(c=>c.id===kelas);
    const completed = p.completed.length;
    const totalM = D.materials.filter(m=>m.kelas.includes(kelas)).length;
    const pct = Math.round((completed/totalM)*100);
    div.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,${cls.color},#8b5cf6);">
        <div class="hero-art">${cls.emoji}</div>
        <h1>Halo, ${state.user.name}! 👋</h1>
        <p>Kelas ${kelas} - ${cls.tagline}</p>
        <div class="progress" style="max-width:300px;background:rgba(255,255,255,0.3);"><div style="width:${pct}%;background:#fff;"></div></div>
        <small style="opacity:.9">Progres materi: ${completed}/${totalM} (${pct}%)</small>
      </div>
      <div class="grid grid-2 mt-16">
        <div class="card"><h3>📚 Lanjut Belajar</h3><p class="subtle">Buka materi sesuai kelasmu.</p><button class="btn btn-primary btn-sm" id="goMat">Materi</button></div>
        <div class="card"><h3>🎮 Simulasi</h3><p class="subtle">Latih passing, servis, rally.</p><button class="btn btn-secondary btn-sm" id="goSim">Main Simulasi</button></div>
        <div class="card"><h3>❓ Kuis</h3><p class="subtle">Uji pengetahuanmu.</p><button class="btn btn-accent btn-sm" id="goQuiz">Kerjakan Kuis</button></div>
        <div class="card"><h3>⭐ Misi</h3><p class="subtle">Selesaikan misi dan dapatkan lencana.</p><button class="btn btn-outline btn-sm" id="goMis">Lihat Misi</button></div>
      </div>
      <div class="card mt-16">
        <h3 class="section-title">Profil Murid</h3>
        <p><strong>Nama:</strong> ${state.user.name}</p>
        <p><strong>Kelas:</strong> ${kelas}</p>
        <p><strong>Lencana:</strong> ${(p.missions?Object.keys(p.missions).length:0)} misi selesai</p>
        <button class="btn btn-ghost btn-sm" id="logout">Keluar</button>
      </div>
    `;
    div.querySelector("#goMat").addEventListener("click", ()=>navigate("material"));
    div.querySelector("#goSim").addEventListener("click", ()=>navigate("simulation"));
    div.querySelector("#goQuiz").addEventListener("click", ()=>navigate("quiz"));
    div.querySelector("#goMis").addEventListener("click", ()=>navigate("missions"));
    div.querySelector("#logout").addEventListener("click", ()=>{ state.role=null; state.user=null; navigate("home"); });
    return div;
  };

  // Class select
  views.classSelect = function(){
    const div = document.createElement("div");
    div.innerHTML = `<h2 class="section-title">Pilih Kelas</h2><p class="subtle">Sesuaikan tingkat kesulitan dengan kelasmu.</p><div class="grid grid-3 mt-12"></div>`;
    const grid = div.querySelector(".grid");
    D.classes.forEach(c=>{
      const card = document.createElement("div");
      card.className="card card-hover text-center";
      card.innerHTML = `<div style="font-size:48px">${c.emoji}</div><h3>${c.name}</h3><p class="subtle">${c.tagline}</p><button class="btn btn-primary btn-sm">Pilih</button>`;
      card.querySelector("button").addEventListener("click", ()=>{
        if(state.role==="student" && state.user){ state.user.kelas=c.id; progressOf(state.user.id); save(); toast("Kelas "+c.id+" dipilih"); }
        navigate("learnMap", {kelas:c.id});
      });
      grid.appendChild(card);
    });
    return div;
  };

  // Learn map
  views.learnMap = function(p){
    const div = document.createElement("div");
    const kelas = p.kelas || (state.user && state.user.kelas) || 4;
    const mats = D.materials.filter(m=>m.kelas.includes(kelas));
    const prog = state.role==="student" ? progressOf(state.user.id) : null;
    div.innerHTML = `<h2 class="section-title">Peta Belajar - Kelas ${kelas}</h2><p class="subtle">Selesaikan materi satu per satu. Indikator progres terlihat.</p><div class="grid grid-2 mt-12" id="mapGrid"></div>`;
    const grid = div.querySelector("#mapGrid");
    mats.forEach(m=>{
      const done = prog && prog.completed.includes(m.id);
      const card = document.createElement("div");
      card.className="card card-hover";
      card.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="badge badge-blue">${m.kategori}</span>
          ${done?'<span class="badge badge-green">Selesai</span>':''}
        </div>
        <h3 class="mt-8">${m.judul}</h3>
        <p class="subtle">${m.tujuan}</p>
        <button class="btn btn-primary btn-sm mt-8">Buka Materi</button>
      `;
      card.querySelector("button").addEventListener("click", ()=>navigate("material", {id:m.id}));
      grid.appendChild(card);
    });
    // learning map table
    const lm = D.learningMap[kelas];
    if(lm){
      const t = document.createElement("div");
      t.className="card mt-16";
      t.innerHTML = `<h3 class="section-title">Peta Tujuan Pembelajaran</h3>
        <table class="table"><thead><tr><th>Elemen</th><th>Tujuan Pembelajaran</th><th>Waktu</th></tr></thead><tbody>
        ${lm.map(r=>`<tr><td>${r.elemen}</td><td>${r.tp}</td><td>${r.waktu}</td></tr>`).join("")}
        </tbody></table>`;
      div.appendChild(t);
    }
    return div;
  };

  // Material detail
  views.material = function(p){
    const div = document.createElement("div");
    let mat = null;
    if(p.id){ mat = D.materials.find(m=>m.id===p.id); }
    else {
      // list materials
      const kelas = (state.user && state.user.kelas) || 4;
      const mats = D.materials.filter(m=>m.kelas.includes(kelas));
      div.innerHTML = `<h2 class="section-title">Materi Pembelajaran</h2><p class="subtle">Pilih materi untuk dibaca.</p><div class="grid grid-2 mt-12" id="mGrid"></div>`;
      const g = div.querySelector("#mGrid");
      mats.forEach(m=>{
        const c = document.createElement("div"); c.className="card card-hover";
        c.innerHTML = `<span class="badge badge-blue">${m.kategori}</span><h3 class="mt-8">${m.judul}</h3><p class="subtle">${m.tujuan}</p><button class="btn btn-primary btn-sm mt-8">Buka</button>`;
        c.querySelector("button").addEventListener("click", ()=>navigate("material",{id:m.id}));
        g.appendChild(c);
      });
      return div;
    }
    if(!mat){ div.innerHTML="<p>Materi tidak ditemukan.</p>"; return div; }

    div.innerHTML = `
      <div class="card">
        <span class="badge badge-blue">${mat.kategori}</span>
        <h2 class="section-title mt-8">${mat.judul}</h2>
        <p><strong>Tujuan:</strong> ${mat.tujuan}</p>
        <h3>Penjelasan</h3><p>${mat.penjelasan}</p>
        <h3>Ilustrasi / Diagram</h3><div class="diagram-box mt-8" style="background:#f0f7ff;border-radius:12px;padding:12px;text-align:center;">${diagramFor(mat.id)}</div>
        <h3>Langkah Melakukan</h3><ol>${mat.langkah.map(x=>`<li>${x}</li>`).join("")}</ol>
        <div class="grid grid-2 mt-8">
          <div class="card" style="background:#dcfce7"><strong>Contoh Benar</strong><p>${mat.benar}</p></div>
          <div class="card" style="background:#fee2e2"><strong>Kesalahan Umum</strong><p>${mat.salah}</p></div>
        </div>
        <h3 class="mt-12">Tips Memperbaiki</h3><p>${mat.tips}</p>
        <h3>Aktivitas Praktik</h3><p>${mat.aktivitas}</p>
        <h3>Pertanyaan Pemantik</h3><p><em>${mat.pemantik}</em></p>
        <h3>Refleksi</h3><p>${mat.refleksi}</p>
        <h3>Tantangan Sesuai Kelas</h3><p>${mat.tantangan}</p>
        <h3>Indikator Keberhasilan</h3><p>${mat.indikator}</p>
        <h3>Kaitan dengan Kehidupan</h3><p>${mat.kaitan}</p>
      </div>
      <div class="card mt-12">
        <h3 class="section-title">Kuis Singkat</h3>
        <div id="matQuiz"></div>
      </div>
      <div class="flex gap-8 mt-12">
        <button class="btn btn-primary" id="markDone">Tandai Selesai</button>
        <button class="btn btn-ghost" id="backMat">Kembali</button>
      </div>
    `;

    // mini quiz
    const qroot = div.querySelector("#matQuiz");
    let qi = 0;
    function renderQ(){
      if(qi >= mat.kuis.length){ qroot.innerHTML = "<p class='text-muted'>Kuis singkat selesai. 🎉</p>"; return; }
      const q = mat.kuis[qi];
      qroot.innerHTML = `
        <p><strong>${qi+1}. ${q.q}</strong></p>
        ${q.opts.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join("")}
        <div id="qfb" class="mt-8"></div>
      `;
      qroot.querySelectorAll(".quiz-option").forEach(b=>{
        b.addEventListener("click", ()=>{
          const i = parseInt(b.dataset.i);
          const correct = i===q.ans;
          qroot.querySelectorAll(".quiz-option").forEach((x,idx)=>{
            if(idx===q.ans) x.classList.add("correct");
            if(idx===i && !correct) x.classList.add("wrong");
          });
          document.getElementById("qfb").innerHTML = `<p>${correct?"✅ Benar!":"❌ Kurang tepat."} ${q.explain||""}</p><button class="btn btn-primary btn-sm" id="qnext">Lanjut</button>`;
          document.getElementById("qnext").addEventListener("click", ()=>{ qi++; renderQ(); });
        });
      });
    }
    renderQ();

    div.querySelector("#markDone").addEventListener("click", ()=>{
      if(state.role==="student" && state.user){
        const p = progressOf(state.user.id);
        if(!p.completed.includes(mat.id)){ p.completed.push(mat.id); save(); toast("Materi ditandai selesai ✅"); }
        else toast("Sudah selesai sebelumnya");
      } else toast("Masuk sebagai murid untuk menyimpan progres");
    });
    div.querySelector("#backMat").addEventListener("click", ()=>navigate("learnMap"));
    return div;
  };

  // Gallery teknik
  views.gallery = function(){
    const div = document.createElement("div");
    div.innerHTML = `<h2 class="section-title">Galeri Teknik Dasar</h2><p class="subtle">Ilustrasi langkah teknik. (Demo visual)</p><div class="grid grid-3 mt-12" id="gGrid"></div>`;
    const g = div.querySelector("#gGrid");
    const techs = [
      {name:"Sikap Siap", art:"🧍", steps:["Kaki selebar bahu","Lutut menekuk","Tangan siap"]},
      {name:"Passing Bawah", art:"🤲", steps:["Genggam tangan","Lengan lurus","Bola mengenai lengan bawah"]},
      {name:"Passing Atas", art:"🙌", steps:["Mangkuk di dahi","Jari terbuka","Dorong lembut"]},
      {name:"Servis Bawah", art:"✋", steps:["Tahan bola","Ayunkan dari bawah","Pukul bola"]},
      {name:"Mengumpan", art:"🎯", steps:["Terima bola","Lihat teman","Umpan akurat"]},
      {name:"Blocking", art:"🛡️", steps:["Dekat net","Lompat","Tangan terangkat"]}
    ];
    techs.forEach(t=>{
      const c = document.createElement("div"); c.className="card text-center";
      c.innerHTML = `<div style="font-size:48px">${t.art}</div><h3>${t.name}</h3><ol style="text-align:left">${t.steps.map(s=>`<li>${s}</li>`).join("")}</ol>`;
      g.appendChild(c);
    });
    return div;
  };

  // Simulation
  views.simulation = function(){
    const root = document.createElement("section");
    root.innerHTML = `<div class="vo-modes" role="group" aria-label="Pilih jenis simulasi"><button class="btn btn-primary" data-mode="observe" aria-pressed="true">Amati Gerakan</button><button class="btn btn-outline" data-mode="timing" aria-pressed="false">Latihan Timing</button></div><div class="vo-content"></div>`;
    const content = root.querySelector(".vo-content");
    let selected = "observe";
    content.appendChild(window.VOLI_OBSERVATION());
    root.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
      if (selected === button.dataset.mode) return;
      selected = button.dataset.mode;
      root.querySelectorAll("[data-mode]").forEach(b => {
        const active = b === button;
        b.setAttribute("aria-pressed", String(active));
        b.className = active ? "btn btn-primary" : "btn btn-outline";
      });
      content.replaceChildren(selected === "observe" ? window.VOLI_OBSERVATION() : window.VOLI_SIMULATION({ state, progressOf, save, toast }));
    }));
    return root;
  };

  // Missions
  views.missions = function(){
    const div = document.createElement("div");
    div.innerHTML = `<h2 class="section-title">Misi dan Tantangan Keterampilan</h2><p class="subtle">Selesaikan level bertahap. Dapatkan lencana.</p><div class="grid grid-2 mt-12" id="mGrid"></div>`;
    const grid = div.querySelector("#mGrid");
    D.missions.forEach(m=>{
      const card = document.createElement("div"); card.className="card";
      const done = state.role==="student" && state.user && progressOf(state.user.id).missions && progressOf(state.user.id).missions[m.id];
      card.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="badge badge-purple">Level ${m.level}</span>
          ${done?'<span class="badge badge-green">Selesai</span>':''}
        </div>
        <h3 class="mt-8">${m.title}</h3>
        <p class="subtle">${m.desc}</p>
        <p><strong>Target:</strong> ${m.target} | <strong>Lencana:</strong> ${m.badge}</p>
        <button class="btn btn-primary btn-sm mt-8">${done?"Ulangi":"Mulai Misi"}</button>
      `;
      card.querySelector("button").addEventListener("click", ()=>{
        if(state.role!=="student"||!state.user){ toast("Masuk sebagai murid"); return; }
        showModal(`
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
          <p>Apakah kamu sudah menyelesaikan misi ini?</p>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-primary" id="mYes">Ya, Selesai</button>
            <button class="btn btn-ghost" id="mNo">Belum</button>
          </div>
        `);
        document.getElementById("mYes").addEventListener("click", ()=>{
          const p = progressOf(state.user.id);
          if(!p.missions) p.missions={};
          p.missions[m.id]=true;
          save(); closeModal(); toast("Lencana diperoleh: "+m.badge); navigate("missions");
        });
        document.getElementById("mNo").addEventListener("click", closeModal);
      });
      grid.appendChild(card);
    });
    return div;
  };

  // Quiz (formatif/diagnostik)
  views.quiz = function(){
    const div = document.createElement("div");
    div.innerHTML = `
      <h2 class="section-title">Kuis dan Asesmen Formatif</h2>
      <div class="card">
        <div class="flex flex-wrap gap-8 mb-12">
          <button class="btn btn-primary btn-sm" id="qDiag">Diagnostik Pengetahuan (10 soal)</button>
          <button class="btn btn-accent btn-sm" id="qNoncog">Diagnostik Nonkognitif</button>
          <button class="btn btn-secondary btn-sm" id="qTopic">Kuis Topik (5-10 soal)</button>
          <button class="btn btn-outline btn-sm" id="qTF">Benar/Salah</button>
          <button class="btn btn-outline btn-sm" id="qOrder">Urutkan Langkah</button>
          <button class="btn btn-outline btn-sm" id="qMatch">Mencocokkan</button>
        </div>
        <div id="quizArea"></div>
      </div>
    `;
    const area = div.querySelector("#quizArea");

    function runQuiz(questions, onComplete){
      let qi=0; let score=0; const order = shuffle(questions);
      function render(){
        if(qi>=order.length){
          const pct = Math.round((score/order.length)*100);
          area.innerHTML = `<h3>Selesai! Skor: ${score}/${order.length} (${pct}%)</h3><p class="subtle">Pembahasan tersedia per soal saat menjawab.</p><button class="btn btn-primary btn-sm" id="qdone">Tutup</button>`;
          document.getElementById("qdone").addEventListener("click", ()=>{ if(onComplete) onComplete(score, order.length); area.innerHTML=""; });
          return;
        }
        const q = order[qi];
        area.innerHTML = `
          <p><strong>${qi+1}/${order.length}. ${q.q}</strong></p>
          ${q.opts.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join("")}
          <div id="qfb" class="mt-8"></div>
        `;
        area.querySelectorAll(".quiz-option").forEach(b=>{
          b.addEventListener("click", ()=>{
            const i=parseInt(b.dataset.i);
            const correct = i===q.ans;
            if(correct) score++;
            area.querySelectorAll(".quiz-option").forEach((x,idx)=>{
              if(idx===q.ans) x.classList.add("correct");
              if(idx===i && !correct) x.classList.add("wrong");
            });
            const fb = document.getElementById("qfb");
            fb.innerHTML = `<p>${correct?"✅ Benar!":"❌ Salah."} ${q.explain||""}</p><button class="btn btn-primary btn-sm" id="qnext">Lanjut</button>`;
            document.getElementById("qnext").addEventListener("click", ()=>{ qi++; render(); });
          });
        });
      }
      render();
    }

    div.querySelector("#qDiag").addEventListener("click", ()=>{
      runQuiz(D.quizBank.diagnostik, (sc,total)=>{
        if(state.role==="student"&&state.user){ const p=progressOf(state.user.id); p.diagnostic={score:sc,total}; save(); toast("Diagnostik disimpan"); }
      });
    });
    div.querySelector("#qNoncog").addEventListener("click", ()=>{
      area.innerHTML = `
        <h3>Diagnostik Nonkognitif</h3>
        <p class="subtle">Minat, pengalaman, kepercayaan diri. Tidak untuk label negatif.</p>
        <label>Seberapa suka kamu bermain voli?</label>
        <select class="input" id="nc1"><option>Sangat suka</option><option>Suka</option><option>Cukup</option><option>Kurang</option></select>
        <label class="mt-8">Pengalaman bermain voli sebelumnya?</label>
        <select class="input" id="nc2"><option>Sering</option><option>Kadang</option><option>Belum pernah</option></select>
        <label class="mt-8">Kepercayaan diri saat bermain?</label>
        <select class="input" id="nc3"><option>Tinggi</option><option>Sedang</option><option>Rendah</option></select>
        <button class="btn btn-primary btn-sm mt-12" id="ncSave">Simpan</button>
      `;
      area.querySelector("#ncSave").addEventListener("click", ()=>{
        if(state.role==="student"&&state.user){
          const p=progressOf(state.user.id);
          p.noncog = { minat: area.querySelector("#nc1").value, pengalaman: area.querySelector("#nc2").value, percaya: area.querySelector("#nc3").value };
          save(); toast("Disimpan. Terima kasih!");
        } else toast("Masuk sebagai murid");
      });
    });
    div.querySelector("#qTopic").addEventListener("click", ()=>{
      // build topic quiz from materials of student's class
      const kelas = (state.user && state.user.kelas) || 4;
      const mats = D.materials.filter(m=>m.kelas.includes(kelas));
      const qs = [];
      mats.forEach(m=>{ (m.kuis||[]).forEach(k=> qs.push({...k})); });
      // pad to at least 5
      if(qs.length<5) qs.push(...D.quizBank.diagnostik.slice(0,5-qs.length));
      runQuiz(qs.slice(0,10), (sc,total)=>{
        if(state.role==="student"&&state.user){ const p=progressOf(state.user.id); p.quiz.topic={score:sc,total}; save(); toast("Kuis disimpan"); }
      });
    });

    // Benar/Salah
    div.querySelector("#qTF").addEventListener("click", ()=>{
      const statements = [
        { q: "Bola voli dimainkan dengan tangan.", ans: true },
        { q: "Setiap reli menghasilkan poin untuk salah satu regu.", ans: true },
        { q: "Passing bawah mengenai telapak tangan.", ans: false },
        { q: "Sebelum bermain tidak perlu pemanasan.", ans: false },
        { q: "Sportivitas berarti menghormati dan jujur.", ans: true }
      ];
      let qi=0, score=0;
      function render(){
        if(qi>=statements.length){ area.innerHTML = `<h3>Selesai! Skor: ${score}/${statements.length}</h3><button class="btn btn-primary btn-sm" id="qdone">Tutup</button>`; document.getElementById("qdone").addEventListener("click",()=>area.innerHTML=""); return; }
        const s = statements[qi];
        area.innerHTML = `<p><strong>${qi+1}/${statements.length}. ${s.q}</strong></p>
          <button class="btn btn-primary btn-sm" data-v="true">Benar</button>
          <button class="btn btn-secondary btn-sm" data-v="false">Salah</button>
          <div id="qfb" class="mt-8"></div>`;
        area.querySelectorAll("button[data-v]").forEach(b=>{
          b.addEventListener("click", ()=>{
            const v = b.dataset.v === "true";
            const correct = v === s.ans;
            if(correct) score++;
            document.getElementById("qfb").innerHTML = `<p>${correct?"✅ Benar!":"❌ Salah."}</p><button class="btn btn-primary btn-sm" id="qnext">Lanjut</button>`;
            document.getElementById("qnext").addEventListener("click", ()=>{ qi++; render(); });
          });
        });
      }
      render();
    });

    // Urutkan Langkah
    div.querySelector("#qOrder").addEventListener("click", ()=>{
      const steps = ["Sikap siap.", "Genggam tangan, lengan lurus.", "Dekatkan bola.", "Bola mengenai lengan bawah.", "Dorong ke target dengan kaki."];
      const shuffled = shuffle(steps.slice());
      area.innerHTML = `<h3>Urutkan Langkah Passing Bawah</h3><p class="subtle">Klik langkah secara berurutan.</p><div id="orderOpts"></div><div id="orderChosen" class="mt-8"></div><div id="orderFb" class="mt-8"></div>`;
      const chosen = [];
      const opts = document.getElementById("orderOpts");
      shuffled.forEach((s,i)=>{
        const b = document.createElement("button"); b.className="btn btn-outline btn-sm"; b.textContent=s; b.style.margin="4px";
        b.addEventListener("click", ()=>{
          if(chosen.includes(s)) return;
          chosen.push(s); b.disabled=true; b.style.opacity="0.5";
          document.getElementById("orderChosen").innerHTML = `<p><strong>Urutanmu:</strong> ${chosen.map((x,j)=>(j+1)+". "+x).join(" | ")}</p>`;
          if(chosen.length===steps.length){
            const correct = chosen.every((x,i)=>x===steps[i]);
            document.getElementById("orderFb").innerHTML = `<p>${correct?"✅ Urutan benar!":"❌ Urutan kurang tepat."} Urutan yang benar: ${steps.join(" → ")}</p>`;
          }
        });
        opts.appendChild(b);
      });
    });

    // Mencocokkan
    div.querySelector("#qMatch").addEventListener("click", ()=>{
      const pairs = [
        { term: "Passing bawah", desc: "Lengan bawah" },
        { term: "Passing atas", desc: "Jari tangan" },
        { term: "Servis bawah", desc: "Ayunan dari bawah" },
        { term: "Sikap siap", desc: "Kaki selebar bahu, lutut menekuk" }
      ];
      const descs = shuffle(pairs.map(p=>p.desc));
      area.innerHTML = `<h3>Mencocokkan Teknik dan Bagian Tubuh</h3>` +
        pairs.map((p,i)=>`<div class="flex items-center gap-8 mt-8"><span style="min-width:140px;font-weight:700">${p.term}</span>
          <select class="input" data-i="${i}" style="max-width:260px">${descs.map(d=>`<option value="${d}">${d}</option>`).join("")}</select></div>`).join("") +
        `<button class="btn btn-primary btn-sm mt-12" id="matchCheck">Periksa</button><div id="matchFb" class="mt-8"></div>`;
      document.getElementById("matchCheck").addEventListener("click", ()=>{
        let okAll = true;
        area.querySelectorAll("select[data-i]").forEach(s=>{
          const i = parseInt(s.dataset.i);
          if(s.value !== pairs[i].desc) okAll = false;
        });
        document.getElementById("matchFb").innerHTML = `<p>${okAll?"✅ Semua cocok!":"❌ Ada yang belum cocok."}</p>`;
      });
    });

    return div;
  };

  // Summative
  views.summative = function(){
    const div = document.createElement("div");
    div.innerHTML = `
      <h2 class="section-title">Asesmen Sumatif</h2>
      <div class="card">
        <p>27 soal pengetahuan (termasuk studi kasus) dengan kisi-kisi seimbang. Kunci dan pembahasan untuk guru.</p>
        <button class="btn btn-primary" id="startSum">Mulai Tes (25 soal)</button>
        <div id="sumArea" class="mt-12"></div>
      </div>
      <div class="card mt-12">
        <h3>Kisi-kisi (Guru)</h3>
        <table class="table"><thead><tr><th>Komponen</th><th>Jumlah</th></tr></thead><tbody>
        <tr><td>Pengertian & manfaat</td><td>3</td></tr>
        <tr><td>Lapangan & posisi</td><td>4</td></tr>
        <tr><td>Aturan</td><td>4</td></tr>
        <tr><td>Teknik dasar</td><td>6</td></tr>
        <tr><td>Keselamatan</td><td>3</td></tr>
        <tr><td>Sportivitas & taktik</td><td>5</td></tr>
        </tbody></table>
      </div>
    `;
    div.querySelector("#startSum").addEventListener("click", ()=>{
      const area = div.querySelector("#sumArea");
      let qi=0, score=0; const order = shuffle(D.sumatif);
      function render(){
        if(qi>=order.length){
          const pct = Math.round((score/order.length)*100);
          area.innerHTML = `<h3>Selesai! Skor: ${score}/${order.length} (${pct}%)</h3><button class="btn btn-primary btn-sm" id="sd">Tutup</button>`;
          document.getElementById("sd").addEventListener("click", ()=>{
            if(state.role==="student"&&state.user){ const p=progressOf(state.user.id); p.summative={score, total:order.length}; save(); toast("Sumatif disimpan"); }
            area.innerHTML="";
          });
          return;
        }
        const q=order[qi];
        area.innerHTML = `<p><strong>${qi+1}/${order.length}. ${q.q}</strong></p>
          ${q.opts.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o}</button>`).join("")}
          <div id="sfb" class="mt-8"></div>`;
        area.querySelectorAll(".quiz-option").forEach(b=>{
          b.addEventListener("click", ()=>{
            const i=parseInt(b.dataset.i); const correct=i===q.ans; if(correct) score++;
            area.querySelectorAll(".quiz-option").forEach((x,idx)=>{ if(idx===q.ans) x.classList.add("correct"); if(idx===i&&!correct) x.classList.add("wrong"); });
            document.getElementById("sfb").innerHTML = `<p>${correct?"✅ Benar!":"❌ Salah."}</p><button class="btn btn-primary btn-sm" id="sn">Lanjut</button>`;
            document.getElementById("sn").addEventListener("click", ()=>{ qi++; render(); });
          });
        });
      }
      render();
    });
    return div;
  };

  // Reflection
  views.reflection = function(){
    const div = document.createElement("div");
    div.innerHTML = `
      <h2 class="section-title">Refleksi Karakter dan Jurnal Belajar</h2>
      <div class="card">
        <p class="subtle">Refleksi singkat sesuai usia. Integrasi karakter: kasih, disiplin, berdaya guna.</p>
        <label>Apa yang kamu pelajari hari ini?</label><textarea class="input" id="r1" rows="3"></textarea>
        <label class="mt-8">Tantangan yang kamu hadapi?</label><textarea class="input" id="r2" rows="3"></textarea>
        <label class="mt-8">Target berikutnya?</label><textarea class="input" id="r3" rows="3"></textarea>
        <label class="mt-8">Karakter yang ingin kamu kembangkan (kasih/disiplin/berdaya guna/kepemimpinan melayani)</label><input class="input" id="r4" />
        <button class="btn btn-primary mt-12" id="rSave">Simpan Refleksi</button>
        <div id="rList" class="mt-12"></div>
      </div>
    `;
    // load existing
    if(state.role==="student"&&state.user){
      const p = progressOf(state.user.id);
      if(p.reflection){ div.querySelector("#r1").value=p.reflection.r1||""; div.querySelector("#r2").value=p.reflection.r2||""; div.querySelector("#r3").value=p.reflection.r3||""; div.querySelector("#r4").value=p.reflection.r4||""; }
    }
    div.querySelector("#rSave").addEventListener("click", ()=>{
      if(state.role!=="student"||!state.user){ toast("Masuk sebagai murid"); return; }
      const p = progressOf(state.user.id);
      p.reflection = { r1:div.querySelector("#r1").value, r2:div.querySelector("#r2").value, r3:div.querySelector("#r3").value, r4:div.querySelector("#r4").value, date:new Date().toLocaleDateString("id-ID") };
      save(); toast("Refleksi disimpan 💭");
    });
    return div;
  };

  // Report (rapor murid)
  views.report = function(){
    const div = document.createElement("div");
    div.innerHTML = `<h2 class="section-title">Rapor Hasil Belajar</h2><div id="repArea"></div>`;
    const area = div.querySelector("#repArea");
    if(state.role==="student" && state.user){
      const sid = state.user.id; const p = progressOf(sid);
      const kelas = state.user.kelas;
      const mats = D.materials.filter(m=>m.kelas.includes(kelas));
      const completed = p.completed.length;
      const diag = p.diagnostic? `${p.diagnostic.score}/${p.diagnostic.total}` : "-";
      const sum = p.summative? `${p.summative.score}/${p.summative.total}` : "-";
      const topic = p.quiz && p.quiz.topic ? `${p.quiz.topic.score}/${p.quiz.topic.total}` : "-";
      area.innerHTML = `
        <div class="card">
          <h3>${state.user.name} - Kelas ${kelas}</h3>
          <div class="grid grid-4 mt-8">
            <div class="stat"><div class="num">${completed}/${mats.length}</div><div class="lbl">Materi Selesai</div></div>
            <div class="stat"><div class="num">${diag}</div><div class="lbl">Diagnostik</div></div>
            <div class="stat"><div class="num">${topic}</div><div class="lbl">Kuis Topik</div></div>
            <div class="stat"><div class="num">${sum}</div><div class="lbl">Sumatif</div></div>
          </div>
          <h3 class="mt-12">Lencana Misi</h3>
          <p>${Object.keys(p.missions||{}).map(id=>{const m=D.missions.find(x=>x.id===id); return m?m.badge:"";}).join("  ") || "Belum ada"}</p>
          <h3 class="mt-12">Refleksi</h3>
          <p>${p.reflection? (p.reflection.r1||"-") : "Belum ada refleksi"}</p>
          <button class="btn btn-outline btn-sm mt-12 no-print" onclick="window.print()">Cetak Rapor</button>
        </div>
      `;
    } else if(state.role==="teacher"){
      area.innerHTML = `<p>Gunakan Dashboard Guru untuk rekap kelas. Atau pilih murid di dashboard.</p><button class="btn btn-primary btn-sm" onclick="navigate('teacher')">Ke Dashboard Guru</button>`;
    } else {
      area.innerHTML = `<p>Masuk sebagai murid untuk melihat rapor.</p>`;
    }
    return div;
  };

  // Teacher dashboard
  views.entryHistory = function(){
    const div=document.createElement('div');
    div.innerHTML='<div class="card"><h2>Catatan Masuk Aplikasi</h2><p>Bukan bukti kehadiran terverifikasi. Maksimal 500 catatan terbaru. Waktu mengikuti zona perangkat.</p><button class="btn" id="back">Kembali</button><button class="btn" id="logout">Keluar Guru</button><div id="entries" role="status">Memuat...</div></div>';
    div.querySelector('#back').onclick=()=>navigate('teacher');
    div.querySelector('#logout').onclick=async()=>{await window.PJOK_CLOUD.auth.signOut();state.role=null;state.user=null;navigate('home');};
    (async()=>{
      const box=div.querySelector('#entries');
      try{
        const {data:teachers,error:te}=await window.PJOK_CLOUD.from('pjok_teachers').select('user_id');
        if(te||!teachers.length) throw new Error('Silakan login sebagai guru.');
        const {data,error}=await window.PJOK_CLOUD.from('pjok_entries').select('entered_at,pjok_students(name,class_name)').order('entered_at',{ascending:false}).limit(500);
        if(error) throw error;
        box.textContent='';
        for(const entry of data){const row=document.createElement('p');row.textContent=`${entry.pjok_students?.class_name} - ${entry.pjok_students?.name} - ${new Date(entry.entered_at).toLocaleString('id-ID')}`;box.appendChild(row);}
        if(!data.length) box.textContent='Belum ada catatan masuk.';
      }catch(e){box.textContent=e.message;}
    })();
    return div;
  };
  views.teacher = function(){
    if(state.role!=='teacher') return views.auth({role:'teacher'});
    const div = document.createElement("div");
    if(state.role!=="teacher"){ div.innerHTML="<p>Akses khusus guru. <button class='btn btn-primary btn-sm' id='g'>Masuk Guru</button></p>"; div.querySelector("#g").addEventListener("click",()=>navigate("auth",{role:"teacher"})); return div; }
    const data = state.data;
    div.innerHTML = `
      <h2 class="section-title">Dashboard Guru</h2>
      <button class="btn btn-primary" id="entryHistory">Lihat Catatan Masuk Murid</button>
      <div class="card">
        <h3>Pengaturan Bobot Nilai & Ketuntasan</h3>
        <div class="grid grid-4">
          <div><label>Pengetahuan %</label><input class="input" id="w1" type="number" value="${data.teacher.weights.pengetahuan}" /></div>
          <div><label>Keterampilan %</label><input class="input" id="w2" type="number" value="${data.teacher.weights.keterampilan}" /></div>
          <div><label>Penerapan %</label><input class="input" id="w3" type="number" value="${data.teacher.weights.penerapan}" /></div>
          <div><label>Sikap %</label><input class="input" id="w4" type="number" value="${data.teacher.weights.sikap}" /></div>
        </div>
        <label class="mt-8">Batas Ketuntasan (%)</label><input class="input" id="thr" type="number" value="${data.teacher.threshold}" style="max-width:120px" />
        <button class="btn btn-primary btn-sm mt-8" id="saveW">Simpan Pengaturan</button>
      </div>

      <div class="card mt-12">
        <h3>Daftar Murid</h3>
        <p class="subtle">Data contoh ditandai sebagai data demo. Ganti dengan data sekolah Anda.</p>
        <table class="table" id="studentTable"></table>
        <div class="mt-8 flex gap-8">
          <button class="btn btn-secondary btn-sm" id="addStudent">Tambah Murid</button>
          <button class="btn btn-accent btn-sm" id="exportCsv">Ekspor CSV</button>
        </div>
      </div>

      <div class="card mt-12">
        <h3>Input Nilai Observasi Praktik (Rubrik)</h3>
        <label>Pilih Murid</label>
        <select class="input" id="selStudent" style="max-width:300px"></select>
        <div id="rubricArea" class="mt-8"></div>
      </div>

      <div class="card mt-12">
        <h3>Rekap Kelas</h3>
        <div id="rekapArea"></div>
      </div>

      <div class="card mt-12">
        <h3>Modul Pelaksanaan Pembelajaran (Contoh)</h3>
        <ol>${D.teachingModule.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
        <p class="subtle">Lembar observasi tersedia di rubrik di atas.</p>
      </div>
    `;

    const table = div.querySelector("#studentTable");
    function renderTable(){
      table.innerHTML = `<thead><tr><th>Nama</th><th>Kelas</th><th>Diagnostik</th><th>Sumatif</th><th>Aksi</th></tr></thead><tbody>
        ${data.students.map(s=>{
          const p = progressOf(s.id);
          return `<tr>
            <td>${s.name}</td><td>${s.kelas}</td>
            <td>${p.diagnostic? p.diagnostic.score+"/"+p.diagnostic.total : "-"}</td>
            <td>${p.summative? p.summative.score+"/"+p.summative.total : "-"}</td>
            <td><button class="btn btn-ghost btn-sm" data-view-student="${s.id}">Detail</button></td>
          </tr>`;
        }).join("")}
      </tbody>`;
      table.querySelectorAll("[data-view-student]").forEach(b=>{
        b.addEventListener("click", ()=>showStudentDetail(b.dataset.viewStudent));
      });
    }
    renderTable();

    // populate select
    const sel = div.querySelector("#selStudent");
    sel.innerHTML = data.students.map(s=>`<option value="${s.id}">${s.name} (K${s.kelas})</option>`).join("");

    function renderRubric(sid){
      const area = div.querySelector("#rubricArea");
      const p = progressOf(sid);
      if(!p.practice) p.practice={};
      const r = D.rubric;
      area.innerHTML = `
        <table class="table"><thead><tr><th>Indikator</th><th>Skor (1-4)</th><th>Deskriptor</th></tr></thead><tbody>
        ${r.indicators.map(ind=>{
          const cur = p.practice[ind.id]||1;
          return `<tr>
            <td>${ind.name} (bobot ${ind.weight})</td>
            <td><select class="input" data-ind="${ind.id}" style="width:80px">${[1,2,3,4].map(v=>`<option value="${v}" ${v===cur?"selected":""}>${v}</option>`).join("")}</select></td>
            <td class="subtle">${r.descriptors[ind.id][cur]}</td>
          </tr>`;
        }).join("")}
        </tbody></table>
        <button class="btn btn-primary btn-sm mt-8" id="savePractice">Simpan Nilai Praktik</button>
        <div id="practiceResult" class="mt-8"></div>
      `;
      area.querySelectorAll("select").forEach(s=>{
        s.addEventListener("change", ()=>{
          if(!p.practice) p.practice={};
          p.practice[s.dataset.ind] = parseInt(s.value);
          renderRubric(sid);
        });
      });
      area.querySelector("#savePractice").addEventListener("click", ()=>{
        const p2 = progressOf(sid);
        if(!p2.practice) p2.practice={};
        area.querySelectorAll("select").forEach(s=>{
          p2.practice[s.dataset.ind] = parseInt(s.value);
        });
        save();
        // compute
        const res = computePractice(p2.practice);
        document.getElementById("practiceResult").innerHTML = `<p><strong>Nilai Praktik:</strong> ${res.toFixed(1)} / 100</p>`;
        toast("Nilai praktik disimpan");
      });
    }
    renderRubric(sel.value);
    sel.addEventListener("change", ()=>renderRubric(sel.value));

    function computePractice(prac){
      const r = D.rubric;
      let totalW=0, sum=0;
      r.indicators.forEach(ind=>{
        const sc = prac[ind.id]||1;
        const max=4;
        sum += (sc/max)*ind.weight;
        totalW += ind.weight;
      });
      return (sum/totalW)*100;
    }

    function showStudentDetail(sid){
      const s = data.students.find(x=>x.id===sid);
      const p = progressOf(sid);
      const prac = p.practice||{};
      const practiceScore = Object.keys(prac).length? computePractice(prac) : 0;
      const pengetahuan = p.summative? (p.summative.score/p.summative.total*100) : (p.diagnostic? p.diagnostic.score/p.diagnostic.total*100 : 0);
      const penerapan = p.simScore? Math.min(100, p.simScore*10) : 0; // demo
      const sikap = 80; // demo placeholder, guru should input real
      const w = data.teacher.weights;
      const final = (pengetahuan*w.pengetahuan + practiceScore*w.keterampilan + penerapan*w.penerapan + sikap*w.sikap)/100;
      const thr = data.teacher.threshold;
      showModal(`
        <h3>Detail: ${s.name} (Kelas ${s.kelas})</h3>
        <p>Diagnostik: ${p.diagnostic? p.diagnostic.score+"/"+p.diagnostic.total : "-"}</p>
        <p>Kuis Topik: ${p.quiz&&p.quiz.topic? p.quiz.topic.score+"/"+p.quiz.topic.total : "-"}</p>
        <p>Sumatif: ${p.summative? p.summative.score+"/"+p.summative.total : "-"}</p>
        <p>Nilai Praktik: ${practiceScore.toFixed(1)}</p>
        <p>Penerapan (simulasi): ${penerapan}</p>
        <p>Sikap (demo): ${sikap}</p>
        <hr/>
        <p><strong>Nilai Akhir:</strong> ${final.toFixed(1)} / 100</p>
        <p><strong>Status:</strong> ${final>=thr?"Mencapai Target":"Perlu Latihan/Bimbingan"}</p>
        <p class="subtle">Catatan guru:</p>
        <textarea class="input" rows="3" id="note">${p.note||""}</textarea>
        <button class="btn btn-primary btn-sm mt-8" id="saveNote">Simpan Catatan</button>
        <button class="btn btn-ghost btn-sm mt-8" onclick="closeModal()">Tutup</button>
      `);
      document.getElementById("saveNote").addEventListener("click", ()=>{
        p.note = document.getElementById("note").value; save(); toast("Catatan disimpan"); closeModal();
      });
    }

    div.querySelector("#entryHistory").addEventListener("click", ()=>navigate("entryHistory"));
    div.querySelector("#saveW").addEventListener("click", ()=>{
      data.teacher.weights = {
        pengetahuan: parseInt(div.querySelector("#w1").value)||0,
        keterampilan: parseInt(div.querySelector("#w2").value)||0,
        penerapan: parseInt(div.querySelector("#w3").value)||0,
        sikap: parseInt(div.querySelector("#w4").value)||0
      };
      data.teacher.threshold = parseInt(div.querySelector("#thr").value)||75;
      save(); toast("Pengaturan disimpan");
    });

    div.querySelector("#addStudent").addEventListener("click", ()=>{
      const name = prompt("Nama murid baru:");
      if(!name) return;
      const kelas = prompt("Kelas (4/5/6):","4");
      const s = {id:"s"+Date.now(), name, kelas: parseInt(kelas)||4};
      data.students.push(s); progressOf(s.id); save(); renderTable(); toast("Murid ditambahkan");
    });

    div.querySelector("#exportCsv").addEventListener("click", ()=>{
      let csv = "Nama,Kelas,Diagnostik,Sumatif,Praktik\n";
      data.students.forEach(s=>{
        const p = progressOf(s.id);
        const prac = p.practice||{};
        const practiceScore = Object.keys(prac).length? computePractice(prac).toFixed(1) : "";
        csv += `${s.name},${s.kelas},${p.diagnostic?p.diagnostic.score+"/"+p.diagnostic.total:""},${p.summative?p.summative.score+"/"+p.summative.total:""},${practiceScore}\n`;
      });
      const blob = new Blob([csv], {type:"text/csv"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download="rekap_voli_cerdas.csv"; a.click();
      URL.revokeObjectURL(url);
      toast("CSV diekspor");
    });

    // Rekap kelas
    function renderRekap(){
      const area = div.querySelector("#rekapArea");
      const byKelas = {};
      data.students.forEach(s=>{
        if(!byKelas[s.kelas]) byKelas[s.kelas]=[];
        byKelas[s.kelas].push(s);
      });
      let html = "";
      Object.keys(byKelas).forEach(k=>{
        html += `<h4>Kelas ${k}</h4><table class="table"><thead><tr><th>Nama</th><th>Materi</th><th>Sumatif</th></tr></thead><tbody>`;
        byKelas[k].forEach(s=>{
          const p = progressOf(s.id);
          const mats = D.materials.filter(m=>m.kelas.includes(parseInt(k))).length;
          html += `<tr><td>${s.name}</td><td>${p.completed.length}/${mats}</td><td>${p.summative?p.summative.score+"/"+p.summative.total:"-"}</td></tr>`;
        });
        html += "</tbody></table>";
      });
      area.innerHTML = html;
    }
    renderRekap();

    return div;
  };

  // ---------- Init ----------
  load();
  // restore session
  try {
    const sess = localStorage.getItem("voli_session");
    if(sess){ const o=JSON.parse(sess); state.role=o.role; state.user=o.user; }
  } catch(e){}
  // save session on navigate? We'll save when login; add save in auth already? Add global save session
  const origNavigate = navigate;
  // wrap navigate to persist session
  window.navigate = navigate;

  // Persist session on login: modify auth handlers? Instead save after setting state in auth. Add saveSession helper.
  function saveSession(){ try { localStorage.setItem("voli_session", JSON.stringify({role:state.role,user:state.user})); } catch(e){} }
  // call saveSession in auth login paths by overriding? We'll just save on any navigate if user present.
  const _nav = navigate;
  navigate = function(v,p){ _nav(v,p); saveSession(); };
  // redefine views navigate references? views use navigate global; update global
  window.navigate = navigate;

  // topbar profile button
  document.getElementById("btnProfile").addEventListener("click", ()=>{
    if(state.role==="student" && state.user) navigate("studentHome");
    else if(state.role==="teacher") navigate("teacher");
    else navigate("auth",{role:"student"});
  });
  document.getElementById("btnSound").addEventListener("click", ()=>{ state.sound=!state.sound; toast(state.sound?"Suara aktif":"Suara mati"); });

  // close modal on Escape
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });

  // Expose closeModal global for inline handlers
  window.closeModal = closeModal;
  window.navigate = navigate;
  window.VOLI_APP = { state, progressOf, save };

  navigate("home");
})();

