import { interpolate, useCurrentFrame } from 'remotion';
import { subtitles } from '../data';

export const AnimatedText: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = subtitles.find((s) => frame >= s.start && frame < s.end) ?? subtitles[subtitles.length - 1];
  const opacity = Math.min(
    interpolate(frame, [sub.start, sub.start + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [sub.end - 12, sub.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const y = interpolate(frame, [sub.start, sub.start + 18], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="subtitle" style={{ opacity, transform: `translate3d(-50%, ${y}px, 320px)` }}>{sub.text}</div>;
};
