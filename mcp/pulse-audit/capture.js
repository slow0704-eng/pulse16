/* 마스터 버스에서 원본 샘플을 한 개도 빠뜨리지 않고 걷어오는 AudioWorklet.

   AnalyserNode 폴링은 rAF 주기 사이의 샘플을 놓쳐 트루피크·클리핑을
   과소평가한다. 워클릿은 렌더 퀀텀 128샘플을 모두 보므로 정확하다.

   측정 자체는 하지 않는다. 원본 샘플을 그대로 Node 로 올려보내
   WAV 로 굳힌 뒤 ffmpeg 에 맡긴다 — 라우드니스 계산 같은 건
   손으로 짠 코드보다 표준 구현을 믿는 편이 낫다. */
export const RECORDER_SRC = `
class Rec extends AudioWorkletProcessor {
  constructor(){
    super();
    this.on = true;
    this.port.onmessage = e => { if(e.data === 'stop') this.on = false; };
  }
  process(inputs){
    if(!this.on) return false;
    const inp = inputs[0];
    if(!inp || !inp.length) return true;
    const L = inp[0];
    const R = inp.length > 1 ? inp[1] : inp[0];
    /* 복사해서 보낸다 — 입력 버퍼는 다음 퀀텀에 재사용된다 */
    const l = new Float32Array(L), r = new Float32Array(R);
    this.port.postMessage({ l, r }, [l.buffer, r.buffer]);
    return true;
  }
}
registerProcessor('pulse-rec', Rec);
`;

/** Float32 좌·우 채널 → 16bit PCM WAV 버퍼 */
export function toWav(left, right, sampleRate) {
  const n = Math.min(left.length, right.length);
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);          // PCM 청크 크기
  buf.writeUInt16LE(1, 20);           // PCM
  buf.writeUInt16LE(2, 22);           // 2채널
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);           // 블록 정렬
  buf.writeUInt16LE(16, 34);          // 비트 심도
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  let o = 44;
  /* 클리핑을 감추지 않도록 클램프만 하고 정규화는 하지 않는다.
     0 dBFS 를 넘긴 신호는 넘긴 그대로 잘려서 ffmpeg 에 잡혀야 한다. */
  for (let i = 0; i < n; i++) {
    for (const ch of [left, right]) {
      let s = ch[i];
      s = s > 1 ? 1 : s < -1 ? -1 : s;
      buf.writeInt16LE(Math.round(s * 32767), o);
      o += 2;
    }
  }
  return buf;
}
