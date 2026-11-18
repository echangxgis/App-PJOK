/* Interactive volleyball laboratory. Coordinates are in court metres. */
window.VOLI_SIMULATION = function ({ state, progressOf, save, toast }) {
  const root = document.createElement("section");
  root.className = "volisim";
  root.innerHTML = `
    <header class="vs-heading"><div><span class="vs-eyebrow">LABORATORIUM INTERAKTIF</span><h2>Masuk lapangan. Kuasai rally.</h2><p>Latih timing, tiga sentuhan, dan penempatan bola. Simulasi ini tidak menggantikan latihan gerak nyata.</p></div><span class="vs-tag">3 vs 3 · Bola voli</span></header>
    <div class="vs-panel"><div class="vs-toolbar"><label>Mode<select data-ui="mode"><option value="practice">Latihan bebas</option><option value="match">Pertandingan · 7 poin</option><option value="challenge">Tantangan · 60 detik</option></select></label><label>Kesulitan<select data-ui="difficulty"><option value="easy">Mudah</option><option value="medium">Sedang</option><option value="hard">Menantang</option></select></label><button data-ui="start" class="vs-primary">Mulai bermain</button><button data-ui="pause" disabled>Jeda</button><button data-ui="reset">Ulangi</button></div>
    <div class="vs-scoreboard"><div><span>TIM KAMU</span><strong data-ui="score">0</strong></div><div class="vs-matchinfo"><span data-ui="phase">SIAP BERMAIN</span><small data-ui="clock">Latihan tanpa batas</small></div><div><span>LAWAN</span><strong data-ui="opponent">0</strong></div></div>
    <div class="vs-arena"><canvas width="1000" height="660" tabindex="0" aria-label="Lapangan voli perspektif. Tim biru di dekat Anda, lawan merah di seberang. Klik bagian jauh lapangan untuk mengarahkan bola. Gunakan tombol kontrol di bawah untuk bermain."></canvas><span class="vs-courtlabel">TIM BIRU · KAMU</span></div>
    <div class="vs-play"><div class="vs-feedback" role="status" aria-live="polite" aria-atomic="true" data-ui="feedback">Pilih mode lalu Mulai bermain. Arahkan bola ke ruang kosong di lapangan lawan.</div><div class="vs-meter-label"><strong data-ui="cue">Siapkan servis</strong><span>Tekan saat penanda di zona hijau</span></div><div class="vs-meter" role="img" aria-label="Meter timing: zona hijau pada 72 sampai 94 persen"><span class="vs-zone"></span><i data-ui="marker"></i></div><div class="vs-actions"><button data-action="serve">Spasi · Servis</button><button data-action="receive">1 · Terima</button><button data-action="set">2 · Umpan</button><button data-action="attack">3 · Smash</button></div><div class="vs-aim"><span>Arah serangan:</span><button data-aim="-3">Kiri</button><button data-aim="0">Tengah</button><button data-aim="3">Kanan</button><button data-ui="save" class="vs-save">Simpan skor terbaik</button></div></div></div>
    <div class="vs-guide"><article><b>01 / Servis</b><p>Tekan Servis untuk memulai ayunan, tekan lagi di zona hijau. Terlalu cepat atau terlambat bisa keluar.</p></article><article><b>02 / Tiga sentuhan</b><p>Terima → Umpan → Smash. Tekan tombol yang menyala saat penanda masuk zona hijau. Spasi juga menjalankan aksi aktif.</p></article><article><b>03 / Cari ruang</b><p>Klik atau sentuh lapangan seberang, atau pilih Kiri / Tengah / Kanan. Jauhi pemain merah agar bola sulit dijangkau.</p></article></div>`;
  const ui = name => root.querySelector(`[data-ui="${name}"]`);
  const canvas = root.querySelector("canvas"), ctx = canvas.getContext("2d");
  const abort = new AbortController(), signal = abort.signal;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const levels = { easy: { speed: .8, ai: 1.7, reach: 1.25 }, medium: { speed: 1, ai: 2.5, reach: 1.6 }, hard: { speed: 1.25, ai: 3.4, reach: 1.9 } };
  const homes = [[-2.8, 3.5], [0, 1.6], [2.7, 3.7], [-2.8, -3.8], [0, -1.5], [2.8, -3.6]];
  const players = homes.map(([x,y], i) => ({ x, y, tx:x, ty:y, team:i < 3 ? 0 : 1, pose:0 }));
  let running = false, paused = false, phase = "idle", elapsed = 0, duration = 1, score = 0, opponent = 0, remaining = 60, rally = 0, quality = 1, aim = { x:2.5, y:-5.5 }, flight = null, ball = {x:0,y:5.5,z:1}, trail = [], time = 0, last = 0, raf, attached = false, dead = false;
  let mode = "practice", level = levels.easy;
  const names = { idle:"SIAP BERMAIN", serve:"SERVIS", charge:"AYUNAN SERVIS", receive:"SENTUHAN 1 · TERIMA", set:"SENTUHAN 2 · UMPAN", attack:"SENTUHAN 3 · SMASH", away:"BOLA DI LAWAN", point:"POIN", finished:"SELESAI" };
  function say(text) { ui("feedback").textContent = text; }
  function persist(notify) {
    if (state.role !== "student" || !state.user) { if (notify) toast("Masuk sebagai murid untuk menyimpan skor"); return; }
    const p = progressOf(state.user.id); p.simScore = Math.max(p.simScore || 0, score); save();
    if (notify) toast("Skor terbaik disimpan: " + p.simScore);
  }
  function sync() {
    ui("score").textContent = score; ui("opponent").textContent = opponent;
    ui("phase").textContent = paused ? "DIJEDA" : names[phase];
    ui("clock").textContent = mode === "challenge" ? `${Math.ceil(remaining)} detik · Rally ${rally}` : mode === "match" ? "Pertama mencapai 7 poin" : `Latihan bebas · Rally ${rally}`;
    ui("pause").disabled = !running; ui("pause").textContent = paused ? "Lanjutkan" : "Jeda";
    ui("mode").disabled = ui("difficulty").disabled = running;
    root.querySelectorAll("[data-action]").forEach(b => {
      const active = b.dataset.action === phase || (phase === "charge" && b.dataset.action === "serve");
      b.disabled = !running || paused || !active; b.classList.toggle("vs-active", active);
    });
    ui("cue").textContent = phase === "charge" ? "Kunci kekuatan servis!" : phase === "serve" ? "Tekan Servis untuk mengayun" : names[phase];
  }
  function enter(next, seconds, target, peak) {
    phase = next; elapsed = 0; duration = seconds / level.speed;
    flight = target ? { from:{...ball}, to:target, peak:peak || 2 } : null;
    if (["receive", "set", "attack"].includes(next)) {
      const index = {receive:0,set:1,attack:2}[next]; players[index].tx = target.x; players[index].ty = target.y;
    }
    sync();
  }
  function finish(text) { running = false; phase = "finished"; flight = null; say(text); persist(false); sync(); }
  function point(won, text) {
    if (won) score++; else opponent++;
    say(text + (won ? " Poin tim biru!" : " Poin lawan."));
    persist(false);
    if (mode === "match" && Math.max(score, opponent) >= 7) { finish(`${score > opponent ? "Tim kamu menang!" : "Pertandingan selesai."} Skor ${score}–${opponent}. Tekan Mulai untuk bermain lagi.`); return; }
    enter("point", 1.8); sync();
  }
  function start() {
    mode = ui("mode").value; level = levels[ui("difficulty").value];
    running = true; paused = false; score = opponent = rally = 0; remaining = 60; quality = 1; trail = [];
    players.forEach((p,i) => { p.x = p.tx = homes[i][0]; p.y = p.ty = homes[i][1]; });
    ball = {x:-2,y:10.3,z:1}; players[0].x = players[0].tx = -2; players[0].y = players[0].ty = 10.3; enter("serve", 1); say("Arahkan servis ke lapangan lawan. Tekan Servis atau Spasi untuk mengayun.");
  }
  function action(act) {
    if (!running || paused) return;
    if (phase === "serve" && act === "serve") { enter("charge", 1.65); say("Ayunan dimulai. Tekan lagi saat penanda berada di zona hijau."); return; }
    if (!(act === phase || (act === "serve" && phase === "charge"))) return;
    const t = elapsed / duration, q = Math.max(0, 1 - Math.abs(t - .83) / .38);
    if (q < .23) { point(false, t < .6 ? "Sentuhan terlalu cepat. Tunggu bola mendekat." : "Sentuhan terlambat. Perhatikan zona hijau."); return; }
    quality = phase === "charge" ? q : quality * .35 + q * .65;
    const active = {receive:0,set:1,attack:2}[phase];
    if (active !== undefined) players[active].pose = .6;
    if (phase === "charge" || phase === "attack") {
      if (phase === "charge") { players[0].tx = homes[0][0]; players[0].ty = homes[0][1]; players[0].pose = .6; }
      rally++; enter("away", phase === "charge" ? 1.65 : 1.1, {x:aim.x,y:aim.y,z:.15}, phase === "charge" ? 3.7 : 3);
      say(q > .8 ? "Timing sempurna! Bola menuju sasaran." : "Bola masuk. Cari ruang kosong untuk serangan berikutnya.");
    } else if (phase === "receive") {
      enter("set", 1.55, {x:0,y:1.8,z:1.8}, 3.4); say("Penerimaan berhasil. Sekarang umpan dengan tombol 2.");
    } else if (phase === "set") {
      enter("attack", 1.4, {x:2.5,y:1,z:2.6}, 4.5); say("Umpan naik! Pilih sasaran lalu smash dengan tombol 3.");
    }
  }
  root.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.action) action(b.dataset.action);
    if (b.dataset.aim !== undefined) { aim = {x:Number(b.dataset.aim),y:-5.5}; say("Sasaran diubah. Tekan aksi saat penanda di zona hijau."); }
    if (b === ui("start")) start();
    if (b === ui("pause") && running) { paused = !paused; sync(); say(paused ? "Permainan dijeda. Tekan Lanjutkan untuk bermain." : "Permainan dilanjutkan."); }
    if (b === ui("reset")) { running = paused = false; score = opponent = rally = 0; phase = "idle"; ball = {x:0,y:5.5,z:1}; trail = []; flight = null; say("Lapangan direset. Tekan Mulai bermain."); sync(); }
    if (b === ui("save")) persist(true);
  }, {signal});
  root.addEventListener("keydown", e => {
    if (/SELECT|INPUT|TEXTAREA/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
    const map = {"1":"receive", "2":"set", "3":"attack"};
    if (map[e.key]) { e.preventDefault(); action(map[e.key]); }
    else if (e.code === "Space" && e.target.tagName !== "BUTTON") { e.preventDefault(); action(phase === "charge" ? "serve" : phase); }
  }, {signal});
  function project(x,y,z=0) { const depth = (y + 9) / 18, scale = .57 + depth * .43; return {x:500 + x * 64 * scale,y:150 + depth * 430 - z * 45 * scale,s:scale}; }
  canvas.addEventListener("pointerdown", e => {
    const rect = canvas.getBoundingClientRect(), x = (e.clientX-rect.left)*1000/rect.width, y = (e.clientY-rect.top)*660/rect.height;
    const depth = (y-150)/430, scale = .57 + depth*.43, courtX = (x-500)/(64*scale), courtY = depth*18-9;
    if (courtY >= -8.5 && courtY <= -.5 && Math.abs(courtX)<=4.5) { aim = {x:courtX,y:courtY}; say("Cakram sasaran dipindahkan. Bidik celah antara pemain merah."); }
    canvas.focus({preventScroll:true});
  }, {signal});
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) { paused = true; sync(); say("Permainan dijeda karena tab tidak aktif."); } }, {signal});
  function line(points, color, width=2) { ctx.beginPath(); points.forEach((p,i) => { const a=project(...p); if(i) ctx.lineTo(a.x,a.y); else ctx.moveTo(a.x,a.y); }); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke(); }
  function polygon(points, color) { ctx.beginPath(); points.forEach((p,i) => { const a=project(...p); if(i) ctx.lineTo(a.x,a.y); else ctx.moveTo(a.x,a.y); }); ctx.closePath(); ctx.fillStyle=color; ctx.fill(); }
  function human(p,i) {
    const walk = reduced || paused || !running ? 0 : Math.sin(time*8+i)*Math.min(1,Math.hypot(p.tx-p.x,p.ty-p.y)*3);
    const jump = p.pose > 0 ? Math.sin(p.pose/.6*Math.PI)*.65 : 0;
    const a=project(p.x,p.y,jump), s=a.s;
    ctx.save(); ctx.translate(a.x,a.y);
    ctx.fillStyle="rgba(9,25,45,.23)"; ctx.beginPath(); ctx.ellipse(0,jump*45*s,17*s,6*s,0,0,Math.PI*2); ctx.fill(); ctx.scale(s,s);
    const limb=(pts,c,w) => { ctx.beginPath(); pts.forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke(); };
    limb([[-6,-25],[-9-walk*4,-13],[-10-walk*7,-2]],"#172b49",7); limb([[6,-25],[9+walk*4,-13],[10+walk*7,-2]],"#172b49",7);
    limb([[-10-walk*7,-2],[-16-walk*7,-2]],"#f5faff",5); limb([[10+walk*7,-2],[16+walk*7,-2]],"#f5faff",5);
    const raised = p.pose>0 ? 19 : 0;
    limb([[-11,-46],[-19,-35-raised],[-12,-26-raised*2]],"#d9a578",6); limb([[11,-46],[19,-35-raised],[12,-26-raised*2]],"#d9a578",6);
    ctx.fillStyle=p.team?"#f46565":"#389eff";ctx.beginPath();ctx.moveTo(-12,-49);ctx.lineTo(12,-49);ctx.lineTo(10,-26);ctx.lineTo(-10,-26);ctx.closePath();ctx.fill();
    ctx.fillStyle="#102d52";ctx.fillRect(-10,-27,20,7);ctx.fillStyle="#fff";ctx.font="bold 13px system-ui";ctx.textAlign="center";ctx.fillText(String(i%3+1),0,-33);
    ctx.fillStyle="#d9a578";ctx.fillRect(-4,-55,8,8);ctx.beginPath();ctx.arc(0,-62,9,0,Math.PI*2);ctx.fill();ctx.fillStyle="#283047";ctx.beginPath();ctx.arc(0,-65,9,Math.PI,Math.PI*2);ctx.fill();ctx.restore();
  }
  function draw() {
    const bg=ctx.createLinearGradient(0,0,0,660);bg.addColorStop(0,"#10253f");bg.addColorStop(1,"#234e64");ctx.fillStyle=bg;ctx.fillRect(0,0,1000,660);
    ctx.fillStyle="#688397"; for(let row=0;row<3;row++) for(let j=0;j<32;j++){ctx.globalAlpha=.14;ctx.fillRect(24+j*31,45+row*20,18,9);}ctx.globalAlpha=1;
    polygon([[-6,-10],[6,-10],[6,10],[-6,10]],"#3e8e94");
    polygon([[-4.5,-9],[4.5,-9],[4.5,0],[-4.5,0]],"#c57e53");polygon([[-4.5,0],[4.5,0],[4.5,9],[-4.5,9]],"#df9b69");
    line([[-4.5,-9],[4.5,-9],[4.5,9],[-4.5,9],[-4.5,-9]],"#fff2d9",3);
    [-3,0,3].forEach(y=>line([[-4.5,y],[4.5,y]],"#fff2d9",2));
    const target=project(aim.x,aim.y);ctx.strokeStyle="#a8ffca";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(target.x,target.y,21*target.s,9*target.s,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#b9ffdc";ctx.font="11px system-ui";ctx.textAlign="center";ctx.fillText("SASARAN",target.x,target.y-16);
    players.filter(p=>p.team).sort((a,b)=>a.y-b.y).forEach(p=>human(p,players.indexOf(p)));
    for(let x=-4.8;x<=4.81;x+=.4) line([[x,0,.25],[x,0,2.45]],"rgba(222,244,255,.35)",1);
    for(let z=.25;z<=2.5;z+=.27) line([[-4.8,0,z],[4.8,0,z]],"rgba(222,244,255,.35)",1);
    line([[-4.8,0,2.45],[4.8,0,2.45]],"#f1f9ff",4);
    [-4.9,4.9].forEach(x=>line([[x,0,0],[x,0,2.8]],"#15314a",7));
    players.filter(p=>!p.team).sort((a,b)=>a.y-b.y).forEach(p=>human(p,players.indexOf(p)));
    const ground=project(ball.x,ball.y);ctx.fillStyle="rgba(0,0,0,.22)";ctx.beginPath();ctx.ellipse(ground.x,ground.y,Math.max(5,13-ball.z)*ground.s,4*ground.s,0,0,Math.PI*2);ctx.fill();
    if(!reduced) trail.forEach((b,i)=>{const a=project(b.x,b.y,b.z);ctx.globalAlpha=i/trail.length*.25;ctx.fillStyle="#fff7b0";ctx.beginPath();ctx.arc(a.x,a.y,5*a.s,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
    const b=project(ball.x,ball.y,ball.z);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(reduced?0:time*3);ctx.fillStyle="#fff9df";ctx.beginPath();ctx.arc(0,0,10*b.s,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#e5a829";ctx.lineWidth=3*b.s;ctx.beginPath();ctx.arc(0,0,7*b.s,-1,2);ctx.stroke();ctx.strokeStyle="#3588c7";ctx.beginPath();ctx.moveTo(-9*b.s,-2*b.s);ctx.quadraticCurveTo(0,6*b.s,8*b.s,-5*b.s);ctx.stroke();ctx.restore();
    if(!running || paused){ctx.fillStyle="rgba(9,25,45,.65)";ctx.fillRect(240,277,520,77);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="bold 25px system-ui";ctx.fillText(paused?"PERMAINAN DIJEDA":phase==="finished"?"SESI SELESAI":"SIAP MASUK LAPANGAN?",500,311);ctx.font="14px system-ui";ctx.fillText(paused?"Tekan Lanjutkan untuk kembali":"Gunakan kontrol di bawah lapangan",500,337);}
  }
  function update(dt) {
    time+=dt; elapsed+=dt;
    if(mode==="challenge") { remaining=Math.max(0,remaining-dt); if(remaining===0){finish(`Waktu habis! Kamu meraih ${score} poin. Skor terbaik tersimpan untuk murid yang masuk.`);return;} }
    players.forEach((p,i)=>{
      if(p.team){ const anticipation=phase==="away"?aim.x:Math.sin(time*.6+i)*2; p.tx=homes[i][0]*.5+anticipation*.5; p.ty=phase==="away"?aim.y+(i===4?1.1:0):homes[i][1]; }
      const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*(p.team?level.ai:5));if(d){p.x+=dx/d*step;p.y+=dy/d*step;}p.pose=Math.max(0,p.pose-dt);
    });
    const t=Math.min(1,elapsed/duration);
    if(flight){ball={x:flight.from.x+(flight.to.x-flight.from.x)*t,y:flight.from.y+(flight.to.y-flight.from.y)*t,z:flight.from.z+(flight.to.z-flight.from.z)*t+Math.sin(Math.PI*t)*flight.peak};if(!reduced){trail.push({...ball});if(trail.length>16)trail.shift();}}
    ui("marker").style.left=`${Math.min(100,t*100)}%`;
    if(t>=1){
      if(phase==="charge" || ["receive","set","attack"].includes(phase)) point(false,"Bola terlewat. Tekan aksi saat penanda di zona hijau.");
      else if(phase==="away"){
        const nearest=Math.min(...players.filter(p=>p.team).map(p=>Math.hypot(p.x-ball.x,p.y-ball.y)));
        if(nearest>level.reach*quality+.25) point(true,"Penempatan tajam ke ruang kosong; lawan tidak menjangkau bola.");
        else {players.slice(3).forEach(p=>{if(Math.hypot(p.x-ball.x,p.y-ball.y)<2.5)p.pose=.6;});enter("receive",2.1,{x:-2.6+Math.sin(rally*1.7)*.6,y:4,z:.9},3.8);say("Lawan mengembalikan bola. Bersiap menerima: tombol 1 di zona hijau.");}
      } else if(phase==="point") {quality=1;ball={x:-2,y:10.3,z:1};players[0].x=players[0].tx=-2;players[0].y=players[0].ty=10.3;trail=[];enter("serve",1);say("Rally baru. Mulai ayunan servis dengan Spasi atau tombol Servis.");}
    }
    ui("clock").textContent=mode==="challenge"?`${Math.ceil(remaining)} detik · Rally ${rally}`:mode==="match"?"Pertama mencapai 7 poin":`Latihan bebas · Rally ${rally}`;
  }
  function frame(now) {
    if(dead)return;
    if(root.isConnected)attached=true;
    else if(attached){dead=true;abort.abort();cancelAnimationFrame(raf);return;}
    const dt=Math.min(.05,last?(now-last)/1000:0);last=now;
    if(running&&!paused&&root.isConnected)update(dt);
    draw();raf=requestAnimationFrame(frame);
  }
  sync();raf=requestAnimationFrame(frame);
  return root;
};
