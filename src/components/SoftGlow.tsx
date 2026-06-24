export const SoftGlow: React.FC<{ x?: number; y?: number; color?: string; size?: number }> = ({ x = 0, y = 0, color = 'rgba(47,128,237,.16)', size = 260 }) => (
  <div className="soft-glow" style={{ width: size, height: size, left: x, top: y, background: color, transform: 'translate3d(0,0,260px)' }} />
);
