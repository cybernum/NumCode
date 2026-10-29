# NumCode

Learning-website prototype for the research *Improving Programming Proficiency through NumCode Website* (Unida Christian Colleges, Grade 12 ICT Programming).

Pure HTML/CSS/JS. No build step, no dependencies.

## Files
- `index.html` Home (hero, features, how it works, scrolling code examples)
- `modules.html` HTML / CSS / Java modules + quiz & progress tracker demo
- `research.html` Study summary
- `about.html` Team and references
- `styles.css`, `script.js` shared styles and behavior
- `assets/` logo and code-snippet images (SVG)

## Deploy on GitHub Pages
1. Create a repository and upload everything in this folder (keep `index.html` at the root).
2. Repo **Settings > Pages**, set Source to *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repo>/` after a minute.

## Customize
- Colors: edit the variables at the top of `styles.css`.
- Adviser name: `about.html`.
- Hero snippets: `script.js` (the `code` object). Marquee images: `assets/snippets/`.
