/* §3 DOM 참조
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §3  DOM 참조 ══════════════════════════════════════════
   id 가 붙은 정적 요소를 전부 UI 객체로 모읍니다.
   예전 판은 브라우저의 암묵 전역(window.bpm 등)에 의존했는데,
   그 탓에 #duck 과 duck() 함수가 충돌해 duck_ 같은 이름이 생겼습니다.
   (파일 분리로 IIFE 를 걷어낸 뒤에는 duckSidechain 으로 개명해 두었습니다.)
   ═════════════════════════════════════════════════════════ */

const UI = {};
document.querySelectorAll('[id]').forEach(el => { UI[el.id] = el; });

const METER_BAR = {
  out : document.querySelector('#mOut i'),
  gr  : document.querySelector('#mGr i'),
  bass: document.querySelector('#mBas i'),
};

/** 노브 값과 옆의 숫자 표시를 함께 세팅 */
function setKnob(id, v){
  UI[id].value = v;
  if(UI[id+'v']) UI[id+'v'].textContent = v;
}
/** 노브의 현재 값 (숫자) */
const knob = id => +UI[id].value;
