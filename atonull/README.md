# atonull

**Drift: Bedtime Story Generator.** Pick a setting, a mood and a sleep timer, and Drift builds a new, slow-paced bedtime story and reads it aloud, fading out gently when the timer ends. Designed in Claude Design, built with Claude Code.

## How it works
- Everything runs in the visitor's browser. There's no server, account or API key.
- **Stories** are built from hand-written sentences in `story.js`. Add your own lines there to make the stories richer.
- **Narration** uses the browser's built-in text-to-speech.
- **Background sounds** (rain, waves, fire) are generated live in `sound.js`.
- **My stories** are saved only on the visitor's own device (browser storage).

## Files
- `index.html` + `app.js`: build a story and play it
- `library.html` + `library.js`: the "My stories" page
- `story.js`: the story sentences and story builder
- `sound.js`: background sounds
- `style.css`: colors and layout

## Test it locally
From the repository root (one folder up), run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/atonull/ in your browser.
