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

  /* ── 한가할 때 미리 그래프를 지어 둔다 ──
     boot() 은 노드 495개를 만들고 노이즈·IR 65만 샘플을 구우면서
     메인 스레드를 **133~293ms(중앙값 162)** 막습니다. 그 시간이 첫 클릭에
     붙으면 버튼이 눌린 티도 안 나서, 사용자가 자연스럽게 한 번 더 누르고
     그 두 번째 클릭이 playing?stop():start() 에 걸려 **재생이 죽습니다.**

     첫 페인트는 224ms 에 끝나고 사용자가 Play 를 찾는 데 1~2초가 걸리므로,
     그 빈 시간에 지어 두면 아무 대가 없이 첫 클릭이 60ms 로 내려갑니다.
     (지연 생성은 일부러 안 합니다 — 재생 중에 메인 스레드가 멈추면
      그건 곧 오디오 글리치이고, 악기에서는 200ms 한 번보다 훨씬 나쁩니다)

     ⚠ 여기서는 **짓기만** 합니다. 소리를 내려면 사용자 제스처가 필요하고,
     그건 wake() 가 합니다. 제스처 밖에서 AudioContext 생성을 막는 브라우저가
     있으므로 실패해도 조용히 넘어갑니다 — wake() 가 그때 다시 짓습니다. */
  const prewarm = () => { try{ boot(); }catch(e){ /* 제스처 필요 — wake() 에 맡긴다 */ } };
  if(typeof requestIdleCallback === 'function') requestIdleCallback(prewarm, {timeout:2500});
  else setTimeout(prewarm, 700);
})();
