import React from "react";
import { Composition } from "remotion";
import { AiSuggestionBubblesPreview } from "./AiSuggestionBubblesPreview";
import { CoverHookImpactPreview } from "./CoverHookImpactPreview";
import { DashboardGridOrbitPreview } from "./DashboardGridOrbitPreview";
import { FinalCtaCardsConvergePreview } from "./FinalCtaCardsConvergePreview";
import { PriceInsightSnapPreview } from "./PriceInsightSnapPreview";
import { SearchTypingThenRowsPreview } from "./SearchTypingThenRowsPreview";
import { SplitCompareCardsPreview } from "./SplitCompareCardsPreview";
import { StepFlowRailPreview } from "./StepFlowRailPreview";
import { WebsiteHeroCenterStagePreview } from "./WebsiteHeroCenterStagePreview";
import { WebsiteHeroAngledPushInPreview } from "./WebsiteHeroAngledPushInPreview";

export const MotionCatalogRoot: React.FC = () => (
  <>
    <Composition
      id="WebsiteHeroAngledPushInPreview"
      component={WebsiteHeroAngledPushInPreview}
      durationInFrames={135}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="SearchTypingThenRowsPreview"
      component={SearchTypingThenRowsPreview}
      durationInFrames={144}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="SplitCompareCardsPreview"
      component={SplitCompareCardsPreview}
      durationInFrames={144}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="DashboardGridOrbitPreview"
      component={DashboardGridOrbitPreview}
      durationInFrames={144}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="AiSuggestionBubblesPreview"
      component={AiSuggestionBubblesPreview}
      durationInFrames={144}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="PriceInsightSnapPreview"
      component={PriceInsightSnapPreview}
      durationInFrames={132}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="StepFlowRailPreview"
      component={StepFlowRailPreview}
      durationInFrames={144}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="WebsiteHeroCenterStagePreview"
      component={WebsiteHeroCenterStagePreview}
      durationInFrames={126}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="FinalCtaCardsConvergePreview"
      component={FinalCtaCardsConvergePreview}
      durationInFrames={132}
      fps={30}
      width={960}
      height={540}
    />
    <Composition
      id="CoverHookImpactPreview"
      component={CoverHookImpactPreview}
      durationInFrames={126}
      fps={30}
      width={960}
      height={540}
    />
  </>
);
