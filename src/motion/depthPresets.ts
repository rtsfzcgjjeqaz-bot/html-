export type DepthPresetId = "foreground_cards" | "website_stage" | "data_layers" | "flat_process" | "summary_space";

export const depthPresets = {
  foreground_cards: { back: -260, mid: 80, front: 280 },
  website_stage: { back: -360, mid: -120, front: 220 },
  data_layers: { back: -180, mid: 40, front: 180 },
  flat_process: { back: 0, mid: 0, front: 0 },
  summary_space: { back: -420, mid: 80, front: 320 },
} as const;

export function depthPresetFor(index: number): DepthPresetId {
  return (Object.keys(depthPresets) as DepthPresetId[])[index % Object.keys(depthPresets).length];
}
