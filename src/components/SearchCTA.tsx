import { interpolate, useCurrentFrame } from 'remotion';

export const SearchCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const text = 'ChatGPT';
  const count = Math.floor(interpolate(frame, [805, 855], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const pulse = interpolate(frame % 45, [0, 22, 45], [1, 1.035, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="cta" style={{ transform: 'translate3d(0,0,40px)' }}>
    <div className="cta-badge">Free lookup · sample result first</div>
    <h1>App Card Price</h1>
    <div className="search-box" style={{ transform: 'translate3d(0,0,40px)' }}><span>{text.slice(0, count)}</span><em>Search your subscription</em></div>
    <div className="feature-tags" style={{ transform: 'translate3d(0,0,160px)' }}><b>Global Prices</b><b>Live Updates</b><b>Price History</b></div>
    <button className="cta-button" style={{ transform: `translate3d(0,0,190px) scale(${pulse})` }}>立即查询订阅价格</button>
    <h2>看看你现在是否有更好的购买地区</h2>
    <p>app-card-price.tnt-pub.com</p>
  </div>;
};
