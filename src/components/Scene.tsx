import { useEffect, useState } from 'react';
import type { GameEvent, Spitter } from '../game/engine';
import { Head, Sandal, type CharState } from './Character';

// Top-down view of an auto-rickshaw driving up the screen. 360x500 view, drawn with `meet`; the road,
// pavements and anything else at the edges extend EX units so tall or wide screens are filled.
const EX = 700;
const W = 360;
const VH = 500;
const SKIN = '#e0a878';

// Front row: front passenger (left) and driver. Back row: three people side by side.
const FRONT: Record<Spitter, { x: number; y: number; shirt: string; dir: 1 | -1 }> = {
  passenger: { x: 125, y: 232, shirt: '#fb923c', dir: -1 },
  driver: { x: 218, y: 232, shirt: '#60a5fa', dir: 1 },
};
const REAR = [
  { id: 'L', x: 112, y: 350, shirt: '#7c3aed' },
  { id: 'M', x: 180, y: 350, shirt: '#f472b6' },
  { id: 'R', x: 248, y: 350, shirt: '#10b981' },
] as const;
// Who slaps whom: the rear person behind the spitter swings the arm on the side nearest the target.
const SLAPPER: Record<Spitter, { rear: 'L' | 'R'; side: 1 | -1 }> = {
  passenger: { rear: 'L', side: 1 },
  driver: { rear: 'R', side: -1 },
};
const SANDAL_IN_HAND = 0.3; // kept small on purpose

const PAVE = [
  { x: -60, y: 10, w: 44, h: 80, c: '#b45309' },
  { x: -150, y: 120, w: 70, h: 90, c: '#be123c' },
  { x: 356, y: 40, w: 60, h: 70, c: '#0f766e' },
  { x: 440, y: 150, w: 70, h: 60, c: '#a16207' },
];

interface SceneProps {
  spitter: Spitter | null;
  event: GameEvent | null;
  onSpitterTap: () => void;
}

export function Scene({ spitter, event, onSpitterTap }: SceneProps) {
  // On a hit the arm swings at once; the face reacts when the sandal lands.
  const [slap, setSlap] = useState<{ id: number; spitter: Spitter } | null>(null);
  const [face, setFace] = useState<Spitter | null>(null);
  useEffect(() => {
    if (event?.type !== 'hit') return;
    setSlap({ id: event.id, spitter: event.spitter });
    const t1 = setTimeout(() => setFace(event.spitter), 150);
    const t2 = setTimeout(() => {
      setSlap(null);
      setFace(null);
    }, 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [event]);

  const front = (Object.keys(FRONT) as Spitter[]).map((k) => {
    const p = FRONT[k];
    const state: CharState = face === k ? 'slapped' : spitter === k ? 'spit' : 'idle';
    return (
      <g key={k} transform={`translate(${p.x} ${p.y})`}>
        <ellipse cy="14" rx="28" ry="13" fill={p.shirt} />
        {k === 'driver' ? (
          <g>
            {/* arms out to the handlebar */}
            <path d="M-20 12 L-24 -26 M20 12 L24 -26" stroke={p.shirt} strokeWidth="9" strokeLinecap="round" />
            <circle cx="-24" cy="-28" r="5" fill={SKIN} />
            <circle cx="24" cy="-28" r="5" fill={SKIN} />
          </g>
        ) : (
          <g>
            <path d="M-22 12 L-14 -14 M22 12 L14 -14" stroke={p.shirt} strokeWidth="9" strokeLinecap="round" />
            <circle cx="-13" cy="-16" r="5" fill={SKIN} />
            <circle cx="13" cy="-16" r="5" fill={SKIN} />
          </g>
        )}
        <Head dir={p.dir} state={state} cap={k === 'driver' ? '#1e3a8a' : undefined} tuft={k === 'passenger'} />
        {state === 'spit' && <rect x="-44" y="-44" width="88" height="88" fill="transparent" style={{ cursor: 'pointer' }} onPointerDown={onSpitterTap} />}
      </g>
    );
  });

  const slapper = slap ? SLAPPER[slap.spitter] : null;

  const rear = REAR.map((p) => {
    const swinging = slapper?.rear === p.id;
    const footGone = swinging ? slapper.side : 0; // the foot on the swinging arm's side loses its sandal
    return (
      <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
        {/* legs forward to the floor, bare feet in sandals */}
        {([-1, 1] as const).map((s) => (
          <g key={s}>
            <path d={`M${s * 9} 18 L${s * 9} -34`} stroke="#334155" strokeWidth="13" strokeLinecap="round" />
            <g transform={`translate(${s * 9} -60) scale(.26)`}>
              <Sandal foot sole={footGone !== s} />
            </g>
          </g>
        ))}
        <ellipse cy="14" rx="28" ry="13" fill={p.shirt} />
        {/* resting arms, hands on the thighs */}
        {([-1, 1] as const).map((s) =>
          swinging && slapper.side === s ? null : (
            <g key={s}>
              <path d={`M${s * 24} 12 L${s * 13} -20`} stroke={p.shirt} strokeWidth="9" strokeLinecap="round" />
              <circle cx={s * 13} cy="-22" r="5" fill={SKIN} />
            </g>
          ),
        )}
        <Head dir={1} state="idle" hair={p.id === 'M' ? '#44403c' : '#1c1917'} />
      </g>
    );
  });

  // The swinging arm: shoulder → just behind the spitter's head. Drawn as a stretching sleeve plus a fist holding a small sandal.
  let swing = null;
  if (slap && slapper) {
    const from = REAR.find((r) => r.id === slapper.rear)!;
    const to = FRONT[slap.spitter];
    const sx = from.x + slapper.side * 24;
    const sy = from.y + 12;
    const fx = to.x;
    const fy = to.y + 30;
    const d = Math.hypot(fx - sx, fy - sy);
    const angle = (Math.atan2(fx - sx, -(fy - sy)) * 180) / Math.PI;
    swing = (
      <g key={slap.id} transform={`translate(${sx} ${sy}) rotate(${angle})`}>
        <g className="arm-ext">
          <rect x="-4.5" y={-d} width="9" height={d} rx="4" fill={from.shirt} />
        </g>
        <g className="fist-ext" style={{ '--d': `${d}px` } as React.CSSProperties}>
          <g transform={`translate(0 ${-50 * SANDAL_IN_HAND - 2}) scale(${SANDAL_IN_HAND})`}>
            <Sandal />
          </g>
          <circle r="5.5" fill={SKIN} stroke="#a16207" strokeWidth="1" />
        </g>
      </g>
    );
  }

  const treads = (w: number, y0: number) =>
    Array.from({ length: 8 }, (_, i) => <rect key={i} x={-w / 2} y={y0 + 12 * i} width={w} height="5" fill="#52525b" />);

  return (
    <div className="relative h-full w-full overflow-hidden bg-stone-400">
      <svg
        viewBox={`0 0 ${W} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Top view of an auto-rickshaw: a driver and a passenger in front, three passengers behind"
      >
        <defs>
          <clipPath id="tire-r">
            <rect x="-13" y="-32" width="26" height="64" rx="7" />
          </clipPath>
          <clipPath id="tire-f">
            <rect x="-9" y="-26" width="18" height="52" rx="5" />
          </clipPath>
        </defs>

        {/* pavements, roofs and road, all scrolling down (the auto drives up) */}
        <rect x={-EX} y={-EX} width={W + 2 * EX} height={VH + 2 * EX} fill="#a8a29e" />
        <g className="scroll-side">
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i} transform={`translate(0 ${-480 + i * 240})`}>
              {PAVE.map((b, j) => (
                <rect key={j} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.c} opacity=".85" />
              ))}
            </g>
          ))}
        </g>
        <rect x="14" y={-EX} width="332" height={VH + 2 * EX} fill="#3f3f46" />
        <rect x="14" y={-EX} width="4" height={VH + 2 * EX} fill="#f4f4f5" />
        <rect x="342" y={-EX} width="4" height={VH + 2 * EX} fill="#f4f4f5" />
        <g className="scroll-road" fill="#fde68a">
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x="177" y={-400 + i * 80} width="6" height="40" />
          ))}
        </g>

        <g className="rattle">
          {/* rear wheels, half under the body: tread scrolls forward (up) */}
          {[64, 296].map((x) => (
            <g key={x} transform={`translate(${x} 398)`}>
              <rect x="-13" y="-32" width="26" height="64" rx="7" fill="#18181b" />
              <g clipPath="url(#tire-r)">
                <g className="tread">{treads(26, -44)}</g>
              </g>
            </g>
          ))}

          {/* body: nose, green shell, interior floor, seats */}
          <path
            d="M70 160 Q70 124 108 108 L136 80 Q180 50 224 80 L252 108 Q290 124 290 160 L290 424 Q290 446 268 446 L92 446 Q70 446 70 424Z"
            fill="#15803d"
            stroke="#14532d"
            strokeWidth="4"
          />
          <rect x="70" y="140" width="220" height="6" fill="#fde047" opacity=".8" />
          <rect x="84" y="166" width="192" height="266" rx="16" fill="#e7d5a8" />
          <rect x="96" y="200" width="168" height="66" rx="12" fill="#7f1d1d" />
          <rect x="90" y="312" width="180" height="82" rx="12" fill="#7f1d1d" />
          <rect x="90" y="394" width="180" height="22" rx="8" fill="#5f1414" />

          {/* front wheel pokes out ahead of the nose, with a mudguard over its rear half */}
          <g transform="translate(180 56)">
            <rect x="-9" y="-26" width="18" height="52" rx="5" fill="#18181b" />
            <g clipPath="url(#tire-f)">
              <g className="tread">{treads(18, -34)}</g>
            </g>
          </g>
          <path d="M163 62 Q180 40 197 62 L197 70 L163 70Z" fill="#166534" stroke="#14532d" strokeWidth="2" />
          <circle cx="180" cy="94" r="6" fill="#fef9c3" stroke="#a16207" strokeWidth="2" />
          {/* handlebar */}
          <path d="M180 100 V170" stroke="#52525b" strokeWidth="5" />
          <path d="M150 176 Q180 166 250 176" stroke="#27272a" strokeWidth="6" strokeLinecap="round" fill="none" />

          {front}
          {rear}
          {swing}

          {/* translucent roof so the passengers stay visible from above */}
          <path d="M76 150 Q76 130 110 116 L250 116 Q284 130 284 150 L284 430 Q284 440 270 440 L90 440 Q76 440 76 430Z" fill="#14532d" opacity=".16" stroke="#14532d" strokeOpacity=".5" strokeWidth="3" />
          {[[86, 126], [274, 126], [86, 432], [274, 432]].map(([x, y]) => (
            <circle key={x + '-' + y} cx={x} cy={y} r="5" fill="#365314" />
          ))}
        </g>
      </svg>
    </div>
  );
}
