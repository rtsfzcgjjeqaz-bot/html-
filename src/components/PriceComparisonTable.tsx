import { interpolate, useCurrentFrame } from 'remotion';
import { apps } from '../data';

export const PriceComparisonTable: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = apps[0].regions.slice(0, 5);
  return <div className="comparison-card card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(3deg)' }}>
    <div className="split-title"><h2>Global Price Comparison</h2><span>Sample data</span></div>
    <div className="table-head"><span>Region</span><span>Local Price</span><span>Converted</span><span>Signal</span></div>
    {rows.map((r, i) => <div key={r.regionCode} className={`table-row ${i === 1 ? 'best-row' : ''}`} style={{ opacity: interpolate(frame, [185 + i * 5, 205 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translate3d(0, ${interpolate(frame, [185 + i * 5, 215 + i * 5], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px, ${i === 1 ? 92 : 0}px)` }}>
      <b>{r.regionName}</b><span>{r.localPriceLabel}</span><span>API value</span><em>{i === 1 ? 'Best value' : r.trend}</em>
    </div>)}
  </div>;
};
