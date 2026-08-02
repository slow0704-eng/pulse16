#!/usr/bin/env node
/* PULSE·16 전용 MCP 서버 — 사운드 품질 계측 + 접근성 점검

   왜 기성품을 안 쓰고 만들었나:
   - Suno·MiniMax 같은 "음악 MCP" 는 음악을 *만드는* 도구다. 우리 신스
     출력을 *재는* 데는 쓸모가 없다.
   - npm 의 ffmpeg MCP 래퍼들은 주간 다운로드 150여 회에 1년 넘게 방치돼
     있고 저장소 링크도 엉뚱한 곳을 가리킨다. 직접 호출하는 편이 낫다.
   - 정작 필요한 "브라우저 신스 출력을 파일로 굳히기" 는 이 앱 전용이라
     어떤 기성 MCP 도 해주지 않는다.

   그래서 역할을 이렇게 나눴다.
     이 서버   앱을 재생시켜 마스터 버스를 탭 → WAV 로 굳힘 (자작 불가피)
     ffmpeg    EBU R128 라우드니스·astats 계측 (검증된 표준 구현에 위임)
     axe-core  WCAG 접근성 검사

   제공 도구
     harness         tools/*.html DSP 검증 하네스를 헤드리스 실행
     render_wav      프리셋을 재생·녹음해 WAV 파일로 저장
     audio_measure   render_wav + ffmpeg 계측을 한 번에
     a11y            axe-core 접근성 검사
*/
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { chromium } from 'playwright';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { RECORDER_SRC, toWav } from './capture.js';

const execFileP = promisify(execFile);
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.PULSE_ROOT || path.resolve(HERE, '..', '..');
const APP = 'pulse16-mk16.html';
const OUTDIR = path.join(os.tmpdir(), 'pulse-audit');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
               '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown' };

/* ── 정적 서버 ── file:// 은 module 스크립트가 CORS 로 막혀 하네스가 안 돈다 */
let httpSrv = null, origin = null;
async function ensureServer() {
  if (origin) return origin;
  httpSrv = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    const abs = path.resolve(ROOT, rel);
    if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      res.writeHead(404).end('not found'); return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(abs)] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise(r => httpSrv.listen(0, '127.0.0.1', r));
  origin = `http://127.0.0.1:${httpSrv.address().port}`;
  return origin;
}

let browser = null;
async function ensureBrowser() {
  if (browser && browser.isConnected()) return browser;
  browser = await chromium.launch({
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  return browser;
}

/* winget 은 설치 직후 PATH 가 현재 셸에 반영되지 않고, Links 심 파일도
   항상 생기진 않는다. Packages 아래를 직접 훑어서 찾는다. */
let ffCache;
async function ffmpegPath() {
  if (ffCache !== undefined) return ffCache;
  const cands = ['ffmpeg'];
  const la = process.env.LOCALAPPDATA;
  if (la) {
    cands.push(path.join(la, 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'));
    const pkgs = path.join(la, 'Microsoft', 'WinGet', 'Packages');
    try {
      for (const d of fs.readdirSync(pkgs)) {
        if (!/ffmpeg/i.test(d)) continue;
        const outer = path.join(pkgs, d);
        for (const inner of fs.readdirSync(outer)) {
          const p = path.join(outer, inner, 'bin', 'ffmpeg.exe');
          if (fs.existsSync(p)) cands.push(p);
        }
      }
    } catch {}
  }
  if (process.env.ProgramFiles)
    cands.push(path.join(process.env.ProgramFiles, 'ffmpeg', 'bin', 'ffmpeg.exe'));
  for (const c of cands) {
    try { await execFileP(c, ['-version']); ffCache = c; return c; } catch {}
  }
  ffCache = null;
  return null;
}

const ok = text => ({ content: [{ type: 'text', text }] });
const mcp = new McpServer({ name: 'pulse-audit', version: '1.0.0' });

/* ═══ 1. DSP 검증 하네스 ═══ */
mcp.registerTool('harness', {
  title: '계측 하네스 실행',
  description: 'tools/ 의 DSP 검증 하네스를 헤드리스로 돌려 출력을 그대로 반환. '
             + 'name 을 비우면 목록을 준다.',
  inputSchema: {
    name: z.string().optional().describe('하네스 파일명 (예: verify-q.html)'),
    timeoutMs: z.number().optional(),
  },
}, async ({ name, timeoutMs = 90000 }) => {
  const dir = path.join(ROOT, 'tools');
  const all = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.html')) : [];
  if (!name) return ok(`하네스 ${all.length}개:\n` + all.map(f => '  ' + f).join('\n'));
  if (!all.includes(name)) return ok(`★ '${name}' 없음. 가능: ${all.join(', ')}`);

  const base = await ensureServer();
  const page = await (await ensureBrowser()).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  try {
    await page.goto(`${base}/tools/${name}`, { waitUntil: 'domcontentloaded' });
    let prev = '', stable = 0;
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      await page.waitForTimeout(500);
      const cur = await page.evaluate(() => document.getElementById('out')?.textContent ?? '');
      if (cur === prev && cur.length) { if (++stable >= 6) break; } else { stable = 0; prev = cur; }
    }
    return ok(`# ${name}\n${prev.replace(/<\/?b>/g, '') || '(출력 없음)'}`
            + (errs.length ? `\n\n★ 페이지 오류 ${errs.length}건:\n${errs.join('\n')}` : ''));
  } finally { await page.close(); }
});

/* ═══ 내부: 앱을 재생시켜 마스터 버스를 WAV 로 굳힌다 ═══ */
async function recordApp({ preset, seconds, bank }) {
  const base = await ensureServer();
  const page = await (await ensureBrowser()).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));

  /* 앱 스크립트보다 먼저 connect 를 감싸, destination 으로 가는 신호를
     탭 노드에도 흘린다. 앱 코드는 건드리지 않는다. */
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

  try {
    await page.goto(`${base}/${APP}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    if (preset) {
      const found = await page.evaluate(n => {
        const c = [...document.querySelectorAll('.chip')].find(x => x.dataset.name === n);
        if (c) { c.click(); return true; }
        return false;
      }, preset);
      if (!found) throw new Error(`프리셋 '${preset}' 없음`);
    }
    if (bank != null) {
      await page.evaluate(i => document.querySelectorAll('.slot')[i]?.click(), bank);
    }

    await page.click('#play');
    await page.waitForFunction(() => !!window.__tapCtx, null, { timeout: 15000 });

    const chunks = [];
    await page.exposeBinding('__push', (_src, d) => {
      chunks.push([Float32Array.from(d.l), Float32Array.from(d.r)]);
    });
    const sr = await page.evaluate(async src => {
      const ctx = window.__tapCtx;
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      await ctx.audioWorklet.addModule(url);
      const node = new AudioWorkletNode(ctx, 'pulse-rec', { numberOfInputs: 1, numberOfOutputs: 0 });
      /* 한 퀀텀씩 넘기면 왕복이 너무 잦다 — 0.25초 단위로 모아 보낸다 */
      let bl = [], br = [], acc = 0;
      const CH = Math.round(ctx.sampleRate * 0.25);
      node.port.onmessage = e => {
        bl.push(e.data.l); br.push(e.data.r); acc += e.data.l.length;
        if (acc >= CH) {
          const flat = a => { const o = new Float32Array(acc); let p = 0;
                              for (const x of a) { o.set(x, p); p += x.length; } return o; };
          window.__push({ l: Array.from(flat(bl)), r: Array.from(flat(br)) });
          bl = []; br = []; acc = 0;
        }
      };
      ctx.__tap.connect(node);
      window.__stopRec = () => node.port.postMessage('stop');
      return ctx.sampleRate;
    }, RECORDER_SRC);

    await page.waitForTimeout(seconds * 1000);
    await page.evaluate(() => { window.__stopRec?.(); document.getElementById('play').click(); });
    await page.waitForTimeout(400);

    const total = chunks.reduce((s, c) => s + c[0].length, 0);
    if (!total) throw new Error('샘플을 하나도 받지 못했습니다 (탭 연결 실패 가능)');
    const L = new Float32Array(total), R = new Float32Array(total);
    let p = 0;
    for (const [l, r] of chunks) { L.set(l, p); R.set(r, p); p += l.length; }

    fs.mkdirSync(OUTDIR, { recursive: true });
    const safe = (preset || 'default').replace(/[^\w가-힣-]+/g, '_');
    const out = path.join(OUTDIR, `${safe}-${seconds}s.wav`);
    fs.writeFileSync(out, toWav(L, R, sr));
    return { out, sr, samples: total, seconds: total / sr, errs };
  } finally { await page.close(); }
}

/* ═══ 2. WAV 렌더 ═══ */
mcp.registerTool('render_wav', {
  title: 'WAV 렌더',
  description: '앱을 실제로 재생시켜 마스터 출력을 WAV 파일로 저장하고 경로를 반환한다.',
  inputSchema: {
    preset: z.string().optional().describe('프리셋 칩 이름'),
    seconds: z.number().optional().describe('녹음 길이 초 (기본 8)'),
    bank: z.number().optional().describe('뱅크 인덱스 0~3'),
  },
}, async ({ preset, seconds = 8, bank }) => {
  try {
    const r = await recordApp({ preset, seconds, bank });
    return ok(`WAV 저장: ${r.out}\n${r.sr} Hz · ${r.samples.toLocaleString()} 샘플 · `
            + `${r.seconds.toFixed(2)} 초`
            + (r.errs.length ? `\n★ 페이지 오류: ${r.errs.join('; ')}` : ''));
  } catch (e) { return ok(`★ 실패: ${e.message}`); }
});

/* ═══ 3. 계측 ═══ */
mcp.registerTool('audio_measure', {
  title: '사운드 품질 계측',
  description: '프리셋을 재생·녹음한 뒤 ffmpeg 로 EBU R128 라우드니스와 astats 를 측정한다. '
             + '라우드니스·트루피크·DC·클리핑·크레스트를 표로 반환.',
  inputSchema: {
    preset: z.string().optional(),
    seconds: z.number().optional().describe('기본 10'),
    bank: z.number().optional(),
  },
}, async ({ preset, seconds = 10, bank }) => {
  const ff = await ffmpegPath();
  if (!ff) return ok('★ ffmpeg 를 찾을 수 없습니다. `winget install Gyan.FFmpeg` 후 새 셸에서 다시 시도하세요.');
  let r;
  try { r = await recordApp({ preset, seconds, bank }); }
  catch (e) { return ok(`★ 녹음 실패: ${e.message}`); }

  let log = '';
  try {
    await execFileP(ff, ['-hide_banner', '-nostats', '-i', r.out,
      '-af', 'ebur128=peak=true:framelog=quiet,astats=measure_perchannel=Peak_level+RMS_level+DC_offset+Crest_factor+Flat_factor+Noise_floor:measure_overall=none',
      '-f', 'null', '-'], { maxBuffer: 1 << 24 });
  } catch (e) { log = (e.stderr || '') + (e.stdout || ''); }
  if (!log) {
    try {
      const { stderr } = await execFileP(ff, ['-hide_banner', '-nostats', '-i', r.out,
        '-af', 'ebur128=peak=true:framelog=quiet,astats=measure_overall=none',
        '-f', 'null', '-'], { maxBuffer: 1 << 24 });
      log = stderr;
    } catch (e) { log = (e.stderr || '') + (e.stdout || ''); }
  }

  const g = re => { const m = log.match(re); return m ? m[1].trim() : null; };
  const I     = g(/I:\s*(-?[\d.]+|-inf)\s*LUFS/);
  const LRA   = g(/LRA:\s*(-?[\d.]+)\s*LU/);
  const tpk   = [...log.matchAll(/Peak:\s*(-?[\d.]+|-inf)\s*dBFS/g)].map(m => m[1]);
  const truePeak = tpk.length ? Math.max(...tpk.map(Number).filter(Number.isFinite)) : null;
  const chans = [...log.matchAll(/Channel:\s*(\d+)([\s\S]*?)(?=Channel:|Overall|$)/g)].map(m => ({
    ch: m[1],
    peak: (m[2].match(/Peak level dB:\s*(-?[\d.inf]+)/) || [])[1],
    rms:  (m[2].match(/RMS level dB:\s*(-?[\d.inf]+)/) || [])[1],
    dc:   (m[2].match(/DC offset:\s*(-?[\d.e-]+)/) || [])[1],
    crest:(m[2].match(/Crest factor:\s*([\d.inf]+)/) || [])[1],
    flat: (m[2].match(/Flat factor:\s*([\d.inf]+)/) || [])[1],
  }));

  const L = [];
  L.push(`# 사운드 품질 계측 — ${preset || '(부팅 기본값)'}`);
  L.push(`${r.sr} Hz · ${r.seconds.toFixed(2)} 초 · ffmpeg EBU R128`);
  L.push('');
  L.push('| 항목 | 값 | 판정 |');
  L.push('|---|---|---|');
  L.push(`| 적분 라우드니스 | ${I ?? '—'} LUFS | ${judgeLufs(I)} |`);
  L.push(`| 라우드니스 레인지 | ${LRA ?? '—'} LU | ${judgeLra(LRA)} |`);
  L.push(`| 트루피크 | ${truePeak ?? '—'} dBFS | ${judgePeak(truePeak)} |`);
  if (chans.length) {
    const n2 = x => { const v = Number(x); return Number.isFinite(v) ? v : null; };
    L.push('');
    L.push('| 채널 | 피크 dB | RMS dB | 크레스트 dB | DC | 플랫 |');
    L.push('|---|---|---|---|---|---|');
    for (const c of chans) {
      /* astats 의 Crest factor 는 dB 가 아니라 선형 배율(peak/RMS)이다.
         그대로 보여주면 dB 로 오독하기 쉬워 dB 로 환산해 싣는다. */
      const cr = n2(c.crest);
      const crDb = cr && cr > 0 ? (20 * Math.log10(cr)).toFixed(1) : '—';
      L.push(`| ${c.ch} | ${c.peak ?? '—'} | ${c.rms ?? '—'} | ${crDb} (×${c.crest ?? '—'}) | ${c.dc ?? '—'} | ${c.flat ?? '—'} |`);
    }
    L.push('');
    const cr0 = n2(chans[0]?.crest);
    const crDb0 = cr0 && cr0 > 0 ? 20 * Math.log10(cr0) : null;
    if (crDb0 !== null)
      L.push(crDb0 < 8  ? '★ 크레스트 8 dB 미만 — 리미터가 트랜지언트를 깎고 있습니다.'
           : crDb0 < 14 ? '크레스트 정상 범위 (드럼 루프는 보통 10~15 dB).'
           :              '크레스트 넓음 — 트랜지언트가 살아 있습니다.');
    const flats = chans.map(c => n2(c.flat)).filter(v => v !== null);
    L.push(flats.some(v => v > 0)
      ? '★ 플랫 팩터가 0 보다 큽니다 — 파형 상단이 잘렸다는 뜻(클리핑).'
      : '플랫 팩터 0 — 파형이 잘린 구간 없음.');
  }
  L.push('');
  L.push(`WAV: ${r.out}`);
  if (r.errs.length) L.push(`\n★ 페이지 오류: ${r.errs.join('; ')}`);
  if (!I && !chans.length) L.push('\n★ ffmpeg 출력 파싱 실패. 원문 일부:\n' + log.slice(-1200));
  return ok(L.join('\n'));
});

const judgeLufs = v => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '측정 불가';
  if (n > -9)  return '★ 과다 — 스트리밍에서 크게 깎임';
  if (n > -12) return '큼 (클럽·EDM 수준)';
  if (n > -16) return '스트리밍 표준권 (−14 목표)';
  return '조용함';
};
/* LRA 는 곡 전체의 라우드니스 변화폭을 재는 값이다.
   16스텝 루프를 반복 녹음하면 구간마다 내용이 같으므로 LRA 는
   구조적으로 0 에 가깝게 나온다 — 압축 정도와는 무관하다.
   여기서 "과압축" 이라고 판정하면 틀린 진단이 된다. */
const judgeLra = v => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '';
  if (n < 3) return '루프 반복이라 낮게 나오는 게 정상 (압축 지표 아님)';
  return '구간별 편차 있음';
};
const judgePeak = v => {
  if (v == null) return '';
  if (v >= 0)   return '★ 0 dBFS 도달 — 클리핑';
  if (v > -1)   return '★ 여유 부족 (−1 dBFS 초과)';
  return '여유 있음';
};

/* ═══ 4. 접근성 ═══ */
mcp.registerTool('a11y', {
  title: '접근성 검사',
  description: 'axe-core 로 WCAG 2.1 AA 위반을 검사해 심각도순으로 반환한다.',
  inputSchema: {
    file: z.string().optional().describe('기본 pulse16-mk16.html'),
    width: z.number().optional(), height: z.number().optional(),
  },
}, async ({ file = APP, width = 1280, height = 900 }) => {
  const base = await ensureServer();
  const page = await (await ensureBrowser()).newPage({ viewport: { width, height } });
  try {
    await page.goto(`${base}/${file}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const r = await page.evaluate(async () => await window.axe.run(document, {
      resultTypes: ['violations'],
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    }));
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    const v = r.violations.sort((a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9));
    if (!v.length) return ok(`# 접근성 — ${file} (${width}×${height})\n위반 없음`);
    const L = [`# 접근성 — ${file} (${width}×${height})`,
               `위반 ${v.length}종 · 총 ${v.reduce((s, x) => s + x.nodes.length, 0)}곳\n`];
    for (const x of v) {
      L.push(`## [${x.impact}] ${x.id} — ${x.nodes.length}곳`);
      L.push(x.help + ' (' + x.helpUrl.split('?')[0] + ')');
      L.push('예시 선택자: `' + (x.nodes.slice(0, 3).map(n => n.target.join(' ')).join('`, `')) + '`');
      const f = x.nodes[0]?.failureSummary;
      if (f) L.push(f.split('\n').map(s => s.trim()).filter(Boolean).map(s => '  ' + s).join('\n'));
      L.push('');
    }
    return ok(L.join('\n'));
  } finally { await page.close(); }
});

process.on('SIGINT', async () => { try { await browser?.close(); } catch {} process.exit(0); });
await mcp.connect(new StdioServerTransport());
