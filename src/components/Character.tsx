import type { Spitter } from '../game/engine';

export type CharState = 'idle' | 'spit' | 'slapped';

const SKIN = '#e0a878';
const SKIN_DARK = '#c98d5c';

/**
 * A person seen from the back seat, drawn around the head centre (0,0).
 * idle: back of the head. spit / slapped: head turned outward, in profile (driver → right, passenger → left).
 * Slightly dim on purpose: big ears, cross-eye, buck tooth.
 */
export function Character({ kind, state }: { kind: Spitter; state: CharState }) {
  const r = kind === 'driver' ? 34 : 28;
  const dir = kind === 'driver' ? 1 : -1;
  const turned = state !== 'idle';
  const slapped = state === 'slapped';
  const lean = slapped ? `translate(${dir * 4}px, 14px) rotate(${dir * -10}deg)` : turned ? `translate(${dir * 20}px, 6px) rotate(${dir * 8}deg)` : 'none';

  return (
    <g className="char" style={{ transform: lean }}>
      <g transform={`scale(${dir} 1)`}>{turned ? <Profile r={r} kind={kind} state={state} /> : <Back r={r} kind={kind} />}</g>
    </g>
  );
}

function Back({ r, kind }: { r: number; kind: Spitter }) {
  return (
    <g>
      {/* big ears */}
      <circle cx={-r - 3} cy="6" r="10" fill={SKIN_DARK} />
      <circle cx={r + 3} cy="6" r="10" fill={SKIN_DARK} />
      <circle r={r} fill={SKIN} />
      {kind === 'driver' ? (
        <g>
          <path d={`M${-r - 2} 4 A${r + 2} ${r + 2} 0 0 1 ${r + 2} 4 Q0 ${r * 0.2} ${-r - 2} 4Z`} fill="#1e3a8a" />
          <rect x="-9" y={-r + 12} width="18" height="7" rx="3" fill="#172554" />
          <circle cy={-r - 1} r="4" fill="#172554" />
        </g>
      ) : (
        <g>
          <path d={`M${-r} 4 A${r} ${r} 0 0 1 ${r} 4 Q${r * 0.55} ${r * 0.6} 0 ${r * 0.4} Q${-r * 0.55} ${r * 0.6} ${-r} 4Z`} fill="#292524" />
          <path d="M-8 -26 L-14 -40 M0 -28 L-2 -44 M8 -26 L14 -40" stroke="#292524" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
}

function Profile({ r, kind, state }: { r: number; kind: Spitter; state: CharState }) {
  const slapped = state === 'slapped';
  return (
    <g>
      {/* hair / cap sits on the back of the head */}
      <circle r={r} fill={SKIN} />
      {kind === 'driver' ? (
        <g>
          <path d={`M${-r - 1} 2 A${r + 1} ${r + 1} 0 0 1 ${r + 1} -6 L${r + 16} -6 L${r + 16} -1 L${r - 2} 2Z`} fill="#1e3a8a" />
          <circle cy={-r - 1} r="4" fill="#172554" />
        </g>
      ) : (
        <g>
          <path d={`M${-r - 1} 8 A${r + 1} ${r + 1} 0 0 1 ${r * 0.7} -${r * 0.8} Q${r * 0.1} -4 ${-r * 0.2} 6Z`} fill="#292524" />
          <path d="M-6 -24 L-12 -38 M2 -26 L0 -42 M10 -24 L16 -36" stroke="#292524" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      )}
      <circle cx="-6" cy="6" r="9" fill={SKIN_DARK} />
      {/* nose */}
      <path d={`M${r - 3} 2 Q${r + 11} 10 ${r - 3} 16Z`} fill={SKIN} stroke={SKIN_DARK} strokeWidth="1" />
      {slapped && <circle cx={r * 0.3} cy="14" r="10" fill="#ef4444" opacity=".5" />}
      {/* eye: pupil pushed toward the nose */}
      {slapped ? (
        <path d={`M${r * 0.35} -9 l9 9 M${r * 0.35 + 9} -9 l-9 9`} stroke="#111827" strokeWidth="2.6" strokeLinecap="round" />
      ) : (
        <g>
          <circle cx={r * 0.5} cy="-3" r="7" fill="#fff" stroke="#00000033" />
          <circle cx={r * 0.5 + 3} cy="-2" r="2.8" fill="#111827" />
        </g>
      )}
      {/* mouth */}
      {slapped ? (
        <path d={`M${r * 0.3} 26 Q${r * 0.7} 20 ${r} 28`} stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <circle cx={r * 0.35} cy="14" r="10" fill={SKIN} stroke="#00000022" />
          <ellipse cx={r * 0.85} cy="24" rx="6" ry="4.5" fill="#b91c1c" />
          <rect x={r * 0.85 - 2} y="26" width="4.5" height="6" rx="1" fill="#fff" stroke="#9ca3af" strokeWidth=".6" />
          <g className="spit-drop">
            <circle cx={r + 8} cy="26" r="3.4" fill="#dbeafe" stroke="#93c5fd" />
            <circle cx={r + 15} cy="30" r="2" fill="#dbeafe" />
          </g>
        </g>
      )}
      {slapped && (
        <g fill="#facc15" stroke="#ca8a04" strokeWidth=".6">
          <path d="M-4 -44 l3 7 7 .7 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.7z" />
          <path d="M26 -34 l2 5 5 .5 -4 3 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -3 5 -.5z" />
        </g>
      )}
    </g>
  );
}

/** A rubber chappal (flip-flop), seen from above, toe up, about 40 wide x 100 tall around (0,0). `foot` puts a bare foot in it. */
export function Sandal({ foot = false }: { foot?: boolean }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M0 -50 C17 -50 21 -32 19 -14 C17 2 14 12 15 28 C16 44 10 50 0 50 C-10 50 -16 44 -15 28 C-14 12 -17 2 -19 -14 C-21 -32 -17 -50 0 -50Z"
        fill="#38bdf8"
        stroke="#0c4a6e"
        strokeWidth="3"
      />
      <path d="M0 -42 C11 -42 13 -30 12 -16 C11 0 9 14 10 28 C10 38 6 42 0 42" fill="none" stroke="#7dd3fc" strokeWidth="3" />
      {foot && (
        <g fill={SKIN} stroke="#a16207" strokeWidth="1.2">
          <path d="M-11 -30 C-12 -10 -9 10 -8 30 C-7 40 7 40 8 30 C9 10 12 -10 11 -30Z" />
          {[-8, -4, 0, 4, 8].map((x, i) => (
            <circle key={x} cx={x} cy={-33 - (i === 2 ? 2 : i === 0 || i === 4 ? -2 : 0)} r="3.6" />
          ))}
        </g>
      )}
      {/* V strap + toe post */}
      <path d="M-17 -6 L0 -26 L17 -6" fill="none" stroke="#b91c1c" strokeWidth="7" />
      <path d="M-17 -6 L0 -26 L17 -6" fill="none" stroke="#ef4444" strokeWidth="3.5" />
      <circle cy="-26" r="4" fill="#450a0a" />
      {!foot && <path d="M-7 34 H7 M-8 40 H8" stroke="#0c4a6e" strokeWidth="2" opacity=".5" />}
    </g>
  );
}

/** One of the player's hands (fist at 0,0), sleeve running off the bottom. Empty until it grabs a sandal (`holding`). */
export function Hand({ side, holding }: { side: 'left' | 'right'; holding: boolean }) {
  const m = side === 'left' ? -1 : 1;
  return (
    <g transform={`scale(${m} 1)`}>
      <rect x="-17" y="6" width="34" height="420" rx="8" fill="#7c3aed" />
      <rect x="-19" y="4" width="38" height="12" rx="5" fill="#5b21b6" />
      {holding && (
        <g className="sandal-grab" transform="translate(0 -54)">
          <Sandal />
        </g>
      )}
      {/* fist */}
      <rect x="-15" y="-16" width="30" height="26" rx="12" fill={SKIN} stroke="#a16207" strokeWidth="1.5" />
      <path d="M-9 -16 V-4 M-1 -16 V-4 M7 -16 V-4" stroke="#a16207" strokeWidth="1.5" />
      <rect x="-19" y="-12" width="9" height="16" rx="4" fill={SKIN} stroke="#a16207" strokeWidth="1.5" />
    </g>
  );
}

/** The player seen from behind, head centre at (0,0): short black hair, big ears, purple shirt. */
export function PlayerBack() {
  return (
    <g>
      <path d="M-150 120 Q-150 36 -64 30 L64 30 Q150 36 150 120Z" fill="#7c3aed" />
      <rect x="-13" y="20" width="26" height="22" fill={SKIN_DARK} />
      <circle cx="-35" cy="4" r="10" fill={SKIN_DARK} />
      <circle cx="35" cy="4" r="10" fill={SKIN_DARK} />
      <circle r="33" fill={SKIN} />
      <path d="M-34 6 A34 34 0 0 1 34 6 Q22 22 0 20 Q-22 22 -34 6Z" fill="#1c1917" />
      <path d="M-20 34 Q0 48 20 34" fill="none" stroke="#5b21b6" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
