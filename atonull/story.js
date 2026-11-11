// Drift — story builder.
// Stories are assembled from gentle, hand-written sentences. Each story has a
// "seed" number, so the same story can be replayed later from the library.
// To add your own sentences, add lines to the lists below.
// {name} = the main character's short name, {Name} = the same, capitalised,
// {hero} = the full description (e.g. "a sleepy otter named Pip"), {place} = the setting.

const THEMES = {
  forest: {
    label: 'Moonlit forest', hint: 'Owls, ferns, a quiet stream', place: 'the moonlit forest',
    kidHero: 'a little fox named Bramble',
    titles: ['{Name} and the Quiet Stream', 'Under the Silver Ferns', 'The Owl’s Lantern'],
    intro: [
      'Tonight, {hero} is walking slowly through {place}, where the trees are tall and the moon is bright.',
      'The forest is quiet, and the air is cool and smells of pine.'
    ],
    scenes: [
      '{Name} follows a narrow path between the ferns, each step soft on the moss.',
      'Far above, an old owl turns its head, blinks slowly, and settles back into its feathers.',
      'The stream runs over smooth stones, saying the same quiet thing again and again.',
      'Moonlight slips between the branches and lies in pale ribbons across the ground.',
      'A breeze moves through the high leaves, a long, slow hush, and then it is still.',
      '{Name} sits for a while on a fallen log, listening to the water.',
      'Somewhere a cricket sings three notes, rests, and sings them again.',
      'The ferns bow a little in the night air, as if they too are getting ready for sleep.',
      'A small lantern glows inside a hollow tree, turned down very low.',
      '{Name} dips a hand into the stream, and the water is cool and gentle.',
      'The path curves around a mossy rock and opens into a clearing, silver in the moonlight.',
      'A family of rabbits is already asleep in their burrow, curled up close together.'
    ]
  },
  ocean: {
    label: 'Slow ocean', hint: 'Tides, boats, soft waves', place: 'the slow ocean',
    kidHero: 'a sea otter named Pebble',
    titles: ['{Name} and the Lighthouse', 'The Little Boat', 'Where the Tide Sleeps'],
    intro: [
      'Tonight, {hero} is resting in a small wooden boat, floating on {place}.',
      'The water is calm and dark, and the moon makes a silver path across it.'
    ],
    scenes: [
      'The boat rocks on the water, up and down, up and down.',
      'The waves arrive one after another, unhurried, and fold themselves onto the sand.',
      '{Name} lies back and watches the clouds move slowly across the moon.',
      'Far off, a lighthouse turns its light, around and around, patient as breathing.',
      'The water laps against the side of the boat with a soft, round sound.',
      'The tide slides out a little, then back in, then out again.',
      'A gull floats on the dark water, its head tucked under its wing.',
      'The air tastes faintly of salt, cool and clean.',
      '{Name} trails one hand in the sea and feels it pull gently, then let go.',
      'The stars lean down to look at their reflections in the calm water.',
      'Somewhere far below, a slow whale hums one long, low note.',
      'The boat drifts, and there is nowhere it needs to be.'
    ]
  },
  space: {
    label: 'Drifting stars', hint: 'A gentle trip past planets', place: 'the drifting stars',
    kidHero: 'a little astronaut named Comet',
    titles: ['{Name} Among the Stars', 'The Quiet Galaxy', 'A Ship Called Lullaby'],
    intro: [
      'Tonight, {hero} is floating gently through {place} in a small, warm ship.',
      'Out here, everything moves slowly, and nothing makes a sound.'
    ],
    scenes: [
      'The little ship glides past a planet wrapped in soft blue clouds.',
      'A ring of tiny moons turns around a sleepy planet, like a mobile over a crib.',
      'Stars drift by the window, near ones and far ones, all of them twinkling quietly.',
      '{Name} pulls a warm blanket up and looks out at the long silver stream of the galaxy.',
      'The engine hums a low, even hum, steady as a heartbeat.',
      'A comet passes far away, trailing a soft tail of light.',
      'The ship turns gently, and a new field of stars comes into view.',
      'On a small round planet below, the night side is dotted with sleepy lights.',
      'There is no hurry here. The stars have all the time in the world.',
      '{Name} counts the stars that pass, one, and two, and three, and then loses count, and that is fine.',
      'A cloud of pale purple dust glows like a lamp turned all the way down.',
      'The ship’s lights dim to a soft, warm glow.'
    ]
  },
  village: {
    label: 'Snowy village', hint: 'Lanterns, warm kitchens', place: 'the snowy village',
    kidHero: 'a little mouse named Juniper',
    titles: ['{Name} and the Lantern Lane', 'The Quiet Snowfall', 'A Warm Kitchen'],
    intro: [
      'Tonight, {hero} is walking home through {place}.',
      'The snow is falling softly, and the windows glow with warm light.'
    ],
    scenes: [
      'Snow falls in big, slow flakes, and settles on the rooftops without a sound.',
      'Lanterns glow along the lane, each one a small circle of gold.',
      '{Name} walks past a bakery where the last loaves are cooling in the window.',
      'Inside a warm kitchen, a kettle sighs and a cat curls up beside the stove.',
      'Footprints in the snow fill in softly, one flake at a time.',
      'Chimney smoke rises straight up into the still, cold air.',
      '{Name} wraps a scarf a little tighter and breathes out a small cloud.',
      'The bell in the tower rings once, low and round, and the sound fades over the hills.',
      'A window upstairs goes dark as someone else in the village settles into bed.',
      'The snow makes everything quieter, as if the whole world is whispering.',
      '{Name} stops by a frozen pond where the moon lies flat and white on the ice.',
      'Somewhere a door closes gently, and a warm bed is waiting.'
    ]
  },
  train: {
    label: 'Night train', hint: 'Rocking carriages, rain', place: 'the night train',
    kidHero: 'a little bear named Clover',
    titles: ['{Name} and the Night Train', 'Rain on the Window', 'The Last Carriage'],
    intro: [
      'Tonight, {hero} is riding {place}, through the dark and gentle countryside.',
      'The carriage is warm, the lamps are low, and rain is tapping on the window.'
    ],
    scenes: [
      'The train rocks gently from side to side, a slow, steady rhythm.',
      'Rain runs in thin lines across the window, catching the light from the carriage lamps.',
      '{Name} leans into a soft seat and watches dark fields slide by.',
      'The wheels click over the rails, clickety-clack, clickety-clack, again and again.',
      'Far away, the lights of a small town glow, and then slip behind a hill.',
      'The conductor walks quietly down the aisle, dimming the lamps one by one.',
      'A cup of warm cocoa steams on the little table by the window.',
      '{Name} pulls a blanket over both knees and listens to the rain on the roof.',
      'The train slows through a sleeping station, and then gathers speed again.',
      'In the next carriage, someone turns the page of a book, very softly.',
      'The rain grows lighter, then heavier, then lighter again, like slow breathing.',
      'Each mile carries {name} a little further into the night, and a little closer to sleep.'
    ]
  },
  garden: {
    label: 'Secret garden', hint: 'Fireflies and moss', place: 'the secret garden',
    kidHero: 'a little hedgehog named Thistle',
    titles: ['{Name} and the Fireflies', 'Behind the Garden Wall', 'The Moonlit Fountain'],
    intro: [
      'Tonight, {hero} has found a small gate that opens into {place}.',
      'Inside, the grass is cool, and everything is green and quiet.'
    ],
    scenes: [
      'Fireflies rise from the grass and blink slowly, gold and green.',
      '{Name} follows a path of round stepping stones, each one soft with moss.',
      'A high stone wall wraps around the garden, keeping it safe and quiet.',
      'Night flowers open their petals and give off a sweet, gentle smell.',
      'A small fountain trickles in the middle of the garden, never in a hurry.',
      '{Name} sits on a wooden bench still warm from the day’s sun.',
      'A hedgehog shuffles under a leaf, turns around twice, and settles in to sleep.',
      'The moon rises over the wall and makes the whole garden silver.',
      'Ivy climbs slowly up the old gate, one leaf at a time.',
      'Moths drift past like tiny pieces of paper floating on the air.',
      'The grass is cool and damp, and smells green and fresh.',
      'A frog in the pond sings one soft note, and then another, and then rests.'
    ]
  }
};

const MOODS = {
  calm: { label: 'Calm', lines: [
    'The air is still and even.',
    'Everything moves at the pace of a slow breath.',
    'It is peaceful here, simple and quiet.',
    'Nothing changes quickly. Everything has time.'
  ] },
  cozy: { label: 'Cozy', lines: [
    'It feels like being wrapped in a thick, warm blanket.',
    'There is a cup of something warm close by.',
    'Everything is soft, and snug, and safe.',
    'It is warm here, like a room with a fire burning low.'
  ] },
  dreamy: { label: 'Dreamy', lines: [
    'The edges of things blur softly, like a picture painted in watercolor.',
    'It feels a little like floating.',
    'Colors fade into gentle shades of blue and silver.',
    'Thoughts drift by like clouds, and none of them need catching.'
  ] },
  nostalgic: { label: 'Nostalgic', lines: [
    'It reminds {name} of long summer evenings, a long time ago.',
    'Somewhere, an old song is playing very softly.',
    'It feels like coming home after a long time away.',
    'A happy memory floats up, warm and golden, and then drifts away again.'
  ] }
};

const CALM_LINES = [
  'Everything is slow here, and there is nothing that needs doing.',
  'Breathe in, slowly, and breathe out, even more slowly.',
  'The night is soft and wide and kind.',
  '{Name} feels heavy and warm, the way you feel right before sleep.',
  'Each sound is a little quieter than the one before.',
  'There is time, all the time in the world.',
  'Shoulders loosen. Hands rest. The day is done.',
  '{Name} yawns a long, slow yawn.',
  'The world is quiet, and safe, and still.',
  'It is good to rest now.',
  'Everything that happened today can wait until tomorrow.',
  'Slowly, slowly, the night goes on.'
];

const KID_LINES = [
  '{Name} is safe, and loved, and very, very sleepy.',
  'All the animals are tucking themselves in for the night.',
  'The moon is keeping watch, so {name} can rest.',
  '{Name} gives a big, cozy yawn.',
  'Everyone {name} loves is close by, and everything is all right.'
];

const FADE_LINES = [
  '{Name}’s eyes feel heavy now, and that is just right.',
  'Slower now. Softer now.',
  'The night wraps around {name} like a blanket.',
  'Rest. Just rest.',
  'Everything is quiet. Everything is still.'
];

const ENDING = 'And so {name} drifts into a deep and gentle sleep. Goodnight.';

const AUDIENCES = { adults: 'For me', kids: 'For my kids' };
const AGES = { '3-5': 'Ages 3–5', '6-8': 'Ages 6–8', '9-12': 'Ages 9–12' };
const VOICES = {
  soft: { label: 'Soft & low', rate: 0.82, pitch: 0.8, volume: 0.9 },
  warm: { label: 'Warm storyteller', rate: 0.88, pitch: 1.0, volume: 1.0 },
  whisper: { label: 'Gentle whisper', rate: 0.8, pitch: 1.15, volume: 0.6 }
};

// A small, repeatable random-number generator (same seed → same story).
function makeRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Works out a full and short name for the main character.
function heroNames(input, theme, audience) {
  const raw = (input || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  if (!raw) {
    if (audience === 'kids') return heroNames(THEMES[theme].kidHero);
    return { full: 'a tired traveller', short: 'the traveller' };
  }
  const named = raw.match(/\bnamed\s+([^\s,.]+)/i);
  if (named) return { full: raw, short: named[1] };
  if (!raw.includes(' ')) return { full: raw, short: raw };
  if (/^(a|an|the|my)\s/i.test(raw)) return { full: raw, short: 'the ' + raw.split(' ').pop() };
  return { full: raw, short: raw };
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function fill(text, ctx) {
  return cap(text
    .replace(/\{Name\}/g, cap(ctx.short))
    .replace(/\{name\}/g, ctx.short)
    .replace(/\{hero\}/g, ctx.full)
    .replace(/\{place\}/g, ctx.place));
}

// A shuffled "deck" of sentences that refills itself, so lines don't repeat too soon.
function makeDeck(lines, random) {
  let pile = [];
  let last = null;
  return function draw() {
    if (!pile.length) {
      pile = lines.slice();
      for (let i = pile.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [pile[i], pile[j]] = [pile[j], pile[i]];
      }
      if (pile.length > 1 && pile[pile.length - 1] === last) pile.unshift(pile.pop());
    }
    last = pile.pop();
    return last;
  };
}

// Creates a new story record from the chosen settings.
function createStory(settings) {
  const seed = Math.floor(Math.random() * 2 ** 31);
  const theme = THEMES[settings.theme];
  const names = heroNames(settings.hero, settings.theme, settings.audience);
  const random = makeRandom(seed);
  const titleName = names.short.replace(/\b\w/g, (c) => c.toUpperCase());
  const title = fill(theme.titles[Math.floor(random() * theme.titles.length)], { ...names, short: titleName, place: theme.place });
  return {
    id: 's' + Date.now().toString(36) + seed.toString(36).slice(0, 4),
    seed,
    title,
    settings: { ...settings },
    createdAt: new Date().toISOString(),
    favorite: false
  };
}

function storyMeta(story, withVoice) {
  const s = story.settings;
  const parts = [];
  if (s.audience === 'kids') parts.push('Kids · ' + AGES[s.age]);
  parts.push(MOODS[s.mood].label, s.timer + ' min');
  if (withVoice) parts.push(VOICES[s.voice].label);
  return parts.join(' · ');
}

// Produces the story one sentence at a time, for as long as the timer runs.
// phase: 'main' while the story plays, 'fade' in the last two minutes, 'end' for the final line.
function createStream(story) {
  const s = story.settings;
  const theme = THEMES[s.theme];
  const ctx = { ...heroNames(s.hero, s.theme, s.audience), place: theme.place };
  const random = makeRandom(story.seed + 1);
  const scenes = makeDeck(theme.scenes, random);
  const moods = makeDeck(MOODS[s.mood].lines, random);
  const calm = makeDeck(s.audience === 'kids' ? CALM_LINES.concat(KID_LINES) : CALM_LINES, random);
  const fade = makeDeck(FADE_LINES, random);
  const queue = theme.intro.slice();
  let beat = 0;

  return function next(phase) {
    if (phase === 'end') return fill(ENDING, ctx);
    if (queue.length) return fill(queue.shift(), ctx);
    if (phase === 'fade') return fill(beat++ % 2 ? fade() : calm(), ctx);
    beat++;
    const r = random();
    if (beat % 3 === 0) return fill(r < 0.5 ? moods() : calm(), ctx);
    return fill(scenes(), ctx);
  };
}

// Saved stories live in this browser only (localStorage).
const Library = {
  key: 'drift.stories',
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; }
  },
  save(list) {
    try { localStorage.setItem(this.key, JSON.stringify(list.slice(0, 200))); } catch (e) { /* storage unavailable */ }
  },
  add(story) { this.save([story].concat(this.all())); },
  get(id) { return this.all().find((x) => x.id === id); },
  update(id, changes) { this.save(this.all().map((x) => (x.id === id ? { ...x, ...changes } : x))); },
  remove(id) { this.save(this.all().filter((x) => x.id !== id)); }
};
