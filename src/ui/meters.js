/* §11 화면 갱신 · 미터
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다. */
'use strict';

/* ═══ §11  화면 갱신 · 미터 ═════════════════════════════════ */

const padEl={}, noteEl=[], keysEl=[], gtrEl=[];
let lastHits=[], lastSkips=[], headStride=0, shown=-1;

function clearHits(){
  for(const el of lastHits)  el.classList.remove('hit');
  for(const el of lastSkips) el.classList.remove('skip');
  lastHits=[]; lastSkips=[];
}
function drawStep(cur,skipped){
  if(cur===shown) return;
  shown=cur;
  UI.head.style.transform=`translate3d(${headStride*cur}px,0,0)`;
  clearHits();
  /* 필인·선율이 걸리면 저장된 패턴이 아니라 **지금 울리는 것** 을 그린다.
     P.drums / P.keys 를 그대로 그리면 화면과 소리가 어긋난다. */
  const fk = (typeof fillAt==='function') ? fillAt(cur) : null;
  for(const tr of TRACKS){
    if(mute[tr.id]) continue;
    let on;
    if(fk!==null){ const row=fillNow.pat[tr.id]; on = !!(row && row[fk]!=='-'); }
    else on = !!P.drums[tr.id][cur];
    if(!on) continue;
    const el=padEl[tr.id][cur];
    if(fk===null && skipped && skipped.includes(tr.id)){ el.classList.add('skip'); lastSkips.push(el); }
    else { el.classList.add('hit'); lastHits.push(el); }
  }
  const d = (typeof blineNow!=='undefined' && blineNow) ? barOf(blineNow)[cur] : P.bass[cur];
  if(d>=0 && !mute.bass){ noteEl[d][cur].classList.add('hit'); lastHits.push(noteEl[d][cur]); }
  const m = (typeof melNow!=='undefined' && melNow) ? barOf(melNow)[cur] : P.keys[cur];
  if(m && !mute.keys)
    for(let k=0;k<ROWS;k++) if(m & (1<<k)){
      keysEl[k][cur].classList.add('hit'); lastHits.push(keysEl[k][cur]);
    }
  const gd = (typeof riffNow!=='undefined' && riffNow) ? barOf(riffNow)[cur] : P.gtr[cur];
  if(gd>=0 && !mute.gtr){ gtrEl[gd][cur].classList.add('hit'); lastHits.push(gtrEl[gd][cur]); }
}
/** 폴백 모드의 화면 갱신 — 예약 큐에서 지난 스텝을 꺼내 그림 */
function fbPaint(){
  if(!playing) return;
  const now=ctx.currentTime;
  let cur=shown, sk=null;
  while(drawQ.length && drawQ[0].t<now){ const d=drawQ.shift(); cur=d.i; sk=d.s; }
  if(cur>=0) drawStep(cur,sk);
  requestAnimationFrame(fbPaint);
}

let mBuf=null, bBuf=null, lastMeter=0, clipUntil=0;
function peakOf(ana,buf){
  ana.getFloatTimeDomainData(buf);
  let p=0;
  for(let i=0;i<buf.length;i++){ const a=Math.abs(buf[i]); if(a>p) p=a; }
  return p;
}
function meterLoop(ts){
  if(!ctx) return;
  if(ts-lastMeter > 55){          // 약 18fps — 미터는 이 정도면 충분
    lastMeter=ts;
    let d1,d2,gr;
    if(HAS_TONE){
      d1=meterOut.getValue(); d2=meterBass.getValue();
      if(Array.isArray(d1)) d1=Math.max(...d1);
      if(Array.isArray(d2)) d2=Math.max(...d2);
      gr=Math.abs(limComp.reduction);
    }else{
      if(!mBuf){ mBuf=new Float32Array(meterOut.fftSize); bBuf=new Float32Array(meterBass.fftSize); }
      d1=dB(peakOf(meterOut,mBuf)); d2=dB(peakOf(meterBass,bBuf));
      gr=Math.abs(limComp.reduction);
    }
    METER_BAR.out.style.transform  = `scaleX(${Math.max(0,Math.min(1,(d1+48)/48))})`;
    METER_BAR.gr.style.transform   = `scaleX(${Math.min(1,gr/12)})`;
    METER_BAR.bass.style.transform = `scaleX(${Math.max(0,Math.min(1,(d2+48)/48))})`;
    UI.mOutV.textContent = d1<-47 ? '-∞' : d1.toFixed(1);
    UI.mGrV.textContent  = gr.toFixed(1);
    UI.mBasV.textContent = d2<-47 ? '-∞' : d2.toFixed(1);

    /* 클리핑 경고 — 한 번 넘으면 2초간 유지해 순간 피크도 놓치지 않게.
       마스터 게인 상한이 0.9 라 출력이 -0.92dBFS 를 넘을 수 없다.
       임계를 -0.3 으로 두면 영영 켜지지 않으므로 실제 도달 범위에 맞춘다. */
    if(d1 > -1.2) clipUntil = ts + 2000;
    const clipping = ts < clipUntil;
    UI.mOutV.classList.toggle('clip', clipping);
    UI.mOutRow.classList.toggle('clip', clipping);
    UI.clipTag.classList.toggle('on', clipping);

    UI.stat.innerHTML =
      (HAS_TONE ? `<b>Tone.js ${Tone.version}</b>` : '내장 스케줄러') +
      ` · 샘플 ${bufCache.size}<br>nodes ${liveNodes} · pool ${pool.gain.length+pool.bq.length}`;
  }
  requestAnimationFrame(meterLoop);
}


/* ── 필인·선율의 상태 표시 ──
   토글만 있고 화면에 아무 표시가 없으면, 필인이 언제 오는지·
   선율이 몇 마디째인지 알 방법이 없다. 루프가 돌 때마다 갱신한다. */
let fillZoneAt = -1;

/** 이번 루프에 필인이 걸렸으면 그 구간의 칸을 표시한다 */
function markFillZone(){
  const from = fillNow ? STEPS - fillNow.len : -1;
  if(from === fillZoneAt) return;              // 안 바뀌었으면 DOM 을 안 건드린다
  fillZoneAt = from;
  for(const tr of TRACKS)
    for(let i=0;i<STEPS;i++)
      padEl[tr.id][i].classList.toggle('fillzone', from>=0 && i>=from);
}

/** 선율이 켜져 있으면 건반 롤에 **지금 마디** 를 그린다.
    사용자가 찍은 P.keys 가 아니라는 것을 알 수 있게 mel 클래스로 구분한다. */
function syncKeysView(){
  const on = (typeof melNow!=='undefined') && melNow;
  const src = on ? barOf(melNow) : P.keys;
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const el=keysEl[d][i];
      el.dataset.on = (src[i] & (1<<d)) ? 1 : 0;
      el.classList.toggle('mel', !!on);
    }
}

/** 상태 한 줄 — 필인 예고와 선율 진행을 글로 알려준다 */
function syncVarState(){
  if(!UI.varstat) return;
  const parts=[];
  if(fillOn){
    if(fillNow) parts.push(`${fillTier} 필인 ▶ ${fillNow.label}`);
    else{
      const until = e => e>0 ? (e - ((loopNo+1) % e)) % e : -1;
      const s1=until(fillEvery), s2=until(fillEveryL);
      const bits=[];
      if(s1>=0) bits.push(`작은 ${s1||fillEvery}`);
      if(s2>=0) bits.push(`큰 ${s2||fillEveryL}`);
      if(bits.length) parts.push('필인 ' + bits.join(' · ') + '루프 뒤');
    }
  }
  if(melOn && (melNow||riffNow||blineNow)){
    const a=melNow?melNow.label:'—', b=riffNow?riffNow.label:'—', c=blineNow?blineNow.label:'—';
    parts.push(`선율 ${a} · 리프 ${b} · 베이스 ${c} — ${melBar+1}/${melLen}루프`);
  }
  UI.varstat.textContent = parts.length ? parts.join('  ·  ') : '';
}

/** 루프 경계에서 한 번에 갱신 */
/** 기타 롤도 선율 모드면 지금 마디를 그린다 */
function syncGtrView(){
  const on = (typeof riffNow!=='undefined') && riffNow;
  const src2 = on ? barOf(riffNow) : P.gtr;
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const el=gtrEl[d][i];
      el.dataset.on = (src2[i]===d) ? 1 : 0;
      el.classList.toggle('mel', !!on);
    }
}

/** 베이스 롤도 선율 모드면 지금 마디를 그린다 */
function syncBassView(){
  const on = (typeof blineNow!=='undefined') && blineNow;
  const src3 = on ? barOf(blineNow) : P.bass;
  for(let d=0;d<ROWS;d++)
    for(let i=0;i<STEPS;i++){
      const el=noteEl[d][i];
      el.dataset.on = (src3[i]===d) ? 1 : 0;
      el.classList.toggle('mel', !!on);
    }
}

function syncVariation(){
  markFillZone();
  syncBassView();
  syncKeysView();
  syncGtrView();
  syncVarState();
}
