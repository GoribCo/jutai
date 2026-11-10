import { useEffect, useState } from 'react';
import type { GameEvent, Spitter } from '../game/engine';
import { Character, Shoe, type CharState } from './Character';

// left → right; the bus drives to the right so the driver is in the front window.
const SLOTS: Spitter[] = ['passenger', 'conductor', 'helper', 'driver'];
const WIN_W = 68;
const WIN_H = 58;
const WIN_Y = 40;
const winX = (i: number) => 20 + i * 84;

interface SceneProps {
  spitter: Spitter | null;
  event: GameEvent | null;
  onSpitterTap: () => void;
}

export function Scene({ spitter, event, onSpitterTap }: SceneProps) {
  // Show the "slapped" face + shoe briefly after each hit.
  const [slap, setSlap] = useState<{ id: number; spitter: Spitter } | null>(null);
  useEffect(() => {
    if (event?.type !== 'hit') return;
    setSlap({ id: event.id, spitter: event.spitter });
    const t = setTimeout(() => setSlap(null), 700);
    return () => clearTimeout(t);
  }, [event]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
      <div className="skyline absolute inset-x-0 bottom-[16%] h-[90px]" />
      <div className="road absolute inset-x-0 bottom-0 h-[22%]" />
      <svg
        viewBox="0 0 360 190"
        className="bus-bounce absolute inset-x-0 bottom-[7%] w-full"
        role="img"
        aria-label="A crowded bus"
      >
        <defs>
          {SLOTS.map((_, i) => (
            <clipPath id={`win-${i}`} key={i}>
              <rect x={winX(i)} y={WIN_Y} width={WIN_W} height={WIN_H} rx="8" />
            </clipPath>
          ))}
        </defs>
        {/* body */}
        <rect x="4" y="22" width="352" height="130" rx="16" fill="#f59e0b" />
        <rect x="4" y="108" width="352" height="30" fill="#dc2626" />
        <text x="180" y="129" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fef3c7" letterSpacing="3">
          JUTAI PARIBAHAN
        </text>
        <rect x="338" y="116" width="18" height="12" rx="4" fill="#fef9c3" />
        {/* windows + people */}
        {SLOTS.map((kind, i) => {
          const x = winX(i);
          const slapped = slap?.spitter === kind;
          const state: CharState = slapped ? 'slapped' : spitter === kind ? 'spit' : 'idle';
          return (
            <g key={kind}>
              <rect x={x} y={WIN_Y} width={WIN_W} height={WIN_H} rx="8" fill="#bae6fd" />
              <g clipPath={state === 'idle' ? `url(#win-${i})` : undefined}>
                <g transform={`translate(${x + WIN_W / 2} ${WIN_Y + 36})`}>
                  <Character kind={kind} state={state} />
                </g>
              </g>
              <rect x={x} y={WIN_Y} width={WIN_W} height={WIN_H} rx="8" fill="none" stroke="#78350f" strokeWidth="4" />
              {state === 'spit' && (
                // generous tap target over the spitting window and the space above it
                <rect x={x - 6} y={WIN_Y - 36} width={WIN_W + 12} height={WIN_H + 40} fill="transparent" style={{ cursor: 'pointer' }} onPointerDown={onSpitterTap} />
              )}
              {slapped && (
                <g transform={`translate(${x + WIN_W / 2} ${WIN_Y + 22})`} key={slap.id}>
                  <g className="shoe-slap">
                    <Shoe />
                  </g>
                </g>
              )}
            </g>
          );
        })}
        {/* wheels */}
        {[80, 280].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="152" r="24" fill="#18181b" />
            <g transform={`translate(${cx} 152)`}>
              <g className="wheel">
                <circle r="11" fill="#d4d4d8" />
                <path d="M-11 0H11M0 -11V11" stroke="#52525b" strokeWidth="3" />
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
