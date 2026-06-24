export type CameraSystem = {
  x: number;
  y: number;
  zoom: number;
};

export type AnimationSystem = {
  entrance: string;
  exit: string;
  emphasis: string;
};

export type TransitionSystem = {
  type: string;
};

export type MotionSystem = {
  cameraSystem: CameraSystem;
  animationSystem: AnimationSystem;
  transitionSystem: TransitionSystem;
};
