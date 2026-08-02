# 멜로디 자료 — melody/

`genres/` 가 **악기·음색**, `patterns/` 가 **박자**를 다룹니다.
여기는 **선율**만 다룹니다.

| 폴더 | 다루는 것 |
|---|---|
| [../genres/](../genres/) | 악기 · 음색 · 수치 |
| [../patterns/](../patterns/) | 드럼 박자 · 화성 아키타입(1마디) |
| **melody/** | **16마디 선율 — 음역 · 리듬 · 윤곽 · 도수 관용구** |

---

## 1. 왜 16마디인가

기존 `patterns/00-harmony.md` 의 화성 아키타입은 **1마디**입니다.
1마디를 반복하면 그루브는 되지만 선율은 안 됩니다. 선율은
"긴장을 쌓고 푸는" 구조라 최소 8마디, 보통 16마디가 한 덩어리입니다.

16마디를 쓰는 이유는 대중음악의 절(verse)·후렴(chorus)이 대개
8마디 또는 16마디이기 때문입니다. 8마디 두 번으로 읽어도 됩니다.

---

## 2. 표기

`patterns/README.md` §1 의 건반 트랙 표기를 그대로 씁니다.

| 기호 | 뜻 |
|---|---|
| `a`~`h` | **단음** — 스케일의 0~7도 |
| `0`~`7` | **3화음** — 그 도수를 근음으로 (인덱스 r, r+2, r+4) |
| `-` | 쉼 |

선율은 단음(`a`~`h`)이 기본입니다. 화음은 강조하고 싶은 자리에만 씁니다.

**도수는 절대 음이 아닙니다.** 근음(Root)과 스케일 노브를 따라갑니다.
같은 선율이 Minor Pentatonic 에서는 5음, Natural Minor 에서는 7음으로 읽힙니다.

```
스케일별 a~h 가 가리키는 반음
  Minor Pentatonic : 0  3  5  7 10 12 15 17
  Natural Minor    : 0  2  3  5  7  8 10 12
  Dorian           : 0  2  3  5  7  9 10 12
  Major            : 0  2  4  5  7  9 11 12
```

---

## 3. 원칙

선율을 지어낼 때 지킨 것들입니다.

1. **도약 뒤에는 순차진행.** 4도 이상 뛰면 그 다음은 반대 방향으로 한 도수씩.
   이게 없으면 아르페지오지 선율이 아닙니다.
2. **쉼이 음만큼 중요합니다.** 16스텝을 다 채우면 선율이 아니라 시퀀스가 됩니다.
   장르별로 밀도를 다르게 잡았습니다(§ [00-analysis.md](00-analysis.md) 표).
3. **반복 + 변형.** 1~4마디를 5~8마디에서 끝만 바꿔 되풀이합니다.
   완전히 새로운 4마디를 네 번 이으면 기억에 안 남습니다.
4. **마지막 마디는 비웁니다.** 다음 덩어리로 넘어갈 자리를 남기고,
   필인(드럼)이 그 자리를 채웁니다.
5. **음역은 keys 트랙의 옥타브 노브를 따릅니다.** 도수만 정하므로
   장르별 음역은 `TONE_KIT` 의 옥타브가 아니라 사용자가 정합니다.

---

## 4. 파일

번호가 두 덩어리입니다. **00~02 는 공통 이론**, **10~20 은 계열별**입니다.
계열별 파일은 `../genres/` 의 A~K 순서를 그대로 따릅니다.

### 공통

| 파일 | 내용 |
|---|---|
| [00-analysis.md](00-analysis.md) | 장르별 선율 특성 — 밀도 · 윤곽 · 관용구 · 그리드의 한계 |
| [01-harmony.md](01-harmony.md) | 화성학 기초 — 도수 · 화음 · 기능 · 진행 · 케이던스 |
| [02-melody-theory.md](02-melody-theory.md) | 선율 작법 — 윤곽 · 도약 · 정점 · 프레이즈 · **지표 ①~⑫** |

### 계열별

각 파일이 **음정 어휘 · 리듬 어휘 · 악구 형식 · 기타 리프 · 베이스 라인 ·
코드 키 매핑 · 지표 예외 · 레퍼런스**를 같은 순서로 담습니다.

| 파일 | 계열 | 짝이 되는 장르 문서 |
|---|---|---|
| [10-rock.md](10-rock.md) | A. Rock | [../genres/01-rock.md](../genres/01-rock.md) |
| [11-pop.md](11-pop.md) | B. Pop | [../genres/02-pop.md](../genres/02-pop.md) |
| [12-hiphop.md](12-hiphop.md) | C. Hip Hop | [../genres/03-hiphop.md](../genres/03-hiphop.md) |
| [13-rnb-soul-funk.md](13-rnb-soul-funk.md) | D. R&B · Soul · Funk | [../genres/04-rnb-soul-funk.md](../genres/04-rnb-soul-funk.md) |
| [14-electronic.md](14-electronic.md) | E. Electronic | [../genres/05-electronic.md](../genres/05-electronic.md) |
| [15-jazz.md](15-jazz.md) | F. Jazz | [../genres/06-jazz.md](../genres/06-jazz.md) |
| [16-roots.md](16-roots.md) | G. Blues · Country · Folk | [../genres/07-roots.md](../genres/07-roots.md) |
| [17-latin.md](17-latin.md) | H. Latin | [../genres/08-latin.md](../genres/08-latin.md) |
| [18-caribbean.md](18-caribbean.md) | I. Caribbean | [../genres/09-caribbean.md](../genres/09-caribbean.md) |
| [19-african.md](19-african.md) | J. African | [../genres/10-african.md](../genres/10-african.md) |
| [20-regional.md](20-regional.md) | K. 기타 지역 | [../genres/11-regional.md](../genres/11-regional.md) |

### 데이터

| 파일 | 내용 |
|---|---|
| `../src/data/melody.js` | PHRASE · FORM · MELODY · RIFF · BLINE 과 각 KIT 표 |
| `../src/data/preset-index.js` | PRESET_SUB · PRESET_CAT — 어느 프리셋이 어느 계열인지 |
| `../tools/analyze-melody.html` | §9 지표로 데이터를 재는 검사 하네스 |

---

## 4-1. 16마디 밖 — 32 · 64루프

`melody.js` 는 16마디 선율마다 **긴 판**을 함께 만듭니다.
키 이름은 `프레이즈쌍_l32` · `프레이즈쌍_l64` 입니다 (예: `rock_l32`).

```
LONG_FORMS = { 32:[['AABA',0],['AABB',1]],
               64:[['AABA',0],['AABB',1],['ABAB',2],['AABA',0]] }
```

두 번째 값은 **모방진행(sequence)의 올림 단수**입니다.
16마디 덩어리를 그냥 두 번 트는 것과 다른 점이 셋입니다.

1. 덩어리마다 **폼이 바뀝니다** — 전개가 달라집니다.
2. 두 번째 덩어리부터는 도수를 통째로 올려 **새 재료**를 만듭니다.
3. 이어지는 자리의 종지를 **열어 둡니다**(`openEnd()` — 끝의 `a`→`b`,
   `0`→`1`). 마지막 덩어리만 닫습니다.

**64루프는 재료를 가립니다.** `LONG_64 = ['rock','pop','bal','cin','ant',
'jazz','amb','root']` 여덟 개에만 붙습니다 — 힙합·트랩처럼 두세 음 훅이
정체성인 계열에 64마디를 물리면 같은 두 음을 64번 듣게 됩니다.

`melodyLenPool(pool, pref)` 이 길이 선호에 맞춰 풀을 갈아 끼웁니다.
`'auto'` 는 16루프와 긴 것을 섞고, `'32'`·`'64'` 는 같은 재료의 긴 판이
있으면 그쪽으로 갑니다 — 없으면 16루프를 그대로 둡니다.

> **지표 ⑥(서로 다른 마디)은 긴 폼에 그대로 대면 안 됩니다.**
> 16마디를 전제로 잡은 값이라 32루프 0.38, 64루프 0.20~0.33 으로 내려갑니다.
> 64루프의 마지막 16마디는 **재현부**라 첫 덩어리를 되풀이하는 것이 형식입니다.
> ([02-melody-theory.md](02-melody-theory.md) §10 과 같은 성격의 예외입니다.)

---

## 5. 계열 이름은 지어내지 않습니다

계열(A~K)과 하위분기 이름은 **`../genres/00-tree.md` 와
`../src/data/preset-index.js` 의 `PRESET_CAT`·`PRESET_SUB` 에 실재하는 것만**
씁니다. 문서에서 새 계열명을 만들면 코드와 어긋나 곧 거짓말이 됩니다.

마찬가지로 계열별 문서가 인용하는 `PHRASE`·`MELODY`·`RIFF`·`BLINE` 키는
전부 `melody.js` 에서 확인한 것입니다.

---

## 6. 알려진 구멍 — `'pop_arch'`

`melodyPoolFor()` 의 마지막 fallback 이 `['pop_arch']` 인데
**`MELODY` 에 그런 키가 없습니다.**

```js
function melodyPoolFor(name){
  const sub=MELODY_KIT[PRESET_SUB[name]];
  if(sub) return sub;
  return MELODY_KIT_CAT[PRESET_CAT[name]] || ['pop_arch'];   // ← 없는 키
}
```

`PRESET_SUB` 의 355개 프리셋 중 **69개**가 여기로 떨어집니다 —
하위분기가 `MELODY_KIT` 에 없고 프리셋 이름도 `PRESET_CAT` 에 없는 경우입니다.
어느 하위분기가 비어 있는지는 각 계열 문서의 **"하위분기가 비어 있는 자리"**
절에 적었습니다.

`riffPoolFor()`·`blinePoolFor()` 의 fallback(`'rock_power'`·`'brock_aaba'`)은
실재하는 키라 문제가 없습니다 — 깨지는 것은 선율 쪽뿐입니다.

> 이 문서는 상태를 기록할 뿐 데이터를 고치지 않습니다.
