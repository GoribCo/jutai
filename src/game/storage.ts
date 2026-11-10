const KEY = 'jutai:v1';

export interface Saved {
  bestScore: number;
}

export function loadSaved(): Saved {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { bestScore: Number.isFinite(v.bestScore) ? v.bestScore : 0 };
  } catch {
    return { bestScore: 0 };
  }
}

/** Saves the score if it beats the best. Returns the best score and whether it is a new record. */
export function saveScore(score: number): { best: number; isNew: boolean } {
  const { bestScore } = loadSaved();
  if (score <= bestScore) return { best: bestScore, isNew: false };
  try {
    localStorage.setItem(KEY, JSON.stringify({ bestScore: score }));
  } catch {
    // storage unavailable (private mode etc.): the score just won't persist
  }
  return { best: score, isNew: true };
}
