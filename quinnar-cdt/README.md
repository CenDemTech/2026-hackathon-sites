# quinnar-cdt

**Attendee:** [@QuinnAR-CDT](https://github.com/QuinnAR-CDT)

**Project:** *Byte vs. the Data Grabbers*, a data privacy adventure game where Byte, a robot cat, takes on trackers, dark patterns, data brokers and a data-hoarding boss across four mini-games. Designed in Claude Design, turned into a plain website with Claude Code.

## Files

- `index.html`: the page itself (all the screens and text)
- `style.css`: colors, fonts and layout, including the phone layout
- `game.js`: the game rules, sound and animations

No build step or install is needed. GitHub Pages can serve these files as they are.

## Try it locally

From the repository root, run:

```
python3 -m http.server 8000 --directory quinnar-cdt
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop the server.
