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

## v2.4 changes
- **Legs and sandals:** the player's two legs (dark trousers) come up from the seat to bare feet wearing sandals, at the bottom corners. While a hand has taken a sandal, that foot is bare.
- **More of the player's body:** the player sits higher, so the back of the head, a wider back with a seam and the shoulders are clearly visible. The hands rest beside the head.
- **Smaller sandal in the swing:** the sandal in the hand is 70% of its former size. The hand stays large.

## v2.5 changes: top-down camera (supersedes the first-person scene in "What changes" and v2.1 to v2.4)
- **Camera:** straight down on the whole auto-rickshaw, which drives **up** the screen. The road, lane dashes and roadside roofs scroll **down**. The roof is translucent so everyone's head, body and hands stay visible. The view always shows in full, and the road and pavements extend to fill any screen size.
- **People:**
  - Front row: the **front passenger** on the left, and the **driver** (cap, blue shirt) holding the handlebar.
  - Back row: **three passengers side by side** on the rear bench, with legs forward and bare feet in sandals.
- **Wheels:** a front wheel pokes out ahead of the nose, and two rear wheels stick out of the sides. Their tread scrolls forward, so the auto reads as moving forward.
- **Spit:** the driver turns the head right and the front passenger turns left. The face shows puffed cheeks, pursed lips and droplets flying outward.
- **Jutai:** the **rear passenger behind the spitter** slaps (rear left → front passenger, rear right → driver, rear middle only watches). The arm stretches forward, the fist holds a **small sandal**, and the sandal is taken off that person's foot. The spitter's head turns, shows a red mark and stars, and the arm retracts.
- **Sandal size:** the sandal in the hand is about 30% of full size, so it never covers the scene.
- Rules, timing and scoring are unchanged.

## v2.6 (tried and dropped): camera slightly above and behind
**Superseded: the game uses the v2.5 straight-down view.** Kept only for reference.
- **Camera:** behind the auto and slightly above, looking forward: sky and skyline ahead, a road in perspective with lane dashes rushing toward the camera, the whole auto in view (rear wheels at the sides, front wheel ahead of the nose, translucent roof).
- **Rear row (nearest):** three people **sitting** side by side on the rear bench. We see the backs of their heads, shoulders and backs above the seat backrest, with their hands resting at their sides.
- **Front row (further away, smaller):** the front passenger on the left, and the driver holding the handlebar.
- **Spit:** the head turns outward into profile (cross-eye, buck tooth, spit flying out). **Jutai:** the rear person behind the spitter swings the outer arm forward with a small sandal. Rear-left slaps the front passenger, rear-right slaps the driver, and the middle person watches.
- The sandals are no longer shown on the feet, because the seated legs are hidden from this angle. The sandal simply appears in the hand.

## v2.7 changes: final v2 scene
- Back to the **v2.5 top-down view** (v2.6 was dropped), with the vehicle **about a third faster** (road 0.3 s, roofs 1.2 s, tread 0.19 s, rattle 0.16 s).
- **Tap the spitting head** to jutai, in addition to the JUTAI button and Space/Enter. The tap target is the top layer of the scene; taps on anyone not spitting do nothing.
