# czembo

Project: **Red Planet Ledger**, an interactive log of 196 two-player Terraforming Mars games, shown on a spinning globe of Mars with overall statistics and corporation performance.

Designed in Claude Design and built as a plain static site (HTML, CSS and JavaScript, no build step):

- `index.html`: the page
- `styles.css`: colors, fonts and layout
- `script.js`: the globe, replay controls, map filters and corporation table
- `data.js`: the game log data

To preview locally, run `python3 -m http.server 8000` from the repository root and open <http://localhost:8000/czembo/>.
