export type CharState = 'idle' | 'spit' | 'slapped';

const SKIN = '#e0a878';
const SKIN_DARK = '#c98d5c';

interface HeadProps {
  /** which way the head turns to spit: 1 = right, -1 = left */
  dir: 1 | -1;
  state: CharState;
  hair?: string;
  cap?: string; // cap colour (driver)
  tuft?: boolean;
}

/**
 * A head seen from above, centred on (0,0), facing up the screen. Big ears and a tuft keep it a bit dim.
 * Spitting: the head turns outward, puffed cheeks, pursed lips, droplets flying forward (the nose's direction).
 */
export function Head({ dir, state, hair = '#1c1917', cap, tuft }: HeadProps) {
  const r = 16;
  const turn = state === 'spit' ? dir * 80 : state === 'slapped' ? dir * 25 : 0;
  return (
    <g className="char" style={{ transform: `rotate(${turn}deg)` }}>
      <circle cx={-r - 1} cy="2" r="6.5" fill={SKIN_DARK} />
      <circle cx={r + 1} cy="2" r="6.5" fill={SKIN_DARK} />
      <circle r={r} fill={SKIN} />
      <path d={`M-3.5 ${-r + 1} L0 ${-r - 5} L3.5 ${-r + 1}Z`} fill={SKIN} stroke={SKIN_DARK} strokeWidth=".8" />
      {cap ? (
        <g>
          <circle cy="5" r={r} fill={cap} />
          <rect x="-10" y={-r - 3} width="20" height="8" rx="3" fill="#172554" />
        </g>
      ) : (
        <g>
          <circle cy="5" r={r - 1} fill={hair} />
          {tuft && <path d="M-5 -6 L-9 -14 M0 -8 L0 -17 M5 -6 L9 -14" stroke={hair} strokeWidth="3.2" strokeLinecap="round" fill="none" />}
        </g>
      )}
      {state === 'spit' && (
        <g>
          <circle cx={-r * 0.8} cy={-r * 0.45} r="5.5" fill={SKIN} stroke="#00000022" />
          <circle cx={r * 0.8} cy={-r * 0.45} r="5.5" fill={SKIN} stroke="#00000022" />
          <ellipse cy={-r + 1} rx="4" ry="3" fill="#b91c1c" />
          <rect x="-1.6" y={-r - 1} width="3.4" height="4.5" rx="1" fill="#fff" stroke="#9ca3af" strokeWidth=".5" />
          <g className="spit-drop">
            <circle cy={-r - 9} r="3" fill="#dbeafe" stroke="#93c5fd" />
            <circle cx="-3" cy={-r - 15} r="1.8" fill="#dbeafe" />
          </g>
        </g>
      )}
      {state === 'slapped' && (
        <g>
          <circle cx={-r * 0.6} cy={-r * 0.2} r="6" fill="#ef4444" opacity=".55" />
          <g fill="#facc15" stroke="#ca8a04" strokeWidth=".5">
            <path d="M-20 -22 l1.6 4 4 .4 -3 2.5 1 4 -3.6 -2.4 -3.6 2.4 1 -4 -3 -2.5 4 -.4z" />
            <path d="M14 -26 l1.3 3.2 3.2 .3 -2.4 2 .8 3.2 -2.9 -1.9 -2.9 1.9 .8 -3.2 -2.4 -2 3.2 -.3z" />
          </g>
        </g>
      )}
    </g>
  );
}

/** A rubber chappal (flip-flop), seen from above, toe up, about 40 wide x 100 tall around (0,0). `foot` puts a bare foot in it. */
export function Sandal({ foot = false, sole = true }: { foot?: boolean; sole?: boolean }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {sole && (
        <g>
          <path
            d="M0 -50 C17 -50 21 -32 19 -14 C17 2 14 12 15 28 C16 44 10 50 0 50 C-10 50 -16 44 -15 28 C-14 12 -17 2 -19 -14 C-21 -32 -17 -50 0 -50Z"
            fill="#38bdf8"
            stroke="#0c4a6e"
            strokeWidth="3"
          />
          <path d="M0 -42 C11 -42 13 -30 12 -16 C11 0 9 14 10 28 C10 38 6 42 0 42" fill="none" stroke="#7dd3fc" strokeWidth="3" />
        </g>
      )}
      {foot && (
        <g fill={SKIN} stroke="#a16207" strokeWidth="1.2">
          <path d="M-11 -30 C-12 -10 -9 10 -8 30 C-7 40 7 40 8 30 C9 10 12 -10 11 -30Z" />
          {[-8, -4, 0, 4, 8].map((x, i) => (
            <circle key={x} cx={x} cy={-33 - (i === 2 ? 2 : i === 0 || i === 4 ? -2 : 0)} r="3.6" />
          ))}
        </g>
      )}
      {sole && (
        <g>
          <path d="M-17 -6 L0 -26 L17 -6" fill="none" stroke="#b91c1c" strokeWidth="7" />
          <path d="M-17 -6 L0 -26 L17 -6" fill="none" stroke="#ef4444" strokeWidth="3.5" />
          <circle cy="-26" r="4" fill="#450a0a" />
        </g>
      )}
    </g>
  );
}
