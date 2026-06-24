import type { QualityScene } from "../qa/types";
import { planShot } from "../director/shotPlanner";

export function cameraIntentForScene(scene: QualityScene, sceneIndex: number) {
  return planShot(scene, sceneIndex);
}

export function isCameraMotionAllowed(scene: QualityScene, sceneIndex: number) {
  const intent = cameraIntentForScene(scene, sceneIndex);
  const motion = String(scene.camera?.motion ?? scene.cameraPathId ?? "");
  if (!intent.activeCamera && /(shake|orbit|arc|jump|dolly|tilt|slide|pull|push)/i.test(motion)) {
    return { allowed: false, reason: `scene ${sceneIndex + 1}: strong camera used without key-scene intent.` };
  }
  if (/(random|shake)/i.test(motion)) return { allowed: false, reason: `scene ${sceneIndex + 1}: random/shake camera is forbidden.` };
  return { allowed: true, reason: intent.reason };
}
