# Jutai: Requirements

Jutai (জুতাই) means slapping someone with a shoe/sandal. This project is converted from the Lucky Ludu codebase.

## 1. Concept
A passenger rides a Bangladeshi vehicle. Now and then someone (driver, helper, conductor or another passenger) spits out of the window. The player gives them a **jutai** (a shoe slap) at the right moment. The game counts spits and jutais.

## 2. Scope: v1 (simple)
- Single player, single vehicle (rickshaw or bus, one scene), one mode.
- Later (out of scope for v1): more vehicles (van, auto/CNG, train, micro), levels, sounds, leaderboard, Bangla UI.

## 3. Gameplay
1. Home screen: title, Play button, best score (localStorage).
2. Round: about 60 seconds. A looping scrolling road and a moving vehicle.
3. At random intervals a spitter leans out and spits. The spit is active for a reaction window (starts at about 1.2 s and shrinks as the round goes on).
4. Player input within the window counts as a **hit**: the shoe animation plays and the spitter is slapped.
5. Spit with no input before the window ends counts as **escaped**.
6. Input when no spit is active is **ignored** (no penalty, no feedback beyond optional shoe wiggle).
7. Spit frequency rises over the round. Spit timing is random and never overlaps.
8. Score = hits, plus a faster-reaction bonus. Tracked stats: total spits, hits, escaped, accuracy %, best reaction time.
9. Round end goes to the result screen.

## 4. Controls
- Mobile: tap the spitter or the large Jutai button.
- Desktop: click, or press Space/Enter.
- The Jutai button is large and always visible at the bottom of the screen.

## 5. Characters and art
- Original art only: inline SVG/CSS/emoji, no external assets.
- Generic cartoon characters with slightly dim-witted expressions (the joke is that they spit). No real-person likeness, no ethnic or religious markers, no gore.
- Visual states: idle, spitting, slapped (stars, shoe impact), escaped.

## 6. UI (game-screen feel)
- Full-screen, mobile-first portrait. Also works in a desktop browser, centered in a max-width column.
- HUD: timer, hits, spits, a best-score badge.
- Big tap targets (at least 48px), no scrolling during play, no text selection or double-tap zoom (`touch-action: manipulation`).
- Hit and escape feedback: floating "জুতাই!" / "Escaped" text, shake, confetti (reuse the existing Confetti).

## 7. Results and sharing
- Result screen: score, spits, hits, accuracy, a verdict message by accuracy (for example: 90% and over is "Jutai Master", under 30% is "Too slow!"), Play again and Share buttons.
- Share card: a generated image (canvas) with the game name, vehicle, score, stats and verdict.
- Share with the Web Share API (file). Fallback: download the PNG, and copy the text message.
- The card contains no personal data.

## 8. Technical
- Stack: Vite + React + TypeScript + Tailwind (existing).
- **Remove Supabase**: delete `@supabase/supabase-js` from package.json and the lock file, and delete any code or env that uses it.
- No backend. Best score and stats are stored in localStorage, wrapped in try/catch.
- **GitHub Pages deploy**:
  - `base` in vite.config.ts is `'./'` (relative), which works for any repo path.
  - The workflow in `.github/workflows` builds and deploys `dist` to Pages (update the existing workflow if there is one).
  - There is no client-side routing (no BrowserRouter), so there are no 404 problems.
  - All assets are bundled or inline, with no absolute `/` paths.
- Rename the package, `index.html` title and meta (description, OG tags), and README to Jutai.
- Remove all Ludo code: Dice, Coin, Fold, PlayerBoard, TurnIndicator, GameSetup, GameBoard, DiceRollAnimation and old engine/constants. Keep the Confetti and the App shell.
- Game timing uses `requestAnimationFrame` or a timer driven by timestamps (not frame counts).

## 9. PWA (installable on iOS and Android)
Modeled on `/Users/wl/Workspace/projects/goribco/lexora` (no PWA library, hand-written files in `public/`), with one fix: Lexora uses absolute `/sw.js` and `/manifest.json`, which break under a GitHub Pages sub-path. Jutai uses relative paths.
- `public/manifest.json`: `name` "Jutai", `short_name` "Jutai", `display: standalone`, `orientation: portrait`, `start_url: "./"`, `scope: "./"`, theme/background colors, and icons 192, 512 and maskable 512 (relative `./` paths).
- Icons (generated from one SVG shoe/sandal design): `icon-192.png`, `icon-512.png`, `icon-maskable.png`, `apple-touch-icon.png` (180).
- `index.html`: `<link rel="manifest" href="./manifest.json">`, `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, `apple-touch-icon`, and viewport `viewport-fit=cover`. Use safe-area insets for padding.
- `public/sw.js`: a small service worker, cache-first. It precaches `./` and `./index.html` and caches built assets as they are fetched (the same runtime approach as Lexora, using relative URLs). The cache name is versioned (`jutai-v1`) and old caches are deleted on `activate`. The game works offline after the first load.
- Registration: `navigator.serviceWorker.register('./sw.js')` in `main.tsx`, best-effort (errors ignored), and only in production builds (`import.meta.env.PROD`).
- Install UX: Android/Chrome shows an "Install" button on the home screen from the `beforeinstallprompt` event. iOS Safari has no install event, so it shows a one-line hint ("Share, then Add to Home Screen"), hidden once the app is running standalone.
- Share card, best score and game state work offline (all local).

## 10. Acceptance
- `npm run build` and `npm run typecheck` pass, with no Supabase reference left (`grep -ri supabase` is empty outside node_modules).
- A full round is playable on mobile and desktop.
- A hit counts only when it happens inside the active window. Ignored taps change nothing.
- The share card is generated and shared or downloaded.
- The built `dist` works when served from a sub-path (for example `/jutai/`).
- Lighthouse/DevTools shows the manifest and service worker valid, and the app is installable. After install it launches standalone and works offline, including under a sub-path such as `/jutai/`.
- A small test of the scoring and hit-window logic.
