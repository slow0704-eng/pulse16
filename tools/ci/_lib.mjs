/* tools/ci/_lib.mjs — 정적 검사 3종이 공유하는 도우미.
   외부 의존성 0. Node 내장 모듈만 씁니다.

   ⚠ 이 파일은 검사 도구입니다. src/ 를 읽기만 하고 절대 고치지 않습니다. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/* tools/ci/_lib.mjs → 저장소 루트는 두 단계 위 */
export const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
export const HTML = 'pulse16-mk16.html';

/* 경로를 항상 슬래시로 — 윈도우에서 비교가 어긋나지 않게 */
export const rel = p => relative(ROOT, p).split(sep).join('/');
export const abs = p => join(ROOT, ...p.split('/'));

export function read(relPath) {
  return readFileSync(abs(relPath), 'utf8');
}

/** 디렉터리를 훑어 확장자가 맞는 파일의 저장소 상대 경로를 돌려준다.
    node_modules · .git 은 건너뛴다. */
export function walk(dirRel, exts = ['.js']) {
  const out = [];
  const skip = new Set(['node_modules', '.git', '.playwright-mcp']);
  (function rec(d) {
    let entries;
    try { entries = readdirSync(d); } catch { return; }
    for (const name of entries) {
      if (skip.has(name)) continue;
      const full = join(d, name);
      const st = statSync(full);
      if (st.isDirectory()) rec(full);
      else if (exts.some(e => name.endsWith(e))) out.push(rel(full));
    }
  })(abs(dirRel));
  return out.sort();
}

/* ── 출력 ─────────────────────────────────────────────────────────── */

export const OK = '✅';
export const NG = '❌';
export const WARN = '⚠';

export function head(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 62 - title.length))}`);
}

/* ── 주석·문자열 지우기 ───────────────────────────────────────────────

   최상위 선언을 "열 0 에서 시작하는 줄" 로 판정하려면, 주석 안이나
   템플릿 문자열 안의 `const ...` 가 코드로 오인되면 안 된다.
   그래서 주석·문자열의 내용을 **같은 길이의 공백으로** 바꾼다.
   길이를 보존하므로 행·열 번호가 원본 그대로 유지된다.

   정규식 리터럴은 완벽히 가려내기 어렵다(나눗셈과 구분 불가).
   여기서는 «앞 토큰이 값이 될 수 없는 문자면 정규식» 이라는 통상의
   어림으로 처리한다 — 이 저장소의 코드에는 충분하다.            */
export function blankNonCode(source) {
  const n = source.length;
  const out = new Array(n);
  let i = 0;
  let prevMeaningful = ''; // 직전의 의미 있는 문자 (정규식 판정용)

  const push = (ch) => { out[i] = ch; };

  while (i < n) {
    const c = source[i];
    const c2 = source[i + 1];

    /* 줄 주석 */
    if (c === '/' && c2 === '/') {
      while (i < n && source[i] !== '\n') { push(' '); i++; }
      continue;
    }
    /* 블록 주석 */
    if (c === '/' && c2 === '*') {
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        out[i] = source[i] === '\n' ? '\n' : ' ';
        i++;
      }
      if (i < n) { out[i] = ' '; out[i + 1] = ' '; i += 2; }
      continue;
    }
    /* 문자열 · 템플릿 */
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      out[i] = quote; i++;               // 따옴표 자체는 남긴다
      while (i < n) {
        if (source[i] === '\\') {
          out[i] = ' '; out[i + 1] = source[i + 1] === '\n' ? '\n' : ' '; i += 2; continue;
        }
        if (source[i] === quote) { out[i] = quote; i++; break; }
        out[i] = source[i] === '\n' ? '\n' : ' ';
        i++;
      }
      prevMeaningful = quote;
      continue;
    }
    /* 정규식 리터럴 (어림) — 앞 토큰이 «값» 이 될 수 없으면 나눗셈이 아니라 정규식이다 */
    if (c === '/' && (prevMeaningful === '' || '(,=:[!&|?{};+-*%<>~^'.includes(prevMeaningful))) {
      let j = i + 1, inClass = false, closed = false;
      while (j < n && source[j] !== '\n') {
        if (source[j] === '\\') { j += 2; continue; }
        if (source[j] === '[') inClass = true;
        else if (source[j] === ']') inClass = false;
        else if (source[j] === '/' && !inClass) { closed = true; break; }
        j++;
      }
      if (closed) {
        for (let k = i; k <= j; k++) out[k] = ' ';
        i = j + 1;
        prevMeaningful = '/';
        continue;
      }
    }

    push(c);
    if (!/\s/.test(c)) prevMeaningful = c;
    i++;
  }
  return out.join('');
}

/* ── 최상위 선언 수집 ─────────────────────────────────────────────────

   "열 0 에서 시작하는 줄" 만 최상위로 본다 — 이 저장소는 중첩 코드를
   전부 들여쓰므로 이 규칙이 성립한다(ARCHITECTURE.md 의 분리 방식).

   한 줄에 여러 선언이 오는 경우(`const a=[], b=[], C=60;`)와
   여러 줄에 걸친 선언을 모두 잡기 위해, 선언이 시작된 뒤 괄호 깊이가
   0 으로 돌아오고 `;` 로 끝날 때까지 줄을 이어 붙여서 읽는다.        */
const DECL_RE = /^(?:(async)\s+)?(const|let|var|function|class)\s+/;

export function topLevelDecls(relPath) {
  const raw = read(relPath);
  const code = blankNonCode(raw);
  const lines = code.split('\n');
  const found = []; // {name, kind, file, line}

  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    const m = DECL_RE.exec(line);
    if (!m) continue;
    const kind = m[2];

    if (kind === 'function' || kind === 'class') {
      const nm = /^(?:async\s+)?(?:function|class)\s*\*?\s*([A-Za-z_$][\w$]*)/.exec(line);
      if (nm) found.push({ name: nm[1], kind, file: relPath, line: ln + 1 });
      continue;
    }

    /* const · let · var — 선언문 전체를 모아서 선언자들을 가른다 */
    let text = line, depth = bracketDelta(line), end = ln;
    while (end + 1 < lines.length && (depth > 0 || !/;\s*$/.test(text.trimEnd()))) {
      /* 다음 줄이 또 다른 최상위 선언이면 여기서 끊는다 (세미콜론 생략 대비) */
      if (depth <= 0 && DECL_RE.test(lines[end + 1])) break;
      end++;
      text += '\n' + lines[end];
      depth += bracketDelta(lines[end]);
      if (end - ln > 400) break; // 안전장치
    }
    const body = text.replace(DECL_RE, '');
    for (const nm of declaratorNames(body)) {
      found.push({ name: nm, kind, file: relPath, line: ln + 1 });
    }
  }
  return found;
}

function bracketDelta(s) {
  let d = 0;
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') d++;
    else if (ch === ')' || ch === ']' || ch === '}') d--;
  }
  return d;
}

/** `a=[], b=1, {x,y}=o` → ['a','b','x','y'] */
function declaratorNames(body) {
  const names = [];
  let depth = 0, cur = '';
  const flush = () => { if (cur.trim()) names.push(...namesOfDeclarator(cur)); cur = ''; };
  for (const ch of body) {
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { flush(); continue; }
    if (ch === ';' && depth === 0) { flush(); break; }
    cur += ch;
  }
  flush();
  return names;
}

function namesOfDeclarator(d) {
  const lhs = d.split('=')[0].trim();
  if (!lhs) return [];
  if (lhs.startsWith('{') || lhs.startsWith('[')) {
    /* 구조분해 — 바인딩되는 이름만 추린다 */
    const out = [];
    const re = /([A-Za-z_$][\w$]*)\s*(?::\s*([A-Za-z_$][\w$]*))?/g;
    let m;
    while ((m = re.exec(lhs))) out.push(m[2] || m[1]);
    return out;
  }
  const m = /^([A-Za-z_$][\w$]*)/.exec(lhs);
  return m ? [m[1]] : [];
}

/* ── HTML 의 <script src> 목록 ────────────────────────────────────── */

export function scriptsInHtml(htmlRel = HTML) {
  const src = read(htmlRel);
  const lines = src.split('\n');
  const out = [];
  lines.forEach((line, i) => {
    const m = /<script[^>]*\bsrc\s*=\s*["']([^"']+)["']/.exec(line);
    if (m) out.push({ src: m[1], line: i + 1 });
  });
  return out;
}

/* ── HTML 의 id="..." 목록 ────────────────────────────────────────── */

export function idsInHtml(htmlRel = HTML) {
  const src = read(htmlRel);
  const lines = src.split('\n');
  const out = new Map(); // id → 첫 등장 행
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)) {
      if (!out.has(m[1])) out.set(m[1], i + 1);
    }
  });
  return out;
}
