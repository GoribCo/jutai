// Pure, timestamp-driven round logic. No React, no timers: callers pass `now` (ms).

export const ROUND_MS = 60_000;
export const WINDOW_START_MS = 1200;
export const WINDOW_END_MS = 600;

export const SPITTERS = ['driver', 'passenger'] as const;
export type Spitter = (typeof SPITTERS)[number];

export interface Stats {
  spits: number;
  hits: number;
  escaped: number;
  score: number;
  bestReaction: number | null; // ms
}

export interface Spit {
  spitter: Spitter;
  startedAt: number;
  windowMs: number;
}

export interface GameEvent {
  id: number; // increments per event so the UI can react once to each
  type: 'spit' | 'hit' | 'escaped';
  spitter: Spitter;
}

export interface Round {
  startedAt: number;
  nextSpitAt: number;
  spit: Spit | null;
  stats: Stats;
  over: boolean;
  event: GameEvent | null;
}

export type Rng = () => number;

const progress = (r: Round, now: number) => Math.min(1, Math.max(0, (now - r.startedAt) / ROUND_MS));

export const windowAt = (p: number) => WINDOW_START_MS - (WINDOW_START_MS - WINDOW_END_MS) * p;

// Gap before the next spit shrinks from ~2s to ~0.8s (randomised), so spits get more frequent.
const gapAt = (p: number, rng: Rng) => (2000 - 1200 * p) * (0.6 + 0.8 * rng());

export function startRound(now: number, rng: Rng = Math.random): Round {
  return {
    startedAt: now,
    nextSpitAt: now + 1000 + 1000 * rng(),
    spit: null,
    stats: { spits: 0, hits: 0, escaped: 0, score: 0, bestReaction: null },
    over: false,
    event: null,
  };
}

const emit = (r: Round, type: GameEvent['type'], spitter: Spitter): GameEvent => ({
  id: (r.event?.id ?? 0) + 1,
  type,
  spitter,
});

export function tick(r: Round, now: number, rng: Rng = Math.random): Round {
  if (r.over) return r;
  const elapsed = now - r.startedAt;
  const p = progress(r, now);

  if (r.spit && now - r.spit.startedAt > r.spit.windowMs) {
    const next: Round = {
      ...r,
      spit: null,
      nextSpitAt: now + gapAt(p, rng),
      stats: { ...r.stats, escaped: r.stats.escaped + 1 },
      event: emit(r, 'escaped', r.spit.spitter),
    };
    return elapsed >= ROUND_MS ? { ...next, over: true } : next;
  }
  if (elapsed >= ROUND_MS) {
    // Spits are never started if their window would cross the end, so only a late tick lands here.
    return r.spit ? r : { ...r, over: true };
  }
  const windowMs = windowAt(p);
  if (!r.spit && now >= r.nextSpitAt && elapsed + windowMs <= ROUND_MS) {
    const spitter = SPITTERS[Math.floor(rng() * SPITTERS.length)];
    return {
      ...r,
      spit: { spitter, startedAt: now, windowMs },
      stats: { ...r.stats, spits: r.stats.spits + 1 },
      event: emit(r, 'spit', spitter),
    };
  }
  // No room left for another spit: end the round once the clock runs out (handled above).
  return r;
}

export function tap(r: Round, now: number, rng: Rng = Math.random): Round {
  if (r.over || !r.spit || now - r.spit.startedAt > r.spit.windowMs) return r; // ignored
  const reaction = now - r.spit.startedAt;
  const points = 100 + Math.round(100 * (1 - reaction / r.spit.windowMs));
  const { stats } = r;
  return {
    ...r,
    spit: null,
    nextSpitAt: now + gapAt(progress(r, now), rng),
    stats: {
      ...stats,
      hits: stats.hits + 1,
      score: stats.score + points,
      bestReaction: stats.bestReaction === null ? reaction : Math.min(stats.bestReaction, reaction),
    },
    event: emit(r, 'hit', r.spit.spitter),
  };
}

export const accuracy = (s: Stats) => (s.spits ? Math.round((s.hits / s.spits) * 100) : 0);

export function verdict(s: Stats): { title: string; message: string } {
  const a = accuracy(s);
  if (!s.spits) return { title: 'Quiet ride', message: 'Nobody spat this time.' };
  if (a >= 90) return { title: 'Jutai Master', message: 'Not a single spitter escaped!' };
  if (a >= 70) return { title: 'Shoe Sniper', message: 'Spitters fear your sandal.' };
  if (a >= 50) return { title: 'Decent Slapper', message: 'Half of them got what they deserved.' };
  if (a >= 30) return { title: 'Sleepy Sandal', message: 'Wake up, the road is full of spitters!' };
  return { title: 'Too slow!', message: 'Your shoe stayed in your bag.' };
}
