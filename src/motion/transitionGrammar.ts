export type TransitionGrammarId = "soft_cut" | "panel_wipe" | "data_snap" | "focus_shift" | "system_lock" | "resolve" | "map_slide" | "feed_push" | "shock_snap_safe" | "minimal_fade";

export const transitionGrammars: TransitionGrammarId[] = ["soft_cut", "panel_wipe", "data_snap", "focus_shift", "system_lock", "resolve", "map_slide", "feed_push", "shock_snap_safe", "minimal_fade"];

export function transitionFor(index: number) {
  return transitionGrammars[index % transitionGrammars.length];
}
