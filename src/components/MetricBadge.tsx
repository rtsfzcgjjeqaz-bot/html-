export const MetricBadge: React.FC<{ label: string; tone?: 'blue' | 'green' | 'orange' | 'red' }> = ({ label, tone = 'blue' }) => (
  <span className={`metric-badge badge-${tone}`} style={{ transform: 'translate3d(0,0,120px)' }}>{label}</span>
);
