import { interpolate, useCurrentFrame } from 'remotion';
import { history } from '../data';

export const PriceHistoryChart: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [400, 450], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pts = history.map((p, i) => `${112 + i * 76},${304 - p.value * 5.1}`).join(' ');
  return <div className="history-card card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(-3deg)' }}>
    <div className="split-title"><h2>Price History</h2><span>Sample data · replaceable</span></div>
    <svg viewBox="0 0 1040 390" aria-hidden="true">
      <line className="axis" x1="108" x2="980" y1="320" y2="320" />
      <line className="axis" x1="108" x2="108" y1="62" y2="320" />
      {['High', 'Mid', 'Low'].map((label, i) => <g key={label}><line className="chart-grid" x1="108" x2="980" y1={82 + i * 86} y2={82 + i * 86} /><text className="axis-label" x="50" y={88 + i * 86}>{label}</text></g>)}
      {['M1', 'M3', 'M6', 'M9', 'M12'].map((label, i) => <text className="axis-label" key={label} x={110 + i * 212} y="354">{label}</text>)}
      <text className="axis-title" x="500" y="378" textAnchor="middle">Time window</text>
      <text className="axis-title" x="36" y="202" textAnchor="middle" transform="rotate(-90 36 202)">Relative price</text>
      <polyline className="trend-line" points={pts} style={{ strokeDasharray: 1300, strokeDashoffset: 1300 * (1 - draw) }} />
      <circle className="low-dot" cx="796" cy="156" r="11" style={{ opacity: draw, transform: 'translate3d(0,0,80px)' }} />
    </svg>
    <div className="floating-label" style={{ opacity: draw, transform: 'translate3d(742px,-284px,160px)' }}>Lowest point</div>
    <div className="ai-hint" style={{ opacity: draw, transform: 'translate3d(600px,-118px,120px)' }}>Use your table later to replace this sample curve.</div>
  </div>;
};
