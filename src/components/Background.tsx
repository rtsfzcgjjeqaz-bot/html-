import { AbsoluteFill } from 'remotion';

export const Background: React.FC<{ variant?: 'map' | 'grid' | 'chart' }> = ({ variant = 'grid' }) => (
  <AbsoluteFill className={`background background-${variant}`}>
    <div className="orb orb-blue" />
    <div className="orb orb-green" />
    <div className="grid-plane" />
    <svg className="map-lines" viewBox="0 0 1200 650" aria-hidden="true">
      <path d="M72 332 C220 210 376 250 498 162 C650 48 782 166 1110 94" />
      <path d="M130 460 C332 330 460 512 622 378 C810 224 990 412 1160 292" />
      <path d="M208 142 C360 208 428 118 560 220 C714 340 860 160 1042 238" />
      {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={80 + ((i * 73) % 1040)} cy={90 + ((i * 109) % 480)} r={i % 4 === 0 ? 5 : 3} />)}
    </svg>
  </AbsoluteFill>
);
