# Jutai: Tasks

Based on [requirements.md](requirements.md). Each task is one commit-sized step. Tick when done.

## 0. Cleanup and setup
- [x] T1. Remove `@supabase/supabase-js` from package.json, run `npm install` to refresh the lock file, and grep for leftover Supabase code/env (Req 8).
- [x] T2. Delete the Ludo code: Dice, Coin, Fold, PlayerBoard, TurnIndicator, GameSetup, GameBoard, DiceRollAnimation, GameResults and `src/game/*`. Keep Confetti and the App shell (Req 8).
- [x] T3. Rename the package to `jutai`, and update the `index.html` title/meta/OG tags and README (Req 8).
- [x] T4. Set `base: './'` in vite.config.ts. Check `.github/workflows/deploy.yml` builds and deploys `dist` to Pages (Req 8).

## 1. Game logic (no UI)
- [x] T5. `src/game/engine.ts`: pure, timestamp-driven state with `startRound`, `tick(now)`, `tap(now)`, random spit scheduling (never overlapping, rising frequency), a shrinking reaction window (starts at 1.2 s), and hit/escaped/ignored handling (Req 3).
- [x] T6. Scoring: hits plus a reaction-time bonus. Stats: spits, hits, escaped, accuracy %, best reaction (Req 3.8).
- [x] T7. Verdict by accuracy (for example 90% and over is "Jutai Master", under 30% is "Too slow!") (Req 7).
- [x] T8. `src/game/storage.ts`: best score and stats in localStorage, wrapped in try/catch (Req 8).
- [x] T9. A small test of the engine (hit inside the window, escaped, ignored tap, no overlap) and the scoring. Add a test runner only if none exists (vitest) (Req 10).

## 2. Art and scene
- [x] T10. Inline SVG/CSS characters: generic cartoon passengers and spitters with dim-witted faces, with states idle, spitting, slapped and escaped (Req 5).
- [x] T11. Vehicle scene (one vehicle, side view) with a scrolling road and a window where the spitter leans out (Req 3.2, 6).
- [x] T12. Shoe/slap animation and the spit animation (CSS keyframes) (Req 3.4, 5).

## 3. Screens
- [x] T13. `HomeScreen`: title, Play, best score, and the install button/hint placeholder (Req 3.1).
- [x] T14. `GameScreen`: HUD (timer, hits, spits, best), the scene, and a large always-visible Jutai button. Floating "জুতাই!" / "Escaped" text, shake and Confetti on a hit. `touch-action: manipulation`, no text selection, 48px or larger targets (Req 4, 6).
- [x] T15. Input: tap the spitter or the button, click, and Space/Enter keys. Ignored when no spit is active (Req 3.6, 4).
- [x] T16. Round loop on `requestAnimationFrame`: a 60 s timer, and the end of the round goes to results (Req 3.2, 3.9, 8).
- [x] T17. `ResultScreen`: score, spits, hits, accuracy, verdict, Play again and Share (Req 7).
- [x] T18. Update `App.tsx` to switch home, game and result (Req 8).

## 4. Share card
- [x] T19. `shareCard.ts`: a canvas-drawn PNG with the game name, vehicle, score, stats and verdict. No personal data (Req 7).
- [x] T20. Share with the Web Share API (file). Fallback: download the PNG and copy the text message (Req 7).

## 5. PWA
- [x] T21. Generate icons from one SVG: 192, 512, maskable 512 and apple-touch-icon 180, in `public/` (Req 9).
- [x] T22. `public/manifest.json` with relative `./` paths, standalone, portrait (Req 9).
- [x] T23. `index.html`: manifest link, theme-color, Apple web-app meta tags, apple-touch-icon, viewport-fit=cover, and safe-area padding in CSS (Req 9).
- [x] T24. `public/sw.js`: cache-first, relative URLs, versioned cache `jutai-v1`, old caches deleted on activate. Register in `main.tsx` in production only (Req 9).
- [x] T25. Install UX: an Install button from `beforeinstallprompt` (Android), and an iOS hint ("Share, then Add to Home Screen") hidden in standalone mode (Req 9).

## 6. Verify
- [x] T26. `npm run build`, `npm run typecheck` and `npm run lint` pass. `grep -ri supabase` is empty outside node_modules (Req 10).
- [x] T27. Serve `dist` under a sub-path (for example `/jutai/`) and check that the game loads, the manifest and service worker work, and the app works offline after the first load (Req 10).
- [x] T28. Manual run: a full round on a mobile viewport and on desktop, check a hit, an escape, an ignored tap and the share card (Req 10).
- [ ] T29. Deploy to GitHub Pages and test install on Android and iOS (Req 9, 10).

## Order
T1 to T4, then T5 to T9 (logic first, testable), then T10 to T18 (UI), then T19 and T20 (share), T21 to T25 (PWA), and last T26 to T29 (verify).
