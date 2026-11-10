import { useEffect, useState } from 'react';
import type { GameEvent, Spitter } from '../game/engine';
import { Character, Hand, PlayerBack, Sandal, type CharState } from './Character';

// The view is 360x500 and drawn with `meet`, so all of it is always visible. Backgrounds and the auto's
// body extend EX units past the edges to fill taller/wider screens.
const EX = 700;
const W = 360;
const VH = 500;
const HORIZON = 190;

// Head centres. Driver sits centre-right, front passenger on the left.
const S = 0.8; // people are drawn at 80% size
const POS: Record<Spitter, { x: number; y: number; r: number; shirt: string }> = {
  driver: { x: 236, y: 284, r: 34, shirt: '#60a5fa' },
  passenger: { x: 112, y: 298, r: 28, shirt: '#fb923c' },
};
// The player sits behind: hands rest beside the shoulders, sandals are on the feet. On a spit the hand on the
// spitter's side grabs the sandal off the foot and slaps.
const HS = 1.4; // hands and sandals are drawn large: they are right in front of the player
const HAND: Record<Spitter, { side: 'left' | 'right'; x: number; y: number; fx: number; fy: number }> = {
  driver: { side: 'right', x: 268, y: 452, fx: 314, fy: 472 },
  passenger: { side: 'left', x: 92, y: 452, fx: 46, fy: 472 },
};
// Where the sandal lands: the head, turned outward (see Character).
const impact = (k: Spitter) => {
  const dir = k === 'driver' ? 1 : -1;
  return { x: POS[k].x + dir * 22 * S, y: POS[k].y + 4 * S + 54 * HS }; // +54: sandal centre sits above the fist
};

interface SceneProps {
  spitter: Spitter | null;
  event: GameEvent | null;
  onSpitterTap: () => void;
}

export function Scene({ spitter, event, onSpitterTap }: SceneProps) {
  // On a hit the hand swings at once; the face reacts when the sandal lands.
  const [slap, setSlap] = useState<{ id: number; spitter: Spitter } | null>(null);
  const [face, setFace] = useState<Spitter | null>(null);
  useEffect(() => {
    if (event?.type !== 'hit') return;
    setSlap({ id: event.id, spitter: event.spitter });
    const t1 = setTimeout(() => setFace(event.spitter), 120);
    const t2 = setTimeout(() => {
      setSlap(null);
      setFace(null);
    }, 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [event]);

  const people = (Object.keys(POS) as Spitter[]).map((kind) => {
    const { x, y, r, shirt } = POS[kind];
    const state: CharState = face === kind ? 'slapped' : spitter === kind ? 'spit' : 'idle';
    return (
      <g key={kind} transform={`translate(${x} ${y}) scale(${S})`}>
        {/* torso (seen from behind) */}
        <path d={`M${-r - 22} 300 Q${-r - 22} ${r - 2} ${-12} ${r - 2} L12 ${r - 2} Q${r + 22} ${r - 2} ${r + 22} 300Z`} fill={shirt} />
        <rect x="-10" y={r - 12} width="20" height="16" fill="#c98d5c" />
        {kind === 'driver' && (
          <g>
            {/* checked gamcha over the shoulder */}
            <path d="M-58 90 L-14 40 L2 54 L-42 108Z" fill="#dc2626" />
            <path d="M-50 82 L-8 46 M-44 96 L-2 60 M-56 92 L-30 62 M-38 100 L-12 70" stroke="#fff" strokeWidth="2" opacity=".7" />
          </g>
        )}
        <Character kind={kind} state={state} />
        {spitter === kind && state === 'spit' && (
          // generous tap target over the spitter
          <rect x={-r - 30} y={-r - 40} width={2 * r + 60} height="200" fill="transparent" style={{ cursor: 'pointer' }} onPointerDown={onSpitterTap} />
        )}
      </g>
    );
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-sky-300">
      <svg
        viewBox={`0 0 ${W} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="View from the back seat of an auto-rickshaw"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
          <clipPath id="tire">
            <rect x="-18" y="-36" width="36" height="72" rx="7" />
          </clipPath>
        </defs>
        {/* outside world */}
        <rect x={-EX} y={-EX} width={W + 2 * EX} height={HORIZON + EX} fill="url(#sky)" />
        <g className="skyline-drift" fill="#b08968" opacity=".7">
          {[-360, 0, 360, 720].map((o) => (
            <g key={o} transform={`translate(${o} 0)`}>
              <rect x="0" y="140" width="50" height="50" />
              <rect x="58" y="115" width="38" height="75" />
              <rect x="104" y="150" width="60" height="40" />
              <rect x="172" y="105" width="44" height="85" />
              <rect x="224" y="135" width="34" height="55" />
              <rect x="266" y="152" width="40" height="38" />
              <rect x="314" y="125" width="40" height="65" />
            </g>
          ))}
        </g>
        <rect x={-EX} y={HORIZON} width={W + 2 * EX} height={VH - HORIZON + EX} fill="#a8a29e" />
        <polygon points="165,190 195,190 1200,1200 -840,1200" fill="#44444c" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} className="road-dash" style={{ animationDelay: `${-i * 0.3}s` }} x="177" y="400" width="6" height="80" fill="#fde68a" />
        ))}

        {/* auto-rickshaw: windshield post, dash panel, front wheel seen from behind */}
        <g className="rattle">
          <rect x="168" y="30" width="6" height="320" fill="#365314" />
          <rect x={-EX} y="340" width={W + 2 * EX} height={VH - 340 + EX} fill="#15803d" />
          <rect x={-EX} y="340" width={W + 2 * EX} height="10" fill="#fde047" />
          {/* From behind a wheel shows only its tread, scrolling upward: that reads as "moving forward". */}
          <g transform="translate(171 372)">
            <rect x="-18" y="-36" width="36" height="72" rx="7" fill="#18181b" />
            <g clipPath="url(#tire)">
              <g className="tread">
                {Array.from({ length: 11 }, (_, i) => (
                  <rect key={i} x="-18" y={-48 + 12 * i} width="36" height="5" fill="#52525b" />
                ))}
              </g>
            </g>
            <path d="M-34 -26 Q0 -56 34 -26 L34 -20 L-34 -20Z" fill="#166534" stroke="#fde047" strokeWidth="3" />
          </g>
        </g>

        <g className="rattle">{people}</g>

        {/* canopy and pillars in front of the people */}
        <rect x={-EX} y={-EX} width={W + 2 * EX} height={EX + 30} fill="#14532d" />
        <path d="M0 0 H360 V34 Q180 52 0 34Z" fill="#14532d" />
        <rect x={-EX} y="30" width={W + 2 * EX} height="5" fill="#fde047" opacity=".85" />
        <rect x={-EX} y="30" width={EX + 14} height={VH + EX} fill="#166534" />
        <rect x="346" y="30" width={EX + 14} height={VH + EX} fill="#166534" />
        <g stroke="#facc15" strokeWidth="2" fill="#ef4444">
          {[60, 120, 180, 240, 300].map((x) => (
            <g key={x}>
              <line x1={x} y1="44" x2={x} y2="56" />
              <circle cx={x} cy="60" r="4" />
            </g>
          ))}
        </g>

        {/* rear-view mirror */}
        <g transform="translate(262 66)">
          <line x1="0" y1="-14" x2="0" y2="0" stroke="#27272a" strokeWidth="4" />
          <rect x="-34" y="0" width="68" height="40" rx="10" fill="#27272a" />
          <rect x="-30" y="4" width="60" height="32" rx="7" fill="#dbeafe" />
          <path d="M-30 36 Q0 20 30 36Z" fill="#7c3aed" />
          <circle cy="18" r="11" fill="#e0a878" />
          <path d="M-11 15 A11 11 0 0 1 11 15 Q0 10 -11 15Z" fill="#292524" />
          <path d="M-8 12 L-3 14 M8 12 L3 14" stroke="#292524" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="-4.5" cy="17.5" r="2.2" fill="#fff" />
          <circle cx="4.5" cy="17.5" r="2.2" fill="#fff" />
          <circle cx="-4.5" cy="18" r="1.1" fill="#111827" />
          <circle cx="4.5" cy="18" r="1.1" fill="#111827" />
          <path d="M-3.5 24 H3.5" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* the player, from behind: back of the head and shoulders at the bottom, empty hands, sandals on the feet */}
        <rect x="-250" y="470" width="860" height={EX} fill="#7c3aed" />
        <g transform="translate(180 448)">
          <PlayerBack />
        </g>
        {(Object.keys(HAND) as Spitter[]).map((k) => {
          const h = HAND[k];
          const t = impact(k);
          const slapping = slap?.spitter === k;
          return (
            <g key={k}>
              {!slapping && (
                <g transform={`translate(${h.fx} ${h.fy}) rotate(${h.side === 'left' ? -12 : 12}) scale(.8)`}>
                  <Sandal foot />
                </g>
              )}
              <g transform={`translate(${h.x} ${h.y})`}>
                <g
                  key={slapping ? slap.id : 'rest'}
                  className={slapping ? 'hand-slap' : undefined}
                  style={
                    {
                      '--fx': `${h.fx - h.x}px`,
                      '--fy': `${h.fy - h.y - 20}px`,
                      '--dx': `${t.x - h.x}px`,
                      '--dy': `${t.y - h.y}px`,
                      '--rot': `${h.side === 'right' ? -22 : 22}deg`,
                    } as React.CSSProperties
                  }
                >
                  <g transform={`scale(${HS})`}>
                    <Hand side={h.side} holding={slapping} />
                  </g>
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
