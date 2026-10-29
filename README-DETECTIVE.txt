TINY FINGERS - COMPLETE APPLICATION
Flashlight Detective edition - 29 October 2026
Developed by: Ms. Amina Qatan

This is the FULL application, including editable source, all 19 theme picture
sheets, large interactive scenes, local font and home-screen icons.
All website files belong together in ONE folder. No build or API key is needed.

UPDATE YOUR EXISTING GITHUB SITE (FASTEST)
1. Extract this ZIP using My Files on your phone.
2. Open https://github.com/AminaQatan/Tiny-Fingers-App
3. Select Add file > Upload files.
4. Upload these five extracted files, keeping their exact filenames:
   index.html
   app.js
   detective.js
   detective.css
   speech.js
5. Select Commit changes. Wait for GitHub Pages to finish publishing.
6. Refresh https://aminaqatan.github.io/Tiny-Fingers-App/
   Close and reopen an installed home-screen copy if needed.
Your pictures and home-screen files are already in your repository.
This version expects the theme PNG files beside index.html, as in your repository.

COMPLETE RESTORE OR NEW REPOSITORY
Upload ALL files in this ZIP into the root of the repository. Upload extracted
files, not the ZIP or a surrounding folder. In Settings > Pages, publish from
main / root. Keep the PNG pictures, friendly.ttf and all JavaScript/CSS files.
There are no external database, server credentials or accounts to copy.

NEW DISCOVERY GAMES
- Detective is accessible from every main section.
- Picture missions in all 20 themes: home rooms, everyday vocabulary and nature.
- Separate word hunts for every theme, capital/lowercase letter hunts and 0-100.
- Move a finger or mouse to shine the torch; TAP an object to choose it.
- Listen repeats a written clue. A teacher avatar moves while speech is playing.
- Find the requested target; each mission has six stars and one hint.
- Dragging the torch does not submit an answer. Lights on offers a fully lit view.
- After finding a target, select Next clue to continue at the child's pace.
- Discoveries appear in My Words with pictures and replayable pronunciation.
- Hints and mission progress survive reloads. Play again starts a fresh mission
  after completion; repeating a mission does not duplicate total earned stars.
- Try tracing opens the most recently discovered item.
- Keyboard: Tab to explore, Enter or Space to choose. Reduced motion is respected.

BRITISH ENGLISH AUDIO
Every spoken lesson, picture, clue, question and tracing instruction now requests
British English (en-GB) at natural pitch. The app prefers an available high-quality
British voice, and the grown-up settings offer a British voice selector and preview.
The existing Slow & steady speed is preserved; Extra slow, Gentle and Natural are
also available. Musical celebration chimes remain musical.

The app uses your device's speech service; these are NOT bundled studio recordings.
Voice quality/availability depends on the phone/browser. If no British voice appears,
add English (United Kingdom) through your device's text-to-speech settings and
reopen Chrome. Until a British voice is available, the browser chooses a default
for en-GB and its accent can vary. Some voices need an internet connection.
No speech API key or paid service is needed by the app.

HOME SCREEN
Open the published site directly in Chrome. Use the three-dot menu > Add to Home
screen (or Install and create shortcut) > Install. The original purple icon and
standalone display are included. Offline caching is not added in this edition.

LOCAL PREVIEW / SOURCE
From the extracted folder run: python3 -m http.server 8000
Then open http://localhost:8000 in Chrome. A published HTTPS site is needed for
home-screen installation. Optional source checks, if Node.js is installed:
node check.mjs
node check-detective.mjs

SAVED PROGRESS
Existing stars and tracing progress are retained. Progress is saved in this
browser/device using localStorage (tiny-fingers-v1), not in GitHub. Clearing
browser storage, changing browser/device or using a different site address
can make progress unavailable. A source ZIP does not include a child's browser
progress. The grown-up Reset option clears local lesson and detective progress.

VALIDATION
Content checks cover 20 themes, 120 pictures, 120 WH questions, 118 traceable words
and 62 glyph guides. Detective checks cover letter/number coverage, wrong choices,
sequencing, replay rewards, saved collections and British voice selection.
Desktop and 390px mobile layout were reviewed; an actual phone's installed speech
voice must be previewed on that phone.
