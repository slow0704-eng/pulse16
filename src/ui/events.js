/* §13 이벤트 바인딩
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §13  이벤트 바인딩 ════════════════════════════════════ */

/* ── 슬라이더 ──
   전부 "값 표시 갱신 + 부수효과" 형태라 표로 묶습니다.
   표시용 <span>(id+'v')이 있으면 자동으로 갱신됩니다. */
/** 노브 값 → 실제 스윙 비율(%).
    fbLoop 의 shift = 16분 × (k/100) × 0.66 이므로
    8분쌍 안에서의 위치 = (1 + 0.66k/100) / 2 → 50 + 0.33k.
    노브 50 이 2:1 셋잇단(≈67%) = 완전 셔플. */
const swingPct = k => Math.round(50 + k*0.33);
function updateSwingRead(){
  const k = knob('swing');
  UI.swingpct.textContent = `${swingPct(k)}% ${k>=50 ? '셔플' : '스윙'}`;
}

const SLIDER_FX = {
  bpm  : v => setBpm(v),
  swing: v => { setSwing(v); updateSwingRead(); },
  vol  : v => { if(masterGain) masterGain.gain.value = v/100*0.9; },
  ktune: () => audition('kick'),
  bsemi: () => syncLabels(),
  ksemi: () => syncLabels(),
  gsemi: () => syncLabels(),
  sub  : applyLow,
  harm : applyLow,
  trim : applyTrim,
  grat : applyGlueAmt,
  rev  : applyRev,
  rwid : applyRevWidth,
  drv  : applyDrive,
  width: applyWidth,
  lthr : v => { if(limComp) limComp.threshold.value = v; },
  lrel : v => { if(limComp) limComp.release.value   = v/1000; },
  gatk : v => { if(glueComp) glueComp.attack.value  = v/1000; },
  lvol : v => { if(chan.loop) chan.loop.gain.value  = v/100; },
  lrate: v => Object.values(loopPlayer).forEach(p => { try{ p.playbackRate=v/100; }catch(err){} }),
  bvol : v => { lvl.bass = v/100; },
};
const SLIDERS = [
  'bpm','swing','chance','vol',                                   // 트랜스포트
  'ktune','stune','ttune','htune','bsemi',                        // 튠
  'gate','bglide','bmix','bdrv','xover','btone','sub','harm','punch', // 베이스
  'ksemi','kgate','gsemi','ggate',                                // 건반·기타
  'trim','lthr','lrel','gatk','grat',                             // 마스터
  'rev','rwid','duck','drv','hum','width',                        // 스튜디오
  'ktrim','lvol','lrate','bvol',                                  // 샘플·루프·베이스 볼륨
];
SLIDERS.forEach(id => {
  const out=UI[id+'v'], fx=SLIDER_FX[id];
  UI[id].oninput = e => {
    const v=e.target.value;
    if(out) out.textContent=v;
    if(fx) fx(+v);
    markDirty();
  };
});

/* ── 재생 · 단축키 ── */
UI.play.onclick = () => playing ? stop() : start();
addEventListener('keydown', e => {
  const typing = /INPUT|SELECT|TEXTAREA/.test(e.target.tagName);

  if(e.key==='Escape'){ UI.help.classList.remove('on'); return; }
  if(e.key==='?'){ e.preventDefault(); UI.help.classList.toggle('on'); return; }
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='z'){
    e.preventDefault();
    e.shiftKey ? doRedo() : doUndo();
    return;
  }
  if(typing) return;
  if(e.code==='Space' && !/BUTTON/.test(e.target.tagName)){
    e.preventDefault();
    playing ? stop() : start();
    return;
  }
  if(/^[1-4]$/.test(e.key)){ e.preventDefault(); switchBank(+e.key-1); }
});
addEventListener('resize', measure);

/* ── FX 패널 접기 ── */
document.querySelectorAll('.pbtn').forEach(b => {
  b.onclick = () => {
    setPanel(b.dataset.panel, b.dataset.on!=='1');
    measure(); markDirty();
  };
});

/* ── 실행취소 · 저장 · 도움말 ── */
UI.undo.onclick = doUndo;
UI.redo.onclick = doRedo;
UI.helpbtn.onclick = () => UI.help.classList.add('on');
UI.helpclose.onclick = () => UI.help.classList.remove('on');
UI.help.onclick = e => { if(e.target===UI.help) UI.help.classList.remove('on'); };
UI.wipe.onclick = () => {
  try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
  UI.savestat.textContent='저장 지움 — 새로고침하면 공장 초기 상태';
};

/* ── 샘플 뱅크 ── */
UI.kit.onchange = e => applyWholeKit(e.target.value);
UI.preload.onclick = preloadAll;
UI.allsyn.onclick = () => {
  TRACK_IDS.forEach(id => { smpSel[id]='synth'; });
  UI.kit.value='synth';
  syncSmpSelects(); setStat('전부 합성 엔진');
};
UI.cload.onclick = loadCustom;

/* ── 킷 셔플 ── */
UI.shuf.onclick = () => {
  shufOn = UI.shuf.dataset.on!=='1';
  UI.shuf.dataset.on = shufOn?'1':'0';
  UI.shuf.textContent = shufOn?'켜짐':'꺼짐';
  setStat(shufOn ? `킷 셔플 — ${shufEvery}루프마다 음색이 바뀝니다` : '킷 셔플 꺼짐');
  markDirty();
};
UI.shufn.onchange = e => { shufEvery=+e.target.value; markDirty(); };

UI.pshuf.onclick = () => {
  patOn = UI.pshuf.dataset.on!=='1';
  UI.pshuf.dataset.on = patOn?'1':'0';
  UI.pshuf.textContent = patOn?'켜짐':'꺼짐';
  if(patOn){
    if(patMode==='genre'){
      /* 장르 모드는 현재 뱅크를 덮어쓰므로 되돌림점을 남긴다 */
      pushUndo();
      setStat(`패턴 셔플 — ${patEvery}루프마다 ${shufflePool().length}개 중에서 바뀝니다`);
    }else{
      const f=filledBanks();
      setStat(f.length<2
        ? '뱅크 셔플 — 내용이 있는 뱅크가 하나뿐입니다. A~D 에 패턴을 채우세요'
        : `뱅크 셔플 — ${patEvery}루프마다 ${f.map(i=>'ABCD'[i]).join('→')} 순환`,
        f.length<2 ? 'err' : '');
    }
  }else{
    setStat(patMode==='genre' ? '패턴 셔플 꺼짐 — Ctrl+Z 로 원래 패턴 복귀'
                              : '뱅크 셔플 꺼짐');
  }
  markDirty();
};
UI.pshufn.onchange   = e => { patEvery=+e.target.value; markDirty(); };
UI.pshufbpm.onchange = e => { patBpm=e.target.value; markDirty(); };
UI.pshufmode.onchange= e => {
  patMode=e.target.value;
  /* 장르 모드에서만 템포 옵션이 의미가 있다 — 뱅크는 템포를 바꾸지 않는다 */
  UI.pshufbpm.disabled = patMode!=='genre';
  markDirty();
};
UI.pshufbpm.disabled = true;   // 기본이 뱅크 모드

/* ── 필인 ──
   모드는 셋 중 하나다.
     genre  — 지금 프리셋의 장르에 어울리는 것 중에서 무작위
     all    — 종류 전체에서 무작위
     <이름> — 그 필인으로 고정 */
{
  const fill=(sel,size)=>{
    const add=(v,t)=>sel.add(new Option(t,v));
    add('genre','장르 맞춤');
    add('all','전체 무작위');
    FILL_NAMES.filter(n=>FILLS[n].size===size).forEach(n => add(n, FILLS[n].label));
    sel.value='genre';
  };
  fill(UI.fillmode,'S');
  fill(UI.fillmodeL,'L');
}
UI.fill.onclick = () => {
  fillOn = UI.fill.dataset.on!=='1';
  UI.fill.dataset.on = fillOn?'1':'0';
  UI.fill.textContent = fillOn?'켜짐':'꺼짐';
  if(!fillOn) fillNow=null;
  syncVariation();
  setStat(fillOn
    ? `필인 — 작은 ${fillEvery||'—'}루프 · 큰 ${fillEveryL||'—'}루프`
    : '필인 꺼짐');
  markDirty();
};
UI.filln.onchange    = e => { fillEvery =+e.target.value; syncVariation(); markDirty(); };
UI.fillnL.onchange   = e => { fillEveryL=+e.target.value; syncVariation(); markDirty(); };
UI.fillmodeL.onchange= e => { fillModeL = e.target.value; markDirty(); };

/* ── 16마디 선율 ──
   건반 트랙이 1마디 반복 대신 16마디를 한 바퀴 돕니다.
   P.keys 를 덮어쓰지 않으므로 끄면 원래 패턴이 그대로 돌아옵니다. */
{
  const add=(v,t)=>UI.melmode.add(new Option(t,v));
  add('genre','장르 맞춤');
  add('all','전체 무작위');
  MELODY_NAMES.forEach(n => add(n, MELODY[n].label));
  UI.melmode.value='genre';
}
UI.mel.onclick = () => {
  melOn = UI.mel.dataset.on!=='1';
  UI.mel.dataset.on = melOn?'1':'0';
  UI.mel.textContent = melOn?'켜짐':'꺼짐';
  melNow=null; riffNow=null; blineNow=null; melBar=0;
  melNow2=null; melNowB=null; riffNowB=null;   // 2번 트랙도 같이 비운다
  syncVariation();
  if(melOn && melMode==='genre'){
    const pool=melodyPoolFor(src.keys);
    setStat(pool.length
      ? `16마디 선율 — ${pool.length}종 중에서 (16마디마다 새로 뽑음)`
      : '이 장르는 건반을 안 씁니다 — 선율 종류를 직접 고르세요','' );
  }else{
    setStat(melOn ? '16마디 선율 켜짐' : '16마디 선율 꺼짐 — 원래 건반 패턴으로');
  }
  markDirty();
};
{
  const add=(v,t)=>UI.mellayereng.add(new Option(t,v));
  add('same','같은 음색');
  Object.entries(ENGINES.keys).forEach(([k,t]) => add(k,t));
  UI.mellayereng.value='same';
}
UI.mellayer.onchange = e => {
  layerMode=e.target.value; melNow2=null;
  UI.mellayereng.disabled = layerMode==='off';
  setStat(layerMode==='off' ? '겹침 없음'
    : `겹침 — ${UI.mellayer.selectedOptions[0].textContent}` +
      (layerEng==='same' ? ' (같은 음색)' : ` · ${ENGINES.keys[layerEng]||layerEng}`));
  markDirty();
};
UI.mellayereng.onchange = e => { layerEng=e.target.value; markDirty(); };
UI.mellayereng.disabled = true;

/* 선율 길이 — 마디가 아니라 **루프 개수**입니다.
   바꾸면 지금 걸린 선율을 비워 다음 루프에서 새 길이로 다시 뽑게 합니다. */
UI.mellen.onchange = e => {
  melLenPref=e.target.value;
  melNow=null; riffNow=null; blineNow=null; melBar=0;
  melNow2=null; melNowB=null; riffNowB=null;
  syncVariation(); markDirty();
};
UI.melmode.onchange = e => {
  melMode=e.target.value; melNow=null; riffNow=null; blineNow=null; melBar=0;
  melNow2=null; melNowB=null; riffNowB=null;   // 2번 트랙도 같이 비운다
  syncVariation(); markDirty();
};
UI.fillmode.onchange = e => {
  fillMode=e.target.value;
  const label = fillMode==='genre' ? `장르 맞춤 — ${fillPoolFor(src.kick,'S').length}종 중에서`
              : fillMode==='all'   ? '전체 작은 필인 중에서'
              : `${FILLS[fillMode].label} 고정`;
  setStat('작은 필인 ' + label);
  markDirty();
};

/* ── 스튜디오 · 음정 셀렉트 ── */
UI.space.onchange = e => { if(convolver) convolver.buffer=IR[e.target.value]; markDirty(); };
UI.root.onchange  = e => { rootNote=+e.target.value; syncLabels(); markDirty(); };
UI.scale.onchange = e => { scaleName=e.target.value; syncLabels(); markDirty(); };
UI.oct.onchange   = e => { baseOct=+e.target.value; syncLabels(); markDirty(); };

/* ── 베이스 스트립 ── */
UI.beng.onchange = e => {
  eng.bass=e.target.value;
  if(eng.bass==='piano' || eng.bass==='casio'){
    loadSampler(eng.bass).then(ok => { if(ok) audition('bass'); else syncStrips(); });
  }else{
    audition('bass');
  }
};
UI.bsrc.onchange = e => {
  pushUndo();
  const n=e.target.value;
  if(n==='__empty') P.bass=new Array(STEPS).fill(-1);
  else { P.bass=LIB[n].bass.slice(); applyBassCfg(LIB[n].bcfg); }
  src.bass=n;
  syncBass(); syncLabels(); syncStrips(); markChips(); markDirty();
};
UI.bmute.onclick = e => {
  mute.bass=!mute.bass;
  e.currentTarget.dataset.off = mute.bass ? '1' : '0';
  markDirty();
};

/* ── 건반·기타 스트립 ──
   구조가 같아서 한 번에 묶어 건다. clear 는 트랙별로 빈 값이 달라서
   (건반은 0 마스크, 기타는 -1) empty 로 넘겨받는다. */
[['keys','k',0],['gtr','g',-1]].forEach(([id,pre,empty]) => {
  UI[pre+'mute'].onclick = e => {
    mute[id]=!mute[id];
    e.currentTarget.dataset.off = mute[id] ? '1' : '0';
    markDirty();
  };
  UI[pre+'vol'].oninput = e => {
    lvl[id]=+e.target.value/100;
    if(chan[id]) chan[id].gain.value=lvl[id];
    markDirty();
  };
  UI[pre+'eng'].onchange = e => { eng[id]=e.target.value; audition(id); markDirty(); };
  UI[pre+'clr'].onclick  = () => {
    pushUndo();
    P[id]=new Array(STEPS).fill(empty);
    syncAll(); markDirty();
  };
});
fillSel(UI.keng, ENGINES.keys, eng.keys);
fillSel(UI.geng, ENGINES.gtr , eng.gtr );

/* ── 2번 트랙 ──
   1번과 따로 도는 별개 트랙입니다. 자기 음색·볼륨·음소거를 갖습니다.
   패턴 롤은 아직 없고 16마디 선율 모드가 라이브러리에서 채웁니다. */
[['keys2','k'],['gtr2','g']].forEach(([id,pre]) => {
  const eSel=UI[pre+'eng2'], vEl=UI[pre+'vol2'], mEl=UI[pre+'mute2'];
  fillSel(eSel, ENGINES[id==='keys2'?'keys':'gtr'], eng[id]);
  eSel.onchange = e => { eng[id]=e.target.value; audition2(id); markDirty(); };
  vEl.oninput   = e => { lvl[id]=+e.target.value/100;
                         if(chan[id]) chan[id].gain.value=lvl[id]; markDirty(); };
  mEl.onclick   = e => { mute[id]=!mute[id];
                         e.currentTarget.dataset.off = mute[id] ? '1' : '0'; markDirty(); };
});
/** 2번 트랙 음색을 바꿨을 때 한 번 들려주기 */
function audition2(id){
  wake();
  if(!chan[id]) return;
  chan[id].gain.value=lvl[id];
  const t=ctx.currentTime+0.02;
  if(id==='keys2')
    keysVoice(t, keysOct+rootNote+knob('ksemi'), spb()*0.25*(knob('kgate')/100), 0.85, eng.keys2);
  else
    guitarVoice2(t, 0, spb()*0.25*(knob('ggate')/100), eng.gtr2);
}

/* ── 패턴 편집 ── */
UI.clear.onclick = () => {
  pushUndo();
  banks[bank]=blank(); P=banks[bank];
  Object.keys(src).forEach(k => { src[k]='__empty'; });
  TRACK_IDS.forEach(id => { probT[id]=1; });
  syncAll(); markDirty();
};
UI.rand.onclick = () => {   // 트랙마다 서로 다른 프리셋에서 무작위로 가져옴
  pushUndo();
  const pick=()=>LIB_NAMES[Math.floor(Math.random()*LIB_NAMES.length)];
  [...TRACK_IDS,'bass','keys','gtr'].forEach(id => {
    const n=pick(); src[id]=n;
    if(id==='bass'){ P.bass=LIB[n].bass.slice(); applyBassCfg(LIB[n].bcfg); }
    else if(id==='keys'){ P.keys=LIB[n].keys.slice(); if(LIB[n].kit.keys) eng.keys=LIB[n].kit.keys; }
    else if(id==='gtr' ){ P.gtr =LIB[n].gtr.slice();  if(LIB[n].kit.gtr ) eng.gtr =LIB[n].kit.gtr;  }
    else{
      P.drums[id]=LIB[n].drums[id].slice();
      if(LIB[n].kit[id]) eng[id]=LIB[n].kit[id];     // 없으면 현재 엔진 유지
      probT[id]=LIB[n].prob ? (LIB[n].prob[id] ?? 1) : 1;
    }
  });
  syncAll(); markDirty();
};
