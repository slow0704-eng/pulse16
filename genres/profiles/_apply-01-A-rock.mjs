/* 배치 A7 의 배정을 src/data/melody.js 의 세 프리셋 표에 넣는다.
   작업본이 CRLF 일 수 있으므로 줄바꿈을 파일에서 알아낸다. */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = process.argv[2];
const { groups } = await import(pathToFileURL(resolve(root, 'genres/profiles/_batch-01-A-rock.mjs')).href);

const RIFF = {
  motorik: ['rock_alt', 'rock_drive'], psych: ['rock_alt', 'rock_power'], space: ['arp_folk', 'rock_alt'],
  southern: ['arp_country', 'rock_drive'], hardrock: ['rock_power', 'rock_drive'],
  rocknroll: ['rock_drive', 'arp_country'], surf: ['rock_drive', 'arp_swing'],
  garage: ['rock_drive', 'rock_power'], postpunk: ['arp_folk', 'rock_alt'],
  dancepunk: ['funk_cut', 'rock_alt'], emo: ['arp_folk', 'rock_drive'],
  shoegaze: ['rock_power', 'arp_folk'], britpop: ['rock_alt', 'arp_folk'],
  lofi: ['arp_folk', 'arp_swing'], alt: ['rock_power', 'rock_alt'],
  countryrock: ['arp_country', 'rock_drive'],
};
const BASS = {
  motorik: ['brock_abab', 'brock_aaba'], psych: ['brock_aaba', 'brock_abab'], space: ['brock_abab', 'breg_aaba'],
  southern: ['bcou_aabb', 'bwal_aabb'], hardrock: ['brock_aaba', 'bmet_aabb'],
  rocknroll: ['bwal_aabb', 'bcou_aabb'], surf: ['brock_aabb', 'bcou_aaba'],
  garage: ['brock_aabb', 'brock_aaba'], postpunk: ['brock_abab', 'bdis_abab'],
  dancepunk: ['bdis_abab', 'bfun_abab'], emo: ['brock_abab', 'brock_aaba'],
  shoegaze: ['brock_aabb', 'breg_aaba'], britpop: ['brock_aabb', 'bdis_aabb'],
  lofi: ['bwal_aaba', 'brock_aabb'], alt: ['brock_aabb', 'bmet_aaab'],
  countryrock: ['bcou_aabb', 'brock_aabb'],
};
const MEL = Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g.pool]));

const q = s => "'" + s + "'";
function block(pick) {
  const L = [
    '  /* A. Rock 계열 29종 — 2026-09-15 배치 A7 (genres/profiles/01-A-rock.json)',
    '     Metal 13 · Punk 7 은 선율 없음이라 여기 없다. 드럼과 편성은 이미',
    '     개별화돼 있었고(드럼 47/49 · 편성 49/49) 선율만 하위분기에 묶여 있었다.',
    '     근거는 genres/01-rock.md 의 장르별 분석표와 실제 kit 이다. */'];
  for (const [k, g] of Object.entries(groups)) {
    L.push('  /* ' + g.why.split(/[.—]/)[0].trim() + ' */');
    for (const m of g.members)
      L.push('  ' + q(m).padEnd(26) + ':[' + pick[k].map(q).join(',') + '],');
  }
  return L;
}

const file = resolve(root, 'src/data/melody.js');
let s = readFileSync(file, 'utf8');
const NL = s.includes('\r\n') ? '\r\n' : '\n';

/* 각 함수 바로 앞의 `};` 앞에 끼운다 */
for (const [after, pick] of [
  ['function melodyPoolFor', MEL],
  /* 앵커는 코드 식별자여야 한다 — 전에는 한글 주석 문장이라 주석을 다듬으면
     깨졌다. 함수는 그 주석 다음 줄이고 사이에 `};` 가 없어 결과가 같다. */
  ['function riffPoolFor', RIFF],
  ['function blinePoolFor', BASS],
]) {
  const at = s.indexOf(after);
  if (at < 0) throw new Error('못 찾음: ' + after);
  const close = s.lastIndexOf('};', at);
  if (close < 0) throw new Error('닫는 괄호 못 찾음: ' + after);
  s = s.slice(0, close) + block(pick).join(NL) + NL + s.slice(close);
}
writeFileSync(file, s, 'utf8');
console.log('melody.js — 록 29종 × 3축 배정 완료');
