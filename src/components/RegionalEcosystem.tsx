import { interpolate, useCurrentFrame } from 'remotion';
import { rankings } from '../data';

export const RegionalEcosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = interpolate(frame, [500, 570], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="ecosystem-card card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(3deg)' }}>
    <div className="split-title"><h2>Regional subscription ecosystem</h2><span>ranked signals</span></div>
    <div className="ecosystem-body">
      <div className="signal-funnel" style={{ transform: 'translate3d(0,0,40px)' }}>
        {['Local price', 'Currency signal', 'Trend stability', 'Risk reminder'].map((label, i) => <div className="funnel-step" key={label} style={{ opacity: interpolate(frame, [500 + i * 7, 526 + i * 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translate3d(${i * 28}px,0,${60 + i * 25}px)` }}><b>{label}</b><span>{Math.round((flow * 72 + i * 6))}% signal</span></div>)}
      </div>
      <div className="rank-bars">
        {rankings.slice(0, 5).map((r, i) => <div className="rank-bar" key={r.regionName} style={{ transform: `translate3d(0,0,${i === 0 ? 90 : 0}px)` }}>
          <span>#{r.rank} {r.regionName}</span><i style={{ width: `${interpolate(frame, [505 + i * 5, 550 + i * 5], [8, 92 - i * 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%` }} />
          <em>{r.advantageLabel}</em>
        </div>)}
      </div>
    </div>
  </div>;
};
