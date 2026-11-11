// Drift — home page: story builder + player.
(function () {
  const $ = (id) => document.getElementById(id);
  const FADE_MS = 2 * 60 * 1000; // fade out over the last two minutes
  const END_MS = 25 * 1000;      // say goodnight in the last 25 seconds

  // ---------- Story choices ----------
  const choices = { audience: 'adults', age: '6-8', theme: 'forest', mood: 'calm', timer: 20, sound: 'none' };

  Object.keys(THEMES).forEach((id) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme';
    b.dataset.value = id;
    b.setAttribute('aria-pressed', String(id === choices.theme));
    const label = document.createElement('strong');
    label.textContent = THEMES[id].label;
    const hint = document.createElement('span');
    hint.textContent = THEMES[id].hint;
    b.append(label, hint);
    $('themes').appendChild(b);
  });

  function setChoice(name, value) {
    choices[name] = name === 'timer' ? Number(value) : value;
    document.querySelectorAll('[data-choice="' + name + '"] [data-value]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.value === String(value)));
    });
    if (name === 'audience') $('kids-box').hidden = value !== 'kids';
    if (name === 'sound' && playing) Ambience.start(value);
  }

  document.querySelectorAll('[data-choice]').forEach((group) => {
    group.addEventListener('click', (e) => {
      const b = e.target.closest('[data-value]');
      if (b) setChoice(group.dataset.choice, b.dataset.value);
    });
  });

  function readChoices() {
    return {
      audience: choices.audience, age: choices.age, theme: choices.theme, mood: choices.mood,
      timer: choices.timer, hero: $('hero').value.trim(), voice: $('voice').value
    };
  }

  function showChoices(s) {
    ['audience', 'age', 'theme', 'mood', 'timer'].forEach((k) => setChoice(k, s[k]));
    $('hero').value = s.hero || '';
    $('voice').value = s.voice;
  }

  // ---------- Narrator voice ----------
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let canSpeak = !!synth;
  let voice = null;

  function pickVoice() {
    if (!synth) return;
    const english = synth.getVoices().filter((v) => /^en/i.test(v.lang));
    voice = english.find((v) => v.default) || english.find((v) => v.localService) || english[0] || null;
  }
  if (synth) {
    pickVoice();
    synth.addEventListener('voiceschanged', pickVoice);
  }

  // ---------- Player ----------
  let story = null;
  let nextLine = null;
  let lines = [];
  let idx = 0;
  let endIndex = -1;
  let elapsed = 0;
  let lastTick = 0;
  let playing = false;
  let finished = false;
  let token = 0;
  let waitTimer = null;
  let utterance = null; // kept so the browser doesn't drop it mid-sentence

  const totalMs = () => story.settings.timer * 60000;
  const remaining = () => totalMs() - elapsed;
  const fadeLevel = () => Math.max(0, Math.min(1, remaining() / FADE_MS));

  function phase() {
    const r = remaining();
    if (r <= END_MS) return 'end';
    if (r <= FADE_MS) return 'fade';
    return 'main';
  }

  function readingMs(text, rate) {
    const words = text.split(/\s+/).length;
    return (words / 140) * 60000 / rate;
  }

  function speakLine() {
    clearTimeout(waitTimer);
    const mine = ++token;
    if (idx >= lines.length) {
      const p = phase();
      lines.push(nextLine(p));
      if (p === 'end') endIndex = lines.length - 1;
    }
    render();

    const text = lines[idx];
    const v = VOICES[story.settings.voice];
    const f = fadeLevel();
    const littleOnes = story.settings.audience === 'kids' && story.settings.age === '3-5';
    const rate = v.rate * (littleOnes ? 0.92 : 1) * (0.85 + 0.15 * f);
    let handled = false;

    const done = () => {
      if (handled || mine !== token || !playing) return;
      handled = true;
      if (idx === endIndex) { finish(); return; }
      idx++;
      // Pauses between sentences grow longer as the story fades out.
      waitTimer = setTimeout(speakLine, 900 + (1 - f) * 1800);
    };

    if (canSpeak) {
      synth.cancel();
      utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = v.pitch;
      utterance.volume = v.volume * (0.2 + 0.8 * f);
      utterance.onend = done;
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        // Speech isn't available (e.g. no voices installed): show the text instead.
        canSpeak = false;
        $('speech-note').hidden = false;
        if (mine === token) waitTimer = setTimeout(done, readingMs(text, rate));
      };
      synth.speak(utterance);
      // Safety net: some browsers occasionally forget to report the end of a sentence.
      setTimeout(done, readingMs(text, rate) * 2.5 + 4000);
    } else {
      waitTimer = setTimeout(done, readingMs(text, rate));
    }
  }

  function stopSound() {
    token++;
    clearTimeout(waitTimer);
    if (synth) synth.cancel();
    Ambience.stop();
  }

  function play() {
    if (!story) return;
    if (finished) restart();
    playing = true;
    lastTick = performance.now();
    Ambience.setLevel(fadeLevel());
    Ambience.start(choices.sound);
    speakLine();
    updateControls();
  }

  function pause() {
    playing = false;
    stopSound();
    updateControls();
  }

  function finish() {
    playing = false;
    finished = true;
    stopSound();
    updateControls();
  }

  function restart() {
    nextLine = createStream(story);
    lines = [];
    idx = 0;
    endIndex = -1;
    elapsed = 0;
    finished = false;
  }

  function load(newStory, autoplay) {
    pause();
    story = newStory;
    restart();
    $('player-empty').hidden = true;
    $('player-story').hidden = false;
    $('story-title').textContent = story.title;
    $('story-meta').textContent = THEMES[story.settings.theme].label + ' · ' + storyMeta(story, true);
    $('time-total').textContent = story.settings.timer + ':00';
    $('generate-label').textContent = 'Create another story';
    $('speech-note').hidden = canSpeak;
    render();
    if (autoplay) play(); else updateControls();
  }

  function fmt(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function render() {
    const box = $('story-text');
    box.textContent = '';
    if (!lines.length) {
      box.textContent = 'Press play when you are ready, then close your eyes.';
      return;
    }
    const start = Math.max(0, idx - 3);
    for (let i = start; i <= idx && i < lines.length; i++) {
      const span = document.createElement('span');
      span.className = i === idx ? 'now' : 'before';
      span.textContent = lines[i] + ' ';
      box.appendChild(span);
    }
  }

  function updateControls() {
    $('icon-play').hidden = playing;
    $('icon-pause').hidden = !playing;
    $('play').setAttribute('aria-label', playing ? 'Pause' : finished ? 'Play again from the start' : 'Play');
    $('status').textContent = playing ? 'Now playing' : finished ? 'Sweet dreams' : elapsed > 0 ? 'Paused' : 'Ready to play';
    updateTime();
  }

  function updateTime() {
    if (!story) return;
    $('time-elapsed').textContent = fmt(Math.min(elapsed, totalMs()));
    $('progress-bar').style.width = Math.min(100, (elapsed / totalMs()) * 100) + '%';
  }

  setInterval(() => {
    if (!playing) return;
    const now = performance.now();
    elapsed += now - lastTick;
    lastTick = now;
    Ambience.setLevel(fadeLevel());
    if (elapsed >= totalMs() + 20000) finish(); // timer ran out
    updateTime();
  }, 500);

  // ---------- Buttons ----------
  $('generate').addEventListener('click', () => {
    const s = createStory(readChoices());
    Library.add(s);
    load(s, true);
    if (window.innerWidth < 900) $('player').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('again').addEventListener('click', () => {
    if (!story) return;
    const s = createStory(story.settings);
    Library.add(s);
    load(s, true);
  });

  $('play').addEventListener('click', () => (playing ? pause() : play()));

  $('back').addEventListener('click', () => {
    if (!story || !lines.length) return;
    idx = Math.max(0, idx - 2);
    if (playing) speakLine(); else render();
  });

  // Opened from "My stories"? Load that story, ready to play.
  const wanted = new URLSearchParams(location.search).get('story');
  const saved = wanted && Library.get(wanted);
  if (saved) {
    showChoices(saved.settings);
    load(saved, false);
  }
})();
