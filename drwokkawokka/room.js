// Crowdpleaser — room page: filters, song list and queue.
// All data below is sample content for the demo.

var SONGS = [
  { title: "Don't Stop Believin'", artist: "Journey", year: 1981, genre: "Rock", known: 8 },
  { title: "Mr. Brightside", artist: "The Killers", year: 2004, genre: "Rock", known: 8 },
  { title: "Dancing Queen", artist: "ABBA", year: 1976, genre: "Pop", known: 7 },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", year: 1987, genre: "Pop", known: 7 },
  { title: "Islands in the Stream", artist: "Dolly Parton & Kenny Rogers", year: 1983, genre: "Country", duet: true, known: 6 },
  { title: "Wannabe", artist: "Spice Girls", year: 1996, genre: "Pop", known: 6 },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", year: 2018, genre: "Pop", duet: true, known: 6 },
  { title: "Valerie", artist: "Mark Ronson ft. Amy Winehouse", year: 2007, genre: "Soul", known: 5 },
  { title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", year: 1983, genre: "Rock", known: 5 },
  { title: "No Scrubs", artist: "TLC", year: 1999, genre: "R&B", known: 4 }
];
var MEMBERS = [
  ["Ana", "Spotify"], ["Ben", "Apple Music"], ["Chloe", "Playlist"], ["Dev", "YouTube Music"],
  ["Emi", "Classics"], ["Femi", "Spotify"], ["Gus", "Deezer"], ["Hana", "Tidal"]
];
var AVATAR_COLORS = ["#FF7A59", "#7FD1C7", "#F5D547", "#C9B6FF"];
var GENRES = ["All", "Pop", "Rock", "R&B", "Soul", "Country"];
var DECADES = ["Any", "70s", "80s", "90s", "2000s+"];
var ROOM_SIZE = MEMBERS.length;

var state = {
  genre: "All",
  decade: "Any",
  duets: false,
  queued: ["Mr. Brightside", "Islands in the Stream", "Wannabe"]
};

function el(tag, attrs, children) {
  var node = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (k) {
    if (k === "text") node.textContent = attrs[k];
    else if (k === "className") node.className = attrs[k];
    else node.setAttribute(k, attrs[k]);
  });
  (children || []).forEach(function (c) { node.appendChild(c); });
  return node;
}

function decadeOf(year) {
  return year >= 2000 ? "2000s+" : String(year).charAt(2) + "0s";
}

function setState(patch) {
  Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
  render();
}

// --- one-time setup ---
function renderMembers() {
  var box = document.getElementById("members");
  MEMBERS.forEach(function (m, i) {
    var avatar = el("span", { className: "avatar", "aria-hidden": "true", text: m[0].charAt(0) });
    avatar.style.background = AVATAR_COLORS[i % AVATAR_COLORS.length];
    box.appendChild(el("div", { className: "member" }, [
      avatar,
      el("span", { style: "font-size: 14px; font-weight: 600", text: m[0] }),
      el("span", { className: "muted", style: "font-size: 12px", text: m[1] })
    ]));
  });
}

function makeChips(containerId, labels, key) {
  var box = document.getElementById(containerId);
  labels.forEach(function (label) {
    var b = el("button", { type: "button", className: "chip", "data-key": key, "data-value": label, text: label });
    b.addEventListener("click", function () { var p = {}; p[key] = label; setState(p); });
    box.appendChild(b);
  });
}

// --- re-rendered on every change ---
function render() {
  document.querySelectorAll("[data-key]").forEach(function (b) {
    b.setAttribute("aria-pressed", state[b.dataset.key] === b.dataset.value ? "true" : "false");
  });
  document.getElementById("duets").setAttribute("aria-pressed", state.duets ? "true" : "false");

  var list = SONGS.filter(function (s) {
    return (state.genre === "All" || s.genre === state.genre) &&
      (state.decade === "Any" || decadeOf(s.year) === state.decade) &&
      (!state.duets || s.duet);
  });

  document.getElementById("result-count").textContent = list.length + (list.length === 1 ? " song" : " songs");
  document.getElementById("no-results").hidden = list.length > 0;

  var ol = document.getElementById("songs");
  ol.textContent = "";
  list.forEach(function (s, i) {
    var inQ = state.queued.indexOf(s.title) >= 0;
    var fill = el("span");
    fill.style.width = Math.round(s.known / ROOM_SIZE * 100) + "%";
    var btn = el("button", {
      type: "button",
      className: "add-btn" + (inQ ? " queued" : ""),
      "aria-label": (inQ ? "Remove " : "Add ") + s.title + (inQ ? " from queue" : " to queue"),
      text: inQ ? "Queued" : "Add"
    });
    btn.addEventListener("click", function () {
      var q = state.queued.slice();
      var at = q.indexOf(s.title);
      if (at >= 0) q.splice(at, 1); else q.push(s.title);
      setState({ queued: q });
      var again = document.querySelector('[aria-label$="' + s.title.replace(/"/g, '\\"') + (at >= 0 ? ' to queue"]' : ' from queue"]'));
      if (again) again.focus();
    });
    ol.appendChild(el("li", { className: "song" }, [
      el("span", { className: "rank", text: String(i + 1) }),
      el("div", { className: "info" }, [
        el("span", { className: "song-title", text: s.title }),
        el("span", { className: "song-artist", text: s.artist + " · " + s.year + " · " + s.genre })
      ]),
      el("div", { className: "meter" }, [
        el("span", { text: s.known + " of " + ROOM_SIZE + " know it" + (s.duet ? " · Duet" : "") }),
        el("div", { className: "bar" }, [fill])
      ]),
      btn
    ]));
  });

  var qList = document.getElementById("queue");
  qList.textContent = "";
  state.queued.forEach(function (t, i) {
    var song = SONGS.filter(function (x) { return x.title === t; })[0];
    qList.appendChild(el("li", {}, [
      el("span", { className: "pos", text: String(i + 1) }),
      el("div", { style: "display: flex; flex-direction: column; gap: 2px; min-width: 0" }, [
        el("span", { style: "font-weight: 600; font-size: 15px", text: t }),
        el("span", { className: "ink-soft", style: "font-size: 13px", text: song ? song.artist : "" })
      ])
    ]));
  });
  document.getElementById("queue-count").textContent = state.queued.length + (state.queued.length === 1 ? " song" : " songs");
  document.getElementById("queue-empty").hidden = state.queued.length > 0;
}

document.addEventListener("DOMContentLoaded", function () {
  renderMembers();
  makeChips("genre-chips", GENRES, "genre");
  makeChips("decade-chips", DECADES, "decade");

  document.getElementById("duets").addEventListener("click", function () { setState({ duets: !state.duets }); });
  document.getElementById("clear").addEventListener("click", function () { setState({ genre: "All", decade: "Any", duets: false }); });

  var copyBtn = document.getElementById("copy-link");
  copyBtn.addEventListener("click", function () {
    var done = function () { copyBtn.textContent = "Link copied"; setTimeout(function () { copyBtn.textContent = "Copy invite link"; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {});
  });

  document.getElementById("save-queue").addEventListener("click", function () {
    document.getElementById("queue-note").textContent = "Saving to a streaming service isn't connected yet in this demo.";
  });

  render();
});
