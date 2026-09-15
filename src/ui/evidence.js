/* §15 근거 패널 — 이 프리셋이 무엇에서 나왔는가
   pulse16-mk16.html 에서 분리. 클래식 스크립트라 최상위 선언은
   전역 렉시컬 스코프를 공유한다 — 로드 순서가 곧 의존 순서다.

   ⚠ **곡·아티스트 이름은 프로파일에 없습니다.**
   이 저장소는 생성 데이터에 이름을 넣지 않는 것을 규칙으로 삼습니다
   (consulting/README.md · genres/profiles/README.md §2). 프로파일의
   `evidenceBasis` 는 「연대 · 지역 · N곡」 형식으로 강제돼 있어 제목이
   들어갈 문법 자리가 없고, tools/ci/check-melody-profile.mjs 의 P2 가
   그 형식을 검사합니다.

   그래서 이 패널은 세 가지를 나란히 보여 줍니다.
     위   — 프로파일에서 **뽑아낸 수치** (밀도·도약·음역·윤곽·표기 …)
     가운데 — genres/*.md 의 **대표 아티스트·앨범** (GENRE_REF, 편성의 판단 근거)
     아래  — 그 장르로 태그된 **실제 빌보드 1위 곡** (billboard/, 출처 위키백과)

   셋은 성격이 다릅니다. 가운데는 «이 장르를 대표하는 사람» 이고 앨범명은
   미검증입니다. 아래 목록은 «무엇이 실제로 팔렸나» 이지 «이 프리셋이 베낀 곡»
   이 아닙니다 — 패널에도 그렇게 적어 둡니다. 가운데 표에는 곡 목록이 없으므로
   곡을 지어내 채우지 않습니다. */
'use strict';

/* ═══ §15 근거 패널 ═══════════════════════════════════════════ */

const EVID_LABEL = {
  contour: { rise:'상행', arch:'아치', fall:'하행', zigzag:'지그재그', static:'정체' },
  rhythm : { onbeat:'정박', offbeat:'오프비트', offbeat16:'16분 싱코페', 'triplet-feel':'3연음 느낌' },
  repeat : { low:'낮음', mid:'중간', high:'높음' },
  voicing: { single:'단음', chord:'3화음', mixed:'섞임' },
  role   : { root:'근음 고수', walking:'워킹', arpeggio:'아르페지오', octave:'옥타브 도약' },
  gate   : { short:'짧게', mid:'보통', long:'길게' },
  kick   : { locked:'킥에 붙음', offset:'킥과 엇나감', free:'자유' },
  glide  : { none:'없음', occasional:'가끔', defining:'정체성' },
  conf   : { high:'높음', medium:'보통', low:'낮음' },
  axis   : { melody:'선율', rhythm:'박자', timbre:'음색', tempo:'템포', none:'구분 안 됨' },
  cat    : { A:'록', B:'팝', C:'힙합', D:'R&B·소울·펑크', E:'일렉트로닉', F:'재즈',
             G:'블루스·컨트리·포크', H:'라틴', I:'카리브', J:'아프리카', K:'기타 지역', X:'그 외' },
};
const evLbl = (g, v) => (EVID_LABEL[g] && EVID_LABEL[g][v]) || v || '—';
const evEsc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/** 그 장르 이름으로 태그된 차트 1위 항목. 정확히 일치하는 것만 센다 —
    비슷한 이름을 긁어 오면 «이 장르 곡» 이라는 표시가 거짓말이 된다. */
function evidenceCharts(genreName){
  if(typeof BILLBOARD === 'undefined') return {hot:[], bb:[]};
  /* 누적 주차가 긴 것부터 — 그 장르에서 가장 크게 팔린 것이 먼저 보여야 한다 */
  const pick = rows => rows.filter(r => r[4] === genreName)
                           .sort((a,b) => (b[7]||0)-(a[7]||0) || a[0]-b[0]);
  return { hot: pick(BILLBOARD.hot100), bb: pick(BILLBOARD.bb200) };
}

/** genres/*.md 의 레퍼런스 — 대표 아티스트·앨범·뽑아낸 속성. 표에 없으면 null */
function evidenceRef(name){
  return (typeof GENRE_REF !== 'undefined' && GENRE_REF[name]) || null;
}
/* 원본 표의 **굵게** 를 살린다. 이스케이프한 뒤에 바꾸므로 태그가 새지 않는다 */
const evBold = s => evEsc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

function evidenceHtml(name){
  const L = (typeof LIB !== 'undefined' && LIB[name]) || null;
  const P = (typeof GENRE_PROFILE !== 'undefined' && GENRE_PROFILE[name]) || null;
  const cat = P ? P.cat : (L && L.cat) || (typeof PRESET_CAT!=='undefined' && PRESET_CAT[name]) || '';
  const sub = P ? P.sub : (typeof PRESET_SUB!=='undefined' && PRESET_SUB[name]) || '';
  const out = [];

  out.push(`<h2 id="whytitle">${evEsc(name)}</h2>`);
  out.push(`<p class="ev-sub">${evEsc(evLbl('cat',cat))} · ${evEsc(sub||'분기 없음')}`
         + (L ? ` · ${L.bpm} BPM · swing ${L.swing}` : '') + `</p>`);

  /* ── 뽑아낸 수치 ── */
  if(P){
    const m = P.mel, b = P.bass;
    out.push(`<h3>이 장르에서 뽑아낸 것</h3>`);
    out.push(`<dl class="ev">`);
    out.push(`<dt>밀도</dt><dd>16스텝 중 ${m.d[0]}~${m.d[1]}칸</dd>`);
    out.push(`<dt>도약</dt><dd>3도 이상 이동 ${Math.round(m.l[0]*100)}~${Math.round(m.l[1]*100)}%</dd>`);
    out.push(`<dt>음역</dt><dd>${m.r[0]}~${m.r[1]} 도수</dd>`);
    out.push(`<dt>윤곽</dt><dd>${evLbl('contour',m.c)}</dd>`);
    out.push(`<dt>리듬</dt><dd>${evLbl('rhythm',m.y)}</dd>`);
    out.push(`<dt>반복</dt><dd>${evLbl('repeat',m.p)}</dd>`);
    out.push(`<dt>표기</dt><dd>${evLbl('voicing',m.v)}</dd>`);
    out.push(`<dt>스케일</dt><dd>${evEsc(m.s)}</dd>`);
    out.push(`<dt>베이스</dt><dd>${evLbl('role',b.role)} · 게이트 ${evLbl('gate',b.gate)}`
           + ` · ${evLbl('kick',b.kickRelation)}`
           + (b.glide!=='none' ? ` · 글라이드 ${evLbl('glide',b.glide)}` : '')
           + (b.octaveJump ? ' · 옥타브 도약' : '') + `</dd>`);
    out.push(`<dt>주인공</dt><dd>${evEsc(P.lead)}</dd>`);
    out.push(`<dt>근거</dt><dd>${evEsc(P.ev)} <i>(확신도 ${evLbl('conf',P.conf)})</i></dd>`);
    out.push(`</dl>`);
    /* why 도 사람이 쓴 문장이라 **굵게** 를 쓴다 — R.at·R.no 와 같은 규칙이다.
       2026-09-16 까지 여기만 evEsc 라 별표가 화면에 그대로 찍혔다(5개 계열 10곳). */
    if(P.why) out.push(`<p class="ev-note">${evBold(P.why)}</p>`);
    out.push(`<p class="ev-pool">선율 풀 · ${P.pool.map(evEsc).join(' · ')}`
           + (P.share ? ` <i>(${evEsc(P.share)} 와 공유)</i>` : '') + `</p>`);

    const diff = P.diff.filter(d => d[1] !== 'none');
    const same = P.diff.filter(d => d[1] === 'none');
    if(diff.length){
      out.push(`<h3>형제와 무엇이 다른가</h3><ul class="ev-diff">`);
      for(const [from,axis,note] of diff.slice(0,8))
        /* note 는 형제 무리의 why 를 따온 문장이라 거기 있던 **굵게** 가 그대로 딸려 온다 */
        out.push(`<li><b>${evEsc(from)}</b> <span class="ev-axis">${evLbl('axis',axis)}</span> ${evBold(note)}</li>`);
      out.push(`</ul>`);
    }
    if(same.length)
      out.push(`<p class="ev-note">선율로 구분되지 않는 형제 — ${same.map(d=>evEsc(d[0])).join(' · ')}</p>`);
  } else {
    out.push(`<h3>이 장르에서 뽑아낸 것</h3>`);
    out.push(`<p class="ev-note">아직 프로파일이 없습니다. 계열·하위분기 단위 배정만 받고 있습니다 —`
           + ` 배치 작업이 이 프리셋에 닿으면 여기에 수치가 생깁니다.</p>`);
  }

  /* ── 대표 아티스트·앨범 (genres/*.md) ── */
  const R = evidenceRef(name);
  out.push(`<h3>이 장르의 대표 <i>(genres/ 레퍼런스)</i></h3>`);
  if(R){
    /* 대표곡 — 곡이 실재하고 출처가 그 장르로 분류한 것만 들어온다(build-refdata.mjs) */
    if(R.tr && R.tr.length){
      out.push(`<p class="ev-warn"><b>대표곡</b>은 곡이 실제로 있고 출처가 그 장르로 분류한 것만 남겼습니다.`
             + ` BPM·조성도 출처가 있는 값만 적었습니다. 프리셋은 이 곡들의 <b>성질</b>(템포·편성·선율의 윤곽과 밀도)에`
             + ` 맞췄고, 선율 자체를 옮겨 적지는 않았습니다.</p>`);
      out.push(`<ul class="ev-chart">` + R.tr.map(([t,a,y,k,bpm,key,url]) =>
        `<li><span class="ev-y">${evEsc(y||'—')}</span> ${evEsc(t)} <i>— ${evEsc(a)}</i>`
        + (k==='1위' ? ` <span class="ev-axis">1위</span>` : '')
        + (bpm ? ` <span class="ev-axis">${evEsc(bpm)} BPM</span>` : '')
        + (key ? ` <span class="ev-axis">${evEsc(key)}</span>` : '')
        + (/^https?:\/\//.test(url) ? ` <a href="${evEsc(url)}" target="_blank" rel="noopener">출처</a>` : '')
        + `</li>`).join('') + `</ul>`);
    }
    out.push(`<p class="ev-warn">아래는 편성을 정할 때 쓴 <b>판단 근거</b>입니다. 아티스트는 대체로 확실하지만`
           + ` 앨범명은 기억에 의존해 적은 값이라 <b>미검증</b>이고, <b>?</b> 는 문서가 «확인 필요» 로 표시한 것입니다.`
           + (R.tr && R.tr.length ? '' : ` 이 장르에는 아직 검증한 대표곡이 없습니다 — 곡을 지어내 채우지 않습니다.`)
           + `</p>`);
    out.push(`<dl class="ev">`);
    out.push(`<dt>아티스트</dt><dd>${R.a.length ? R.a.map(evEsc).join(' · ') : '<i>표에 적힌 이름 없음</i>'}</dd>`);
    if(R.al.length)
      out.push(`<dt>앨범</dt><dd>${R.al.map(([t,u]) => evEsc(t) + (u ? ' <i>?</i>' : '')).join(' · ')}</dd>`);
    if(R.at) out.push(`<dt>뽑아낸 것</dt><dd>${evBold(R.at)}</dd>`);
    out.push(`<dt>출처</dt><dd><i>${R.src.map(f => 'genres/' + evEsc(f)).join(' · ')}</i></dd>`);
    out.push(`</dl>`);
    for(const n of R.no) out.push(`<p class="ev-note">${evBold(n)}</p>`);
  } else {
    out.push(`<p class="ev-note">genres/ 의 레퍼런스 표에 이 프리셋이 없습니다.</p>`);
  }

  /* ── 실제 차트 ── */
  const ch = evidenceCharts(name);
  const tot = ch.hot.length + ch.bb.length;
  out.push(`<h3>이 장르로 1위를 한 것 <i>(${tot}건)</i></h3>`);
  out.push(`<p class="ev-warn">아래는 <b>빌보드 1위 기록</b>이지 «이 프리셋이 참고한 곡» 이 아닙니다.`
         + ` 프로파일은 곡 제목을 기록하지 않습니다 — 여러 곡에서 뽑은 구조적 성질만 남깁니다.`
         + ` 출처는 위키백과 연도별 차트 1위 목록입니다.</p>`);
  if(!tot){
    out.push(`<p class="ev-note">이 장르 이름으로 태그된 1위 항목이 없습니다.`
           + ` 차트 1위는 대중성이 극대화된 지점이라 장르 관습에서 벗어나는 일이 많습니다 —`
           + ` 없다고 해서 그 장르가 작다는 뜻은 아닙니다.</p>`);
  } else {
    /* r[7] = 누적 1위 주차. 0 이면 위키백과 표기와 짝이 안 지어진 것이라
       비워 둔다 — 추측으로 채우지 않는다(tools/apply-billboard-runs.mjs). */
    const rows = (list, kind) => list.slice(0, 14).map(r =>
      `<li><span class="ev-y">${r[0]}</span> ${evEsc(r[1])} <i>— ${evEsc(r[2])}</i>`
      + (r[7] ? ` <span class="ev-axis">1위 ${r[7]}주</span>` : '')
      + (r[5] ? ` <span class="ev-axis">${evEsc(r[5])}</span>` : '')
      + ` <span class="ev-axis">${kind}</span></li>`).join('');
    out.push(`<ul class="ev-chart">${rows(ch.hot,'Hot 100')}${rows(ch.bb,'BB 200')}</ul>`);
    if(tot > 28) out.push(`<p class="ev-note">${tot - 28}건 더 있습니다.</p>`);
  }
  out.push(`<p class="ev-note"><a href="billboard.html" target="_blank" rel="noopener">빌보드 전체 조회 →</a></p>`);
  return out.join('');
}

/* ── 라이브러리 아래 «지금 장르» 줄 ────────────────────────────────
   프리셋을 고를 때마다 갱신한다. 모달 버튼 뒤에 묻어 두면 아무도 안 본다.

   ⚠ **여기 뜨는 곡은 «이 프리셋의 모티브» 가 아니다.**
   프로파일은 곡 제목을 기록하지 않는다 — 여러 곡에서 뽑은 구조적 성질만
   남긴다(genres/profiles/README.md §2). 이 줄이 보여 주는 것은 «그 장르
   이름으로 빌보드 1위를 한 기록» 이고, 라벨에 그렇게 적는다. */
function updateMotif(){
  if(typeof UI === 'undefined' || !UI.motif) return;
  const name = (typeof src !== 'undefined' && src.keys) || null;
  if(!name){ UI.motif.innerHTML = ''; return; }

  const P = (typeof GENRE_PROFILE !== 'undefined' && GENRE_PROFILE[name]) || null;
  const ch = evidenceCharts(name);
  const top = [...ch.hot, ...ch.bb].sort((a,b) => (b[7]||0)-(a[7]||0)).slice(0,3);
  const out = [];

  out.push(`<span class="k">${evEsc(name)}</span>`);
  if(P){
    out.push(`<span class="k">밀도 ${P.mel.d[0]}~${P.mel.d[1]}</span>`);
    out.push(`<span class="k">${evLbl('contour',P.mel.c)}</span>`);
    out.push(`<span class="k">${evLbl('rhythm',P.mel.y)}</span>`);
  }
  /* 대표 아티스트는 곡이 아니라 사람이다 — 1위 기록과 라벨을 따로 둔다 */
  const R = evidenceRef(name);
  if(R && R.tr && R.tr.length){
    /* 검증한 대표곡이 있으면 그것이 먼저다 — 아티스트보다 구체적이다 */
    out.push(`<span class="k">대표곡</span>`);
    out.push(R.tr.slice(0,2).map(([t,a]) =>
      `<span class="art">${evEsc(t)} <i>— ${evEsc(a)}</i></span>`).join(' · '));
  }else if(R && R.a.length){
    out.push(`<span class="k">대표</span>`);
    out.push(`<span class="art">${R.a.slice(0,3).map(evEsc).join(' · ')}</span>`);
  }
  out.push(`<span class="k">1위 기록</span>`);
  if(top.length){
    out.push(top.map(r =>
      `<span class="song">${evEsc(r[1])} <i>— ${evEsc(r[2])}</i>`
      + (r[7] ? ` <span class="wk">${r[7]}주</span>` : '') + `</span>`).join(' · '));
  } else {
    out.push(`<span class="none">이 장르 이름으로 1위한 기록이 없습니다</span>`);
  }
  out.push(`<span class="more"><button type="button" onclick="showEvidence()">근거 전체 →</button></span>`);
  UI.motif.innerHTML = out.join(' ');
}

function showEvidence(){
  const name = (typeof src !== 'undefined' && src.keys) || null;
  if(!name || typeof UI === 'undefined' || !UI.why) return;
  UI.whybody.innerHTML = evidenceHtml(name);
  UI.why.classList.add('on');
  UI.whyclose.focus();
}
function hideEvidence(){ if(typeof UI!=='undefined' && UI.why) UI.why.classList.remove('on'); }
