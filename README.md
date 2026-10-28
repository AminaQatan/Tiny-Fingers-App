# Tiny Fingers

Developed by: **Ms. Amina Qatan**

A touch-friendly early-learning application for children. This is the complete source-code export of the published application, including its illustrations and font.

## Included features

- 20 vocabulary themes, including seven rooms/areas around the house.
- A large interactive scene above each theme's individual vocabulary cards.
- 120 talking picture items and 120 Who, What, Where, When, Why, and How questions.
- Guided tracing for A-Z, a-z, numbers 0-100, custom numbers, and 118 words/phrases.
- Slow spoken pronunciation, adjustable voice speed, stars, and celebration sounds.
- Touch, mouse, and stylus interaction; layouts for phones, tablets, and computers.
- Learning progress saved in the current browser.

## Start here

Read **GITHUB-INSTRUCTIONS.txt** for the simple GitHub upload steps.

## Open on your computer

Extract this ZIP first. Open `dist/index.html` in a modern browser, then tap an object to activate sound. If your browser restricts features for local files, serve the app from the project folder using Python:

```sh
python -m http.server 8000 --directory dist
```

Then open http://localhost:8000 in your browser. The application has no build step and no external JavaScript dependencies. A device with an English speech-synthesis voice is required for spoken audio; the voice is supplied by the browser/device, not bundled audio files. No API key is needed.

## Validate the source

With Node.js installed, run from this folder:

```sh
node check.mjs
```

## Project files

- `dist/index.html`: application page and creator credit.
- `dist/app.js`: interactions, audio, tracing, questions, and saved progress.
- `dist/style.css`: desktop and phone layouts.
- `dist/data.js`: original themes and tracing guides.
- `dist/themes.js`: additional themes and vocabulary.
- `dist/themes-art.js`: original vector illustration assets.
- `dist/scenes.js`: complete room/theme pictures and descriptions.
- `dist/art-3d/`: vocabulary card images and image briefs.
- `dist/friendly.ttf` and `dist/FONT-LICENSE.txt`: bundled Ubuntu font and its license.
- `check.mjs`: content, asset, and syntax checks.

## Hosting

Upload the contents of `dist/` to any static website host. Keep all subfolders intact. Saving the project in a GitHub repository stores the code; it does not automatically publish a website. This export contains no repository history, account credentials, browser learning progress, or account-specific hosting configuration.

## Privacy and portability

Learning progress is stored locally in the browser under `tiny-fingers-v1` and does not synchronize between devices or website addresses. This app does not require a child's name or collect analytics. Moving it to another website address starts a separate browser progress record.

## Attribution

Developed by: Ms. Amina Qatan

Keep the bundled font license with the font. This export does not add an open-source license to the application.
