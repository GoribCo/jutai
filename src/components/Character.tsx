import type { Spitter } from '../game/engine';

export type CharState = 'idle' | 'spit' | 'slapped';

const SKIN: Record<Spitter, string> = {
  driver: '#e8b98a',
  helper: '#d9a273',
  conductor: '#f0c9a0',
  passenger: '#e2b07f',
};

/** A generic, slightly dim cartoon face drawn around (0,0). Cross-eyed, slack-jawed, buck tooth. */
export function Character({ kind, state }: { kind: Spitter; state: CharState }) {
  const slapped = state === 'slapped';
  const spitting = state === 'spit';
  return (
    <g className={`char ${spitting ? 'char--lean' : ''}`}>
      {/* shoulders */}
      <path d="M-26 40 Q-26 22 0 22 Q26 22 26 40Z" fill="#6b7280" />
      {/* head */}
      <circle r="20" fill={SKIN[kind]} />
      {slapped && <circle cx="-10" cy="6" r="9" fill="#ef4444" opacity=".55" />}
      {/* hair / hats */}
      {kind === 'driver' && (
        <g>
          <path d="M-20 -6 Q-20 -24 0 -24 Q20 -24 20 -6Z" fill="#1f2937" />
          <rect x="-4" y="-9" width="26" height="5" rx="2" fill="#111827" />
        </g>
      )}
      {kind === 'helper' && (
        <g>
          <path d="M-19 -8 Q-16 -24 0 -23 Q16 -24 19 -8Z" fill="#292524" />
          <rect x="-20" y="-10" width="40" height="6" fill="#dc2626" />
        </g>
      )}
      {kind === 'conductor' && (
        <g>
          <rect x="-17" y="-26" width="34" height="14" rx="4" fill="#2563eb" />
          <rect x="-20" y="-13" width="40" height="4" rx="2" fill="#1d4ed8" />
        </g>
      )}
      {kind === 'passenger' && (
        <g stroke="#3f2a1d" strokeWidth="3" strokeLinecap="round">
          <path d="M-14 -17 L-18 -26 M-6 -20 L-8 -30 M3 -20 L6 -30 M12 -17 L18 -25" />
        </g>
      )}
      {/* eyes */}
      {slapped ? (
        <g stroke="#111827" strokeWidth="2.4" strokeLinecap="round">
          <path d="M-12 -7 L-5 0 M-5 -7 L-12 0 M5 -7 L12 0 M12 -7 L5 0" />
        </g>
      ) : (
        <g>
          <circle cx="-8" cy="-3" r="5.5" fill="#fff" />
          <circle cx="8" cy="-3" r="5.5" fill="#fff" />
          {/* both pupils drift toward the nose: cross-eyed */}
          <circle cx="-5.5" cy="-2" r="2.4" fill="#111827" />
          <circle cx="5.5" cy="-4" r="2.4" fill="#111827" />
        </g>
      )}
      {/* mouth */}
      {spitting ? (
        <g>
          <circle cx="-13" cy="6" r="5" fill={SKIN[kind]} stroke="#00000022" />
          <circle cx="13" cy="6" r="5" fill={SKIN[kind]} stroke="#00000022" />
          <ellipse cx="0" cy="9" rx="4" ry="3.2" fill="#7f1d1d" />
          <g className="spit-drop">
            <circle cx="-3" cy="12" r="3" fill="#dbeafe" stroke="#93c5fd" />
            <circle cx="-8" cy="16" r="1.8" fill="#dbeafe" />
          </g>
        </g>
      ) : (
        <g>
          <path d="M-6 9 Q0 15 6 9 Q0 12 -6 9Z" fill="#7f1d1d" stroke="#7f1d1d" strokeWidth="1.5" />
          <rect x="-1.5" y="9" width="4" height="5" rx="1" fill="#fff" stroke="#9ca3af" strokeWidth=".6" />
        </g>
      )}
      {slapped && (
        <g fill="#facc15" stroke="#ca8a04" strokeWidth=".6">
          <path d="M-22 -24 l2 5 5 .5 -4 3 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -3 5 -.5z" />
          <path d="M18 -26 l1.5 4 4 .4 -3 2.5 1 4 -3.5 -2.4 -3.5 2.4 1 -4 -3 -2.5 4 -.4z" />
        </g>
      )}
    </g>
  );
}

/** A flip-flop style sandal, for the slap. Sole + strap, drawn around (0,0). */
export function Shoe() {
  return (
    <g>
      <path d="M-26 -9 Q-30 0 -26 9 L18 11 Q30 9 30 0 Q30 -9 18 -11Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
      <path d="M-6 -10 Q4 -2 -6 10 M-6 -10 Q8 0 -6 10" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-10" cy="0" r="2.6" fill="#451a03" />
    </g>
  );
}
