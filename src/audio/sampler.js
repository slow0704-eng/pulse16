/* §7 샘플 로딩
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §7  샘플 로딩 ═════════════════════════════════════════ */

function withTimeout(p,ms){
  return Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
}
async function loadBuf(url){
  if(bufCache.has(url)) return bufCache.get(url);
  const b = await withTimeout(Tone.ToneAudioBuffer.load(url), 12000);
  bufCache.set(url,b);
  return b;
}
function blocked(){
  showWarn('외부 샘플(tonejs.github.io)에 접근하지 못했습니다. 이 미리보기 창이 외부 오디오 요청을 '+
    '차단했을 가능성이 큽니다. 파일을 내려받아 브라우저에서 직접 열면 모두 정상 동작하며, '+
    '지금도 합성 엔진만으로 전 기능을 쓸 수 있습니다.');
}
const keyUrl = k => `${AUDIO_BASE}${k}.mp3`;

/** 트랙 하나에 샘플 배정. 실패하면 합성으로 되돌림 */
async function assignSample(id,key,quiet){
  smpSel[id]=key;
  if(key==='synth') return true;
  if(!HAS_TONE){ smpSel[id]='synth'; return false; }
  wake();
  if(!quiet) setStat(`${key} 불러오는 중…`,'load');
  try{
    const buf = await loadBuf(keyUrl(key));
    if(!trackPlayer[id]){
      trackPlayer[id] = new Tone.Player({fadeOut:0.012});
      trackPlayer[id].connect(chan[id]);
    }
    trackPlayer[id].buffer = buf;
    if(!quiet) setStat(`${key} 적용 · 캐시 ${bufCache.size}개`,'ok');
    return true;
  }catch(err){
    smpSel[id]='synth';
    if(!quiet){ setStat('로드 실패 — 합성으로 되돌림','err'); blocked(); }
    return false;
  }
}
async function applyWholeKit(kitN){
  if(kitN==='synth'){
    TRACK_IDS.forEach(id => { smpSel[id]='synth'; });
    syncSmpSelects(); setStat('합성 엔진 사용 중');
    return;
  }
  setStat(`${kitN} 킷 적용 중…`,'load');
  let ok=0;
  for(const t of TRACKS){
    if(await assignSample(t.id, `drum-samples/${kitN}/${KIT_MAP[t.id]}`, true)) ok++;
  }
  syncSmpSelects();
  if(ok===0){ setStat('킷 로드 실패','err'); blocked(); }
  else setStat(`${kitN} 적용 · ${ok}/${TRACKS.length} 트랙 · 캐시 ${bufCache.size}개`,'ok');
}
/** 모든 킷 샘플을 동시 6개씩 미리 받기 */
async function preloadAll(){
  if(!HAS_TONE) return;
  wake();
  UI.preload.disabled = true;
  const urls=[];
  KITS.forEach(k => KIT_FILES.forEach(f => urls.push(`${AUDIO_BASE}drum-samples/${k}/${f}.mp3`)));
  CASIO_STEP.forEach(n => urls.push(`${AUDIO_BASE}casio/${n}.mp3`));
  const total=urls.length;
  let done=0, fail=0;
  async function worker(){
    while(urls.length){
      const u=urls.shift();
      try{ await loadBuf(u); }catch(e){ fail++; }
      done++;
      if(done%4===0 || !urls.length) setStat(`전체 받는 중 ${done}/${total} · 실패 ${fail}`,'load');
      if(fail>6) urls.length=0;   // 네트워크가 막힌 것으로 보고 중단
    }
  }
  await Promise.all(Array.from({length:6}, worker));
  UI.preload.disabled = false;
  if(fail>6){ setStat('전체 받기 중단 — 네트워크 차단','err'); blocked(); }
  else setStat(`전체 받기 완료 · 캐시 ${bufCache.size}개 · 실패 ${fail}`,'ok');
}
function toggleLoop(L){
  if(!HAS_TONE) return;
  wake();
  const btn=document.querySelector(`[data-loop="${L.n}"]`);
  if(btn.dataset.dead==='1') return;
  if(loopPlayer[L.n] && loopPlayer[L.n].state==='started'){
    loopPlayer[L.n].stop(); btn.dataset.on='0'; return;
  }
  (async()=>{
    try{
      const buf = await loadBuf(AUDIO_BASE+L.u);
      if(!loopPlayer[L.n]){
        loopPlayer[L.n] = new Tone.Player({loop:true, fadeIn:0.02, fadeOut:0.05});
        loopPlayer[L.n].connect(chan.loop);
      }
      loopPlayer[L.n].buffer = buf;
      loopPlayer[L.n].playbackRate = knob('lrate')/100;
      loopPlayer[L.n].start();
      btn.dataset.on='1';
    }catch(e){ btn.dataset.dead='1'; blocked(); }
  })();
}
async function loadSampler(which){
  if(!HAS_TONE) return false;
  if(which==='piano' && pianoReady) return true;
  if(which==='casio' && casioReady) return true;
  wake();
  setStat(`${which} 샘플 불러오는 중…`,'load');
  try{
    const s = new Tone.Sampler({
      urls   : which==='piano' ? PIANO_URLS : CASIO_URLS,
      baseUrl: AUDIO_BASE + (which==='piano' ? 'salamander/' : 'casio/'),
      release: which==='piano' ? 1.2 : 0.6,
    });
    s.connect(chan.bass);
    await withTimeout(Tone.loaded(), 15000);
    if(which==='piano'){ piano=s; pianoReady=true; } else { casio=s; casioReady=true; }
    setStat(`${which} 준비 완료`,'ok');
    return true;
  }catch(err){
    setStat(`${which} 로드 실패 — 합성으로 되돌림`,'err'); blocked();
    eng.bass='sub'; UI.beng.value='sub';
    return false;
  }
}
async function loadCustom(){
  const raw = UI.curl.value.trim();
  if(!raw) return;
  if(!HAS_TONE){ setStat('Tone.js 없음','err'); return; }
  wake();
  const url = /^https?:/.test(raw) ? raw : AUDIO_BASE + raw.replace(/^\//,'');
  setStat('직접 URL 불러오는 중…','load');
  try{
    const buf = await loadBuf(url);
    const dst = UI.cdst.value;
    if(dst==='loop'){
      if(!loopPlayer.__custom){
        loopPlayer.__custom = new Tone.Player({loop:true, fadeIn:0.02, fadeOut:0.05});
        loopPlayer.__custom.connect(chan.loop);
      }
      loopPlayer.__custom.buffer = buf;
      loopPlayer.__custom.playbackRate = knob('lrate')/100;
      loopPlayer.__custom.start();
      setStat('루프 재생 시작','ok');
    }else{
      if(!trackPlayer[dst]){
        trackPlayer[dst] = new Tone.Player({fadeOut:0.012});
        trackPlayer[dst].connect(chan[dst]);
      }
      trackPlayer[dst].buffer = buf;
      smpSel[dst]='__custom'; syncSmpSelects();
      setStat(`${dst} 트랙에 배정 완료`,'ok');
    }
  }catch(e){ setStat('직접 URL 로드 실패','err'); blocked(); }
}
