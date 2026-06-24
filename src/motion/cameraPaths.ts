export type CameraPathId = "push_in" | "dolly_left" | "tilt_up" | "slide_right" | "arc" | "pull_back" | "orbit_map" | "feed_follow" | "jump_cut" | "slow_center";

export const cameraPaths: CameraPathId[] = ["push_in", "dolly_left", "tilt_up", "slide_right", "arc", "pull_back", "orbit_map", "feed_follow", "jump_cut", "slow_center"];

export function cameraPathFor(index: number) {
  return cameraPaths[index % cameraPaths.length];
}
