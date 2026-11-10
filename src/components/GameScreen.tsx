import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUND_MS, startRound, tap, tick, type Round, type Stats } from '../game/engine';
import { Confetti } from './Confetti';
import { Scene } from './Scene';

interface GameScreenProps {
  best: number;
  onFinish: (stats: Stats) => void;
}

export function GameScreen({ best, onFinish }: GameScreenProps) {
  const roundRef = useRef<Round>(startRound(performance.now()));
  const [round, setRound] = useState<Round>(roundRef.current);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_MS / 1000);

  // Single rAF loop; state is only set when the round actually changed (tick returns the same object otherwise).
  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const next = tick(roundRef.current, now);
      if (next !== roundRef.current) {
        roundRef.current = next;
        setRound(next);
      }
      setSecondsLeft(Math.min(ROUND_MS / 1000, Math.max(0, Math.ceil((ROUND_MS - (now - next.startedAt)) / 1000))));
      if (!next.over) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (round.event?.type !== 'hit') return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 250);
    return () => clearTimeout(t);
  }, [round.event]);

  const finished = useRef(false);
  useEffect(() => {
    if (round.over && !finished.current) {
      finished.current = true;
      onFinish(round.stats);
    }
  }, [round, onFinish]);

  const onTap = useCallback(() => {
    const next = tap(roundRef.current, performance.now());
    if (next !== roundRef.current) {
      roundRef.current = next;
      setRound(next);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
        e.preventDefault();
        onTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onTap]);

  const { stats, event } = round;
  return (
    <div className="relative flex h-full flex-col bg-amber-100">
      <div className="z-10 grid grid-cols-4 gap-2 bg-amber-950 px-3 py-2 text-center text-amber-50">
        <Stat label="Time" value={`${secondsLeft}s`} />
        <Stat label="Jutai" value={stats.hits} />
        <Stat label="Spits" value={stats.spits} />
        <Stat label="Score" value={stats.score} sub={`best ${Math.max(best, stats.score)}`} />
      </div>

      <div className={`relative min-h-0 flex-1 ${shaking ? 'hit-shake' : ''}`}>
        <Scene spitter={round.spit?.spitter ?? null} event={event} onSpitterTap={onTap} />
        {event && event.type !== 'spit' && (
          <div
            key={event.id}
            className={`float-text pointer-events-none absolute inset-x-0 top-[18%] text-center font-display text-5xl font-bold drop-shadow ${
              event.type === 'hit' ? 'text-red-600' : 'text-slate-700'
            }`}
          >
            {event.type === 'hit' ? 'জুতাই!' : 'Escaped…'}
          </div>
        )}
        {event?.type === 'hit' && <Confetti key={event.id} count={16} />}
      </div>

      <div className="z-10 bg-amber-950 p-3">
        <button
          onPointerDown={onTap}
          aria-label="Jutai! (Space)"
          className="flex h-24 w-full items-center justify-center gap-3 rounded-3xl bg-red-600 font-display text-4xl font-bold text-white shadow-pop active:scale-95 active:bg-red-700"
        >
          <span aria-hidden="true">🩴</span> JUTAI!
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</div>
      <div className="font-display text-2xl font-bold leading-tight">{value}</div>
      {sub && <div className="text-[10px] opacity-60">{sub}</div>}
    </div>
  );
}
