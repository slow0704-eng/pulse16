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

  /* ── 첫 조작에 미리 그래프를 지어 둔다 ──
     boot() 은 노드 495개를 만들고 노이즈·IR 65만 샘플을 구우면서
     메인 스레드를 **133~293ms(중앙값 162)** 막습니다. 그 시간이 Play 첫 클릭에
     붙으면 버튼이 눌린 티도 안 나서, 사용자가 자연스럽게 한 번 더 누르고
     그 두 번째 클릭이 playing?stop():start() 에 걸려 **재생이 죽습니다.**

     그래서 Play 보다 먼저 오는 **아무 조작**(칩을 고르든 노브를 만지든)에
     미리 지어 둡니다. 그때는 이미 화면을 보고 움직이는 중이라 200ms 가 안 느껴집니다.

     ⚠ requestIdleCallback 으로 해 봤더니 «AudioContext was not allowed to start»
        경고가 100개씩 쏟아졌습니다 — 사용자 제스처 밖에서 컨텍스트를 만들면
        브라우저가 매 조작마다 경고합니다. 제스처 안에서 하면 이득은 같고 경고는 없습니다.

     지연 생성(필요할 때 굽기)은 일부러 안 합니다 — 재생 중 메인 스레드 정지는
     곧 오디오 글리치이고, 악기에서는 200ms 한 번보다 훨씬 나쁩니다. */
  const prewarm = () => {
    document.removeEventListener('pointerdown', prewarm, true);
    document.removeEventListener('keydown', prewarm, true);
    try{ boot(); }catch(e){ /* 실패하면 wake() 가 그때 짓는다 */ }
  };
  document.addEventListener('pointerdown', prewarm, true);
  document.addEventListener('keydown', prewarm, true);
})();
