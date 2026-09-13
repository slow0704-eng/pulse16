/* tools/ci/_browser.mjs — 브라우저 검사(2·3단계)가 공유하는 뼈대.

   playwright 와 axe-core 는 **mcp/pulse-audit/node_modules** 에서 가져온다.
   저장소 루트에 package.json 을 두지 않기로 한 결정이다 — 루트에 그것이
   생기는 순간 «npm install 해야 도는 앱» 으로 오해받고, 그건 «더블클릭으로
   열린다» 는 이 저장소의 정체성을 흐린다. .gitignore 도 이미
   «mcp/pulse-audit 는 npm install 로 복원합니다» 라고 못박고 있다.

   정적 서버는 mcp/pulse-audit/server.js 의 ensureServer() 와 같은 방식이다. */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { ROOT, HTML } from './_lib.mjs';

const PKG = path.join(ROOT, 'mcp', 'pulse-audit', 'package.json');
export const auditRequire = createRequire(PKG);

export function loadPlaywright() {
  try {
    return auditRequire('playwright');
  } catch {
    console.error(`
❌ playwright 를 찾지 못했습니다.

   이 저장소는 npm 의존성을 mcp/pulse-audit 한 군데에만 둡니다.
   먼저 복원하세요:

       cd mcp/pulse-audit && npm ci && npx playwright install --with-deps chromium
`);
    process.exit(2);
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.md': 'text/markdown',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.wav': 'audio/wav',
};

/** 저장소 루트를 그대로 내주는 정적 서버. 포트는 OS 가 고른다. */
export async function startServer() {
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || HTML;
    const abs = path.resolve(ROOT, rel);
    if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      res.writeHead(404).end('not found'); return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(abs)] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${srv.address().port}`;
  return { origin, close: () => new Promise(r => srv.close(r)) };
}

export const fileUrl = (rel = HTML) => pathToFileURL(path.join(ROOT, rel)).href;

/* ── 콘솔 · 예외 수집 ────────────────────────────────────────────────
   page.on('console') 은 «브라우저가 콘솔에 찍은 것» 이고
   page.on('pageerror') 는 «잡히지 않은 예외» 다. 둘은 별개이므로
   따로 센다 — uncaught 예외가 콘솔 error 로도 세어지면 숫자가 흐려진다. */
export function watchPage(page) {
  const rec = { errors: [], warnings: [], uncaught: [], all: [] };
  page.on('console', m => {
    const e = { type: m.type(), text: m.text(), at: m.location() };
    rec.all.push(e);
    if (e.type === 'error') rec.errors.push(e);
    else if (e.type === 'warning') rec.warnings.push(e);
  });
  page.on('pageerror', err => rec.uncaught.push({ text: String(err && err.stack || err) }));
  return rec;
}

export const where = e =>
  e.at && e.at.url ? ` (${e.at.url.replace(/^.*\/(src\/|vendor\/)/, '$1')}:${e.at.lineNumber})` : '';

/* ── 전체 타임아웃 ──────────────────────────────────────────────────
   제약: 오래 도는 도구에는 반드시 타임아웃. 브라우저가 뜨다 멈추면
   CI 가 6시간 도는 대신 여기서 끊긴다.                                */
export function watchdog(seconds, label) {
  const t = setTimeout(() => {
    console.error(`\n❌ 시간 초과 — ${label} 이 ${seconds}초 안에 끝나지 않았습니다.`);
    process.exit(1);
  }, seconds * 1000);
  t.unref?.();
  return () => clearTimeout(t);
}
