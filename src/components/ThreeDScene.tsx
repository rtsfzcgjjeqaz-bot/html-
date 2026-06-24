import type { ReactNode, CSSProperties } from 'react';
import type { CameraState } from './camera';
import { getParallax } from './camera';

export const ThreeDScene: React.FC<{ children: ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <section className="scene3d" style={{ opacity }}>{children}</section>
);

export const CameraRig: React.FC<{ camera: CameraState; children: ReactNode }> = ({ camera, children }) => (
  <div
    className="camera-rig"
    style={{
      transform: `translate3d(${-camera.x}px, ${-camera.y}px, 0px) rotateX(${camera.rotationX}deg) rotateY(${camera.rotationY}deg) scale(${camera.zoom})`,
    }}
  >
    {children}
  </div>
);

export const DepthLayer: React.FC<{
  camera: CameraState;
  depth: 'background' | 'ui' | 'foreground';
  z: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ camera, depth, z, children, style }) => {
  const p = getParallax(camera, depth);
  return (
    <div className={`depth-layer depth-${depth}`} style={{ ...style, transform: `translate3d(${p.x}px, ${p.y}px, ${z}px)` }}>
      {children}
    </div>
  );
};
