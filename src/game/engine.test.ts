import { describe, expect, it } from 'vitest';
import { ROUND_MS, accuracy, startRound, tap, tick, verdict, windowAt } from './engine';

const rng = () => 0.5;
// Start at t=0; first spit is scheduled at 1500 with rng 0.5.
const spitting = () => tick(startRound(0, rng), 1500, rng);

describe('engine', () => {
  it('starts a spit when due', () => {
    const r = spitting();
    expect(r.spit).not.toBeNull();
    expect(r.stats.spits).toBe(1);
    expect(r.event?.type).toBe('spit');
  });

  it('counts a tap inside the window as a hit with a score', () => {
    const r = tap(spitting(), 1500 + 300, rng);
    expect(r.spit).toBeNull();
    expect(r.stats).toMatchObject({ hits: 1, bestReaction: 300 });
    expect(r.stats.score).toBeGreaterThan(100);
    expect(r.event?.type).toBe('hit');
  });

  it('counts a spit with no tap as escaped', () => {
    const r = tick(spitting(), 1500 + windowAt(0) + 1, rng);
    expect(r.spit).toBeNull();
    expect(r.stats.escaped).toBe(1);
    expect(r.event?.type).toBe('escaped');
  });

  it('ignores taps when nobody is spitting', () => {
    const r = startRound(0, rng);
    expect(tap(r, 500, rng)).toBe(r);
    const done = tap(spitting(), 1500 + 100, rng);
    expect(tap(done, 1500 + 200, rng)).toBe(done);
  });

  it('never overlaps spits', () => {
    const r = spitting();
    expect(tick(r, 1600, rng)).toBe(r); // still spitting: nothing new starts
  });

  it('keeps hits + escaped equal to spits and ends the round', () => {
    let r = startRound(0, rng);
    for (let t = 0; t <= ROUND_MS + 2000; t += 50) {
      r = tick(r, t, rng);
      if (r.spit && t % 200 === 0) r = tap(r, t, rng);
    }
    expect(r.over).toBe(true);
    expect(r.stats.hits + r.stats.escaped).toBe(r.stats.spits);
    expect(r.stats.spits).toBeGreaterThan(10);
  });

  it('computes accuracy and verdict', () => {
    const s = { spits: 10, hits: 9, escaped: 1, score: 0, bestReaction: null };
    expect(accuracy(s)).toBe(90);
    expect(verdict(s).title).toBe('Jutai Master');
    expect(verdict({ ...s, hits: 1 }).title).toBe('Too slow!');
  });
});
