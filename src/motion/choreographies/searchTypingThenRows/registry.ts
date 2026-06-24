import { searchTypingThenRowsTracks } from "./tracks";

export type SearchTypingThenRowsChoreography = {
  choreographyId: "searchTypingThenRows";
  shotId: "shot_25";
  sceneType: "searchDemo";
  approved: true;
  allowedInFactory: true;
  durationSeconds: number;
  animationTracks: typeof searchTypingThenRowsTracks;
};

export const searchTypingThenRows: SearchTypingThenRowsChoreography = {
  choreographyId: "searchTypingThenRows",
  shotId: "shot_25",
  sceneType: "searchDemo",
  approved: true,
  allowedInFactory: true,
  durationSeconds: 4.8,
  animationTracks: searchTypingThenRowsTracks,
};
