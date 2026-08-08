/* §12 UI 구성
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §12  UI 구성 ══════════════════════════════════════════ */

/* ── 셀렉트 채우기 헬퍼 ── */
function fillSel(s,o,c){
  s.innerHTML='';
  for(const [k,l] of Object.entries(o)) s.add(new Option(l,k,false,k===c));
}
function srcOptions(s,c){
  s.innerHTML='';
  s.add(new Option('— 비우기 —','__empty'));
  LIB_NAMES.forEach(n => s.add(new Option(n,n,false,n===c)));
}
function smpOptions(s,cur){
  s.innerHTML='';
  s.add(new Option('합성','synth',false,cur==='synth'));
  if(cur==='__custom') s.add(new Option('직접 URL','__custom',false,true));
  KITS.forEach(k => {
    const og=document.createElement('optgroup'); og.label=KIT_LABEL[k]||k;
    KIT_FILES.forEach(f => {
      const key=`drum-samples/${k}/${f}`;
      og.appendChild(new Option(f,key,false,cur===key));
    });
    s.appendChild(og);
  });
  const og2=document.createElement('optgroup'); og2.label='Casio (stepSequencer 예제)';
  CASIO_STEP.forEach(n => og2.appendChild(new Option(n,`casio/${n}`,false,cur===`casio/${n}`)));
  s.appendChild(og2);
}
function syncSmpSelects(){
  document.querySelectorAll('#drums .row').forEach((row,i) => {
    smpOptions(row.querySelector('.smp'), smpSel[TRACKS[i].id]);
  });
}

/* ── 눈금자 ── */
UI.ruler.appendChild(document.createElement('div'));   // 스트립 자리 비움
for(let i=0;i<STEPS;i++){
  const b=document.createElement('b');
  b.textContent = i%4===0 ? i/4+1 : '·';
  if(i%4===0) b.className='beat';
  UI.ruler.appendChild(b);
}

/* ── 킷 셀렉트 · 루프 버튼 · 직접 URL 대상 ── */
UI.kit.add(new Option('— 합성 엔진 —','synth',false,true));
KITS.forEach(k => UI.kit.add(new Option(KIT_LABEL[k]||k,k)));

LOOP_CANDIDATES.forEach(L => {
  const b=document.createElement('button');
  b.className='lbtn'; b.textContent=L.n;
  b.dataset.loop=L.n; b.dataset.on='0';
  b.onclick=()=>toggleLoop(L);
  UI.loops.appendChild(b);
});

TRACKS.forEach(t => UI.cdst.add(new Option(t.label,t.id)));
UI.cdst.add(new Option('Loop 데크','loop'));

/* ── 드럼 트랙 행 ── */
TRACKS.forEach(tr => {
  padEl[tr.id]=[];
  const row=document.createElement('div');
  row.className='row'; row.style.setProperty('--tone',tr.tone);

  const strip=document.createElement('div'); strip.className='strip';
  strip.innerHTML=`<div class="top">
      <div class="mute" role="button" tabindex="0" aria-label="${tr.label} 음소거"></div>
      <span>${tr.label}</span>
      <input type="range" min="0" max="100" value="${tr.gain*100}" aria-label="${tr.label} 볼륨"></div>
    <div class="bot"><select class="eng" aria-label="${tr.label} 음색"></select>
      <select class="src" aria-label="${tr.label} 패턴 출처"></select>
      <select class="smp" aria-label="${tr.label} 샘플"></select></div>`;

  strip.querySelector('.mute').onclick = e => {
    mute[tr.id]=!mute[tr.id];
    e.currentTarget.dataset.off = mute[tr.id] ? '1' : '0';
  };
  strip.querySelector('.top input').oninput = e => { lvl[tr.id]=+e.target.value/100; };

  const es=strip.querySelector('.eng'); fillSel(es,ENGINES[tr.id],eng[tr.id]);
  es.onchange = e => { eng[tr.id]=e.target.value; audition(tr.id); };

  /* 트랙 하나만 다른 프리셋에서 가져오기 */
  const ss=strip.querySelector('.src'); srcOptions(ss,src[tr.id]);
  ss.onchange = e => {
    pushUndo();
    const n=e.target.value;
    if(n==='__empty'){
      P.drums[tr.id]=new Array(STEPS).fill(0);
      probT[tr.id]=1;
    }else{
      const L=LIB[n];
      P.drums[tr.id]=L.drums[tr.id].slice();
      if(L.kit[tr.id]) eng[tr.id]=L.kit[tr.id];      // 없으면 현재 엔진 유지
      probT[tr.id]=L.prob ? (L.prob[tr.id] ?? 1) : 1;
      if(L.tune && TUNE_KNOB[tr.id]) setKnob(TUNE_KNOB[tr.id], L.tune[TUNE_KEY[tr.id]]);
      if(L.smp && L.smp[tr.id]) assignSample(tr.id,L.smp[tr.id]).then(syncSmpSelects);
    }
    src[tr.id]=n;
    syncDrums(); syncStrips(); markChips(); markDirty();
  };

  const ms=strip.querySelector('.smp'); smpOptions(ms,smpSel[tr.id]);
  ms.onchange = async e => {
    await assignSample(tr.id,e.target.value);
    syncSmpSelects(); audition(tr.id);
  };
  row.appendChild(strip);

  /* 스텝 패드 — 클릭할 때마다 없음 → 보통 → 강세 순환, 끌면 연속 입력 */
  for(let i=0;i<STEPS;i++){
    const pad=document.createElement('div');
    pad.className='pad' + (Math.floor(i/4)%2 ? ' q' : '');
    pad.dataset.v=0; pad.tabIndex=0;
    pad.setAttribute('role','button');
    pad.setAttribute('aria-pressed','false');
    pad.setAttribute('aria-label',`${tr.label} ${Math.floor(i/4)+1}박 ${i%4+1}번째 스텝`);
    padEl[tr.id][i]=pad;

    const setVal=(v,audible)=>{
      P.drums[tr.id][i]=v;
      pad.dataset.v=v;
      pad.setAttribute('aria-pressed', v ? 'true' : 'false');
      if(v && audible){
        wake(); chan[tr.id].gain.value=lvl[tr.id];
        fireTrack(tr.id, ctx.currentTime+0.02, v===2?1:0.60, eng[tr.id]);
      }
      markChips(); syncSlots(); markDirty();
    };
    const cycle=()=>{ pushUndo(); const v=(P.drums[tr.id][i]+1)%3; setVal(v,true); return v; };

    pad.addEventListener('pointerdown', e => {
      e.preventDefault();
      paintVal=cycle(); painting=true; paintKind='pad';
    });
    pad.addEventListener('pointerenter', () => {
      if(!painting || paintKind!=='pad') return;
      if(P.drums[tr.id][i]===paintVal) return;
      setVal(paintVal,false);
    });
    pad.onkeydown=e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); cycle(); } };
    row.appendChild(pad);
  }
  UI.drums.appendChild(row);
});

/* ── 베이스 피아노롤 (위가 높은 음) ── */
for(let r=0;r<ROWS;r++){
  const deg=ROWS-1-r;
  const row=document.createElement('div');
  row.className='rrow' + (deg===0 ? ' acc' : '');
  const lab=document.createElement('small'); lab.dataset.deg=deg;
  row.appendChild(lab);
  noteEl[deg]=[];
  for(let i=0;i<STEPS;i++){
    const c=document.createElement('div');
    c.className='note'; c.dataset.on=0; c.tabIndex=0;
    c.setAttribute('role','button');
    c.setAttribute('aria-pressed','false');
    c.setAttribute('aria-label',`베이스 ${deg+1}도 ${Math.floor(i/4)+1}박 ${i%4+1}번째 스텝`);
    noteEl[deg][i]=c;

    const setNote=(v,audible)=>{
      P.bass[i]=v;
      syncBass(); markChips(); syncSlots(); markDirty();
      if(v>=0 && audible){
        wake(); chan.bass.gain.value=lvl.bass;
        bassVoice(ctx.currentTime+0.02, v, spb()*0.25*(knob('gate')/100), eng.bass);
      }
    };
    c.addEventListener('pointerdown', e => {
      e.preventDefault();
      pushUndo();
      const on = P.bass[i]!==deg;
      setNote(on ? deg : -1, true);
      paintVal = on ? deg : -1; painting=true; paintKind='note';
    });
    c.addEventListener('pointerenter', () => {
      if(!painting || paintKind!=='note') return;
      if(paintVal>=0){ if(P.bass[i]!==paintVal) setNote(paintVal,false); }
      else if(P.bass[i]===deg) setNote(-1,false);
    });
    c.onkeydown=e=>{
      if(e.key===' '||e.key==='Enter'){
        e.preventDefault(); pushUndo();
        setNote(P.bass[i]===deg ? -1 : deg, true);
      }
    };
    row.appendChild(c);
  }
  UI.rolls.appendChild(row);
}

/* ── 건반 롤 (화음) ──
   베이스·기타와 달리 한 스텝에 여러 음이 동시에 켜진다.
   P.keys[i] 는 8비트 마스크 — 비트 d 가 서 있으면 d도(度)가 울린다. */
for(let r=0;r<ROWS;r++){
  const deg=ROWS-1-r;
  const row=document.createElement('div');
  row.className='rrow' + (deg===0 ? ' acc' : '');
  const lab=document.createElement('small'); lab.dataset.deg=deg; lab.dataset.roll='k';
  row.appendChild(lab);
  keysEl[deg]=[];
  for(let i=0;i<STEPS;i++){
    const c=document.createElement('div');
    c.className='note'; c.dataset.on=0; c.tabIndex=0;
    c.setAttribute('role','button');
    c.setAttribute('aria-pressed','false');
    c.setAttribute('aria-label',`건반 ${deg+1}도 ${Math.floor(i/4)+1}박 ${i%4+1}번째 스텝`);
    keysEl[deg][i]=c;

    const setBit=(on,audible)=>{
      if(on) P.keys[i] |=  (1<<deg);
      else   P.keys[i] &= ~(1<<deg);
      syncKeys(); markDirty();
      if(on && audible){
        wake(); chan.keys.gain.value=lvl.keys;
        if(keysWet) keysWet.gain.value=(KENG[eng.keys]||KENG.pad).chorus||0;
        keysVoice(ctx.currentTime+0.02,
          keysOct+rootNote+knob('ksemi')+SCALES[scaleName][deg],
          spb()*0.25*(knob('kgate')/100), 0.85, eng.keys);
      }
    };
    c.addEventListener('pointerdown', e => {
      e.preventDefault(); pushUndo();
      const on = !(P.keys[i] & (1<<deg));
      setBit(on,true);
      paintVal = on ? 1 : 0; painting=true; paintKind='keys';
    });
    c.addEventListener('pointerenter', () => {
      if(!painting || paintKind!=='keys') return;
      const cur = !!(P.keys[i] & (1<<deg));
      if(!!paintVal !== cur) setBit(!!paintVal,false);
    });
    c.onkeydown=e=>{
      if(e.key===' '||e.key==='Enter'){
        e.preventDefault(); pushUndo();
        setBit(!(P.keys[i] & (1<<deg)),true);
      }
    };
    row.appendChild(c);
  }
  UI.krolls.appendChild(row);
}

/* ── 기타 롤 (단선) ── 근음 하나를 고르면 그 위에 코드가 스트럼된다 */
for(let r=0;r<ROWS;r++){
  const deg=ROWS-1-r;
  const row=document.createElement('div');
  row.className='rrow' + (deg===0 ? ' acc' : '');
  const lab=document.createElement('small'); lab.dataset.deg=deg; lab.dataset.roll='g';
  row.appendChild(lab);
  gtrEl[deg]=[];
  for(let i=0;i<STEPS;i++){
    const c=document.createElement('div');
    c.className='note'; c.dataset.on=0; c.tabIndex=0;
    c.setAttribute('role','button');
    c.setAttribute('aria-pressed','false');
    c.setAttribute('aria-label',`기타 ${deg+1}도 ${Math.floor(i/4)+1}박 ${i%4+1}번째 스텝`);
    gtrEl[deg][i]=c;

    const setNote=(v,audible)=>{
      P.gtr[i]=v;
      syncGtr(); markDirty();
      if(v>=0 && audible){
        wake(); chan.gtr.gain.value=lvl.gtr;
        guitarVoice(ctx.currentTime+0.02, v, spb()*0.25*(knob('ggate')/100), eng.gtr);
      }
    };
    c.addEventListener('pointerdown', e => {
      e.preventDefault(); pushUndo();
      const on = P.gtr[i]!==deg;
      setNote(on ? deg : -1, true);
      paintVal = on ? deg : -1; painting=true; paintKind='gtr';
    });
    c.addEventListener('pointerenter', () => {
      if(!painting || paintKind!=='gtr') return;
      if(paintVal>=0){ if(P.gtr[i]!==paintVal) setNote(paintVal,false); }
      else if(P.gtr[i]===deg) setNote(-1,false);
    });
    c.onkeydown=e=>{
      if(e.key===' '||e.key==='Enter'){
        e.preventDefault(); pushUndo();
        setNote(P.gtr[i]===deg ? -1 : deg, true);
      }
    };
    row.appendChild(c);
  }
  UI.grolls.appendChild(row);
}

/* ── 음정 셀렉트 ── */
NOTES.forEach((n,i) => UI.root.add(new Option(n,i,false,i===9)));
Object.keys(SCALES).forEach(s => UI.scale.add(new Option(s,s)));
[['24','Oct 1'],['36','Oct 2'],['48','Oct 3']].forEach(([v,l]) =>
  UI.oct.add(new Option(l,v,false,v==='24')));
[['36','Oct 2'],['48','Oct 3'],['60','Oct 4']].forEach(([v,l]) =>
  UI.koct.add(new Option(l,v,false,v==='48')));
[['24','Oct 1'],['36','Oct 2'],['48','Oct 3']].forEach(([v,l]) =>
  UI.goct.add(new Option(l,v,false,v==='36')));
UI.koct.onchange = e => { keysOct=+e.target.value; syncLabels(); markDirty(); };
UI.goct.onchange = e => { gtrOct =+e.target.value; syncLabels(); markDirty(); };
fillSel(UI.beng, ENGINES.bass, eng.bass);
srcOptions(UI.bsrc, src.bass);

/* ── 계열 필터 ──
   프리셋 자체에 cat 이 있으면 그것을, 없으면 손으로 쓴 PRESET_CAT 을 씁니다. */
const catOf = name => LIB[name].cat || PRESET_CAT[name] || 'K';
const subOf = name => PRESET_SUB[name] || '기타';
let activeCat='all', activeSub='all';

/** 선택된 계열의 하위 분기 칩을 다시 그림 */
function buildSubChips(){
  UI.subs.innerHTML='';
  if(activeCat==='all'){ UI.subs.hidden=true; return; }
  const names = LIB_NAMES.filter(x => catOf(x)===activeCat);
  /* 트리 등장 순서를 유지하려면 프리셋 정의 순서를 그대로 따른다 */
  const order=[];
  names.forEach(n => { const s=subOf(n); if(!order.includes(s)) order.push(s); });
  if(order.length<2){ UI.subs.hidden=true; return; }   // 분기가 하나뿐이면 숨김
  UI.subs.hidden=false;
  const mk=(id,label,count)=>{
    const b=document.createElement('button');
    b.className='sub'; b.dataset.sub=id; b.dataset.on = id===activeSub ? '1':'0';
    b.innerHTML=`${label}<b>${count}</b>`;
    b.onclick=()=>{ activeSub=id; applyCatFilter(); };
    UI.subs.appendChild(b);
  };
  mk('all','전체',names.length);
  order.forEach(s => mk(s, s, names.filter(n=>subOf(n)===s).length));
}

function applyCatFilter(){
  let shown=0;
  document.querySelectorAll('.chip').forEach(c => {
    const n=c.dataset.name;
    const hide = (activeCat!=='all' && catOf(n)!==activeCat)
              || (activeSub!=='all'  && subOf(n)!==activeSub);
    c.hidden = hide;
    if(!hide) shown++;
  });
  document.querySelectorAll('.cat').forEach(c => { c.dataset.on = c.dataset.cat===activeCat ? '1':'0'; });
  document.querySelectorAll('.sub').forEach(c => { c.dataset.on = c.dataset.sub===activeSub ? '1':'0'; });
  UI.libcount.textContent = `${shown}종 표시`;
}
CATS.forEach(c => {
  const n = c.id==='all' ? LIB_NAMES.length
                         : LIB_NAMES.filter(x => catOf(x)===c.id).length;
  if(!n) return;
  const b=document.createElement('button');
  b.className='cat'; b.dataset.cat=c.id; b.dataset.on = c.id==='all' ? '1':'0';
  b.innerHTML = `${c.label}<b>${n}</b>`;
  b.onclick=()=>{ activeCat=c.id; activeSub='all'; buildSubChips(); applyCatFilter(); };
  UI.cats.appendChild(b);
});

/* ── 패턴 라이브러리 칩 ──
   전체 개수는 하드코딩하지 않는다 — 프리셋이 늘 때마다 라벨을 손으로
   맞춰야 하면 잊어버리기 마련이다(실제로 208 → 357 로 늘어난 뒤에도
   라벨은 208 에 머물러 있었다). LIB_NAMES.length 를 그대로 읽는다. */
if(UI.libtotal) UI.libtotal.textContent = `${LIB_NAMES.length}종`;
LIB_NAMES.forEach(name => {
  const L=LIB[name];
  const b=document.createElement('button');
  b.className='chip' + (L.tone ? ' tone' : '') + (L.gen ? ' gen' : '');
  b.textContent=name; b.dataset.name=name; b.dataset.on=0;
  b.title = `${name} — ${L.bpm} BPM · swing ${L.swing}`
          + (L.gen ? '\n(파생 프리셋 — 규칙으로 유도, 청감 미검증)' : '');
  b.onclick=()=>{
    /* 첫 화면에서 가장 크게 보이는 것이 이 칩인데, 예전에는 눌러도 오디오가
       안 깨어났습니다 — 클릭 600ms 뒤에도 ctx.state 가 suspended 였습니다.
       사용자 제스처 안에서 깨워 두면 다음 Play 가 즉시 울립니다. */
    wake();
    pushUndo();
    TRACKS.forEach(t => {
      P.drums[t.id]=L.drums[t.id].slice();
      src[t.id]=name;
      /* 트랙이 늘어난 뒤에 만든 프리셋만 그 트랙의 엔진을 갖는다.
         없으면 현재 엔진을 그대로 둔다 — undefined 를 넣으면 보이스가 죽는다. */
      if(L.kit[t.id]) eng[t.id]=L.kit[t.id];
      probT[t.id]=L.prob ? (L.prob[t.id] ?? 1) : 1;
    });
    P.bass=L.bass.slice(); src.bass=name;
    P.keys=L.keys.slice();  src.keys=name;
    P.gtr =L.gtr.slice();   src.gtr =name;
    /* 건반·기타 음색도 프리셋을 따라간다. 예전에는 드럼과 베이스만 따라가서
       Death Metal 을 불러도 기타가 clean 그대로였다. */
    if(L.kit.keys) eng.keys=L.kit.keys;
    if(L.kit.gtr ) eng.gtr =L.kit.gtr;
    applyPresetLvl(L);
    applyTune(L.tune); applyBassCfg(L.bcfg);
    setKnob('bpm',  L.bpm);   setBpm(L.bpm);
    setKnob('swing',L.swing); setSwing(L.swing);

    TRACKS.forEach(t => { if(!L.smp || !L.smp[t.id]) smpSel[t.id]='synth'; });
    syncSmpSelects();
    if(L.smp){
      (async()=>{
        for(const [id,key] of Object.entries(L.smp)) await assignSample(id,key,true);
        syncSmpSelects();
        setStat(`${name} — 지정 샘플 ${Object.keys(L.smp).length}개 적용 시도`,'ok');
      })();
    }
    /* 장르를 골랐으니 곡을 처음부터 — 필인·선율·리프도 이 장르에 맞춰 새로 잡는다 */
    restartSong();
    syncAll(); markDirty();
  };
  UI.chips.appendChild(b);
});
/* 칩을 만들기만 하고 한 번도 걸러 보이지 않으면 #libcount 가 초기 문구
   ("…종 표시")에 계속 머문다 — 실제로 208종에서 늘어난 뒤에도 이 자리는
   숫자를 한 번도 새로 안 세고 있었다. 시작할 때 한 번 걸어 둔다. */
applyCatFilter();

/* ── 뱅크 슬롯 A~D ── */
['A','B','C','D'].forEach((n,i) => {
  const b=document.createElement('button');
  b.className='slot'; b.textContent=n; b.dataset.on = i===0 ? 1 : 0;
  b.title = `뱅크 ${n} (단축키 ${i+1})`;
  b.onclick=()=>switchBank(i);
  UI.slots.appendChild(b);
});

/* ── 상태 → 화면 동기화 ── */
function measure(){
  const a=padEl.kick[0], b=padEl.kick[1];
  if(!a||!b) return;
  headStride=b.offsetLeft-a.offsetLeft;
  UI.head.style.left  = a.offsetLeft+'px';
  UI.head.style.width = a.offsetWidth+'px';
  /* 재생 헤드는 드럼 맨 위부터 마지막 롤(기타) 바닥까지 덮어야 한다 */
  UI.head.style.height= (UI.grolls.getBoundingClientRect().bottom
                        - UI.drums.getBoundingClientRect().top + 8) + 'px';
}
function syncDrums(){
  for(const tr of TRACKS)
    for(let i=0;i<STEPS;i++){
      const v=P.drums[tr.id][i], el=padEl[tr.id][i];
      el.dataset.v=v;
      el.setAttribute('aria-pressed', v ? 'true' : 'false');
    }
}
function syncBass(){
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const on=(P.bass[i]===d);
      noteEl[d][i].dataset.on = on ? 1 : 0;
      noteEl[d][i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
}
function syncKeys(){
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const on=!!(P.keys[i] & (1<<d));
      keysEl[d][i].dataset.on = on ? 1 : 0;
      keysEl[d][i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
}
function syncGtr(){
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const on=(P.gtr[i]===d);
      gtrEl[d][i].dataset.on = on ? 1 : 0;
      gtrEl[d][i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
}
function syncLabels(){
  /* 롤마다 기준 옥타브와 반음 오프셋이 다르므로 dataset.roll 로 갈라준다 */
  document.querySelectorAll('.rrow small').forEach(s => {
    const k=s.dataset.roll;
    const base = k==='k' ? keysOct + knob('ksemi')
               : k==='g' ? gtrOct  + knob('gsemi')
               :           baseOct + knob('bsemi');
    const m = base + rootNote + SCALES[scaleName][+s.dataset.deg];
    s.textContent = NOTES[((m%12)+12)%12] + (Math.floor(m/12)-1);
  });
  const m0 = baseOct + rootNote + knob('bsemi');
  const hz = 440*Math.pow(2,(m0-69)/12);
  UI.keyinfo.textContent =
    `근음 ${NOTES[((m0%12)+12)%12]}${Math.floor(m0/12)-1} · ${hz.toFixed(1)} Hz · ${scaleName}`;
}
function syncStrips(){
  document.querySelectorAll('#drums .row').forEach((row,i) => {
    const id=TRACKS[i].id;
    row.querySelector('.eng').value=eng[id];
    row.querySelector('.src').value=src[id];
  });
  UI.beng.value=eng.bass; UI.bsrc.value=src.bass;
  UI.keng.value=eng.keys; UI.geng.value=eng.gtr;
  if(UI.keng2) UI.keng2.value=eng.keys2;
  if(UI.geng2) UI.geng2.value=eng.gtr2;
  UI.koct.value=keysOct;  UI.goct.value=gtrOct;
}
/** 프리셋이 정한 악기별 볼륨을 적용.
    장르마다 주인공이 다르다 — 메탈은 기타, 트랩은 808, 라틴은 타악기.
    하위분기가 lvl 을 안 정했으면 지금 볼륨을 그대로 둔다. */
function applyPresetLvl(L){
  if(!L.lvl) return;
  for(const [id,v] of Object.entries(L.lvl)){
    if(lvl[id]==null) continue;
    lvl[id]=v;
    if(chan[id]) chan[id].gain.value=v;
  }
  /* syncAll() 은 볼륨 슬라이더를 안 건드린다 — 따로 맞춰줘야 화면과 소리가 일치한다 */
  syncTrackUI();
}

/** 모든 트랙이 같은 프리셋에서 왔을 때만 그 칩을 켜둠 */
function markChips(){
  const all=[...TRACK_IDS,'bass'];
  document.querySelectorAll('.chip').forEach(c => {
    c.dataset.on = all.every(id => src[id]===c.dataset.name) ? 1 : 0;
  });
}
/** 뱅크 슬롯에 내용물 유무를 표시 — 빈 슬롯인지 한눈에 보이게 */
function syncSlots(){
  document.querySelectorAll('.slot').forEach((s,i) => {
    const filled = bankFilled(banks[i]);
    s.dataset.filled = filled ? '1' : '0';
    s.title = `뱅크 ${'ABCD'[i]} (단축키 ${i+1}) — ${filled?'패턴 있음':'비어 있음'}`;
  });
}
function syncAll(){ syncDrums(); syncBass(); syncKeys(); syncGtr();
                    syncLabels(); syncStrips(); markChips(); syncSlots(); }

/** 음색을 바꿨을 때 한 번 들려주기 */
function audition(id){
  wake();
  chan[id].gain.value=lvl[id];
  const t=ctx.currentTime+0.02;
  if(id==='bass') bassVoice(t, 0, spb()*0.25*(knob('gate')/100), eng.bass);
  else if(id==='keys'){
    if(keysWet) keysWet.gain.value=(KENG[eng.keys]||KENG.pad).chorus||0;
    /* 화음 트랙이라 단음으로는 음색이 잘 안 드러난다 — 1·3·5도를 같이 울린다 */
    [0,2,4].forEach(d => keysVoice(t,
      keysOct+rootNote+knob('ksemi')+SCALES[scaleName][d],
      spb()*0.5, 0.85, eng.keys));
  }
  else if(id==='gtr') guitarVoice(t, 0, spb()*0.5, eng.gtr);
  else fireTrack(id,t,1,eng[id]);
}

/** 트랙 스트립의 뮤트·볼륨·뱅크 표시를 상태에 맞춤 (불러오기 후 필요) */
function syncTrackUI(){
  document.querySelectorAll('#drums .row').forEach((row,i) => {
    const id=TRACKS[i].id;
    row.querySelector('.mute').dataset.off = mute[id] ? '1' : '0';
    row.querySelector('.top input').value = Math.round(lvl[id]*100);
  });
  UI.bmute.dataset.off = mute.bass ? '1' : '0';
  UI.bvol.value = Math.round(lvl.bass*100);
  UI.kmute.dataset.off = mute.keys ? '1' : '0';
  UI.kvol.value = Math.round(lvl.keys*100);
  UI.gmute.dataset.off = mute.gtr ? '1' : '0';
  if(UI.kmute2){ UI.kmute2.dataset.off = mute.keys2 ? '1' : '0';
                 UI.kvol2.value = Math.round(lvl.keys2*100); }
  if(UI.gmute2){ UI.gmute2.dataset.off = mute.gtr2 ? '1' : '0';
                 UI.gvol2.value = Math.round(lvl.gtr2*100); }
  UI.gvol.value = Math.round(lvl.gtr*100);
  document.querySelectorAll('.slot').forEach((s,j) => { s.dataset.on = j===bank ? 1 : 0; });
}

/** 뱅크 전환 */
function switchBank(i){
  if(i===bank) return;
  pushUndo();
  bank=i; P=banks[i];
  document.querySelectorAll('.slot').forEach((s,j) => { s.dataset.on = j===i ? 1 : 0; });
  syncAll(); markDirty();
}
