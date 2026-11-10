# Jutai: Requirements, version 2

Changes on top of [requirements.md](requirements.md). Everything not listed here stays as in v1 (gameplay rules, scoring, share card, PWA, GitHub Pages).

## What changes: first-person view in an auto-rickshaw
v1 showed a bus from the outside. In v2 the player **sits inside an auto-rickshaw (CNG)** in the back seat and looks forward, so the people spitting are **right in front of the player**.

### Scene
- Camera: the player's seat, facing forward. Through the windshield: sky, a skyline drifting past and a road in perspective with lane dashes rushing toward the player.
- The auto frame: canopy roof at the top, side pillars, a centre windshield post and a green body panel at the bottom.
- Two people sit in front, seen **from behind**:
  - **Driver** (centre-right): cap, shirt, a checked gamcha cloth over the shoulder.
  - **Front passenger** (left): messy hair with a tuft, orange shirt.
- Both have a slightly dim look: big ears, a cross-eyed eye, a buck tooth (visible when their head turns).

### Spit and slap
- Spit: the person **turns their head to the outer side** (driver to the right, passenger to the left) and leans out of the open side. The face is now in profile with puffed cheeks, pursed lips and spit droplets flying outward.
- Jutai: the player's shoe swings in from the **bottom right** (the player's hand) and smacks the spitter's head. The head is knocked forward, X eyes, a red mark and stars.
- Escaped: the person turns back, smug, and the "Escaped…" text shows.
- Tap target: the spitter (head and torso area), the big Jutai button, and Space/Enter. Rules, timing and scoring are unchanged.

### Other
- Spitters are now `driver` and `passenger` only (the helper/conductor were bus roles).
- Home screen copy and the share card mention the auto-rickshaw.
- The service worker cache name is bumped to `jutai-v2`, and the package version is `0.2.0`.

## Acceptance
- A round is playable on mobile and desktop and looks like the view from the back seat of an auto-rickshaw.
- The spitter turns, spits, and gets slapped from the bottom-right on a hit. Ignored taps still change nothing.
- `npm run build`, `typecheck`, `lint` and `test` pass. Offline and sub-path behaviour are unchanged.

## v2.1 changes
- The two front characters are drawn 20% smaller.
- The player is now visible: two purple-sleeved arms and fists rest at the bottom corners, each holding a sandal. The **right hand slaps the driver** (right) and the **left hand slaps the passenger** (left).
- The shoe is replaced everywhere by a **rubber chappal (flip-flop)**: blue sole, red V-strap. This covers the slap, the home screen, the app icons and the 🩴 emoji on the Jutai button and share card.

## v2.2 changes
- A **front wheel** with a mudguard sits at the centre of the dash. Its spokes and tread spin, and the dash, wheel and people rattle slightly, so the auto looks like it is moving.
- The player's **hands and sandals are 1.5x larger**, with the shoulders visible along the bottom edge.
- The player is shown as a **passenger watching the road**: a rear-view mirror at the top shows the player's face looking forward.
- The driver and front passenger are spaced further apart to make room for the wheel.

## v2.3 changes
- **Wheel:** seen from behind, a front wheel shows only its tread, so it is now a narrow tire whose tread bars scroll **upward**. That reads as moving forward. The old face-on spinning wheel looked like it moved right to left.
- **Always on screen:** the scene is drawn with `meet` (the whole view always shows), and the background and auto body extend past the edges for taller or wider screens. The two people are placed further inward so a spitting head never leaves the screen.
- **The player, from behind:** the back of the player's head and purple shoulders sit at the bottom centre. The player's **hands are empty** at rest, and **sandals are on the player's feet** at the bottom corners.
- **Slap:** on a spit, the hand on the spitter's side reaches down, **grabs the sandal off the foot** (the foot's sandal disappears), swings up and slaps. The spitter's face reacts when it lands, about 120 ms after the tap.
