/* tools/measure-sections.mjs — 곡 형식이 **실제 소리로** 나오는가를 잰다.

   왜 따로 필요한가.
   check-song-length.mjs 는 표를 읽어 «코러스가 벌스보다 두껍다» 를 확인한다.
   그런데 그것은 **표의 성질**이지 소리의 성질이 아니다 — 마스터 체인의
   글루 컴프·리미터가 구간별 편차를 눌러 버리는 것을 이미 한 번 겪었다
   (arrange.js §SECTION_RULE 의 «1차 실측 2.33 LU»). 트랙을 아무리 끄고
   레벨을 올려도 스피커에서 안 갈리면 조사한 것이 소리에 안 닿은 것이다.

   그래서 이 도구는 앱을 **실제로 재생해서 녹음**하고, 섹션마다 RMS 를 재서
   그 차이를 dB 로 보여 준다. 마스터를 가로채는 방식은 render-melody.mjs 와
   같다(AudioNode.prototype.connect 를 감싼다) — 앱 코드는 안 건드린다.

   사용법
     node tools/measure-sections.mjs Britpop
     node tools/measure-sections.mjs "Chicago Blues" Soukous Salsa Brostep
     node tools/measure-sections.mjs Afrobeat --form grooveHold   ← 형식 고정
     node tools/measure-sections.mjs Britpop --bars 64            ← 잴 마디 수

   읽는 법
     한 바퀴의 평균을 0 dB 로 두고 섹션마다 얼마나 위아래인가를 적는다.
     인트로·브레이크가 음수로, 코러스·드롭이 양수로 벌어져야 «쌓였다 터지는»
     형태다. 벌어짐이 1 dB 안쪽이면 규칙이 소리에 안 닿고 있다는 뜻이다.     */

import { HTML, OK, NG, WARN, head } from './ci/_lib.mjs';
import { loadPlaywright, startServer, watchdog, auditRequire } from './ci/_browser.mjs';

/* 녹음 워클릿은 mcp/pulse-audit 의 것을 그대로 쓴다 — render-melody.mjs 와 같다.
   ScriptProcessorNode 로는 안 된다: destination 에 물리지 않으면 안 돌고,
   물리면 위의 connect 후킹이 탭으로 되먹임을 만든다. */
const { RECORDER_SRC } = auditRequire('./capture.js');

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? (argv[i + 1] ?? d) : d; };
const FORM = flag('form', '');
const BARS = +flag('bars', 0);            // 0 = 폼 한 바퀴 전부
const VAL = ['--form', '--bars'];
const presets = argv.filter((a, i) => !a.startsWith('--') && !VAL.includes(argv[i - 1]));

if (!presets.length) {
  console.log('프리셋 이름을 하나 이상 주십시오.');
  console.log('  예: node tools/measure-sections.mjs Britpop "Chicago Blues" Soukous');
  process.exit(2);
}

/* 덥스텝은 한 바퀴가 224마디(140 BPM 에 6분 24초)다 — 넉넉히 잡는다 */
const stopDog = watchdog(Math.max(480, presets.length * 480), '섹션 측정');
const { chromium } = loadPlaywright();
const srv = await startServer();
const browser = await chromium.launch();
const db = v => 20 * Math.log10(Math.max(v, 1e-9));

try {
  for (const preset of presets) {
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).split('\n')[0]));

    /* destination 으로 가는 신호를 탭에도 흘린다 (render-melody.mjs 와 동일) */
    await page.addInitScript(() => {
      const orig = AudioNode.prototype.connect;
      AudioNode.prototype.connect = function (dest, ...rest) {
        const r = orig.call(this, dest, ...rest);
        try {
          const ctx = this.context;
          if (dest === ctx.destination) {
            if (!ctx.__tap) { ctx.__tap = ctx.createGain(); window.__tapCtx = ctx; }
            orig.call(this, ctx.__tap);
          }
        } catch {}
        return r;
      };
    });

    await page.goto(`${srv.origin}/${HTML}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(400);

    const found = await page.evaluate(n => {
      const c = [...document.querySelectorAll('.chip')].find(x => x.dataset.name === n);
      if (c) { c.click(); return true; }
      return false;
    }, preset);
    if (!found) { console.log(`${NG} 프리셋 '${preset}' 없음 — 건너뜁니다`); await page.close(); continue; }

    /* 형식 고정(선택) · 곡 구조는 기본 켜짐이다 */
    const info = await page.evaluate(f => {
      if (f) {
        const sel = document.getElementById('formmode');
        sel.value = f; sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const btn = document.getElementById('form');
      if (btn && btn.dataset.on !== '1') btn.click();
      return { bpm: +document.getElementById('bpm').value, formOn: btn && btn.dataset.on === '1' };
    }, FORM);
    if (!info.formOn) { console.log(`${NG} ${preset} — 곡 구조를 못 켰습니다`); await page.close(); continue; }

    await page.click('#play');
    await page.waitForFunction(() => !!window.__tapCtx, null, { timeout: 15000 });

    /* 지금 걸린 폼 — 재생이 시작돼야 formNow 가 잡힌다 */
    const form = await page.evaluate(() => {
      if (!formNow) return null;
      /* 이 프리셋이 **실제로 가진** 트랙만 센다. 표에는 12개가 있어도 블루스
         프리셋은 kick·snare·chat + bass·keys·gtr 여섯뿐이라, clap·perc 를
         끄고 켜는 규칙은 그 프리셋에서 통째로 무효다. 그것을 모르면 표만
         보고 «대비가 있다» 고 착각한다. */
      const has = id => {
        if (['bass', 'keys', 'gtr'].includes(id)) return Array.isArray(P[id]) && P[id].some(v => v);
        if (id === 'keys2') return Array.isArray(P.keys2) && P.keys2.some(v => v);
        if (id === 'gtr2') return Array.isArray(P.gtr2) && P.gtr2.some(v => v);
        const a = P.drums && P.drums[id];
        return Array.isArray(a) && a.some(v => v);
      };
      const ALL = [...TRACK_IDS, 'bass', 'keys', 'gtr', 'keys2', 'gtr2'];
      const live = ALL.filter(has);
      const kinds = [...new Set(formNow.secs.map(s => s.k))];
      const grid = {};
      for (const k of kinds) {
        const r = (formNow.rule && formNow.rule[k]) || SECTION_RULE[k];
        grid[k] = live.map(id => (r.off || []).includes(id) ? 0 : ((r.lvl || {})[id] || 1));
      }
      return {
        name: Object.keys(SONG_FORM).find(k => SONG_FORM[k] === formNow),
        label: formNow.label, total: formNow.total, melLen: formNow.melLen,
        conf: formNow.conf, arc: formNow.arc, secs: formNow.secs, ruled: !!formNow.rule,
        live, kinds, grid, dead: ALL.filter(id => !has(id)),
      };
    });
    if (!form) { console.log(`${NG} ${preset} — 폼이 안 걸렸습니다`); await page.close(); continue; }

    const barSec = 4 * 60 / info.bpm;
    const nBars = BARS || form.total;
    const SEC = nBars * barSec + 1.0;

    const chunks = [];
    await page.exposeBinding('__push', (_s, d) => chunks.push(Float32Array.from(d)));
    /* 모노 RMS 면 충분하다 — 좌우 차이를 재는 도구가 아니다 */
    const sr = await page.evaluate(async src => {
      const ctx = window.__tapCtx;
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      await ctx.audioWorklet.addModule(url);
      const node = new AudioWorkletNode(ctx, 'pulse-rec', { numberOfInputs: 1, numberOfOutputs: 0 });
      let buf = [], acc = 0;
      node.port.onmessage = e => {
        const L = e.data.l, R = e.data.r;
        const m = new Float32Array(L.length);
        for (let i = 0; i < L.length; i++) m[i] = (L[i] + R[i]) * 0.5;
        buf.push(m); acc += m.length;
        if (acc >= ctx.sampleRate * 0.25) {
          const out = new Float32Array(acc); let p = 0;
          for (const b of buf) { out.set(b, p); p += b.length; }
          window.__push(Array.from(out)); buf = []; acc = 0;
        }
      };
      ctx.__tap.connect(node);
      window.__stopRec = () => node.port.postMessage('stop');
      window.__t0 = ctx.currentTime;
      /* 소리와 섹션을 같은 시계로 묶는다 — 마디 수로 역산하면 재생 시작
         지연만큼 통째로 밀린다 */
      window.__marks = [];
      window.__fills = [];          // 큰 필인이 어느 마디에서 울렸는가
      window.__mk = setInterval(() => {
        const sec = (typeof sectionNow !== 'undefined' && sectionNow) ? sectionNow : null;
        window.__marks.push([ctx.currentTime - window.__t0, sec ? sec.k : '',
                             typeof loopNo !== 'undefined' ? loopNo : -1]);
        if (typeof fillNow !== 'undefined' && fillNow && typeof fillTier !== 'undefined' && fillTier) {
          const last = window.__fills[window.__fills.length - 1];
          if (!last || last[0] !== loopNo)
            window.__fills.push([loopNo, fillTier, sec ? sec.k : '', sec ? sec.last : false]);
        }
      }, 60);
      return ctx.sampleRate;
    }, RECORDER_SRC);

    await page.waitForTimeout(SEC * 1000);
    const { marks, fills } = await page.evaluate(() => {
      clearInterval(window.__mk);
      window.__stopRec?.();
      document.getElementById('play').click();
      return { marks: window.__marks, fills: window.__fills };
    });
    await page.waitForTimeout(300);

    const total = chunks.reduce((s, c) => s + c.length, 0);
    if (!total) { console.log(`${NG} ${preset} — 샘플을 못 받았습니다`); await page.close(); continue; }
    const M = new Float32Array(total); { let p = 0; for (const c of chunks) { M.set(c, p); p += c.length; } }

    /* 마크를 구간으로 접는다 — 같은 섹션이 이어지는 동안이 한 구간 */
    const runs = [];
    for (const [t, k] of marks) {
      const last = runs[runs.length - 1];
      if (last && last.k === k) last.t1 = t;
      else runs.push({ k, t0: t, t1: t });
    }
    /* 구간마다 RMS — 경계 0.15초씩 잘라 낸다(필인·전환음이 섞인다) */
    const EDGE = 0.15;
    const per = {};
    for (const r of runs) {
      const a = Math.floor((r.t0 + EDGE) * sr), b = Math.floor((r.t1 - EDGE) * sr);
      if (b - a < sr * 0.2 || b > M.length) continue;
      let s = 0; for (let i = a; i < b; i++) s += M[i] * M[i];
      const rms = Math.sqrt(s / (b - a));
      (per[r.k] = per[r.k] || []).push({ rms, dur: (b - a) / sr });
    }

    const kinds = Object.keys(per);
    if (!kinds.length) { console.log(`${NG} ${preset} — 섹션을 못 잡았습니다`); await page.close(); continue; }
    /* 전체 평균(길이 가중)을 0 dB 로 */
    let num = 0, den = 0;
    for (const k of kinds) for (const x of per[k]) { num += x.rms * x.rms * x.dur; den += x.dur; }
    const ref = Math.sqrt(num / den);

    head(`${preset} — ${form.label} (${form.name})`);
    console.log(`   ${form.total}마디 · 선율 ${form.melLen} · ${info.bpm} BPM · 확신도 ${form.conf}`
      + ` · 기대 ${form.arc} · 형식 전용 규칙 ${form.ruled ? '있음' : '없음(기본 규칙)'}`);

    /* ── 이 프리셋이 가진 트랙만으로 그린 규칙표 ──
       0 = 이 섹션에서 안 운다. 1 = 그대로. 그 외 = 레벨 배율. */
    console.log(`   트랙 ${form.live.length}개 (표의 12개 중) — 없는 트랙 ${form.dead.join(' ') || '없음'}`);
    console.log('   ' + '섹션'.padEnd(11) + form.live.map(t => t.padStart(6)).join(''));
    for (const k of form.kinds)
      console.log('   ' + k.padEnd(12) + form.grid[k].map(v => (v ? v.toFixed(2) : '·').padStart(6)).join(''));
    /* ── 편성 변화 ──
       저장소가 이미 배운 것: «압축기를 거쳐도 살아남는 건 게인 배율보다
       안 울리는 트랙 수» 다(arrange.js §SECTION_RULE). 그래서 dB 보다 이쪽이
       «다른 구간으로 들리는가» 에 가깝다. 가장 얇은 섹션과 가장 두꺼운 섹션
       사이에 **켜고 꺼지는 트랙이 몇 개인가**를 센다. */
    let swing = 0, lvlOnly = 0;
    {
      const rows = form.kinds.map(k => form.grid[k].join(','));
      if (new Set(rows).size === 1)
        console.log(`   ${NG} 섹션이 전부 같다 — 이 프리셋에서 형식 규칙이 아무것도 안 바꾼다`);
      /* 얇다·두껍다는 «울리는 트랙 수 → 같으면 레벨 합» 으로 가른다.
         트랙 수만 보면 전부 같을 때 thin 과 thick 이 같은 섹션이 되어
         «변화 0» 이라는 거짓말이 나온다. */
      const weight = k => {
        const g = form.grid[k];
        return g.filter(v => v > 0).length * 100 + g.reduce((s, v) => s + v, 0);
      };
      const thin = form.kinds.reduce((a, b) => weight(a) <= weight(b) ? a : b);
      const thick = form.kinds.reduce((a, b) => weight(a) >= weight(b) ? a : b);
      for (let i = 0; i < form.live.length; i++) {
        const a = form.grid[thin][i], b = form.grid[thick][i];
        if ((a === 0) !== (b === 0)) swing++;
        else if (a > 0 && Math.abs(b - a) >= 0.15) lvlOnly++;
      }
      console.log(`   편성 변화 — ${thin} → ${thick}: 켜고 꺼지는 트랙 ${swing}개 · 레벨만 바뀌는 트랙 ${lvlOnly}개`);
      if (swing === 0 && lvlOnly > 0)
        console.log(`   ${WARN} 켜고 꺼지는 트랙이 0 이다 — 레벨만으로는 마스터 컴프·리미터를 잘 못 넘는다`);
    }
    const order = form.secs.map(s => s.k).filter((v, i, a) => a.indexOf(v) === i);
    const rows = order.filter(k => per[k]);
    let lo = Infinity, hi = -Infinity;
    for (const k of rows) {
      const g = per[k];
      const r = Math.sqrt(g.reduce((s, x) => s + x.rms * x.rms * x.dur, 0) / g.reduce((s, x) => s + x.dur, 0));
      const d = db(r) - db(ref);
      lo = Math.min(lo, d); hi = Math.max(hi, d);
      const bar = d >= 0 ? ' '.repeat(12) + '#'.repeat(Math.min(12, Math.round(d * 2)))
                         : ' '.repeat(12 - Math.min(12, Math.round(-d * 2))) + '#'.repeat(Math.min(12, Math.round(-d * 2)));
      console.log(`   ${k.padEnd(10)} ${(d >= 0 ? '+' : '') + d.toFixed(2)} dB`.padEnd(26) + `|${bar}|`);
    }
    /* 판정 기준은 **출처가 셈여림을 뭐라 했는가**(arc)에 달려 있다.
       grooveHold 는 벌어짐이 작은 것이 성공이다 — 같은 잣대로 재면 안 된다. */
    const span = hi - lo;
    const txt = `벌어짐 ${span.toFixed(2)} dB (가장 조용한 섹션 → 가장 큰 섹션)`;
    if (form.arc === 'flat')
      console.log(span <= 1.0 ? `   ${OK} ${txt} — «안 변하는 것이 형식» 이라 이것이 맞다`
                              : `   ${WARN} ${txt} — 이 형식은 평평해야 한다`);
    else if (form.arc === 'build')
      console.log((span >= 1.0 || swing >= 3)
        ? `   ${OK} ${txt}${span < 1.0 ? ' — dB 는 작지만 편성이 ' + swing + '트랙 바뀐다' : ''}`
        : `   ${WARN} ${txt} — 출처는 쌓였다 터지는 형태라는데 소리에 안 닿는다`);
    else
      console.log(`   ${OK} ${txt} — 출처가 셈여림을 말하지 않아 판정하지 않는다`);
    /* ── 큰 필인이 섹션 끝에 붙는가 ──
       곡 구조가 켜져 있으면 큰 필인은 고정 16격자가 아니라 **섹션 끝**에서
       울려야 한다(sequencer.js §onLoopWrap). 12마디 블루스의 턴어라운드가
       바로 이 자리다 — 16격자로 치면 영영 안 맞는다. */
    if (fills.length) {
      const atEnd = fills.filter(f => f[3]).length;
      const where = fills.slice(0, 8).map(f => `${f[0]}마디(${f[2]}${f[3] ? '·끝' : ''})`).join(' ');
      console.log(`   큰 필인 ${fills.length}회 — 섹션 끝에서 ${atEnd}회 · ${where}`);
      if (atEnd < fills.length)
        console.log(`   ${WARN} 섹션 끝이 아닌 자리에서 ${fills.length - atEnd}회 울렸습니다`);
    } else console.log(`   큰 필인 0회 (섹션이 길거나 필인이 꺼져 있습니다)`);
    if (errs.length) console.log(`   ${WARN} 페이지 오류: ${errs.slice(0, 2).join('; ')}`);
    await page.close();
  }
} finally {
  await browser.close();
  srv.close();
  stopDog();
}
