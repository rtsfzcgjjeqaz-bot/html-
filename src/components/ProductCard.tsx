import { interpolate, useCurrentFrame } from 'remotion';
import { apps } from '../data';
import { MetricBadge } from './MetricBadge';

export const ProductCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const frame = useCurrentFrame();
  const rows = apps[0].regions.slice(0, compact ? 3 : 4);
  const scanX = interpolate(frame, [10, 78], [0, 568], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div className="product-card card" style={{ transform: 'translate3d(0,0,0) rotateX(3deg) rotateY(-4deg)' }}>
      <div className="product-left product-left-v3">
        <div className="product-kicker" style={{ transform: 'translate3d(0,0,72px)' }}>Global subscription data system</div>
        <h1>App Card Price</h1>
        <p>Compare App Store subscription prices across regions before you buy.</p>
        <MetricBadge label="Sample data · API ready" tone="blue" />
      </div>
      <div className="price-list product-system">
        <div className="system-scan" style={{ transform: `translate3d(${scanX}px,0,110px)` }} />
        {rows.map((r, i) => {
          const y = interpolate(frame, [i * 5, 28 + i * 5], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const signal = r.trend === 'down' ? 'Better' : r.trend === 'up' ? 'Watch' : 'Stable';
          return <div className="price-row price-row-v3" key={r.regionCode} style={{ opacity: interpolate(frame, [i * 5, 24 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translate3d(0, ${y}px, ${i === 1 ? 90 : 42}px)` }}>
            <b>{r.regionName}</b><span>{r.localPriceLabel}</span><em>{signal}</em>
          </div>;
        })}
        <div className="decision-strip" style={{ transform: 'translate3d(0,0,120px)' }}>
          <span>Compare</span><i />
          <span>Track</span><i />
          <span>Recommend</span>
        </div>
      </div>
    </div>
  );
};
