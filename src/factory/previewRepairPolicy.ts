import type { QualityStructure } from "../qa/types";
import { solveSceneLayout } from "../layout/layoutSolver";
import { cameraIntentForScene } from "../motion/cameraIntentMap";
import { semanticMotionForTemplate } from "../motion/semanticMotionMap";

export function applyPreviewRepairPolicy(structure: QualityStructure): QualityStructure {
  return {
    ...structure,
    scenes: (structure.scenes ?? []).map((scene, index) => {
      const solved = solveSceneLayout(scene);
      const camera = cameraIntentForScene(solved, index);
      const motion = semanticMotionForTemplate(String(solved.visualTemplate ?? ""));
      const repairedScene = {
        ...solved,
        camera: { ...(solved.camera ?? {}), motion: camera.activeCamera ? camera.cameraPath : "slow_center" },
        cameraPathId: camera.activeCamera ? camera.cameraPath : `stable_component_${index + 1}`,
        animationEvents: motion.events,
        semanticMotion: motion,
      };
      return repairedScene;
    }),
  };
}
