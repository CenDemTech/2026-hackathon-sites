// Drift — background sounds, generated live in the browser (no audio files needed).
const Ambience = (function () {
  let ctx = null;
  let master = null;
  let parts = [];
  let crackleTimer = null;
  let level = 1;
  const BASE = 0.5;

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noise(kind) {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === 'brown') {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = white;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  }

  function chain(src, filters, gainValue) {
    let node = src;
    filters.forEach(([type, freq]) => {
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      node.connect(f);
      node = f;
    });
    const g = ctx.createGain();
    g.gain.value = gainValue;
    node.connect(g);
    g.connect(master);
    src.start();
    parts.push(src);
    return g;
  }

  function crackle() {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    const src = noise('white');
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1500 + Math.random() * 2500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.15 + Math.random() * 0.25, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03 + Math.random() * 0.06);
    src.connect(hp); hp.connect(g); g.connect(master);
    src.start(t);
    src.stop(t + 0.15);
    crackleTimer = setTimeout(crackle, 80 + Math.random() * 600);
  }

  function stop() {
    clearTimeout(crackleTimer);
    crackleTimer = null;
    if (!ctx || !master) return;
    const old = master;
    const oldParts = parts;
    old.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(() => {
      oldParts.forEach((p) => { try { p.stop(); } catch (e) { /* already stopped */ } });
      old.disconnect();
    }, 2000);
    master = null;
    parts = [];
  }

  function start(kind) {
    stop();
    if (!kind || kind === 'none' || !audio()) return;
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.setTargetAtTime(BASE * level, ctx.currentTime, 1.2);

    if (kind === 'rain') {
      chain(noise('white'), [['highpass', 900], ['lowpass', 7000]], 0.12);
      chain(noise('brown'), [['lowpass', 500]], 0.5);
    } else if (kind === 'waves') {
      const swell = chain(noise('brown'), [['lowpass', 700]], 0.45);
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 0.09; // one slow wave about every 11 seconds
      depth.gain.value = 0.4;
      lfo.connect(depth);
      depth.connect(swell.gain);
      lfo.start();
      parts.push(lfo);
    } else if (kind === 'fire') {
      chain(noise('brown'), [['lowpass', 350]], 0.6);
      crackle();
    }
  }

  // 1 = full volume, 0 = silent. Used by the sleep timer to fade out.
  function setLevel(value) {
    level = Math.max(0, Math.min(1, value));
    if (ctx && master) master.gain.setTargetAtTime(BASE * level, ctx.currentTime, 0.5);
  }

  return { start, stop, setLevel };
})();
