import { resultFrom, type QualityStructure } from "./types";

function noDup(values: string[], label: string, errors: string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) errors.push(`${label} repeats within video: ${value}`);
    seen.add(value);
  }
}

const stringsOnly = (values: Array<string | undefined>) => values.filter((value): value is string => Boolean(value));

export function intraVideoMotionValidator(structure: QualityStructure & Record<string, unknown>) {
  const errors: string[] = [];
  const scenes = structure.scenes ?? [];
  noDup(stringsOnly(scenes.map((s) => s.expression?.layoutId ?? s.layoutId)), "layoutId", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.cameraPathId ?? s.cameraPathId)), "cameraPathId", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.motionId ?? s.motionId)), "motionId", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.transitionId ?? s.transitionId)), "transitionId", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.animationPlan?.entrance)), "animationPlan.entrance", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.animationPlan?.dataMotion)), "animationPlan.dataMotion", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.animationPlan?.emphasis)), "animationPlan.emphasis", errors);
  noDup(stringsOnly(scenes.map((s) => s.expression?.animationPlan?.exit)), "animationPlan.exit", errors);
  return resultFrom(errors);
}
