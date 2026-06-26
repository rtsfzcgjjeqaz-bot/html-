import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { ResolvedScene } from "../factory/shotPlanner";
import { pickScenesFromStructure, resolveRuntimeStructure, type RuntimeInputProps } from "./runtimeStructure";
import { buildBeatMap } from "../timeline/beatMap";
import { buildTimeline } from "../timeline/storyboard";
import { Scene } from "./components/Scene";
import { SceneRenderer } from "./components/SceneRenderer";
import { ArticleTransitionLayer } from "./components/ArticleTransitionLayer";
import { buildArticleTransitionPlan, overlapForIncomingScene } from "./articleTransitionContract";

type WebsiteAdVideoProps = RuntimeInputProps;

const certifiedToFallbackPrerollFrames = 8;

export const shouldUseCertifiedShotRenderer = (scene: ResolvedScene) => Boolean(scene.selectedShotId && scene.choreographyId);

const needsFallbackPreroll = (scene: ResolvedScene, previousScene: ResolvedScene | undefined) => {
  return !shouldUseCertifiedShotRenderer(scene) && Boolean(previousScene && shouldUseCertifiedShotRenderer(previousScene));
};

export const sequenceTimingWithPreroll = (
  scene: ResolvedScene,
  previousScene: ResolvedScene | undefined,
  startFrame: number,
  durationFrames: number,
) => {
  const prerollFrames = needsFallbackPreroll(scene, previousScene) ? Math.min(certifiedToFallbackPrerollFrames, startFrame) : 0;
  return {
    from: startFrame - prerollFrames,
    durationInFrames: durationFrames + prerollFrames,
    prerollFrames,
  };
};

const PrerolledScene: React.FC<React.PropsWithChildren<{ prerollFrames: number }>> = ({ prerollFrames, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: frame < prerollFrames ? 0 : 1 }}>
      {children}
    </AbsoluteFill>
  );
};

export const WebsiteAdVideo: React.FC<WebsiteAdVideoProps> = (props) => {
  const { withAudio = false, strategyId } = props;
  const structure = resolveRuntimeStructure(props);
  const fps = structure.meta?.fps ?? 30;
  const scenes = pickScenesFromStructure(structure, strategyId);
  const timeline = buildTimeline(scenes, fps);
  const articleTransitionPlan = structure.articleJob ? buildArticleTransitionPlan(scenes) : undefined;
  buildBeatMap(timeline);

  return (
    <AbsoluteFill style={{ background: "#f6f1e9" }}>
      {withAudio ? <Audio src={staticFile("audio/bgm.mp3")} volume={0.22} /> : null}
      {timeline.map(({ scene, index, startFrame, durationFrames }) => {
        const previousScene = timeline[index - 1]?.scene;
        const sequenceTiming = sequenceTimingWithPreroll(scene, previousScene, startFrame, durationFrames);
        const articleOverlapFrames = structure.articleJob ? overlapForIncomingScene(scenes, index) : 0;
        const sequenceFrom = sequenceTiming.from - articleOverlapFrames;
        const sequenceDuration = sequenceTiming.durationInFrames + articleOverlapFrames;
        return (
          <Sequence key={scene.id ?? index} from={sequenceFrom} durationInFrames={sequenceDuration} premountFor={fps}>
            {shouldUseCertifiedShotRenderer(scene) ? (
              <SceneRenderer scene={scene} sceneIndex={index} />
            ) : sequenceTiming.prerollFrames > 0 ? (
              <PrerolledScene prerollFrames={sequenceTiming.prerollFrames}>
                <Scene scene={scene} sceneIndex={index} strategyId={strategyId} />
              </PrerolledScene>
            ) : (
              <Scene scene={scene} sceneIndex={index} strategyId={strategyId} />
            )}
          </Sequence>
        );
      })}
      {articleTransitionPlan ? <ArticleTransitionLayer boundaries={articleTransitionPlan.boundaries} /> : null}
      {withAudio ? <Audio src={staticFile("audio/voice.mp3")} volume={1} /> : null}
    </AbsoluteFill>
  );
};
