# FRT Law Walkthrough — design brief
- Purpose: show, step by step, where state facial recognition laws apply during a criminal investigation, and where they have gaps.
- Look: minimal. White background, CDT blue as the main accent (exact hex: TODO, pull from cdt.org). One clean sans-serif font. The data is the hero.
- Status colors: Prohibits = dark blue, Conditions = mid blue, Procedural = light blue, Silent = gray with dashed outline.
- Page layout:
  1. Title + one-sentence explainer + "Prototype, not legal analysis" banner
  2. Comparison grid: states × steps, colored by status. Click a cell to open its detail.
  3. Walkthrough: pick a state, then step through the flowchart one stage at a time. Each stage shows status, plain-English summary, gap, remedy, citation.
  4. Baseline note: "Silent ≠ anything goes — the Fourth Amendment and probable cause still apply."
  5. "Coming next": federal vs. local agents; bills that would fill the gaps.
- Tech: a single static index.html (no build step) that reads data.json. Must work on GitHub Pages and look fine on a phone.
