// Red Planet Ledger — interactive behavior.
// Plain JavaScript, no libraries. Data comes from data.js (window.LEDGER_DATA).
(function () {
  'use strict';

  var D = window.LEDGER_DATA;
  var N = D.games.length;
  var COLOR_A = '#EE7B30';
  var COLOR_B = '#9ED3FF';

  // ---------- Page state ----------
  var state = {
    idx: N - 1,        // which game is selected (0-based)
    playing: false,    // replay running?
    aim: false,        // globe turning toward the selected game / map?
    spin: true,        // slow auto-rotation on?
    lon0: 110,         // globe center longitude
    lat0: 22,          // globe center latitude
    region: null,      // selected map key, or null
    drag: null,        // pointer-drag info while rotating the globe
    cp: 'all',         // corporation table: which player ('all', 'T' = A, 'D' = B)
    cmin: 3,           // corporation table: minimum games
    csort: 'delta'     // corporation table: sort order
  };

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduceMotion) state.spin = false;

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function set(patch) {
    for (var k in patch) state[k] = patch[k];
    render();
  }
  function go(i) { set({ idx: i, aim: true, playing: false, region: null }); }

  // ---------- Globe drawing ----------
  var C = 280, R = 250, rad = Math.PI / 180;

  function drawGlobe() {
    var p0 = state.lat0 * rad, sp0 = Math.sin(p0), cp0 = Math.cos(p0), L0 = state.lon0;

    // Project latitude/longitude to [x, y, depth]; depth > 0 means facing us.
    function P(lat, lon) {
      var p = lat * rad, l = (lon - L0) * rad, cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
      return [C + R * cp * Math.sin(l), C - R * (cp0 * sp - sp0 * cp * cl), sp0 * sp + cp0 * cp * cl];
    }
    function line(pts) {
      var o = '', pen = false;
      for (var i = 0; i < pts.length; i++) {
        var r = P(pts[i][0], pts[i][1]);
        if (r[2] > 0) { o += (pen ? 'L' : 'M') + r[0].toFixed(1) + ' ' + r[1].toFixed(1); pen = true; }
        else pen = false;
      }
      return o;
    }
    // Closed shape, drawn only when every point is on the visible side.
    function poly(pts) {
      var o = '';
      for (var k = 0; k < pts.length; k++) {
        var r = P(pts[k][0], pts[k][1]);
        if (r[2] <= 0) return '';
        o += (k ? 'L' : 'M') + r[0].toFixed(1) + ' ' + r[1].toFixed(1);
      }
      return o + 'Z';
    }
    function hex(lat, lon, size) {
      var pts = [], cl = Math.max(0.2, Math.cos(lat * rad));
      for (var k = 0; k < 6; k++) {
        var a = (k * 60 + 30) * rad;
        pts.push([lat + size * Math.sin(a), lon + size * Math.cos(a) / cl]);
      }
      return poly(pts);
    }

    var out = [];
    var tones = { d: ['#3B160D', 0.45], l: ['#D98A62', 0.22], p: ['#F6EDE6', 0.75] };
    D.globe.terrain.forEach(function (t) {
      var d = poly(t.p);
      if (d) out.push('<path d="' + d + '" fill="' + tones[t.t][0] + '" fill-opacity="' + tones[t.t][1] + '"/>');
    });
    out.push('<path d="' + line(D.globe.valles) + '" fill="none" stroke="#3A140C" stroke-width="3" stroke-linecap="round" stroke-opacity=".7"/>');
    out.push('<path d="' + D.globe.grat.map(line).join('') + '" fill="none" stroke="#F3C2A8" stroke-opacity=".10" stroke-width="1"/>');

    // Dashed ring around the selected map's region
    var rb = state.region ? boardByKey(state.region) : null;
    if (rb) {
      var ringPts = [];
      for (var k = 0; k <= 48; k++) {
        var a = k / 48 * 2 * Math.PI, la = rb.lat + 11 * Math.sin(a);
        ringPts.push([la, rb.lon + 11 * Math.cos(a) / Math.max(0.25, Math.cos(la * rad))]);
      }
      var ring = line(ringPts);
      if (ring) out.push('<path d="' + ring + '" fill="none" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="1.5" stroke-dasharray="4 4"/>');
    }

    // One hex per game played so far
    for (var i = 0; i <= state.idx; i++) {
      var g = D.games[i], d = hex(g.lat, g.lon, 1.35);
      if (!d) continue;
      var op = state.region && g.b !== state.region ? 0.22 : 1;
      out.push('<path d="' + d + '" fill="' + (g.w === 'Player A' ? COLOR_A : COLOR_B) + '" fill-opacity="' + op + '" stroke="#140B08" stroke-opacity="' + op + '" stroke-width="1"/>');
    }

    // Highlight the current game
    var cur = D.games[state.idx], cpos = P(cur.lat, cur.lon);
    if (cpos[2] > 0) {
      var x = cpos[0].toFixed(1), y = cpos[1].toFixed(1);
      out.push('<circle cx="' + x + '" cy="' + y + '" r="13" fill="none" stroke="#FFFFFF" stroke-width="2"/>');
      out.push('<circle cx="' + x + '" cy="' + y + '" r="19" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="1.5"/>');
    }
    $('globeSurface').innerHTML = out.join('');

    // Map name labels (drawn above the shading)
    var labels = [];
    D.boards.forEach(function (b) {
      var r = P(b.lat + (b.lat > 55 ? -12 : 11), b.lon);
      if (r[2] > 0.2) {
        var o = (state.region && state.region !== b.key ? 0.45 : 1) * Math.min(1, (r[2] - 0.2) * 3);
        labels.push('<text class="globe-label" x="' + r[0].toFixed(1) + '" y="' + r[1].toFixed(1) + '" text-anchor="middle" fill="#FFF4EE" fill-opacity="' + o.toFixed(2) + '">' + esc(b.key.toUpperCase()) + '</text>');
      }
    });
    $('globeLabels').innerHTML = labels.join('');
  }

  function boardByKey(key) {
    for (var i = 0; i < D.boards.length; i++) if (D.boards[i].key === key) return D.boards[i];
    return null;
  }

  // ---------- Selected game panel ----------
  var ICON_PAUSE = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>';
  var ICON_PLAY = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2 L14 8 L4 14 Z" fill="currentColor"/></svg>';

  function drawGame() {
    var s = state, cur = D.games[s.idx];
    $('scrubPos').textContent = 'Game ' + (s.idx + 1) + ' of ' + N + ' · ' + cur.short;
    var scrub = $('tmScrub');
    if (String(scrub.value) !== String(s.idx)) scrub.value = s.idx;

    $('gameNum').textContent = 'Game ' + (s.idx + 1);
    $('gameDate').textContent = cur.date;
    $('scoreAVal').textContent = cur.ts;
    $('scoreBVal').textContent = cur.ds;
    // A few games have no corporation recorded in the log
    $('scoreACorp').textContent = cur.tc === 'MISSING' ? 'Corporation not logged' : cur.tc;
    $('scoreBCorp').textContent = cur.dc === 'MISSING' ? 'Corporation not logged' : cur.dc;
    $('scoreA').classList.toggle('won-a', cur.w === 'Player A');
    $('scoreB').classList.toggle('won-b', cur.w === 'Player B');
    $('gameWinner').textContent = cur.w + (cur.mov ? ' by ' + cur.mov : ' (tiebreak)');
    $('gameMap').textContent = cur.b;
    $('gameGens').textContent = cur.g ? String(cur.g) : 'Not logged';
    var note = $('gameNote');
    note.hidden = !cur.n;
    note.textContent = cur.n ? 'Note: ' + cur.n : '';
    $('runRecord').textContent = 'A ' + cur.tw + ' · B ' + cur.dw;
    $('runBar').style.width = (cur.tw / (s.idx + 1) * 100).toFixed(1) + '%';
    var streak = $('streak');
    streak.textContent = cur.sw + ', ' + cur.sl + (cur.sl === 1 ? ' game' : ' games');
    streak.style.color = cur.sw === 'Player A' ? COLOR_A : COLOR_B;
  }

  function drawControls() {
    var play = $('btnPlay');
    play.innerHTML = state.playing ? ICON_PAUSE + 'Pause' : ICON_PLAY + 'Play from game 1';
    play.setAttribute('aria-label', state.playing ? 'Pause replay' : 'Play replay from game 1');
    var spin = $('btnSpin');
    spin.textContent = state.spin ? 'Auto-rotate on' : 'Auto-rotate off';
    spin.setAttribute('aria-pressed', state.spin ? 'true' : 'false');
  }

  // ---------- Maps ----------
  function buildBoards() {
    var wrap = $('boardBtns');
    D.boards.forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tm-chip';
      btn.dataset.key = b.key;
      btn.innerHTML =
        '<span class="chip-name">' + esc(b.key) + '</span>' +
        '<span class="tm-num chip-sub">' + b.n + ' games · ' + b.tw + '–' + b.dw + '</span>' +
        '<span class="chip-bar"><span style="width:' + (b.tw / b.n * 100).toFixed(1) + '%"></span></span>';
      btn.addEventListener('click', function () {
        var on = state.region === b.key;
        set({ region: on ? null : b.key, aim: !on, playing: false });
      });
      wrap.appendChild(btn);
    });
  }

  function drawRegion() {
    var buttons = $('boardBtns').children;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].dataset.key === state.region ? 'true' : 'false');
    }
    var rb = state.region ? boardByKey(state.region) : null;
    $('region').hidden = !rb;
    if (!rb) return;
    $('rgName').textContent = rb.name;
    $('rgGames').textContent = rb.n + ' games';
    $('rgWins').textContent = 'A ' + rb.tw + ' · B ' + rb.dw;
    $('rgShare').textContent = Math.round(rb.dw / rb.n * 100) + '%';
    $('rgAvg').textContent = 'A ' + rb.ta + ' · B ' + rb.da;
    $('rgGens').textContent = rb.ga ? rb.ga + ' (' + rb.gn + ' logged)' : 'Not logged';
    $('rgHigh').textContent = rb.hi;
  }

  // ---------- Records ----------
  function buildRecords() {
    var wrap = $('records');
    D.records.forEach(function (r) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tm-chip record';
      btn.innerHTML =
        '<span class="record-label">' + esc(r.label) + '</span>' +
        '<span class="tm-num record-val" style="color:' + esc(r.c) + '">' + esc(r.val) + '</span>' +
        '<span class="record-sub">' + esc(r.sub) + '</span>' +
        '<span class="record-date">' + esc(r.date) + '</span>';
      btn.addEventListener('click', function () {
        go(r.i);
        $('globe').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      wrap.appendChild(btn);
    });
  }

  // ---------- Corporations ----------
  var corpCache = {};
  function corpData(cp, cmin, csort) {
    var key = cp + '|' + cmin + '|' + csort;
    if (corpCache[key]) return corpCache[key];
    var rows = [];
    D.corps.forEach(function (c) {
      var parts = cp === 'all' ? [c.T, c.D] : [cp === 'T' ? c.T : c.D];
      var g = 0, w = 0, sum = 0, dsum = 0;
      parts.forEach(function (p) { g += p[0]; w += p[1]; sum += p[2]; dsum += p[3]; });
      if (g < cmin || g === 0) return;
      rows.push({
        name: c.name, g: g, w: w, wr: w / g, avgN: sum / g, dN: dsum / g,
        tRec: 'A ' + c.T[1] + '–' + (c.T[0] - c.T[1]),
        dRec: 'B ' + c.D[1] + '–' + (c.D[0] - c.D[1])
      });
    });
    var by = {
      delta: function (a, b) { return b.dN - a.dN; },
      win: function (a, b) { return b.wr - a.wr || b.g - a.g; },
      games: function (a, b) { return b.g - a.g || b.dN - a.dN; },
      avg: function (a, b) { return b.avgN - a.avgN; },
      name: function (a, b) { return a.name.localeCompare(b.name); }
    };
    rows.sort(by[csort]);
    var maxAbs = Math.max.apply(null, [10].concat(rows.map(function (r) { return Math.abs(r.dN); })));
    rows.forEach(function (r) {
      r.half = Math.abs(r.dN) / maxAbs * 50;
      r.up = r.dN >= 0;
      var sign = r.dN > 0.05 ? '+' : (r.dN < -0.05 ? '−' : '');
      r.delta = sign + Math.abs(r.dN).toFixed(1);
      r.rec = r.w + '–' + (r.g - r.w);
    });
    var ranked = rows.slice().sort(function (a, b) { return b.dN - a.dN; });
    var res = { rows: rows, best: ranked[0], worst: ranked[ranked.length - 1] };
    corpCache[key] = res;
    return res;
  }

  var FILTERS = {
    cp: { el: 'filterPlayer', opts: [['all', 'Both'], ['T', 'Player A'], ['D', 'Player B']] },
    cmin: { el: 'filterMin', opts: [[1, '1+'], [3, '3+'], [5, '5+']] },
    csort: { el: 'filterSort', opts: [['delta', 'Vs. own average'], ['win', 'Win rate'], ['avg', 'Avg score'], ['games', 'Games'], ['name', 'Name']] }
  };

  function buildFilters() {
    Object.keys(FILTERS).forEach(function (field) {
      var f = FILTERS[field], wrap = $(f.el);
      f.opts.forEach(function (o) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tm-btn';
        btn.textContent = o[1];
        btn.dataset.value = String(o[0]);
        btn.addEventListener('click', function () {
          var patch = {}; patch[field] = o[0]; set(patch);
        });
        wrap.appendChild(btn);
      });
    });
  }

  function drawCorps() {
    Object.keys(FILTERS).forEach(function (field) {
      var buttons = $(FILTERS[field].el).children;
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute('aria-pressed', buttons[i].dataset.value === String(state[field]) ? 'true' : 'false');
      }
    });
    var corp = corpData(state.cp, state.cmin, state.csort);
    function sub(r) { return r ? r.delta + ' pts/game · ' + r.g + ' games · ' + r.rec : ''; }
    $('bestName').textContent = corp.best ? corp.best.name : '—';
    $('bestSub').textContent = sub(corp.best);
    $('worstName').textContent = corp.worst ? corp.worst.name : '—';
    $('worstSub').textContent = sub(corp.worst);
    $('corpCount').textContent = corp.rows.length + ' corporations';
    $('corpRows').innerHTML = corp.rows.map(function (r) {
      var left = r.up ? 50 : 50 - r.half, width = Math.max(r.half, 0.6);
      return '<tr>' +
        '<td class="corp-name">' + esc(r.name) + '</td>' +
        '<td class="tm-num">' + r.rec + '</td>' +
        '<td class="tm-num">' + Math.round(r.wr * 100) + '%</td>' +
        '<td class="tm-num">' + r.avgN.toFixed(1) + '</td>' +
        '<td><div class="delta ' + (r.up ? 'delta-up' : 'delta-down') + '"><div class="delta-track"><div class="delta-bar" style="left:' + left + '%;width:' + width + '%"></div></div><span class="tm-num delta-num">' + r.delta + '</span></div></td>' +
        '<td class="tm-num split-rec"><span class="a">' + r.tRec + '</span> · <span class="b">' + r.dRec + '</span></td>' +
        '</tr>';
    }).join('');
  }

  // ---------- Render: only redraw the parts whose inputs changed ----------
  var last = {};
  function changed(name, key) {
    if (last[name] === key) return false;
    last[name] = key;
    return true;
  }
  function render() {
    var s = state;
    if (changed('globe', [s.idx, s.region, s.lon0.toFixed(2), s.lat0.toFixed(2)].join('|'))) drawGlobe();
    if (changed('game', s.idx)) drawGame();
    if (changed('controls', s.playing + '|' + s.spin)) drawControls();
    if (changed('region', s.region)) drawRegion();
    if (changed('corps', s.cp + '|' + s.cmin + '|' + s.csort)) drawCorps();
  }

  // ---------- Animation loop (20 times a second) ----------
  var t = 0;
  function tick() {
    var s = state, up = {}, any = false;
    t += 1;
    var idx = s.idx;
    if (s.playing && t % 5 === 0) {
      if (idx >= N - 1) up.playing = false;
      else { idx += 1; up.idx = idx; }
      any = true;
    }
    if (!s.drag) {
      var tl = null, tla = 0;
      if (s.region) { var b = boardByKey(s.region); tl = b.lon; tla = b.lat; }
      else if (s.aim) { var g = D.games[idx]; tl = g.lon; tla = g.lat; }
      if (tl !== null && s.aim) {
        var dlon = ((tl - s.lon0) % 360 + 540) % 360 - 180;
        var dlat = Math.max(-40, Math.min(40, tla * 0.7)) - s.lat0;
        if (Math.abs(dlon) > 0.05 || Math.abs(dlat) > 0.05) {
          var f = reduceMotion ? 1 : 0.14;
          up.lon0 = s.lon0 + dlon * f; up.lat0 = s.lat0 + dlat * f; any = true;
        }
      } else if (s.spin && !s.aim) {
        up.lon0 = s.lon0 + 0.22; any = true;
      }
    }
    if (any) set(up);
  }

  // ---------- Wire up controls ----------
  function init() {
    buildBoards();
    buildRecords();
    buildFilters();

    var scrub = $('tmScrub');
    scrub.max = N - 1;
    scrub.addEventListener('input', function () {
      var v = parseInt(scrub.value, 10);
      if (!isNaN(v)) set({ idx: v, aim: true, playing: false, region: null });
    });

    $('btnPlay').addEventListener('click', function () {
      if (state.playing) set({ playing: false });
      else set({ playing: true, aim: true, region: null, idx: state.idx >= N - 1 ? 0 : state.idx });
    });
    $('btnPrev').addEventListener('click', function () { go(Math.max(0, state.idx - 1)); });
    $('btnNext').addEventListener('click', function () { go(Math.min(N - 1, state.idx + 1)); });
    $('btnLatest').addEventListener('click', function () { go(N - 1); });
    $('btnSpin').addEventListener('click', function () { set({ spin: !state.spin, aim: false }); });
    $('btnClearRegion').addEventListener('click', function () { set({ region: null, aim: false }); });

    // Drag to rotate the globe (mouse, pen or touch)
    var svg = $('globeSvg');
    svg.addEventListener('pointerdown', function (e) {
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
      set({ drag: { x: e.clientX, y: e.clientY, lon: state.lon0, lat: state.lat0 }, aim: false });
    });
    svg.addEventListener('pointermove', function (e) {
      var d = state.drag;
      if (!d) return;
      var k = 0.32;
      set({ lon0: d.lon - (e.clientX - d.x) * k, lat0: Math.max(-70, Math.min(70, d.lat + (e.clientY - d.y) * k)) });
    });
    function endDrag() { if (state.drag) set({ drag: null }); }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    render();
    setInterval(tick, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
