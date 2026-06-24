import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type CameraRigProps = {
  variant: number;
  durationFrames: number;
  cameraPathId?: string;
  active?: boolean;
  children: React.ReactNode;
};

export const CameraRig: React.FC<CameraRigProps> = ({ variant, durationFrames, cameraPathId = "", active = true, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = spring({ frame, fps, config: { damping: 18, stiffness: 105 } });
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { extrapolateRight: "clamp" });

  const camera = !active
    ? { x: 0, y: 0, zoomA: 0.985, zoomB: 0.995, rotateY: 0, rotateX: 0 }
    : cameraPathId.includes("dolly_left")
    ? { x: 46, y: -10, zoomA: 0.93, zoomB: 1.01, rotateY: 4, rotateX: -1.2 }
    : cameraPathId.includes("tilt_up")
      ? { x: -12, y: 42, zoomA: 0.94, zoomB: 1.02, rotateY: -1.5, rotateX: 4 }
      : cameraPathId.includes("slide_right")
        ? { x: -52, y: 8, zoomA: 0.94, zoomB: 1, rotateY: -4, rotateX: 1 }
        : cameraPathId.includes("arc") || cameraPathId.includes("orbit")
          ? { x: 34, y: 18, zoomA: 0.92, zoomB: 1.02, rotateY: 6, rotateX: 2.2 }
          : cameraPathId.includes("pull_back")
            ? { x: -8, y: -8, zoomA: 1.03, zoomB: 0.94, rotateY: 2, rotateX: -1 }
            : cameraPathId.includes("jump_cut")
              ? { x: 28, y: -22, zoomA: 1.02, zoomB: 0.98, rotateY: -5, rotateX: 2 }
              : [
                  { x: 26, y: -8, zoomA: 0.94, zoomB: 1.02, rotateY: -3, rotateX: 1.6 },
                  { x: 36, y: -14, zoomA: 0.93, zoomB: 1.0, rotateY: 3.8, rotateX: -1.4 },
                  { x: -18, y: 30, zoomA: 0.94, zoomB: 1.02, rotateY: 0, rotateX: 3 },
                  { x: -44, y: 12, zoomA: 0.93, zoomB: 1.0, rotateY: -4, rotateX: 1 },
                  { x: 28, y: 18, zoomA: 0.92, zoomB: 1.01, rotateY: 5, rotateX: 2 },
                  { x: -12, y: -10, zoomA: 1.02, zoomB: 0.95, rotateY: 2, rotateX: 1 },
                ][variant % 6];

  const snap = active && cameraPathId.includes("jump_cut") ? interpolate(frame % 18, [0, 2, 18], [1, 1.006, 1], { extrapolateRight: "clamp" }) : 1;
  const x = interpolate(progress, [0, 1], [camera.x, -camera.x]);
  const y = interpolate(progress, [0, 1], [camera.y, -camera.y]);
  const zoom = interpolate(progress, [0, 1], [camera.zoomA + 0.02 * beat, camera.zoomB]) * snap;
  const rotateY = interpolate(progress, [0, 1], [camera.rotateY, -camera.rotateY]);
  const rotateX = interpolate(progress, [0, 1], [camera.rotateX, -camera.rotateX]);

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1600, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
