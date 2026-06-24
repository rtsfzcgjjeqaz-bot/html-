import { cameraPathFor } from "../motion/cameraPaths";
import { depthPresetFor } from "../motion/depthPresets";
import { motionGrammarFor } from "../motion/motionGrammar";
import { transitionFor } from "../motion/transitionGrammar";
import { tenVideoTemplateSequences } from "../templates/TemplateRegistry";
import { animationPlanFor } from "./animationGrammarRegistry";
import { expressionSystems } from "./expressionSystems";
import type { LockedVideoContent } from "./contentLock";

export function generateExpressionVariants(lockedContent: LockedVideoContent, count = 10) {
  return Array.from({ length: count }, (_, index) => {
    const videoIndex = index + 1;
    const system = expressionSystems[index % expressionSystems.length];
    const templates = tenVideoTemplateSequences[index % tenVideoTemplateSequences.length];
    return {
      videoId: `video_${String(videoIndex).padStart(2, "0")}`,
      contentHash: lockedContent.contentHash,
      lockedContent,
      expressionSystemId: system.id,
      expressionSystem: system,
      scenes: lockedContent.scenes.map((scene, sceneIndex) => {
        const template = templates[sceneIndex % templates.length];
        const grammar = motionGrammarFor(index + sceneIndex);
        const camera = cameraPathFor(index * lockedContent.scenes.length + sceneIndex);
        const transition = transitionFor(index * lockedContent.scenes.length + sceneIndex);
        return {
          id: scene.id,
          content: scene,
          expression: {
            visualTemplate: template,
            layoutId: `${system.id}_${template}_layout_${scene.id}`,
            motionId: `${system.id}_${grammar.id}_${scene.id}`,
            cameraPathId: `${system.id}_${camera}_${scene.id}`,
            transitionId: `${system.id}_${transition}_${scene.id}`,
            depthPresetId: depthPresetFor(sceneIndex),
            animationPlan: animationPlanFor(videoIndex, sceneIndex),
          },
        };
      }),
    };
  });
}
