export const ComparisonResult: React.FC = () => (
  <div className="result-wrap">
    <div className="result-card card before" style={{ transform: 'translate3d(-310px,0,-40px) rotateY(-2deg)' }}><span>Before</span><h3>Current Region Price</h3><p>Only one storefront visible.</p></div>
    <div className="arrow-3d" style={{ transform: 'translate3d(-42px,0,180px)' }}>→</div>
    <div className="result-card card better" style={{ transform: 'translate3d(310px,0,92px) rotateY(2deg)' }}><span>Better Option</span><h3>AI Recommended Region</h3><p>Potential savings calculated from live data.</p></div>
  </div>
);
