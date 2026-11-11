/* The Fine Print — builds the case cards and case pages from cases.js.
   Pages use the address bar "hash" so links and the back button work:
     #cases, #sorn, #method  → home page sections
     #case/save              → a case page                                 */
(function () {
  'use strict';

  // ---------- Word-level diff (same approach as the original design) ----------
  const tok = (s) => (s ? s.split(/\s+/).filter(Boolean) : []);
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

  function lcs(a, b) {
    const n = a.length, m = b.length;
    const dp = [];
    for (let i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const ops = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ops.push({ t: 'eq', w: b[j], j: j }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: 'del', w: a[i] }); i++; }
      else { ops.push({ t: 'ins', w: b[j], j: j }); j++; }
    }
    while (i < n) { ops.push({ t: 'del', w: a[i] }); i++; }
    while (j < m) { ops.push({ t: 'ins', w: b[j], j: j }); j++; }
    return { ops: ops, same: dp[0][0] };
  }

  // Indexes of words in the new text that belong to a flagged phrase.
  function flagIdx(b, flags) {
    const set = new Set();
    const bn = b.map(norm);
    (flags || []).forEach((p) => {
      const pt = tok(p).map(norm).filter(Boolean);
      if (!pt.length) return;
      for (let i = 0; i + pt.length <= bn.length; i++) {
        let ok = true;
        for (let k = 0; k < pt.length; k++) { if (bn[i + k] !== pt[k]) { ok = false; break; } }
        if (ok) for (let k = 0; k < pt.length; k++) set.add(i + k);
      }
    });
    return set;
  }

  // Merge runs of words with the same style into one segment.
  function group(ops) {
    const segs = [];
    let cls = null, words = [];
    const flush = () => {
      if (!words.length) return;
      segs.push({ cls: cls, text: words.join(' ') });
      words = [];
    };
    ops.forEach((o) => {
      if (o.cls !== cls) { flush(); cls = o.cls; }
      words.push(o.w);
    });
    flush();
    return segs;
  }

  const TAGS = {
    Rewritten: ['#E3E8F7', '#124692'],
    Added: ['#FCE7A1', '#5B2A06'],
    Deleted: ['#F6DCD7', '#7A1F14'],
    Unchanged: ['#E6E3DC', '#3B3F47']
  };

  function buildChange(c, ch, idx) {
    const a = tok(ch.old), b = tok(ch.new);
    let ops;
    if (!a.length) ops = b.map((w, j) => ({ t: 'ins', w: w, j: j }));
    else if (!b.length) ops = a.map((w) => ({ t: 'del', w: w }));
    else {
      const r = lcs(a, b);
      ops = r.ops;
      // Mostly different text reads better as "all old struck, all new added".
      if (r.same / Math.max(a.length, b.length) < 0.3) {
        ops = a.map((w) => ({ t: 'del', w: w })).concat(b.map((w, j) => ({ t: 'ins', w: w, j: j })));
      }
    }
    const fs = flagIdx(b, ch.flags);
    ops.forEach((o) => {
      if (o.t === 'del') o.cls = 'del';
      else o.cls = fs.has(o.j) ? 'flag' : (o.t === 'ins' ? 'ins' : 'eq');
    });
    const status = !a.length ? 'Added' : !b.length ? 'Deleted' : ch.old === ch.new ? 'Unchanged' : 'Rewritten';
    return Object.assign({}, ch, {
      num: String(idx + 1).padStart(2, '0'),
      status: status,
      tag: TAGS[status],
      hasOld: a.length > 0,
      hasNew: b.length > 0,
      oldNote: ch.oldNote || ('Not in the ' + c.priorLabel + '.'),
      inline: group(ops),
      oldSegs: group(ops.filter((o) => o.t !== 'ins')),
      newSegs: group(ops.filter((o) => o.t !== 'del'))
    });
  }

  const CASES = window.FINE_PRINT_CASES.map((c) => {
    const changes = c.changes.map((ch, i) => buildChange(c, ch, i));
    return Object.assign({}, c, { changes: changes, flagCount: changes.length });
  });

  // ---------- Small DOM helpers (all text goes in as plain text, never HTML) ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style') node.style.cssText = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((ch) => { if (ch != null) node.append(ch); });
    return node;
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function icon(paths, size) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    [['width', size], ['height', size], ['viewBox', '0 0 24 24'], ['fill', 'none'], ['stroke', 'currentColor'],
      ['stroke-width', '2'], ['stroke-linecap', 'round'], ['stroke-linejoin', 'round'], ['aria-hidden', 'true']]
      .forEach(([k, v]) => svg.setAttribute(k, v));
    paths.forEach((d) => { const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', d); svg.append(p); });
    return svg;
  }
  const FLAG = ['M4 22V4', 'M4 4h12l-2 4 2 4H4'];
  const ARROW = ['M5 12h14', 'M12 5l7 7-7 7'];

  function docText(segs, extraStyle) {
    const p = el('p', { class: 'doc', style: extraStyle || '' });
    segs.forEach((s, i) => {
      if (i) p.append(' ');
      p.append(s.cls === 'eq' ? s.text : el('span', { class: s.cls, text: s.text }));
    });
    return p;
  }

  // ---------- Home: case cards ----------
  function renderCards() {
    const grid = document.getElementById('case-grid');
    CASES.forEach((c) => {
      const lead = c.news[0];
      grid.append(el('article', { class: 'card' }, [
        el('div', { class: 'row-between mono-sm' }, [
          el('span', { text: c.tag }),
          el('span', { style: 'display:flex;align-items:center;gap:6px;color:#124692' },
            [icon(FLAG, 14), c.flagCount + ' flagged changes'])
        ]),
        el('h3', { text: c.title }),
        el('p', { class: 'body', text: c.blurb }),
        el('div', { class: 'news-pull' }, [
          el('span', { class: 'mono-sm', style: 'letter-spacing:0', text: 'IN THE NEWS · ' + lead.outlet + ' · ' + lead.date }),
          el('q', { text: lead.headline })
        ]),
        el('div', { class: 'row-between', style: 'gap:12px;margin-top:auto;padding-top:6px' }, [
          el('span', { style: 'font-size:14px;color:#55585F', text: 'Notice rewritten ' + c.notices[1].date }),
          el('a', { class: 'btn btn-blue', href: '#case/' + c.id }, ['See what changed', icon(ARROW, 16)])
        ])
      ]));
    });
  }

  // ---------- Case page ----------
  let mode = 'inline';
  let current = null;
  const caseEl = document.getElementById('case');

  function setField(name, value) {
    caseEl.querySelectorAll('[data-field="' + name + '"]').forEach((n) => { n.textContent = value || ''; });
  }

  function renderChanges() {
    const c = current;
    const list = document.getElementById('case-changes');
    list.replaceChildren();
    c.changes.forEach((ch) => {
      let view;
      if (mode === 'inline') {
        view = el('div', { class: 'stack', style: 'gap:10px' }, [
          ch.hasOld ? null : el('span', { style: 'font-size:13px;color:#55585F;font-style:italic', text: ch.oldNote }),
          docText(ch.inline)
        ]);
      } else {
        view = el('div', { class: 'side' }, [
          el('div', { style: 'background:#F3F6FA' }, [
            el('span', { class: 'mono-sm', style: 'text-transform:uppercase', text: c.priorLabel }),
            ch.hasOld ? docText(ch.oldSegs) : el('p', { class: 'muted-italic', text: ch.oldNote })
          ]),
          el('div', { style: 'background:#FFFBEF' }, [
            el('span', { class: 'mono-sm', style: 'text-transform:uppercase', text: c.newLabel }),
            ch.hasNew ? docText(ch.newSegs) : el('p', { class: 'muted-italic', text: 'Deleted from this notice.' })
          ])
        ]);
      }
      const flagIcon = icon(FLAG, 20);
      flagIcon.setAttribute('stroke', '#124692');
      flagIcon.style.marginTop = '3px';

      list.append(el('li', { class: 'change' }, [
        el('div', { class: 'change-meta' }, [
          el('span', { style: 'font-family:var(--mono);font-size:13px;color:#55585F', text: ch.num }),
          el('h3', { text: ch.section }),
          el('span', { class: 'status-tag', style: 'background:' + ch.tag[0] + ';color:' + ch.tag[1], text: ch.status })
        ]),
        el('div', { class: 'change-body' }, [
          view,
          el('div', { class: 'note why' }, [
            flagIcon,
            el('div', { class: 'stack', style: 'gap:4px' }, [
              el('span', { style: 'font-size:13px;font-weight:700;letter-spacing:0.02em;color:#124692', text: 'WHY THIS MATTERS' }),
              el('p', { style: 'margin:0;font-size:16px;line-height:1.6;color:#0B1F3A', text: ch.why })
            ])
          ])
        ])
      ]));
    });
    caseEl.querySelectorAll('.toggle').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  }

  function renderCase(c) {
    current = c;
    const idx = CASES.indexOf(c);
    const next = CASES[(idx + 1) % CASES.length];

    ['agency', 'title', 'dek', 'system', 'caveat', 'status'].forEach((f) => setField(f, c[f]));
    setField('summary', c.priorLabel + ' → ' + c.newLabel + ' · ' + c.flagCount + ' flagged changes');
    setField('nextTitle', next.title);
    document.getElementById('next-case').setAttribute('href', '#case/' + next.id);
    document.getElementById('case-caveat').hidden = !c.caveat;
    const compare = document.getElementById('case-compare');
    compare.hidden = !c.compareNote;
    compare.textContent = c.compareNote || '';

    document.getElementById('case-news').replaceChildren(...c.news.map((n) =>
      el('a', { class: 'newslink', href: n.url, target: '_blank', rel: 'noopener' }, [
        el('span', { class: 'mono-sm', style: 'letter-spacing:0', text: n.outlet + ' · ' + n.date }),
        el('span', { class: 'hl', style: 'font-family:var(--serif);font-size:19px;line-height:1.35', text: n.headline })
      ])));

    document.getElementById('case-timeline').replaceChildren(...c.timeline.map((t) =>
      el('li', { class: t.harm ? 'harm' : '' }, [
        el('span', { style: 'font-family:var(--mono);font-size:13px;font-weight:500', text: t.date }),
        el('span', { style: 'font-size:15px;line-height:1.5;color:#3B3F47', text: t.text })
      ])));

    document.getElementById('case-notices').replaceChildren(...c.notices.map((d) =>
      el('a', { href: d.url, target: '_blank', rel: 'noopener', style: 'display:flex;flex-direction:column;gap:4px;text-decoration:none;padding-bottom:16px;border-bottom:1px solid #D5DDE8' }, [
        el('span', { class: 'mono-sm', style: 'letter-spacing:0', text: d.label }),
        el('span', { style: 'font-size:17px;font-weight:600;color:#1B5FC1', text: d.cite + ' · ' + d.date })
      ])));

    renderChanges();
    document.title = c.title + ' — The Fine Print';
  }

  caseEl.querySelectorAll('.toggle').forEach((b) => {
    b.addEventListener('click', () => { mode = b.dataset.mode; renderChanges(); });
  });

  // ---------- Simple router ----------
  const home = document.getElementById('home');
  const homeNav = document.getElementById('home-nav');
  const backLink = document.getElementById('back-link');

  function route() {
    const m = location.hash.match(/^#case\/([\w-]+)$/);
    const c = m && CASES.find((x) => x.id === m[1]);
    if (c) {
      renderCase(c);
      home.hidden = true; homeNav.hidden = true;
      caseEl.hidden = false; backLink.hidden = false;
      window.scrollTo({ top: 0, behavior: 'instant' });
      const h1 = caseEl.querySelector('h1');
      h1.focus({ preventScroll: true });
    } else {
      const wasCase = !caseEl.hidden;
      home.hidden = false; homeNav.hidden = false;
      caseEl.hidden = true; backLink.hidden = true;
      document.title = 'The Fine Print — SORN Redlines';
      const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: wasCase ? 'instant' : 'smooth' });
      else if (wasCase) window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  renderCards();
  window.addEventListener('hashchange', route);
  route();
})();
