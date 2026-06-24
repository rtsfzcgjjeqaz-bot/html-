export type CameraSystem = {
  x: number;
  y: number;
  zoom: number;
  rotate: number;
};

export type AnimationSystem = {
  entrance: number;
  exit: number;
  emphasis: number;
};

export type TransitionSystem = {
  opacity: number;
  blur: number;
  type: string;
};

export type EngineMotionSystem = {
  cameraSystem: CameraSystem;
  animationSystem: AnimationSystem;
  transitionSystem: TransitionSystem;
};
