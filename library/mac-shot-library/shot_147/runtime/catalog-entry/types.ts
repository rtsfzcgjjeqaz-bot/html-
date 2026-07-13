export type ShotLibraryEntry = {
  libraryId: string;
  choreographyId: string;
  sourceShotId: string;
  sceneType: string;
  title: string;
  approved: boolean;
  allowedInFactory: boolean;
  implementationVerified: boolean;
  durationFrames: number;
  actionBreakdownPath: string;
  atomicMotionsPath: string;
  choreographyPath: string;
  executableChoreographyPath: string;
  certificationPreviewPath: string;
  sourceReferencePath: string;
  atomicMotionIds: string[];
};
