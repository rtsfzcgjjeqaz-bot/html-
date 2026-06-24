import { interpolate, useCurrentFrame } from 'remotion';
import { aiRecommendation } from '../data';

export const AIRecommendationCard: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [612, 660], [-80, 590], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="ai-card ai-card-v3 card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg)' }}>
    <div className="ai-report-left">
      <span className="eyebrow">AI Recommendation</span>
      <h2>{aiRecommendation.recommendedRegion}</h2>
      <p>Recommended region for the current sample subscription scenario.</p>
      <div className="recommend-result" style={{ transform: 'translate3d(0,0,70px)' }}><span>Decision</span><strong>Compare before buying</strong></div>
    </div>
    <div className="ai-report-right">
      {aiRecommendation.reasons.map((reason, i) => <div className="reason reason-v3" key={reason} style={{ opacity: interpolate(frame, [612 + i * 8, 642 + i * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translate3d(0,0,${90 + i * 12}px)` }}><b>✓</b><span>{reason}</span><small>{i === 0 ? 'region signal' : i === 1 ? 'history signal' : 'risk check'}</small></div>)}
      <div className="risk-chip risk-chip-v3" style={{ transform: 'translate3d(0,0,130px)' }}>Sample data · replace with API</div>
    </div>
    <div className="vertical-scan" style={{ transform: `translate3d(0,${scan}px,180px)` }} />
  </div>;
};
