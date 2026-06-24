export type EngineMode =
  | "info"
  | "minimal"
  | "map"
  | "ai"
  | "shock"
  | "dashboard"
  | "parallax"
  | "narrative"
  | "realtime"
  | "walkthrough";

export type EngineDefinition = {
  mode: EngineMode;
  label: string;
};

export const engineList: EngineDefinition[] = [
  { mode: "info", label: "Info Explosion" },
  { mode: "minimal", label: "Apple Minimal" },
  { mode: "map", label: "Global Map" },
  { mode: "ai", label: "AI Decision" },
  { mode: "shock", label: "Price Shock" },
  { mode: "dashboard", label: "Dashboard" },
  { mode: "parallax", label: "Parallax Space" },
  { mode: "narrative", label: "Narrative Case" },
  { mode: "realtime", label: "Realtime Feed" },
  { mode: "walkthrough", label: "Walkthrough" },
];

export const selectEngine = (mode: EngineMode): EngineDefinition => {
  const engine = engineList.find((item) => item.mode === mode);

  if (!engine) {
    throw new Error(`Unknown engine mode: ${mode}`);
  }

  return engine;
};
