import { Sandal } from './Character';
import { InstallPrompt } from './InstallPrompt';

interface HomeScreenProps {
  best: number;
  onPlay: () => void;
}

export function HomeScreen({ best, onPlay }: HomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 px-6 py-10 text-center text-amber-950">
      <div className="mt-6">
        <svg viewBox="-30 -60 60 120" className="mx-auto h-40 rotate-[25deg] drop-shadow-lg" aria-hidden="true">
          <Sandal />
        </svg>
        <h1 className="mt-4 font-display text-6xl font-bold tracking-tight">Jutai</h1>
        <p className="font-display text-3xl text-red-700">জুতাই</p>
        <p className="mx-auto mt-5 max-w-xs text-lg font-semibold">
          Someone in the auto spat out of the side? Give them a jutai before they get away!
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="mb-5 rounded-2xl bg-white/60 py-3 text-lg font-bold">
          Best score: <span className="text-red-700">{best}</span>
        </div>
        <button
          onClick={onPlay}
          className="w-full rounded-3xl bg-red-600 py-5 font-display text-3xl font-bold text-white shadow-pop active:scale-95"
        >
          Play
        </button>
        <p className="mt-4 text-sm font-semibold opacity-70">Tap the spitter, the shoe button, or press Space.</p>
        <div className="mt-4 flex justify-center">
          <InstallPrompt />
        </div>
      </div>
    </div>
  );
}
