# drwokkawokka

**Attendee:** [@DrWokkaWokka](https://github.com/DrWokkaWokka)

**Project:** Crowdpleaser — a karaoke song picker that ranks songs by how many people in the room know them. Designed in Claude Design, built as a plain static website.

## Pages

- `index.html` — landing page
- `connect.html` — "Add your music to the room"
- `room.html` — the shared room list (filters and queue work in the browser)

Shared styles live in `style.css`; the room page's interactivity is in `room.js`. No build step and no dependencies.

## Test it locally

From the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/drwokkawokka/> in your browser. Press `Ctrl+C` in the terminal to stop.

## Placeholders still to fill in

- `[KARAOKE LIST SOURCES]` on the landing page
- `[RETENTION PERIOD]` in the privacy section

Note: this is a front-end demo. The song data, room members and room code are sample content; linking a real streaming service is not wired up.
