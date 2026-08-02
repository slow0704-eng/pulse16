/* §14 초기화 — 마지막에 로드한다
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §14  초기화 ══════════════════════════════════════════ */

UI.stat.textContent = HAS_TONE ? 'Tone.js 준비됨' : '내장 스케줄러로 실행';
if(!HAS_TONE){
  UI.kit.disabled=true; UI.preload.disabled=true; UI.cload.disabled=true;
  setStat('Tone.js 없음 — 샘플 기능 사용 불가','err');
}

(function init(){
  /* 저장된 상태가 있으면 그것을, 없으면 Boom Bap 을 올림 */
  const restored = loadState();
  if(!restored){
    const L=LIB['Boom Bap'];
    TRACKS.forEach(t => { P.drums[t.id]=L.drums[t.id].slice(); });
    P.bass=L.bass.slice();
    P.keys=L.keys.slice(); P.gtr=L.gtr.slice();
    applyTune(L.tune); applyBassCfg(L.bcfg);
    UI.savestat.textContent='자동 저장 준비됨';
  }else{
    applyLow();
    UI.savestat.textContent='이전 상태를 복원했습니다';
  }
  syncAll(); syncTrackUI(); syncUndoButtons(); updateSwingRead();
  requestAnimationFrame(measure);
})();
