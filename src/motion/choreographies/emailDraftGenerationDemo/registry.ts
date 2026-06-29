import { emailDraftGenerationDemoTracks } from "./tracks";

export type EmailDraftGenerationDemoChoreography = {
  choreographyId: "emailDraftGenerationDemo";
  shotId: "shot_36";
  sceneType: "emailDraftDemo";
  approved: true;
  allowedInFactory: true;
  durationSeconds: number;
  animationTracks: typeof emailDraftGenerationDemoTracks;
};

export const emailDraftGenerationDemo: EmailDraftGenerationDemoChoreography = {
  choreographyId: "emailDraftGenerationDemo",
  shotId: "shot_36",
  sceneType: "emailDraftDemo",
  approved: true,
  allowedInFactory: true,
  durationSeconds: 4.8,
  animationTracks: emailDraftGenerationDemoTracks,
};