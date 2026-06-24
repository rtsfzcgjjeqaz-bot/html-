import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type CameraState = { x: number; y: number; zoom: number; rotationY: number; rotationX: number };

const sceneStarts = [0, 90, 180, 300, 390, 480, 600, 690, 780];
const sceneEnds = [90, 180, 300, 390, 480, 600, 690, 780, 900];
const cameraKeyframes: [CameraState, CameraState][] = [
  [{ x: 0, y: 20, zoom: 0.96, rotationY: -4, rotationX: 3 }, { x: -30, y: 0, zoom: 1.04, rotationY: -2, rotationX: 2 }],
  [{ x: -40, y: 0, zoom: 1.02, rotationY: -2, rotationX: 1 }, { x: 0, y: 0, zoom: 1, rotationY: 0, rotationX: 0 }],
  [{ x: 50, y: 10, zoom: 0.96, rotationY: 4, rotationX: 2 }, { x: 0, y: 0, zoom: 1.05, rotationY: 1, rotationX: 1 }],
  [{ x: 0, y: 0, zoom: 1.08, rotationY: 1, rotationX: 1 }, { x: -20, y: -10, zoom: 1.02, rotationY: -2, rotationX: 0 }],
  [{ x: -30, y: 0, zoom: 1.04, rotationY: -3, rotationX: 1 }, { x: 20, y: 0, zoom: 1, rotationY: 2, rotationX: 1 }],
  [{ x: 60, y: 0, zoom: 0.98, rotationY: 5, rotationX: 2 }, { x: 0, y: 0, zoom: 1.03, rotationY: 1, rotationX: 1 }],
  [{ x: 0, y: 20, zoom: 0.98, rotationY: 0, rotationX: 2 }, { x: 0, y: 0, zoom: 1.04, rotationY: 0, rotationX: 0 }],
  [{ x: -40, y: 0, zoom: 1, rotationY: -3, rotationX: 1 }, { x: 20, y: 0, zoom: 1.05, rotationY: 2, rotationX: 1 }],
  [{ x: 0, y: 10, zoom: 1.06, rotationY: 1, rotationX: 1 }, { x: 0, y: 0, zoom: 1, rotationY: 0, rotationX: 0 }],
];

export const getSceneIndex = (frame: number) => Math.min(sceneStarts.findIndex((s, i) => frame >= s && frame < sceneEnds[i]) === -1 ? 8 : sceneStarts.findIndex((s, i) => frame >= s && frame < sceneEnds[i]), 8);
export const getSceneRange = (index: number) => ({ start: sceneStarts[index], end: sceneEnds[index], duration: sceneEnds[index] - sceneStarts[index] });

export const getCameraForScene = (sceneIndex: number, localFrame: number): CameraState => {
  const [from, to] = cameraKeyframes[sceneIndex];
  const { duration } = getSceneRange(sceneIndex);
  const p = interpolate(localFrame, [0, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ease = p * p * (3 - 2 * p);
  const lerp = (a: number, b: number) => a + (b - a) * ease;
  return { x: lerp(from.x, to.x), y: lerp(from.y, to.y), zoom: lerp(from.zoom, to.zoom), rotationY: lerp(from.rotationY, to.rotationY), rotationX: lerp(from.rotationX, to.rotationX) };
};

export const getParallax = (camera: CameraState, depth: 'background' | 'ui' | 'foreground') => {
  const map = { background: [0.25, 0.2], ui: [0.55, 0.45], foreground: [0.9, 0.8] }[depth];
  return { x: camera.x * map[0], y: camera.y * map[1] };
};

export const useSceneProgress = (sceneIndex: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start, duration } = getSceneRange(sceneIndex);
  const local = frame - start;
  const appear = spring({ frame: Math.max(0, local), fps, config: { damping: 18, stiffness: 90 } });
  return { local, duration, progress: interpolate(local, [0, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), appear };
};

export const sceneOpacity = (frame: number, index: number) => {
  const { start, end } = getSceneRange(index);
  return Math.min(
    interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [end - 14, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
};
