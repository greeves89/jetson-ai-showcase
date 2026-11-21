// Musik per Code: ruhiges Pad, weicher Puls, Zupftöne an den Szenenanfängen. Keine fremde Musik.
// musik(plan, ziel, wurzel) schreibt eine WAV (44,1 kHz, Stereo, 16 Bit), Länge = plan.gesamt.
import { writeFileSync } from "node:fs";

export function musik(plan, ziel, versatz = 0) {
  const SR = 44100, DAUER = plan.gesamt, N = Math.round(SR * DAUER);
  const L = new Float32Array(N), R = new Float32Array(N);
  const midi = (m) => 440 * Math.pow(2, (m + versatz - 69) / 12);
  const BEAT = 60 / 96, TAKT = BEAT * 4;
  const starts = plan.szenen.map((s) => s.start);
  let saat = 11 + versatz;
  const zufall = () => ((saat = (saat * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;
  const add = (i, l, r) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };

  // Pad: Cmaj7, Am7, Fmaj7, G6, je ein Takt
  const AK = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 55, 59]];
  const pad = new Float32Array(N * 2);
  for (let takt = 0; takt * TAKT < DAUER; takt++) {
    const t0 = takt * TAKT, noten = AK[takt % 4];
    const a = Math.floor((t0 - 0.3) * SR), e = Math.floor((t0 + TAKT + 0.6) * SR);
    for (let i = Math.max(0, a); i < Math.min(N, e); i++) {
      const t = i / SR;
      const hk = Math.min(1, (t - (t0 - 0.3)) / 0.6) * Math.min(1, (t0 + TAKT + 0.6 - t) / 0.9);
      let l = 0, r = 0;
      for (const n of noten) {
        const f = midi(n);
        l += Math.sin(2 * Math.PI * f * 0.9983 * t) + 0.25 * Math.sin(4 * Math.PI * f * t);
        r += Math.sin(2 * Math.PI * f * 1.0017 * t) + 0.25 * Math.sin(4 * Math.PI * f * t + 0.5);
      }
      pad[2 * i] += l * hk * 0.045; pad[2 * i + 1] += r * hk * 0.045;
    }
  }
  let pl = 0, pr = 0;
  for (let i = 0; i < N; i++) { pl += 0.08 * (pad[2 * i] - pl); pr += 0.08 * (pad[2 * i + 1] - pr); add(i, pl, pr); }

  // Bass und leiser Puls im Mittelteil
  const AB = 2.0, BIS = DAUER - 4.0;
  for (let b = 0; b * BEAT < DAUER; b++) {
    const t0 = b * BEAT;
    if (t0 < AB || t0 > BIS) continue;
    const grund = AK[Math.floor(t0 / TAKT) % 4][0] - 12;
    for (let i = 0; i < 0.3 * SR; i++) {
      const t = i / SR, f = 45 + 75 * Math.exp(-t * 30);
      const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 11) * 0.12;
      add(Math.floor(t0 * SR) + i, v, v);
    }
    if (b % 2 === 0) for (let i = 0; i < 0.5 * SR; i++) {
      const t = i / SR, v = Math.sin(2 * Math.PI * midi(grund) * t) * Math.exp(-t * 4) * Math.min(1, t * 200) * 0.14;
      add(Math.floor(t0 * SR) + i, v, v);
    }
    let alt = 0;
    for (let i = 0; i < 0.05 * SR; i++) {
      const t = i / SR, n = zufall(), h = n - alt; alt = n;
      const v = h * Math.exp(-t * 90) * 0.014;
      add(Math.floor((t0 + BEAT / 2) * SR) + i, v * 0.8, v);
    }
  }

  // Zupftöne an den Szenenanfängen
  const hall = new Float32Array(N * 2);
  const TOENE = [[76, 79, 83], [72, 76, 79], [69, 72, 76], [71, 74, 79]];
  const zupf = [[0.5, 76]];
  starts.forEach((s, i) => { if (i > 0) zupf.push([s + 0.2, TOENE[Math.floor(s / TAKT) % 4][i % 3]]); });
  zupf.push([DAUER - 3.2, 79], [DAUER - 2.6, 84]);
  for (const [t0, m] of zupf) {
    const f = midi(m);
    for (let i = 0; i < 0.9 * SR; i++) {
      const t = i / SR;
      const v = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t * 6) * Math.min(1, t * 400) * 0.07;
      const j = Math.floor(t0 * SR) + i;
      if (j < N) { hall[2 * j] += v; hall[2 * j + 1] += v; add(j, v, v); }
    }
  }
  // Rauschen bei Szenenwechseln
  for (const t0 of starts.slice(1)) {
    let lp = 0;
    const a = t0 - 0.4, e = t0 + 0.3;
    for (let i = Math.floor(a * SR); i < Math.floor(e * SR); i++) {
      const t = i / SR, hk = t < t0 ? (t - a) / 0.4 : 1 - (t - t0) / 0.3;
      lp += (0.02 + 0.25 * hk) * (zufall() - lp);
      const v = lp * hk * hk * 0.09;
      add(i, v * (0.8 + 0.2 * Math.sin(t * 9)), v * (0.8 + 0.2 * Math.cos(t * 9)));
    }
  }
  // Arpeggio, leise, in der Mitte
  const ARP_AB = DAUER * 0.2, ARP_BIS = DAUER * 0.8;
  for (let e = 0; (e * BEAT) / 2 < DAUER; e++) {
    const t0 = (e * BEAT) / 2;
    if (t0 < ARP_AB || t0 > ARP_BIS) continue;
    const noten = AK[Math.floor(t0 / TAKT) % 4];
    const f = midi(noten[[0, 2, 1, 3, 2, 1, 3, 2][e % 8]] + 24);
    const hk = Math.min(1, (t0 - ARP_AB) / 4) * Math.min(1, (ARP_BIS - t0) / 3);
    for (let i = 0; i < 0.35 * SR; i++) {
      const t = i / SR;
      const v = Math.sin(2 * Math.PI * f * t + 0.6 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 12)) * Math.exp(-t * 9) * Math.min(1, t * 300) * 0.026 * hk;
      add(Math.floor(t0 * SR) + i, v * (e % 2 ? 0.7 : 1), v * (e % 2 ? 1 : 0.7));
    }
  }
  // Echo für die Zupftöne
  { const d = Math.floor(0.3 * SR); let fl = 0, fr = 0;
    for (let i = d; i < N; i++) {
      fl += 0.3 * (hall[2 * (i - d) + 1] * 0.55 - fl);
      fr += 0.3 * (hall[2 * (i - d)] * 0.55 - fr);
      add(i, fl * 0.5, fr * 0.5);
    } }
  // Master: Ein- und Ausblenden, Sättigung, Normalisieren
  let spitze = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, g = Math.min(1, t / 0.5) * Math.min(1, Math.max(0, (DAUER - t) / 3.0));
    L[i] = Math.tanh(L[i] * g * 1.1); R[i] = Math.tanh(R[i] * g * 1.1);
    spitze = Math.max(spitze, Math.abs(L[i]), Math.abs(R[i]));
  }
  const faktor = 0.85 / spitze;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(L[i] * faktor * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(R[i] * faktor * 32767), 46 + i * 4);
  }
  writeFileSync(ziel, buf);
}
