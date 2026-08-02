/* §12.5 편집 보조 — 실행취소 · 자동 저장 · 패널 · 드래그
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §12.5  편집 보조 — 실행취소 · 자동 저장 · 패널 · 드래그 ═══ */

/* ── 실행취소 / 다시하기 ──
   패턴을 바꾸는 동작 직전에 pushUndo() 를 부릅니다.
   스냅샷 대상은 뱅크 4개 + 트랙별 출처·엔진·확률. */
const undoStack=[], redoStack=[], UNDO_MAX=60;

/* 저장본·스냅샷은 만들 당시의 트랙만 갖고 있다.
   나중에 트랙이 늘면(perc) 그 자리가 undefined 로 비어 시퀀서가 죽으므로
   복원할 때마다 빠진 트랙을 빈 패턴으로 메운다. */
function fillTracks(drums){
  const out = drums || {};
  TRACK_IDS.forEach(id => { if(!Array.isArray(out[id])) out[id]=new Array(STEPS).fill(0); });
  return out;
}

function snapshot(){
  return JSON.stringify({
    banks: banks.map(b => ({drums:b.drums, bass:b.bass, keys:b.keys, gtr:b.gtr,
                            keys2:b.keys2, gtr2:b.gtr2})),
    bank, src, eng, probT,
  });
}
function restoreSnap(sn){
  const o = JSON.parse(sn);
  o.banks.forEach((b,i) => {
    banks[i].drums=fillTracks(b.drums); banks[i].bass=b.bass;
    /* 구버전 스냅샷에는 keys·gtr 이 없다 — 빈 배열로 메운다 */
    banks[i].keys=b.keys || new Array(STEPS).fill(0);
    banks[i].gtr =b.gtr  || new Array(STEPS).fill(-1);
    banks[i].keys2=b.keys2 || new Array(STEPS).fill(0);
    banks[i].gtr2 =b.gtr2  || new Array(STEPS).fill(-1);
  });
  bank = o.bank; P = banks[bank];
  Object.assign(src,o.src); Object.assign(eng,o.eng); Object.assign(probT,o.probT);
  syncAll(); syncTrackUI();
}
function syncUndoButtons(){
  UI.undo.disabled = undoStack.length===0;
  UI.redo.disabled = redoStack.length===0;
  UI.undo.title = `실행취소 (Ctrl+Z) — ${undoStack.length}단계`;
  UI.redo.title = `다시하기 (Ctrl+Shift+Z) — ${redoStack.length}단계`;
}
function pushUndo(){
  undoStack.push(snapshot());
  if(undoStack.length>UNDO_MAX) undoStack.shift();
  redoStack.length=0;
  syncUndoButtons();
}
function doUndo(){
  if(!undoStack.length) return;
  redoStack.push(snapshot());
  restoreSnap(undoStack.pop());
  syncUndoButtons(); markDirty();
}
function doRedo(){
  if(!redoStack.length) return;
  undoStack.push(snapshot());
  restoreSnap(redoStack.pop());
  syncUndoButtons(); markDirty();
}

/* ── 자동 저장 ──
   샘플 배정(smpSel)은 네트워크에 의존하므로 저장하지 않습니다. */
const SAVE_KEY='pulse16.mk16.v1';
let saveTimer=null;

function markDirty(){
  clearTimeout(saveTimer);
  UI.savestat.textContent='저장 중…';
  saveTimer=setTimeout(saveState,400);
}
function saveState(){
  try{
    const knobs={}; SLIDERS.forEach(id => { knobs[id]=UI[id].value; });
    const sels={};  ['kit','space','root','scale','oct','beng','bsrc',
                     'keng','geng','koct','goct','keng2','geng2',
                     'shufn','pshufn','pshufbpm','pshufmode','filln','fillmode','fillnL','fillmodeL','melmode','mellen','mellayer','mellayereng'].forEach(id => { sels[id]=UI[id].value; });
    const panels={}; document.querySelectorAll('.pbtn').forEach(b => { panels[b.dataset.panel]=b.dataset.on; });
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v:1, banks:banks.map(b=>({drums:b.drums,bass:b.bass,keys:b.keys,gtr:b.gtr,
                           keys2:b.keys2,gtr2:b.gtr2})), bank,
      src, eng, probT, mute, lvl, rootNote, scaleName, baseOct,
      keysOct, gtrOct, shufOn, knobs, sels, panels,
    }));
    UI.savestat.textContent='자동 저장됨';
  }catch(e){
    UI.savestat.textContent='저장 실패 — 브라우저 저장 공간 확인';
  }
}
function loadState(){
  let o;
  try{ o=JSON.parse(localStorage.getItem(SAVE_KEY)||'null'); }catch(e){ return false; }
  if(!o || o.v!==1) return false;
  try{
    o.banks.forEach((b,i) => {
      if(!banks[i]) return;
      banks[i].drums=fillTracks(b.drums); banks[i].bass=b.bass;
      /* 건반·기타가 없던 시절의 저장본과도 호환 */
      banks[i].keys=b.keys || new Array(STEPS).fill(0);
      banks[i].gtr =b.gtr  || new Array(STEPS).fill(-1);
      banks[i].keys2=b.keys2 || new Array(STEPS).fill(0);
      banks[i].gtr2 =b.gtr2  || new Array(STEPS).fill(-1);
    });
    bank=o.bank||0; P=banks[bank];
    Object.assign(src,o.src); Object.assign(eng,o.eng); Object.assign(probT,o.probT);
    Object.assign(mute,o.mute); Object.assign(lvl,o.lvl);
    rootNote=o.rootNote; scaleName=o.scaleName; baseOct=o.baseOct;
    if(o.keysOct!=null) keysOct=o.keysOct;
    if(o.gtrOct !=null) gtrOct =o.gtrOct;
    if(o.shufOn){
      shufOn=true;
      UI.shuf.dataset.on='1'; UI.shuf.textContent='켜짐';
    }
    shufEvery=+(o.sels && o.sels.shufn) || 4;
    patEvery =+(o.sels && o.sels.pshufn) || 4;
    patBpm   =(o.sels && o.sels.pshufbpm) || 'keep';
    patMode  =(o.sels && o.sels.pshufmode) || 'seq';
    fillEvery=+(o.sels && o.sels.filln) || 4;
    fillMode =(o.sels && o.sels.fillmode) || 'genre';
    fillEveryL=(o.sels && o.sels.fillnL!=null) ? +o.sels.fillnL : 16;
    fillModeL=(o.sels && o.sels.fillmodeL) || 'genre';
    melMode  =(o.sels && o.sels.melmode)  || 'genre';
    melLenPref=(o.sels && o.sels.mellen) || 'auto';
    layerMode=(o.sels && o.sels.mellayer) || 'off';
    layerEng =(o.sels && o.sels.mellayereng) || 'same';
    UI.mellayereng.disabled = layerMode==='off';
    UI.pshufbpm.disabled = patMode!=='genre';
    /* 패턴 셔플은 복원하지 않는다 — 켜진 채로 새로 열면
       사용자가 손대기도 전에 패턴이 바뀌어 버린다 */
    for(const [id,v] of Object.entries(o.knobs||{})){
      if(!UI[id]) continue;
      UI[id].value=v;
      if(UI[id+'v']) UI[id+'v'].textContent=v;
    }
    for(const [id,v] of Object.entries(o.sels||{})) if(UI[id]) UI[id].value=v;
    for(const [k,on] of Object.entries(o.panels||{})) setPanel(k, on==='1');
    return true;
  }catch(e){ return false; }
}

/* ── FX 패널 접기 ── */
const PANEL_SEL={tun:'.fx.tun', low:'.fx.low', key:'.fx.key', mst:'.fx.mst', std:'.fx.std'};
function setPanel(key,on){
  const el=document.querySelector(PANEL_SEL[key]);
  const btn=document.querySelector(`.pbtn[data-panel="${key}"]`);
  if(!el||!btn) return;
  el.hidden=!on;
  btn.dataset.on = on ? '1' : '0';
  btn.querySelector('.car').textContent = on ? '▾' : '▸';
}

/* ── 드래그 페인트 ──
   패드를 누른 채 끌면 첫 칸이 된 값으로 연속 입력합니다. */
let painting=false, paintKind=null, paintVal=0;
function endPaint(){ painting=false; paintKind=null; }
addEventListener('pointerup', endPaint);
addEventListener('pointercancel', endPaint);
