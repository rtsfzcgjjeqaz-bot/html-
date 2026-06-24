import { searchTypingThenRowsAtomicMotions } from "../../atomic/searchTypingThenRows";

export type SearchTypingThenRowsTrack = {
  trackId: string;
  motionId: (typeof searchTypingThenRowsAtomicMotions)[number];
  target: string;
  layer: "background" | "search" | "semantic" | "results" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const searchTypingThenRowsTracks: SearchTypingThenRowsTrack[] = [
  {
    trackId: "track-searchBackdropDrift",
    motionId: "searchBackdropDrift",
    target: "searchBackdrop",
    layer: "background",
    startPercent: 0,
    endPercent: 100,
    role: "depth-establish",
    purpose: "Create a restrained gradient drift behind the search interface.",
  },
  {
    trackId: "track-searchBarReveal",
    motionId: "searchBarReveal",
    target: "searchBar",
    layer: "search",
    startPercent: 8,
    endPercent: 28,
    role: "primary-control-entry",
    purpose: "Bring the universal search control into focus as the primary action.",
    semanticTarget: "search.primaryInput",
  },
  {
    trackId: "track-queryTypeReveal",
    motionId: "queryTypeReveal",
    target: "queryText",
    layer: "search",
    startPercent: 28,
    endPercent: 48,
    role: "input-intent",
    purpose: "Reveal a replaceable query string without depending on the source video's text.",
    semanticTarget: "search.query",
  },
  {
    trackId: "track-submitPulse",
    motionId: "submitPulse",
    target: "submitButton",
    layer: "semantic",
    startPercent: 46,
    endPercent: 58,
    role: "action-confirmation",
    purpose: "Confirm the search action with a small semantic pulse.",
    semanticTarget: "search.submit",
  },
  {
    trackId: "track-resultRowsReveal",
    motionId: "resultRowsReveal",
    target: "resultRows",
    layer: "results",
    startPercent: 55,
    endPercent: 84,
    role: "result-build",
    purpose: "Cascade generic result rows after search intent is established.",
    semanticTarget: "search.results",
  },
  {
    trackId: "track-searchFocusSettle",
    motionId: "searchFocusSettle",
    target: "fullComposition",
    layer: "camera",
    startPercent: 84,
    endPercent: 100,
    role: "readability-hold",
    purpose: "Settle the whole search composition for review without adding more information.",
  },
];
