import { useCallback, useState } from 'react';
import type { Stats } from '@/game/engine';
import { loadSaved, saveScore } from '@/game/storage';
import { HomeScreen } from '@/components/HomeScreen';
import { GameScreen } from '@/components/GameScreen';
import { ResultScreen } from '@/components/ResultScreen';

type View =
  | { name: 'home' }
  | { name: 'game'; run: number }
  | { name: 'result'; stats: Stats; best: number; isNew: boolean };

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const [best, setBest] = useState(() => loadSaved().bestScore);

  const play = () => setView((v) => ({ name: 'game', run: v.name === 'game' ? v.run + 1 : 0 }));
  const finish = useCallback((stats: Stats) => {
    const r = saveScore(stats.score);
    setBest(r.best);
    setView({ name: 'result', stats, best: r.best, isNew: r.isNew });
  }, []);

  return (
    <div className="app-shell font-sans">
      {view.name === 'home' && <HomeScreen best={best} onPlay={play} />}
      {view.name === 'game' && <GameScreen key={view.run} best={best} onFinish={finish} />}
      {view.name === 'result' && (
        <ResultScreen stats={view.stats} best={view.best} isNew={view.isNew} onAgain={play} onHome={() => setView({ name: 'home' })} />
      )}
    </div>
  );
}
