export type ScenePlan = {
  sceneId: string;
  sceneType: string;
  durationSeconds: number;
  hasHook?: boolean;
  hasCTA?: boolean;
  emotionalIntensity?: number;
};

export type RuleResult = {
  ruleId: string;
  passed: boolean;
  severity: "info" | "warning" | "error";
  message: string;
};

export function runHookRule(scenes: ScenePlan[]): RuleResult {
  const firstScene = scenes[0];
  const passed = Boolean(firstScene && firstScene.durationSeconds <= 2.5 && (firstScene.hasHook || firstScene.sceneType === "coverHook"));
  return {
    ruleId: "HOOK_FIRST_2_SECONDS",
    passed,
    severity: passed ? "info" : "error",
    message: passed ? "First scene has a strong hook within the opening window." : "First 2 seconds must contain a strong hook scene.",
  };
}

export function runCtaRule(scenes: ScenePlan[]): RuleResult {
  const lastScene = scenes[scenes.length - 1];
  const passed = Boolean(lastScene && (lastScene.hasCTA || lastScene.sceneType === "finalCTA"));
  return {
    ruleId: "CTA_REQUIRED",
    passed,
    severity: passed ? "info" : "error",
    message: passed ? "Final scene contains a CTA." : "Video must end with a clear CTA scene.",
  };
}

export function runPacingRule(scenes: ScenePlan[]): RuleResult {
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  const averageDuration = scenes.length ? totalDuration / scenes.length : 0;
  const passed = averageDuration >= 1.8 && averageDuration <= 5.5;
  return {
    ruleId: "PACING_RANGE",
    passed,
    severity: passed ? "info" : "warning",
    message: passed ? "Scene pacing is within the batch-safe range." : "Average scene duration should stay between 1.8s and 5.5s.",
  };
}

export function runEmotionalIntensityRule(scenes: ScenePlan[]): RuleResult {
  const values = scenes.map((scene) => scene.emotionalIntensity ?? 0.5);
  const peak = Math.max(...values, 0);
  const passed = peak >= 0.65;
  return {
    ruleId: "EMOTIONAL_INTENSITY_PEAK",
    passed,
    severity: passed ? "info" : "warning",
    message: passed ? "At least one scene reaches a strong emotional intensity peak." : "Add a stronger emotional peak to avoid flat batch output.",
  };
}

export function runVideoRules(scenes: ScenePlan[]): RuleResult[] {
  return [runHookRule(scenes), runCtaRule(scenes), runPacingRule(scenes), runEmotionalIntensityRule(scenes)];
}
