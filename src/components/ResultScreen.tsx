import { useState } from 'react';
import { accuracy, verdict, type Stats } from '../game/engine';
import { shareResult } from '../game/shareCard';
import { Confetti } from './Confetti';

interface ResultScreenProps {
  stats: Stats;
  best: number;
  isNew: boolean;
  onAgain: () => void;
  onHome: () => void;
}

export function ResultScreen({ stats, best, isNew, onAgain, onHome }: ResultScreenProps) {
  const v = verdict(stats);
  const [note, setNote] = useState('');

  const share = async () => {
    try {
      const r = await shareResult(stats);
      setNote(r === 'downloaded' ? 'Card saved. Text copied, share it!' : r === 'shared' ? 'Shared!' : '');
    } catch {
      setNote('Could not create the card.');
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-amber-400 to-amber-100 px-6 py-8 text-center text-amber-950">
      {(isNew || accuracy(stats) >= 70) && <Confetti />}
      <div className="mt-4">
        <p className="font-display text-xl font-semibold opacity-70">Round over</p>
        <h2 className="font-display text-5xl font-bold text-red-700">{v.title}</h2>
        <p className="mt-2 text-lg font-semibold">{v.message}</p>
      </div>

      <div className="w-full max-w-xs rounded-3xl bg-white/70 p-5 shadow-pop">
        <div className="font-display text-7xl font-bold">{stats.score}</div>
        <div className="text-sm font-bold uppercase tracking-wide opacity-70">
          {isNew ? '🏆 New best!' : `Best ${best}`}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-semibold">
          <Cell label="Jutais" value={stats.hits} />
          <Cell label="Spits" value={stats.spits} />
          <Cell label="Accuracy" value={`${accuracy(stats)}%`} />
        </div>
        {stats.bestReaction !== null && (
          <div className="mt-3 text-sm font-semibold opacity-70">Fastest slap: {Math.round(stats.bestReaction)} ms</div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button onClick={share} className="w-full rounded-2xl bg-amber-950 py-4 font-display text-2xl font-bold text-amber-50 active:scale-95">
          Share score
        </button>
        <button onClick={onAgain} className="w-full rounded-2xl bg-red-600 py-4 font-display text-2xl font-bold text-white shadow-pop active:scale-95">
          Play again
        </button>
        <button onClick={onHome} className="w-full py-2 font-semibold underline">
          Home
        </button>
        <p className="h-5 text-sm font-semibold" aria-live="polite">{note}</p>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase opacity-70">{label}</div>
    </div>
  );
}
