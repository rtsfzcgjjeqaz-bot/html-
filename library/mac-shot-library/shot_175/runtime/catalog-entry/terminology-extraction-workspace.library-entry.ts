import type {ShotLibraryEntry} from "./types";
import {shot175AtomicMotionIds} from "../atomic/shot175-atomic-motions";

export const terminologyExtractionWorkspaceLibraryEntry:ShotLibraryEntry={
  libraryId:"terminology-extraction-workspace",
  choreographyId:"terminologyExtractionWorkspace",
  sourceShotId:"shot_175",
  sceneType:"featureHighlight",
  title:"Terminology Extraction Workspace",
  approved:true,
  allowedInFactory:true,
  implementationVerified:true,
  durationFrames:240,
  actionBreakdownPath:"src/motion/shot_175/shot175-action-breakdown.md",
  atomicMotionsPath:"src/motion/shot_175/shot175-atomic-motions.ts",
  choreographyPath:"src/motion/shot_175/shot175-choreography.tsx",
  executableChoreographyPath:"src/motion/choreographies/terminologyExtractionWorkspace.tsx",
  certificationPreviewPath:"outputs/motion-catalog/review/shot_175/terminologyExtractionWorkspace.preview.mp4",
  sourceReferencePath:"references/extracted-shots/new-reference-remotion-code-promo/shot_175_featureHighlight_52p50-60p50.mp4",
  atomicMotionIds:[...shot175AtomicMotionIds],
};
