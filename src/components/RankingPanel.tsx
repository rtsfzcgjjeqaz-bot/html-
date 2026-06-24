import { rankings } from '../data';

export const RankingPanel: React.FC = () => (
  <div className="ranking-card card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg) rotateY(3deg)' }}>
    <h2>Top Regions</h2>
    {rankings.map((r, i) => <div className={`ranking-row ${i === 0 ? 'top-rank' : ''}`} key={r.rank} style={{ transform: `translate3d(0,0,${i === 0 ? 86 : 0}px)` }}>
      <strong>#{r.rank}</strong><b>{r.regionName}</b><span>{r.categoryAdvantage}</span><em>{r.advantageLabel}</em>
    </div>)}
  </div>
);
