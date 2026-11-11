// Drift — "My stories" page.
(function () {
  const $ = (id) => document.getElementById(id);
  let filter = 'all';
  let armedDelete = null;

  const STAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"></path></svg>';
  const PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"></path></svg>';

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function matches(story, q) {
    if (filter === 'fav' && !story.favorite) return false;
    if (filter === 'kids' && story.settings.audience !== 'kids') return false;
    if (filter === 'adults' && story.settings.audience === 'kids') return false;
    if (!q) return true;
    const hay = [story.title, THEMES[story.settings.theme].label, story.settings.hero || '', MOODS[story.settings.mood].label]
      .join(' ').toLowerCase();
    return hay.includes(q);
  }

  function card(story) {
    const s = story.settings;
    const art = el('article', 'story-card');

    const top = el('div', 'top');
    const tags = el('div', 'tags');
    tags.appendChild(el('span', 'tag', THEMES[s.theme].label));
    if (s.audience === 'kids') tags.appendChild(el('span', 'tag kids', 'Kids · ' + AGES[s.age].replace('Ages ', '')));
    const star = el('button', 'star');
    star.type = 'button';
    star.innerHTML = STAR;
    star.setAttribute('aria-pressed', String(!!story.favorite));
    star.setAttribute('aria-label', story.favorite ? 'Remove from favorites' : 'Add to favorites');
    star.addEventListener('click', () => { Library.update(story.id, { favorite: !story.favorite }); render(); });
    top.append(tags, star);

    const body = el('div');
    body.style.cssText = 'display:flex;flex-direction:column;gap:4px';
    body.append(el('h2', null, story.title), el('span', 'meta', storyMeta(story, true)));

    const bottom = el('div', 'bottom');
    const date = new Date(story.createdAt);
    bottom.appendChild(el('span', 'date', date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })));
    const actions = el('div', 'actions');
    const del = el('button', 'pill quiet' + (armedDelete === story.id ? ' warn' : ''), armedDelete === story.id ? 'Tap again to delete' : 'Delete');
    del.type = 'button';
    del.setAttribute('aria-label', armedDelete === story.id ? 'Confirm delete ' + story.title : 'Delete ' + story.title);
    del.addEventListener('click', () => {
      if (armedDelete === story.id) { Library.remove(story.id); armedDelete = null; }
      else armedDelete = story.id;
      render();
    });
    const play = el('a', 'pill');
    play.href = 'index.html?story=' + encodeURIComponent(story.id);
    play.innerHTML = PLAY;
    play.append('Play');
    play.setAttribute('aria-label', 'Play ' + story.title);
    actions.append(del, play);
    bottom.appendChild(actions);

    art.append(top, body, bottom);
    return art;
  }

  function render() {
    const all = Library.all();
    const q = $('search').value.trim().toLowerCase();
    const shown = all.filter((x) => THEMES[x.settings.theme] && matches(x, q));
    const grid = $('grid');
    grid.textContent = '';
    shown.forEach((x) => grid.appendChild(card(x)));

    $('empty').hidden = shown.length > 0;
    if (!all.length) {
      $('empty-title').textContent = 'No stories here yet';
      $('empty-text').textContent = 'Create your first story and it will appear here.';
    } else if (filter === 'fav' && !q) {
      $('empty-title').textContent = 'No favorites yet';
      $('empty-text').textContent = 'Tap the star on a story to add it to your favorites.';
    } else {
      $('empty-title').textContent = 'Nothing matches';
      $('empty-text').textContent = 'Try a different filter or search.';
    }
  }

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-value]');
    if (!b) return;
    filter = b.dataset.value;
    $('filters').querySelectorAll('[data-value]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
  $('search').addEventListener('input', render);

  render();
})();
