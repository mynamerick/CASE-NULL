"use client";

import type { PhotoScene as SceneId } from "@/game/types";

/**
 * There are no photographs in this build, so each one is drawn. The point is
 * not to render a convincing image — it is to give the eye something specific
 * to look at while the caption and the observation do the real work. Flat
 * shapes, low contrast, one warm light source, heavy grain over the top.
 */

interface Props {
  scene: SceneId;
  className?: string;
}

export function PhotoScene({ scene, className }: Props) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Photograph"
    >
      <defs>
        <linearGradient id="ps-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1119" />
          <stop offset="100%" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id="ps-warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2119" />
          <stop offset="100%" stopColor="#0d0b09" />
        </linearGradient>
        <radialGradient id="ps-lamp" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d99a2b" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#d99a2b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ps-flash" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#c9d2e0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9d2e0" stopOpacity="0" />
        </radialGradient>
        <filter id="ps-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="ps-blur">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {SCENES[scene]()}

      {/* Uniform film grain over every scene. */}
      <rect width="400" height="300" filter="url(#ps-grain)" opacity="0.11" />
      <rect
        width="400"
        height="300"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  );
}

const rain = (opacity = 0.28, count = 46) => (
  <g opacity={opacity} stroke="#8ea3c0" strokeWidth="0.8">
    {Array.from({ length: count }, (_, i) => {
      const x = (i * 97) % 400;
      const y = (i * 53) % 300;
      return <line key={i} x1={x} y1={y} x2={x - 5} y2={y + 16} />;
    })}
  </g>
);

const people = (xs: number[], y: number, h: number, fill = "#161b25") => (
  <g fill={fill}>
    {xs.map((x, i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={h * 0.17} />
        <path
          d={`M${x - h * 0.24} ${y + h} Q${x - h * 0.2} ${y + h * 0.22} ${x} ${y + h * 0.2} Q${x + h * 0.2} ${y + h * 0.22} ${x + h * 0.24} ${y + h} Z`}
        />
      </g>
    ))}
  </g>
);

/** An estate car in profile, three-quarter rear. Used in three scenes. */
const car = (x: number, y: number, s: number, brake = false) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M0 40 L4 18 Q8 10 26 8 L62 8 Q82 10 92 20 L112 26 Q120 30 120 40 L120 50 L0 50 Z"
      fill="#12161e"
      stroke="#1d2430"
      strokeWidth="1.5"
    />
    <path d="M12 20 L28 13 L56 13 L56 22 Z" fill="#1b2230" opacity="0.9" />
    <path d="M62 13 L84 15 L96 24 L62 24 Z" fill="#1b2230" opacity="0.9" />
    <circle cx="26" cy="50" r="10" fill="#080a0e" />
    <circle cx="96" cy="50" r="10" fill="#080a0e" />
    <circle cx="26" cy="50" r="4" fill="#161b25" />
    <circle cx="96" cy="50" r="4" fill="#161b25" />
    {brake && (
      <>
        <rect x="1" y="28" width="9" height="6" rx="1.5" fill="#b8452f" />
        <circle cx="5.5" cy="31" r="11" fill="#b8452f" opacity="0.28" />
      </>
    )}
  </g>
);

const SCENES: Record<SceneId, () => React.ReactElement> = {
  /* ------------------------------------------------------------ interiors */
  "kitchen-party": () => (
    <g>
      <rect width="400" height="300" fill="url(#ps-warm)" />
      <rect x="0" y="0" width="400" height="150" fill="#1a1510" />
      {/* wall units + shelf */}
      <rect x="30" y="40" width="150" height="70" fill="#221b14" stroke="#2c2419" />
      <rect x="30" y="118" width="340" height="5" fill="#2c2419" />
      {/* mugs on the shelf */}
      {[46, 66, 86, 128, 148].map((x) => (
        <rect key={x} x={x} y="100" width="12" height="18" rx="2" fill="#2f2820" />
      ))}
      {/* the blue tin */}
      <rect x="106" y="102" width="16" height="16" rx="2" fill="#2c3f57" stroke="#3c556f" />
      <rect x="106" y="102" width="16" height="4" fill="#3c556f" />
      <ellipse cx="200" cy="60" rx="120" ry="70" fill="url(#ps-lamp)" />
      {/* worktop */}
      <rect x="0" y="196" width="400" height="104" fill="#171208" />
      {people([120, 200, 278], 150, 95, "#0f0c08")}
      {/* the green jacket */}
      <path d="M176 168 Q200 162 224 168 L228 245 L172 245 Z" fill="#1e3128" opacity="0.95" />
    </g>
  ),

  "living-room": () => (
    <g>
      <rect width="400" height="300" fill="url(#ps-warm)" />
      {/* window streaming with rain */}
      <rect x="238" y="34" width="126" height="112" fill="#0a0e16" stroke="#2c2419" strokeWidth="3" />
      <line x1="301" y1="34" x2="301" y2="146" stroke="#2c2419" strokeWidth="3" />
      <g clipPath="none" opacity="0.5">{rain(0.4, 22)}</g>
      {/* reflection of an open door in the glass */}
      <rect x="246" y="60" width="22" height="60" fill="#c6b18a" opacity="0.13" />
      <g opacity="0.22">{people([257], 74, 44, "#c6b18a")}</g>
      <ellipse cx="120" cy="70" rx="130" ry="80" fill="url(#ps-lamp)" />
      <rect x="0" y="214" width="400" height="86" fill="#150f08" />
      {people([56, 98, 146, 190], 150, 92, "#0f0b07")}
      {/* the man at the edge of frame, back to camera, dark green waxed jacket */}
      <g>
        <circle cx="372" cy="140" r="19" fill="#0d0a07" />
        <path d="M340 300 Q342 176 372 172 Q400 176 402 300 Z" fill="#1c2a20" />
      </g>
    </g>
  ),

  "living-room-late": () => (
    <g>
      <rect width="400" height="300" fill="#0b0906" />
      <ellipse cx="200" cy="120" rx="150" ry="90" fill="url(#ps-lamp)" opacity="0.55" />
      {/* empty shelf — the tin is gone */}
      <rect x="30" y="118" width="180" height="5" fill="#221c14" />
      {/* mantel clock reading 01:20 */}
      <circle cx="316" cy="96" r="20" fill="#15110c" stroke="#2c2419" strokeWidth="2" />
      <line x1="316" y1="96" x2="316" y2="83" stroke="#8a7a5e" strokeWidth="2" />
      <line x1="316" y1="96" x2="326" y2="101" stroke="#8a7a5e" strokeWidth="1.6" />
      <circle cx="316" cy="96" r="1.6" fill="#8a7a5e" />
      {/* people sitting on the floor */}
      <rect x="0" y="238" width="400" height="62" fill="#100c08" />
      {people([44, 86, 150, 196, 240], 200, 54, "#0a0806")}
      {/* someone asleep in an armchair */}
      <rect x="288" y="196" width="86" height="66" rx="6" fill="#141009" />
      <circle cx="330" cy="204" r="13" fill="#0a0806" />
      {/* bottles */}
      {[24, 40, 118, 176, 262, 368].map((x) => (
        <rect key={x} x={x} y="252" width="7" height="22" rx="2" fill="#1a2018" />
      ))}
    </g>
  ),

  "old-flat": () => (
    <g>
      <rect width="400" height="300" fill="#191512" />
      <rect x="0" y="0" width="400" height="196" fill="#231d18" />
      {/* door with the taped sign */}
      <rect x="256" y="18" width="118" height="178" fill="#1a1512" stroke="#2e2620" strokeWidth="2" />
      <g transform="rotate(-3 300 62)">
        <rect x="272" y="42" width="86" height="42" fill="#d8d2c4" opacity="0.9" />
        <rect x="276" y="52" width="72" height="4" fill="#2a2620" />
        <rect x="276" y="62" width="58" height="4" fill="#2a2620" />
        <rect x="276" y="72" width="34" height="3" fill="#2a2620" />
      </g>
      {/* stacked flat-pack boxes */}
      <rect x="70" y="150" width="130" height="46" fill="#2c2318" stroke="#3a2f20" />
      <rect x="86" y="118" width="98" height="32" fill="#31281c" stroke="#3a2f20" />
      <rect x="0" y="196" width="400" height="104" fill="#141110" />
      {people([104, 166], 104, 74, "#15120f")}
      {/* two mugs */}
      <rect x="96" y="126" width="11" height="14" rx="2" fill="#4a4238" />
      <rect x="176" y="126" width="11" height="14" rx="2" fill="#4a4238" />
    </g>
  ),

  /* -------------------------------------------------------------- outdoors */
  "flat-doorway": () => (
    <g>
      <rect width="400" height="300" fill="url(#ps-night)" />
      <rect x="120" y="30" width="160" height="250" fill="#0c0f16" stroke="#1a2130" strokeWidth="3" />
      <rect x="150" y="60" width="100" height="220" fill="#141a26" />
      <circle cx="262" cy="150" r="4" fill="#3a4658" />
      <ellipse cx="200" cy="120" rx="90" ry="110" fill="url(#ps-lamp)" opacity="0.5" />
      {people([200], 128, 104, "#090c12")}
      {rain(0.3)}
    </g>
  ),

  "back-alley": () => (
    <g>
      <rect width="400" height="300" fill="#070910" />
      <ellipse cx="200" cy="140" rx="180" ry="150" fill="url(#ps-flash)" />
      {/* doorway on the left with two coats on a hook */}
      <rect x="0" y="40" width="66" height="220" fill="#0d1018" stroke="#1c2331" strokeWidth="2" />
      <path d="M14 82 Q22 76 30 82 L34 158 L10 158 Z" fill="#1d2a22" />
      <path d="M36 84 Q44 78 52 84 L56 152 L32 152 Z" fill="#241d18" />
      <circle cx="22" cy="76" r="2.4" fill="#39404d" />
      <circle cx="44" cy="78" r="2.4" fill="#39404d" />
      {/* drainpipe */}
      <rect x="84" y="0" width="9" height="230" fill="#141a24" />
      {/* wheelie bins */}
      <path d="M124 168 L196 168 L190 262 L130 262 Z" fill="#111721" stroke="#1d2531" />
      <rect x="120" y="160" width="80" height="10" rx="3" fill="#1a222e" />
      <path d="M204 176 L268 176 L262 262 L210 262 Z" fill="#0f151e" stroke="#1a2230" />
      {/* rear windscreen of a car, far back, too dark to read */}
      <g opacity="0.75">
        <path d="M300 176 L378 176 L386 208 L294 208 Z" fill="#0b0e15" stroke="#161d28" />
        <rect x="306" y="182" width="66" height="20" fill="#151c27" opacity="0.8" />
      </g>
      {/* standing water */}
      <ellipse cx="216" cy="278" rx="150" ry="14" fill="#131a26" opacity="0.85" />
      {rain(0.4, 60)}
    </g>
  ),

  "street-night": () => (
    <g>
      <rect width="400" height="300" fill="url(#ps-night)" />
      {/* terrace silhouette */}
      <rect x="0" y="60" width="400" height="120" fill="#0a0d14" />
      {[20, 70, 120, 170, 220, 270, 320, 370].map((x) => (
        <rect key={x} x={x} y="82" width="22" height="30" fill="#141b28" opacity="0.7" />
      ))}
      {/* streetlamp cone */}
      <path d="M296 30 L246 300 L370 300 Z" fill="#d99a2b" opacity="0.09" />
      <circle cx="296" cy="30" r="7" fill="#d99a2b" opacity="0.55" />
      <ellipse cx="300" cy="120" rx="70" ry="90" fill="url(#ps-lamp)" opacity="0.6" />
      {/* wet road */}
      <rect x="0" y="196" width="400" height="104" fill="#080b11" />
      <ellipse cx="300" cy="250" rx="80" ry="30" fill="#d99a2b" opacity="0.07" />
      {/* the car pulling away, brake lights on */}
      {car(232, 176, 1, true)}
      {/* indicator */}
      <circle cx="240" cy="212" r="4" fill="#d99a2b" opacity="0.9" />
      {/* the porch we're standing under */}
      <rect x="0" y="0" width="400" height="26" fill="#05070b" />
      {rain(0.34, 54)}
    </g>
  ),

  "car-park": () => (
    <g>
      <rect width="400" height="300" fill="#161b22" />
      <rect x="0" y="0" width="400" height="110" fill="#1d232c" />
      {/* office block behind */}
      <rect x="24" y="14" width="150" height="96" fill="#171d26" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={34 + (i % 4) * 36}
          y={26 + Math.floor(i / 4) * 28}
          width="26"
          height="17"
          fill="#212936"
        />
      ))}
      {/* tarmac + bay markings */}
      <rect x="0" y="110" width="400" height="190" fill="#12161c" />
      {[40, 140, 240, 340].map((x) => (
        <line key={x} x1={x} y1="150" x2={x - 14} y2="290" stroke="#3a4250" strokeWidth="3" />
      ))}
      {/* stencilled bay names */}
      <rect x="66" y="262" width="52" height="7" rx="1" fill="#4c5768" opacity="0.8" />
      <rect x="176" y="264" width="44" height="7" rx="1" fill="#4c5768" opacity="0.55" />
      {/* the badly parked estate, straddling two bays */}
      <g transform="rotate(-7 200 190)">
        {car(112, 152, 1.35)}
        {/* number plate */}
        <rect x="108" y="196" width="34" height="11" rx="1.5" fill="#d8d2c4" />
        <rect x="111" y="199" width="28" height="5" fill="#1a1a1a" />
      </g>
    </g>
  ),

  "storage-unit": () => (
    <g>
      <rect width="400" height="300" fill="#151109" />
      {/* dusk sky */}
      <rect x="0" y="0" width="400" height="96" fill="#1c1a1d" />
      <rect x="0" y="60" width="400" height="36" fill="#2a2018" opacity="0.7" />
      {/* run of units with orange shutters */}
      <rect x="0" y="96" width="400" height="120" fill="#181410" />
      {[10, 108, 206, 304].map((x, i) => (
        <g key={x}>
          <rect x={x} y="112" width="86" height="104" fill="#3a2411" stroke="#48300f" strokeWidth="2" />
          {Array.from({ length: 9 }, (_, r) => (
            <line
              key={r}
              x1={x + 3}
              y1={118 + r * 11}
              x2={x + 83}
              y2={118 + r * 11}
              stroke="#26170a"
              strokeWidth="1.6"
            />
          ))}
          {/* unit numbers — the third one is 14 */}
          <rect x={x + 34} y="100" width="20" height="10" fill="#0f0c08" />
          <text
            x={x + 44}
            y="108.5"
            textAnchor="middle"
            fontSize="8"
            fontFamily="monospace"
            fill={i === 2 ? "#d99a2b" : "#6b6152"}
          >
            {[12, 13, 14, 15][i]}
          </text>
        </g>
      ))}
      {/* the lane */}
      <rect x="0" y="216" width="400" height="84" fill="#100d0a" />
      {/* estate parked nose-in at unit 14, boot open */}
      <g transform="translate(196 176) scale(0.92)">
        {car(0, 0, 1)}
        <path d="M-4 8 L-4 -22 L20 -18 L20 10 Z" fill="#12161e" stroke="#1d2430" strokeWidth="1.5" />
      </g>
      <rect x="204" y="222" width="30" height="9" rx="1.5" fill="#d8d2c4" />
      <rect x="207" y="224.5" width="24" height="4" fill="#1a1a1a" />
      {/* windscreen wiper arc across the top of frame */}
      <path
        d="M-20 40 Q200 -26 420 46"
        stroke="#2b3340"
        strokeWidth="7"
        fill="none"
        opacity="0.5"
        filter="url(#ps-blur)"
      />
      {rain(0.16, 30)}
    </g>
  ),

  canal: () => (
    <g>
      <rect width="400" height="300" fill="#1a212b" />
      <rect x="0" y="0" width="400" height="120" fill="#243040" />
      {/* stone bridge arch */}
      <path d="M40 120 L40 60 Q160 -12 280 60 L280 120 Z" fill="#2b3340" />
      <path d="M78 120 Q160 40 242 120 Z" fill="#141a24" />
      {/* bare trees */}
      {[312, 348, 380].map((x) => (
        <g key={x} stroke="#39424f" strokeWidth="2" fill="none">
          <line x1={x} y1="130" x2={x} y2="66" />
          <line x1={x} y1="88" x2={x - 12} y2="70" />
          <line x1={x} y1="94" x2={x + 12} y2="76" />
        </g>
      ))}
      {/* water */}
      <rect x="0" y="176" width="400" height="124" fill="#1b232f" />
      {[186, 200, 216, 232, 252, 274].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#232d3a" strokeWidth="2" />
      ))}
      {/* narrowboat */}
      <path d="M56 168 L212 168 L204 190 L64 190 Z" fill="#1e3a34" stroke="#27504a" />
      <rect x="92" y="152" width="86" height="17" fill="#3a2a1e" />
      {/* towpath + railing with two cups */}
      <rect x="0" y="140" width="400" height="12" fill="#2e3846" />
      <line x1="0" y1="140" x2="400" y2="140" stroke="#414c5c" strokeWidth="3" />
      <rect x="286" y="130" width="9" height="11" rx="2" fill="#c8cdd6" />
      <rect x="302" y="130" width="9" height="11" rx="2" fill="#c8cdd6" />
    </g>
  ),
};
