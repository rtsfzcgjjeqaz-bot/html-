import { dashboardGridOrbitTracks } from "./tracks";

export type DashboardGridOrbitChoreography = {
  choreographyId: "dashboardGridOrbit";
  shotId: "shot_15";
  sceneType: "appGrid";
  approved: true;
  allowedInFactory: true;
  durationSeconds: number;
  animationTracks: typeof dashboardGridOrbitTracks;
};

export const dashboardGridOrbit: DashboardGridOrbitChoreography = {
  choreographyId: "dashboardGridOrbit",
  shotId: "shot_15",
  sceneType: "appGrid",
  approved: true,
  allowedInFactory: true,
  durationSeconds: 4.8,
  animationTracks: dashboardGridOrbitTracks,
};
