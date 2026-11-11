// Byte vs. the Data Grabbers — game logic
// Plain JavaScript, no build step. The page's HTML lives in index.html;
// this file keeps the game state and updates the page when it changes.
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ---------- Game content ----------
  const GD = {
    levels: [
      {
        name: 'Cookie Canyon', color: '#FFD54A', villain: 'Snoopsy Ad Network',
        taunt: 'Every click, every scroll, every pause. We keep it all!',
        goal: 'Zap 15 trackers before 5 of them slip through. Do not zap your own privacy settings.',
        byteIntro: 'Trackers follow people from site to site. Time to swat them!',
        byteHint: 'Zap the trackers. Leave my settings alone!',
        byteWin: 'Purr-fect! The canyon is tracker-free.',
        byteLose: 'Too many leaks! Let me reboot.',
        lesson: 'Ad trackers can follow you across sites and apps to build a profile of your habits. Blocking third-party trackers and limiting your ad ID makes that much harder.',
        loseText: 'Too many trackers slipped through and started building a profile of Byte.'
      },
      {
        name: 'Pop-Up Palace', color: '#FF7AB6', villain: 'Sly Subscriptions',
        taunt: 'Click the shiny button. Do not read. Do not think. Just click!',
        goal: 'Spot the dark patterns and pick the smart move in at least 3 of 4 rounds.',
        byteIntro: 'Dark patterns are tricky designs that nudge you to give up more than you meant to.',
        byteHint: 'Read the fine print with me!',
        byteWin: 'Sharp eyes! No trick gets past us.',
        byteLose: 'Those tricks were sneaky. Let us study up and retry.',
        lesson: 'Dark patterns steer people toward sharing data or staying subscribed. The FTC and state attorneys general have taken action against some of them, and you can spot many yourself.',
        loseText: 'Byte fell for too many tricks and clicked Accept on everything.'
      },
      {
        name: 'Broker Bazaar', color: '#A78BFA', villain: 'Slurp & Sell Data Brokers',
        taunt: 'Your location, your habits, your shopping guesses. All on sale today!',
        goal: 'Match each kind of data with the shield that protects it. Only 7 mix-ups allowed.',
        byteIntro: 'Data brokers collect and sell profiles about people. Let us find the shields!',
        byteHint: 'Match the data to its shield.',
        byteWin: 'Every kind of data has its shield!',
        byteLose: 'Too many mix-ups. Let me reboot.',
        lesson: 'Data brokers buy and sell personal information, often without people knowing. Opting out, limiting what apps collect and using your state privacy tools can shrink your footprint.',
        loseText: 'Too many mix-ups, and the brokers sold the whole profile.'
      },
      {
        name: 'Mega-Grab Fortress', color: '#FF6B5E', villain: 'Mega-Grab 9000',
        taunt: 'I hoard everything. Nobody can stop me!',
        goal: 'Use the right policy move against each attack. Three hits and Byte’s shield is gone.',
        byteIntro: 'The big boss! The best defense is strong privacy rules.',
        byteHint: 'Pick the right power move!',
        byteWin: 'Mega-Grab 9000 powers down!',
        byteLose: 'My shield broke. Reboot time!',
        lesson: 'Strong privacy rules rest on a few big ideas: collect less, ask clearly, let people delete their data, and have someone check that companies follow the rules.',
        loseText: 'Mega-Grab 9000 broke through Byte’s shield.'
      }
    ],
    trackers: ['Pixel Spy', 'Cookie Creeper', 'Fingerprinter', 'Ad Beacon', 'Data Gnat', 'Super Cookie'],
    quiz: [
      {
        head: 'We value your privacy!',
        body: 'Our 412 partners would love to follow you around the web.',
        box: '', primary: 'ACCEPT ALL', secondary: 'manage choices',
        prompt: 'What is Byte’s smartest move?',
        options: ['Smash the giant ACCEPT ALL button', 'Find "manage choices" and switch off the extras', 'Stare at the screen until it goes away'],
        correct: 1,
        explain: 'Banners often make "accept" huge and "decline" tiny. The quiet option is still your choice, so use it.',
        quips: { 2: 'Staring contest with a pop-up. I blinked first.' }
      },
      {
        head: 'Wait! Before you go...',
        body: 'Get 10% off your first order.',
        box: '', primary: 'Yes, sign me up!', secondary: 'No thanks, I like paying full price',
        prompt: 'What trick is this?',
        options: ['Confirmshaming: a guilt trip that pushes you toward yes', 'A friendly joke with no strings attached', 'A legal notice every site must show'],
        correct: 0,
        explain: 'Confirmshaming makes the "no" option sound foolish so you will click yes. You can click no anyway.',
        quips: { 1: 'Funny? Not when it steers my clicks.' }
      },
      {
        head: 'Almost done!',
        body: 'Create your free account.',
        box: 'Share my info with our partners (412 of them)', primary: 'Create account', secondary: '',
        prompt: 'What should Byte do first?',
        options: ['Leave it checked. It is probably fine!', 'Uncheck the pre-ticked box before continuing', 'Tick every other box too'],
        correct: 1,
        explain: 'Pre-ticked boxes count on you not noticing. Check every box before you continue.',
        quips: { 0: 'Probably fine is how most data gets sold.', 2: 'More boxes means more sharing. Not my best idea.' }
      },
      {
        head: 'Join in one click!',
        body: 'To cancel and delete your data, mail a signed letter to our headquarters.',
        box: '', primary: 'Join now', secondary: '',
        prompt: 'Easy in, hard out. What is Byte’s best move?',
        options: ['Mail the letter and wait', 'Send a deletion request online and cite your state privacy law if you have one', 'Give up and keep the account forever'],
        correct: 1,
        explain: 'Easy to join but hard to leave is sometimes called a roach motel. Many state privacy laws give you the right to ask for deletion.',
        quips: { 0: 'A stamp, an envelope, a week of waiting. No thanks.', 2: 'Forever is a long time, even for a robot cat.' }
      }
    ],
    pairs: [
      { data: 'Ad tracking ID', shield: 'Reset or turn it off', tip: 'Your phone lets you reset or limit the ad ID that follows you across apps.' },
      { data: 'Precise location', shield: 'Share only while using', tip: 'Share location only while an app is open, and only if it needs it.' },
      { data: 'Browsing trail', shield: 'Global Privacy Control', tip: 'Global Privacy Control sends an opt-out signal to every site you visit.' },
      { data: 'Broker profile', shield: 'Opt-out request', tip: 'Many brokers let you ask to opt out, and some states are building easier tools.' },
      { data: 'Dusty old accounts', shield: 'Close what you do not use', tip: 'Old accounts still hold your data. Ask to delete them.' }
    ],
    moves: [
      { name: 'Data Minimization', desc: 'Collect only what a service needs.' },
      { name: 'Real Consent', desc: 'Clear, opt-in, no tricks.' },
      { name: 'Right to Delete', desc: 'Ask a company to erase your data.' },
      { name: 'Independent Audits', desc: 'Someone checks the rules are followed.' }
    ],
    rounds: [
      { line: '“Consent? It is on page 47, in tiny gray text. Nobody reads that!”', answer: 1, win: 'Clear, opt-in consent means people say yes on purpose.', miss: 'That does not fix hidden fine print. What makes a yes meaningful?' },
      { line: '“Who is going to check our homework? Nobody!”', answer: 3, win: 'Audits and real enforcement make rules count.', miss: 'Rules need someone checking that companies follow them.' },
      { line: '“I will collect EVERYTHING, just in case. Forever!”', answer: 0, win: 'Data minimization means collecting only what a service needs.', miss: 'Think smaller. What limits how much a company can collect?' },
      { line: '“Delete your data? Never heard of it.”', answer: 2, win: 'The right to delete lets people ask companies to erase their data.', miss: 'Think about getting your data erased once you no longer want a company to have it.' }
    ]
  };

  // ---------- State ----------
  function blankHoles() {
    return Array.from({ length: 9 }, () => ({ t: 0, life: 1, k: '', name: '' }));
  }

  const state = {
    screen: 'title', level: 0, score: 0, levelStart: 0,
    mood: 'normal', moodT: 0, say: '',
    sound: false, sparks: [], rainbow: false, pets: 0, spinT: 0, hue: 0, emptyClicks: 0, titleN: 0,
    holes: blankHoles(), zapped: 0, leaks: 0,
    qi: 0, picked: -1, qOk: 0,
    cards: [], first: -1, lock: false, matches: 0, miss: 0,
    round: 0, shield: 3, bDone: false, bWrongs: []
  };

  let timer = null;
  let lastSp = 0;
  let sid = 0;

  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  function fin(win) {
    sfx(win ? 'win' : 'lose');
    return { screen: win ? 'win' : 'lose', say: '', mood: win ? 'happy' : 'hurt', moodT: 0 };
  }

  function deal() {
    const cards = [];
    GD.pairs.forEach((p, i) => {
      cards.push({ pair: i, side: 'data', label: p.data, flipped: false, matched: false });
      cards.push({ pair: i, side: 'shield', label: p.shield, flipped: false, matched: false });
    });
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  // ---------- Sound (made with the Web Audio API, no files needed) ----------
  const audio = { ac: null, master: null, mi: null, step: 0, nextT: 0 };

  function toggleSound() {
    const on = !state.sound;
    setState({ sound: on });
    if (on) startAudio();
    else stopAudio();
  }

  function startAudio() {
    try {
      if (!audio.ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audio.ac = new AC();
        audio.master = audio.ac.createGain();
        audio.master.gain.value = 0.5;
        audio.master.connect(audio.ac.destination);
      }
      if (audio.ac.state === 'suspended') audio.ac.resume();
      audio.step = 0;
      audio.nextT = audio.ac.currentTime + 0.1;
      if (audio.mi) clearInterval(audio.mi);
      audio.mi = setInterval(schedule, 120);
    } catch (e) { /* sound is optional */ }
  }

  function stopAudio() {
    if (audio.mi) {
      clearInterval(audio.mi);
      audio.mi = null;
    }
  }

  function note(freq, t, dur, type, vol) {
    const ac = audio.ac;
    if (!ac || !audio.master) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(audio.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function schedule() {
    const ac = audio.ac;
    if (!ac || !state.sound) return;
    const boss = state.screen === 'play' && state.level === 3;
    const len = boss ? 0.15 : 0.21;
    if (audio.nextT < ac.currentTime - 0.3) audio.nextT = ac.currentTime + 0.05;
    while (audio.nextT < ac.currentTime + 0.4) {
      playStep(audio.step, audio.nextT, boss, len);
      audio.nextT += len;
      audio.step = (audio.step + 1) % 32;
    }
  }

  function playStep(step, t, boss, len) {
    const happy = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const minor = [440, 523.25, 587.33, 659.25, 783.99, 880];
    const mh = [0, 2, 4, 2, 3, 2, 0, -1, 0, 2, 4, 5, 4, 2, 3, -1, 1, 3, 5, 3, 4, 3, 1, -1, 0, 2, 4, 3, 2, 1, 0, -1];
    const mb = [0, -1, 0, 2, 3, -1, 2, 0, 0, -1, 0, 2, 4, -1, 3, 2, 1, -1, 1, 3, 4, -1, 3, 1, 0, -1, 0, 2, 5, 4, 3, 2];
    const bh = [130.81, 110, 87.31, 98];
    const bb = [110, 87.31, 98, 82.41];
    const m = (boss ? mb : mh)[step];
    const scale = boss ? minor : happy;
    if (m >= 0) note(scale[m], t, len * 1.6, 'square', 0.07);
    const root = (boss ? bb : bh)[Math.floor(step / 8)];
    if (boss || step % 2 === 0) note(root, t, len * 1.8, 'triangle', 0.14);
  }

  function sfx(kind) {
    const ac = audio.ac;
    if (!ac || !state.sound) return;
    const t = ac.currentTime;
    const table = {
      zap: [[880, 0, 0.07, 'square'], [1320, 0.06, 0.1, 'square']],
      hurt: [[220, 0, 0.12, 'sawtooth'], [140, 0.1, 0.18, 'sawtooth']],
      flip: [[660, 0, 0.06, 'triangle']],
      match: [[784, 0, 0.08, 'square'], [988, 0.08, 0.08, 'square'], [1318, 0.16, 0.14, 'square']],
      good: [[784, 0, 0.08, 'square'], [1046, 0.08, 0.14, 'square']],
      meow: [[700, 0, 0.1, 'sine'], [950, 0.1, 0.12, 'sine'], [600, 0.22, 0.14, 'sine']],
      win: [[523, 0, 0.12, 'square'], [659, 0.12, 0.12, 'square'], [784, 0.24, 0.12, 'square'], [1046, 0.36, 0.3, 'square']],
      lose: [[392, 0, 0.15, 'triangle'], [330, 0.15, 0.15, 'triangle'], [262, 0.3, 0.3, 'triangle']]
    };
    (table[kind] || []).forEach((n) => note(n[0], t + n[1], n[2], n[3], 0.14));
  }

  // ---------- Sparkles ----------
  function addSparks(x, y, n, spread) {
    if (reduce) return;
    const rb = state.rainbow;
    const pal = rb
      ? ['#FF6B5E', '#FFA94D', '#FFD54A', '#5EEAD4', '#60A5FA', '#A78BFA', '#FF7AB6']
      : ['#FFD54A', '#FF7AB6', '#5EEAD4', '#A78BFA'];
    const add = [];
    for (let i = 0; i < n; i += 1) {
      sid += 1;
      add.push({
        id: sid,
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        life: 9,
        size: 8 + Math.random() * (rb ? 16 : 10),
        c: pal[Math.floor(Math.random() * pal.length)]
      });
    }
    setState({ sparks: state.sparks.concat(add).slice(-70) });
  }

  // Center of an element, measured from the top-left of the game frame.
  function centerOf(el) {
    const g = $('game').getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - g.left + r.width / 2, y: r.top - g.top + r.height / 2, w: r.width };
  }

  function onMove(e) {
    if (reduce) return;
    const now = Date.now();
    if (now - lastSp < 35) return;
    lastSp = now;
    const r = $('game').getBoundingClientRect();
    addSparks(e.clientX - r.left, e.clientY - r.top, state.rainbow ? 2 : 1, 14);
  }

  // ---------- Easter eggs ----------
  function petByte() {
    const pets = state.pets + 1;
    const lines = [
      'Purr... purr...',
      'Hehe, that tickles!',
      'Meow.exe is running smoothly.',
      'Careful, my whiskers are antennas!',
      'Cats nap 12 to 16 hours a day. I just reboot.'
    ];
    sfx('meow');
    const p = { pets: pets, mood: 'happy', moodT: 15, say: lines[(pets - 1) % lines.length] };
    if (pets % 7 === 0) {
      p.spinT = 9;
      p.say = 'Wheee! Backflip!';
    }
    if (pets % 15 === 0) {
      p.rainbow = !state.rainbow;
      p.say = !state.rainbow ? 'Secret unlocked: Rainbow Mode! Pet me 15 more times to switch it off.' : 'Rainbow Mode off. Back to plain old Byte.';
      p.moodT = 40;
      const c = centerOf($('byte'));
      addSparks(c.x, c.y, 24, 120);
    }
    setState(p);
  }

  function titleEgg() {
    const lines = [
      'Fun fact: real cats have 32 muscles in each ear. I have 32 tiny motors.',
      'My favorite snack is a lasagna made of ones and zeros.',
      'Psst! Pet me 15 times for a secret.'
    ];
    sfx('meow');
    setState({ titleN: state.titleN + 1, say: lines[state.titleN % lines.length], mood: 'happy', moodT: 50 });
  }

  function partyBurst() {
    sfx('win');
    const c = centerOf($('party'));
    addSparks(c.x, c.y + 120, 40, Math.max(320, c.w));
    setState({ say: 'Confetti time! Now go tell a friend.', mood: 'happy', moodT: 30 });
  }

  // ---------- Screen flow ----------
  function doStart() {
    setState({ screen: 'intro', level: 0, score: 0, levelStart: 0, say: '', mood: 'normal', moodT: 0 });
  }

  function doRestart() {
    setState({ screen: 'title', level: 0, score: 0, levelStart: 0, say: '', mood: 'normal', moodT: 0 });
  }

  function doLaunch() {
    const s = state;
    const score = s.screen === 'lose' ? s.levelStart : s.score;
    const base = { screen: 'play', say: '', mood: 'normal', moodT: 0, score: score, levelStart: score };
    if (s.level === 0) Object.assign(base, { holes: blankHoles(), zapped: 0, leaks: 0 });
    if (s.level === 1) Object.assign(base, { qi: 0, picked: -1, qOk: 0 });
    if (s.level === 2) Object.assign(base, { cards: deal(), first: -1, lock: false, matches: 0, miss: 0 });
    if (s.level === 3) Object.assign(base, { round: 0, shield: 3, bDone: false, bWrongs: [] });
    setState(base);
  }

  function doNext() {
    if (state.level >= 3) {
      setState({ screen: 'end', say: '', mood: 'happy', moodT: 0 });
    } else {
      setState({ screen: 'intro', level: state.level + 1, say: '', mood: 'normal', moodT: 0 });
    }
  }

  // ---------- Clock: runs 10 times a second ----------
  function tick() {
    const s = state;
    const p = {};
    let dirty = false;
    if (s.sparks.length > 0) {
      p.sparks = s.sparks
        .map((sp) => ({ id: sp.id, x: sp.x, y: sp.y + 1.5, life: sp.life - 1, size: sp.size, c: sp.c }))
        .filter((sp) => sp.life > 0);
      dirty = true;
    }
    if (s.spinT > 0) {
      p.spinT = s.spinT - 1;
      dirty = true;
    }
    if (s.rainbow) {
      p.hue = (s.hue + 10) % 360;
      dirty = true;
    } else if (s.hue !== 0) {
      p.hue = 0;
      dirty = true;
    }
    if (s.moodT > 0) {
      p.moodT = s.moodT - 1;
      if (s.moodT === 1) {
        p.mood = 'normal';
        p.say = '';
      }
      dirty = true;
    }
    if (s.screen === 'play' && s.level === 0) {
      const holes = s.holes.map((h) => ({ t: h.t, life: h.life, k: h.k, name: h.name }));
      let leaks = s.leaks;
      let leaked = false;
      holes.forEach((h) => {
        if (h.t > 0) {
          h.t -= 1;
          if (h.t === 0) {
            if (h.k === 'bad') {
              leaks += 1;
              leaked = true;
            }
            h.k = '';
            h.name = '';
          }
        }
      });
      const active = holes.filter((h) => h.t > 0).length;
      const maxActive = s.zapped < 5 ? 2 : s.zapped < 10 ? 3 : 4;
      if (active < maxActive && Math.random() < 0.4) {
        const empties = [];
        holes.forEach((h, i) => { if (h.t === 0) empties.push(i); });
        if (empties.length > 0) {
          const i = empties[Math.floor(Math.random() * empties.length)];
          const life = Math.max(9, 16 - Math.floor(s.zapped / 2));
          const good = Math.random() < 0.18;
          const names = GD.trackers;
          holes[i] = {
            t: life, life: life, k: good ? 'good' : 'bad',
            name: good ? 'Your Settings' : Math.random() < 0.06 ? 'Totally Not Spying' : names[Math.floor(Math.random() * names.length)]
          };
        }
      }
      p.holes = holes;
      dirty = true;
      if (leaked) {
        sfx('hurt');
        p.leaks = leaks;
        p.mood = 'hurt';
        p.moodT = 8;
        p.say = 'Ouch! A tracker slipped through.';
        if (leaks >= 5) Object.assign(p, fin(false));
      }
    }
    if (dirty) setState(p);
  }

  // ---------- Level 1: zap trackers ----------
  function zap(i) {
    const s = state;
    if (s.screen !== 'play' || s.level !== 0) return;
    const h = s.holes[i];
    if (!h) return;
    if (h.t <= 0) {
      const n = s.emptyClicks + 1;
      const q = { emptyClicks: n };
      if (n % 6 === 0) {
        q.say = 'Nothing here but a dust bunny. Meow.';
        q.mood = 'happy';
        q.moodT = 15;
      }
      setState(q);
      return;
    }
    const holes = s.holes.map((x, j) => (j === i ? { t: 0, life: 1, k: '', name: '' } : x));
    if (h.k === 'bad') {
      const zapped = s.zapped + 1;
      const rare = h.name === 'Totally Not Spying';
      sfx('zap');
      const say = rare ? 'Totally not spying? Busted! Bonus points.' : h.name === 'Super Cookie' ? 'Cookie crumbs! Nom nom nom.' : 'Zap! ' + h.name + ' is toast.';
      const p = { holes: holes, zapped: zapped, score: s.score + (rare ? 40 : 10), mood: 'happy', moodT: 8, say: say };
      if (zapped >= 15) Object.assign(p, fin(true));
      setState(p);
    } else {
      sfx('hurt');
      const leaks = s.leaks + 1;
      const p = { holes: holes, leaks: leaks, mood: 'hurt', moodT: 10, say: 'Oops! That was your own privacy setting.' };
      if (leaks >= 5) Object.assign(p, fin(false));
      setState(p);
    }
  }

  // ---------- Level 2: dark patterns ----------
  function pickQ(oi) {
    const s = state;
    if (s.screen !== 'play' || s.level !== 1 || s.picked !== -1) return;
    const q = GD.quiz[s.qi];
    const ok = oi === q.correct;
    sfx(ok ? 'good' : 'hurt');
    setState({
      picked: oi,
      qOk: s.qOk + (ok ? 1 : 0),
      score: s.score + (ok ? 25 : 0),
      mood: ok ? 'happy' : 'hurt',
      moodT: 25,
      say: ok ? 'Gotcha! Nice catch.' : (q.quips && q.quips[oi]) || 'Hmm, that was a sneaky one.'
    });
  }

  function doNextQ() {
    const s = state;
    if (s.level !== 1) return;
    if (s.qi < GD.quiz.length - 1) {
      setState({ qi: s.qi + 1, picked: -1, say: '', mood: 'normal', moodT: 0 });
    } else {
      setState(fin(s.qOk >= 3));
    }
  }

  // ---------- Level 3: memory match ----------
  function flip(i) {
    const s = state;
    if (s.screen !== 'play' || s.level !== 2 || s.lock) return;
    const c = s.cards[i];
    if (!c || c.flipped || c.matched) return;
    const cards = s.cards.map((x, j) => (j === i ? Object.assign({}, x, { flipped: true }) : x));
    if (s.first === -1) {
      sfx('flip');
      setState({ cards: cards, first: i });
      return;
    }
    const a = s.first;
    if (cards[a].pair === cards[i].pair) {
      cards[a] = Object.assign({}, cards[a], { matched: true });
      cards[i] = Object.assign({}, cards[i], { matched: true });
      sfx('match');
      const matches = s.matches + 1;
      const p = { cards: cards, first: -1, matches: matches, score: s.score + 20, mood: 'happy', moodT: 40, say: GD.pairs[c.pair].tip };
      if (matches >= GD.pairs.length) {
        p.lock = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (state.screen === 'play' && state.level === 2) setState(Object.assign({ lock: false }, fin(true)));
        }, 1100);
      }
      setState(p);
    } else {
      sfx('hurt');
      const miss = s.miss + 1;
      setState({ cards: cards, first: -1, lock: true, miss: miss, mood: 'hurt', moodT: 12, say: 'Not a match. Remember where those are!' });
      clearTimeout(timer);
      timer = setTimeout(() => {
        const t = state;
        if (t.screen !== 'play' || t.level !== 2) return;
        const cs = t.cards.map((x, j) => ((j === a || j === i) && !x.matched ? Object.assign({}, x, { flipped: false }) : x));
        const p = { cards: cs, lock: false };
        if (t.miss >= 7) Object.assign(p, fin(false));
        setState(p);
      }, 900);
    }
  }

  // ---------- Level 4: boss ----------
  function bossPick(mi) {
    const s = state;
    if (s.screen !== 'play' || s.level !== 3 || s.bDone || s.bWrongs.indexOf(mi) >= 0) return;
    const r = GD.rounds[s.round];
    if (mi === r.answer) {
      sfx('good');
      setState({ bDone: true, score: s.score + 30, mood: 'happy', moodT: 25, say: 'Direct hit!' });
    } else {
      sfx('hurt');
      const shield = s.shield - 1;
      const p = { shield: shield, bWrongs: s.bWrongs.concat([mi]), mood: 'hurt', moodT: 20, say: 'Ow! That did not work.' };
      if (shield <= 0) Object.assign(p, fin(false));
      setState(p);
    }
  }

  function doNextRound() {
    const s = state;
    if (s.level !== 3) return;
    if (s.round < GD.rounds.length - 1) {
      setState({ round: s.round + 1, bDone: false, bWrongs: [], say: '', mood: 'normal', moodT: 0 });
    } else {
      setState(fin(true));
    }
  }

  // ---------- Build the repeating buttons once ----------
  function el(tag, cls, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function makePips(id, n) {
    return Array.from({ length: n }, () => el('span', 'pip', $(id)));
  }

  const ui = {
    leakPips: makePips('leak-pips', 5),
    missPips: makePips('miss-pips', 7),
    shieldPips: makePips('shield-pips', 3),
    holes: [],
    options: [],
    cards: [],
    moves: []
  };

  for (let i = 0; i < 9; i += 1) {
    const b = el('button', 'hole tap', $('holes'));
    b.type = 'button';
    const name = el('span', 'hole-name', b);
    const hint = el('span', 'hole-hint', b);
    const bar = el('span', 'hole-bar', b);
    const fill = el('span', '', bar);
    b.addEventListener('click', () => zap(i));
    ui.holes.push({ b, name, hint, bar, fill });
  }

  for (let i = 0; i < 3; i += 1) {
    const b = el('button', 'option tap', $('q-options'));
    b.type = 'button';
    el('span', 'letter', b).textContent = 'ABC'[i];
    const text = el('span', '', b);
    b.addEventListener('click', () => pickQ(i));
    ui.options.push({ b, text });
  }

  for (let i = 0; i < GD.pairs.length * 2; i += 1) {
    const b = el('button', 'card tap', $('cards'));
    b.type = 'button';
    const tag = el('span', 'card-tag', b);
    const face = el('span', 'card-face', b);
    b.addEventListener('click', () => flip(i));
    ui.cards.push({ b, tag, face });
  }

  GD.moves.forEach((m, i) => {
    const b = el('button', 'move tap', $('moves'));
    b.type = 'button';
    el('span', 'move-name', b).textContent = m.name;
    el('span', 'move-desc', b).textContent = m.desc;
    const tag = el('span', 'move-tag', b);
    b.addEventListener('click', () => bossPick(i));
    ui.moves.push({ b, tag });
  });

  // ---------- Draw the page from the current state ----------
  function text(id, value) {
    const e = $(id);
    if (e.textContent !== value) e.textContent = value;
  }

  function show(id, on) {
    $(id).hidden = !on;
  }

  function setDisabled(b, off) {
    b.setAttribute('aria-disabled', off ? 'true' : 'false');
  }

  const SCREENS = ['s-title', 's-intro', 's-play0', 's-play1', 's-play2', 's-play3', 's-win', 's-lose', 's-end'];

  function render() {
    const s = state;
    const L = s.level;
    const lv = GD.levels[L];
    const screen = s.screen;
    const isPlay = screen === 'play';
    const mood = s.mood;

    // Which screen is showing
    const current = isPlay ? 's-play' + L : 's-' + screen;
    SCREENS.forEach((id) => show(id, id === current));
    show('hud', screen === 'intro' || isPlay || screen === 'win' || screen === 'lose');

    // Byte
    $('eyes-normal').setAttribute('opacity', mood === 'normal' ? 1 : 0);
    $('eyes-happy').setAttribute('opacity', mood === 'happy' ? 1 : 0);
    $('eyes-hurt').setAttribute('opacity', mood === 'hurt' ? 1 : 0);
    $('mouth-smile').setAttribute('opacity', mood === 'hurt' ? 0 : 1);
    $('mouth-o').setAttribute('opacity', mood === 'hurt' ? 1 : 0);
    const byte = $('byte');
    byte.classList.toggle('big', screen === 'title' || screen === 'end');
    byte.classList.toggle('spin', s.spinT > 0);
    byte.style.filter = s.hue ? 'hue-rotate(' + s.hue + 'deg)' : '';

    let bubble = s.say;
    if (!bubble) {
      if (screen === 'title') bubble = 'Hi! I am Byte, a robot cat with a very good nose for data snoops.';
      else if (screen === 'intro') bubble = lv.byteIntro;
      else if (isPlay) bubble = lv.byteHint;
      else if (screen === 'win') bubble = lv.byteWin;
      else if (screen === 'lose') bubble = lv.byteLose;
      else bubble = 'We did it! Now tell a friend what you learned.';
    }
    text('bubble', bubble);

    const sound = $('sound');
    sound.setAttribute('aria-pressed', s.sound ? 'true' : 'false');
    text('sound', s.sound ? 'Sound: on' : 'Sound: off');

    // Top bar
    const scoreText = 'Score ' + s.score;
    $('hud-tag').style.background = lv.color;
    text('hud-tag', 'Level ' + (L + 1) + ' of 4');
    text('hud-name', lv.name);
    text('hud-score', scoreText);

    // Level intro
    $('intro-panel').style.borderTopColor = lv.color;
    $('intro-tag').style.color = lv.color;
    text('intro-tag', 'Level ' + (L + 1) + ' of 4');
    text('intro-name', lv.name);
    text('intro-villain', lv.villain);
    text('intro-taunt', '“' + lv.taunt + '”');
    text('intro-goal', lv.goal);

    // Win / lose / end
    text('win-title', lv.name + ' cleared!');
    text('win-lesson', lv.lesson);
    text('win-score', scoreText);
    text('btn-next', L >= 3 ? 'See what happens next' : 'Next adventure');
    text('lose-text', lv.loseText);
    text('end-text', 'Four adventures cleared. Final score: ' + s.score + '.');

    // Level 1
    if (current === 's-play0') {
      text('zap-text', 'Trackers zapped: ' + s.zapped + ' of 15');
      $('zap-bar').style.width = Math.round((100 * s.zapped) / 15) + '%';
      text('leak-text', 'Leaks: ' + s.leaks + ' of 5');
      ui.leakPips.forEach((pip, i) => { pip.style.background = i < s.leaks ? '#FF6B5E' : ''; });
      s.holes.forEach((h, i) => {
        const u = ui.holes[i];
        const empty = h.t <= 0;
        const bad = h.k === 'bad';
        u.b.style.background = empty ? '#2A2666' : bad ? '#FF6B5E' : '#5EEAD4';
        u.name.textContent = empty ? '' : h.name;
        u.hint.textContent = empty ? '' : bad ? 'Tap to zap!' : 'Keep me!';
        u.bar.style.opacity = empty ? 0 : 1;
        u.fill.style.width = (empty ? 0 : Math.round((100 * h.t) / h.life)) + '%';
        u.b.setAttribute('aria-label', empty ? 'Empty hole' : bad ? 'Zap tracker ' + h.name : 'Do not zap ' + h.name);
      });
    }

    // Level 2
    if (current === 's-play1') {
      const q = GD.quiz[s.qi] || GD.quiz[0];
      const answered = s.picked !== -1;
      text('q-head', q.head);
      text('q-body', q.body);
      show('q-boxrow', !!q.box);
      text('q-box', q.box);
      text('q-primary', q.primary);
      show('q-secondary', !!q.secondary);
      text('q-secondary', q.secondary);
      text('q-prompt', 'Round ' + (s.qi + 1) + ' of ' + GD.quiz.length + ': ' + q.prompt);
      ui.options.forEach((u, oi) => {
        let bg = '';
        let fg = '';
        let bd = '';
        if (answered && oi === q.correct) { bg = '#5EEAD4'; fg = '#14123A'; bd = '#5EEAD4'; }
        else if (answered && oi === s.picked) { bg = '#FF6B5E'; fg = '#14123A'; bd = '#FF6B5E'; }
        u.b.style.background = bg;
        u.b.style.color = fg;
        u.b.style.borderColor = bd;
        u.text.textContent = q.options[oi];
        setDisabled(u.b, answered);
      });
      show('q-result', answered);
      text('q-result-title', s.picked === q.correct ? 'Nice catch!' : 'Tricky, right?');
      text('q-explain', q.explain);
      text('btn-nextq', s.qi < GD.quiz.length - 1 ? 'Next round' : 'Finish level');
    }

    // Level 3
    if (current === 's-play2') {
      text('pair-text', 'Pairs matched: ' + s.matches + ' of ' + GD.pairs.length);
      text('miss-text', 'Mix-ups: ' + s.miss + ' of 7');
      ui.missPips.forEach((pip, i) => { pip.style.background = i < s.miss ? '#FF6B5E' : ''; });
      s.cards.forEach((c, i) => {
        const u = ui.cards[i];
        const up = c.flipped || c.matched;
        const data = c.side === 'data';
        u.b.classList.toggle('down', !up);
        u.b.style.background = up ? (data ? '#FF6B5E' : '#5EEAD4') : '';
        u.b.style.borderColor = c.matched ? '#FFD54A' : '';
        u.tag.textContent = up ? (data ? 'Your data' : 'Shield') : '';
        u.face.textContent = up ? c.label : '?';
        u.b.setAttribute('aria-label', up ? (data ? 'Your data: ' : 'Shield: ') + c.label : 'Hidden card, tap to flip');
        setDisabled(u.b, up || s.lock);
      });
    }

    // Level 4
    if (current === 's-play3') {
      const r = GD.rounds[s.round] || GD.rounds[0];
      const cleared = s.round + (s.bDone ? 1 : 0);
      text('boss-line', r.line);
      $('boss-hp').style.width = Math.round(100 * (1 - cleared / GD.rounds.length)) + '%';
      ui.shieldPips.forEach((pip, i) => { pip.style.background = i < s.shield ? '#5EEAD4' : ''; });
      text('b-prompt', 'Attack ' + (s.round + 1) + ' of ' + GD.rounds.length + '. Pick Byte’s move:');
      ui.moves.forEach((u, mi) => {
        const wrong = s.bWrongs.indexOf(mi) >= 0;
        const right = s.bDone && mi === r.answer;
        u.b.style.background = right ? '#5EEAD4' : wrong ? '#3B3680' : '';
        u.b.style.color = wrong ? '#C9C5F2' : '';
        u.tag.textContent = right ? 'It worked!' : wrong ? 'Not effective' : '';
        setDisabled(u.b, s.bDone || wrong);
      });
      text('b-msg', s.bDone ? r.win : s.bWrongs.length > 0 ? r.miss : 'Choose the move that stops this attack.');
      show('btn-nextround', s.bDone);
      text('btn-nextround', s.round < GD.rounds.length - 1 ? 'Next attack' : 'Finish the fight');
    }

    // Sparkles
    const layer = $('sparkles');
    layer.textContent = '';
    s.sparks.forEach((sp) => {
      const e = el('span', 'spark', layer);
      e.style.left = Math.round(sp.x - sp.size / 2) + 'px';
      e.style.top = Math.round(sp.y - sp.size / 2) + 'px';
      e.style.width = e.style.height = Math.round(sp.size) + 'px';
      e.style.background = sp.c;
      e.style.opacity = (sp.life / 9).toFixed(2);
      e.style.transform = 'rotate(' + (9 - sp.life) * 25 + 'deg)';
    });

    // Keyboard users: if the button they were on just disappeared,
    // move focus to the first button on the new screen.
    const active = document.activeElement;
    if (active && active !== document.body && active.closest('.stage') && active.offsetParent === null) {
      const next = $(current).querySelector('button');
      if (next) next.focus();
    }
  }

  // ---------- Wire up the fixed buttons ----------
  $('byte').addEventListener('click', petByte);
  $('sound').addEventListener('click', toggleSound);
  $('title-egg').addEventListener('click', titleEgg);
  $('party').addEventListener('click', partyBurst);
  $('btn-start').addEventListener('click', doStart);
  $('btn-launch').addEventListener('click', doLaunch);
  $('btn-retry').addEventListener('click', doLaunch);
  $('btn-next').addEventListener('click', doNext);
  $('btn-nextq').addEventListener('click', doNextQ);
  $('btn-nextround').addEventListener('click', doNextRound);
  $('btn-restart').addEventListener('click', doRestart);
  $('game').addEventListener('mousemove', onMove);

  render();
  setInterval(tick, 100);
})();
