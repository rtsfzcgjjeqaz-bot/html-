import { interpolate, useCurrentFrame } from 'remotion';

const points = [
  { x: 110, y: 228, code: 'US', label: 'Baseline' },
  { x: 255, y: 170, code: 'JP', label: 'Best value' },
  { x: 420, y: 244, code: 'TR', label: 'Risk check' },
  { x: 505, y: 132, code: 'IN', label: 'Stable' },
  { x: 330, y: 312, code: 'BR', label: 'Promo' },
  { x: 190, y: 300, code: 'SG', label: 'Clean signal' },
];

export const RegionMap: React.FC<{ wide?: boolean }> = ({ wide = false }) => {
  const frame = useCurrentFrame();
  return (
    <div className={`region-map card region-map-v3 ${wide ? 'wide-map' : ''}`} style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(-4deg)' }}>
      <div className="map-header"><h3>Region signal map</h3><span>sample data</span></div>
      <svg viewBox="0 0 640 410" aria-hidden="true">
        <path className="map-shape" d="M70 220 C150 120 235 154 300 102 C378 38 460 88 578 72 M92 304 C170 262 232 324 302 266 C398 188 480 275 560 222 M160 146 C244 178 268 98 340 162 C415 232 480 136 548 166" />
        {points.map((p, i) => {
          const lift = interpolate(frame, [190 + i * 5, 222 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const r = 22 + Math.sin((frame + i * 9) / 10) * 4;
          return <g key={p.code} style={{ opacity: lift, transform: `translate3d(${p.x}px,${p.y}px,${90 + i * 14}px)` }}>
            <circle className="pulse" r={r} />
            <circle className={`pin pin-${i}`} r="9" />
            <text className="map-code" x="18" y="3">{p.code}</text>
            <text className="map-label" x="18" y="28">{p.label}</text>
          </g>;
        })}
      </svg>
      <div className="map-legend map-legend-v3"><b /> Lower signal <em /> Volatility signal <strong /> Updated region</div>
    </div>
  );
};
