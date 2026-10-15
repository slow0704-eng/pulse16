"""레퍼런스와 우리 렌더를 같은 자로 잰다. 인자: wav 경로 → stdout 에 JSON 한 줄.

비교 가능한 것만 잰다 — 마스터된 상업 음원과 루프 렌더를 같은 축에 둘 수 있는 성질:
  · 라우드니스(LUFS·LRA·트루피크)  — ffmpeg ebur128
  · 몸통(단기 RMS 상위 50% 구간)의 스펙트럼 균형 — 인트로·아웃트로가 평균을 끌지 않게
  · 스테레오 폭(사이드/미드), 크레스트, 타악/화성 에너지 비, 온셋 밀도, 템포
"""
import json, re, subprocess, sys
import numpy as np, soundfile as sf, librosa
from scipy.signal import welch

path = sys.argv[1]
x, sr = sf.read(path, always_2d=True, dtype='float32')
if x.shape[1] == 1:
    x = np.repeat(x, 2, axis=1)
L, R = x[:, 0], x[:, 1]
M, S = (L + R) / 2, (L - R) / 2

# ── 라우드니스 ──
o = subprocess.run(['ffmpeg', '-nostats', '-hide_banner', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                   capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
summ = o[o.rfind('Summary:'):]
num = lambda k: float(re.search(k + r':\s+(-?[\d.]+)', summ).group(1))
lufs, lra, tp = num('I'), num('LRA'), num('Peak')

# ── 몸통 구간: 3초 RMS 상위 50% ──
hop = int(sr * 0.5)
win = int(sr * 3)
rms = np.array([np.sqrt(np.mean(M[i:i + win] ** 2) + 1e-12) for i in range(0, max(1, len(M) - win), hop)])
thr = np.median(rms)
mask = np.zeros(len(M), bool)
for k, v in enumerate(rms):
    if v >= thr:
        mask[k * hop:k * hop + win] = True
Mb, Sb = M[mask], S[mask]

# ── 스펙트럼 균형: 대역 에너지 점유율 (몸통, 미드) ──
f, P = welch(Mb, sr, nperseg=8192)
BANDS = [('sub', 20, 60), ('bass', 60, 250), ('lowmid', 250, 500), ('mid', 500, 2000),
         ('himid', 2000, 4000), ('pres', 4000, 8000), ('air', 8000, 16000)]
tot = P[(f >= 20) & (f < 16000)].sum()
bands = {n: round(float(10 * np.log10(P[(f >= a) & (f < b)].sum() / tot)), 2) for n, a, b in BANDS}
# 1/3 옥타브 LTAS (1 kHz 대역 기준 0 dB) — 곡선 비교용
centers = 1000 * 2 ** (np.arange(-17, 14) / 3)  # 20 Hz ~ 16 kHz
ltas = []
for c in centers:
    sel = (f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6))
    ltas.append(10 * np.log10(P[sel].sum() + 1e-20) if sel.any() else None)
ref1k = ltas[17]
ltas = [round(float(v - ref1k), 2) if v is not None else None for v in ltas]

# ── librosa 특징 (22.05k 모노) ──
y = librosa.resample(Mb, orig_sr=sr, target_sr=22050)
ys = 22050
cent = float(np.median(librosa.feature.spectral_centroid(y=y, sr=ys)))
roll = float(np.median(librosa.feature.spectral_rolloff(y=y, sr=ys, roll_percent=0.85)))
flat = float(np.median(librosa.feature.spectral_flatness(y=y)))
H, Pc = librosa.effects.hpss(y)
perc_ratio = float(10 * np.log10(np.sum(Pc ** 2) / np.sum(H ** 2)))
onsets = librosa.onset.onset_detect(y=y, sr=ys, units='time')
onset_rate = len(onsets) / (len(y) / ys)
yfull = librosa.resample(M, orig_sr=sr, target_sr=22050)
tempo = float(np.atleast_1d(librosa.beat.beat_track(y=yfull, sr=ys)[0])[0])

crest = float(20 * np.log10(np.max(np.abs(Mb)) / np.sqrt(np.mean(Mb ** 2))))
width = float(10 * np.log10(np.mean(Sb ** 2) / np.mean(Mb ** 2) + 1e-12))
corr = float(np.corrcoef(L[mask], R[mask])[0, 1])

print(json.dumps(dict(lufs=lufs, lra=lra, tp=tp, dur=round(len(M) / sr, 1), tempo=round(tempo, 1),
                      centroid=round(cent), rolloff=round(roll), flatness=round(flat, 4),
                      perc_db=round(perc_ratio, 2), onset_rate=round(onset_rate, 2),
                      crest=round(crest, 2), side_db=round(width, 2), lr_corr=round(corr, 3),
                      bands=bands, ltas=ltas)))
