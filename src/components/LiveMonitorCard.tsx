import { interpolate, useCurrentFrame } from 'remotion';
import { apps } from '../data';

export const LiveMonitorCard: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [312, 372], [-20, 1120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="live-card live-card-v3 card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(-2deg)' }}>
    <div className="live-card-header"><h2>Storefront signals refresh automatically</h2><span>live monitor · sample data</span></div>
    <div className="live-grid"><span>App</span><span>Region</span><span>Live price</span><span>Trend</span><span>Updated</span></div>
    {apps[0].regions.slice(0,4).map((r, i) => <div className="live-row" key={r.regionCode} style={{ transform: `translate3d(0,0,${i === 0 ? 70 : 0}px)` }}><b>{apps[0].name}</b><span>{r.regionName}</span><strong>Sample price</strong><em>{r.trend}</em><small>{r.updatedAtLabel}</small></div>)}
    <div className="scan" style={{ transform: `translate3d(${scan}px,0,180px)` }} />
  </div>;
};
