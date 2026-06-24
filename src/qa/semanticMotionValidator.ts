import { isForbiddenMotionName, semanticMotionForTemplate } from "../motion/semanticMotionMap";
import { QualityStructure, resultFrom } from "./types";

export function semanticMotionValidator(structure: QualityStructure) {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const [index, scene] of (structure.scenes ?? []).entries()) {
    const id = scene.id ?? index + 1;
    const template = String(scene.visualTemplate ?? "");
    const expected = semanticMotionForTemplate(template);
    const events = scene.animationEvents ?? [];
    if (events.length < 3) errors.push(`scene ${id}: fewer than 3 semantic animation events.`);
    for (const event of events) {
      if (isForbiddenMotionName(event)) errors.push(`scene ${id}: forbidden unbound motion event ${event}.`);
    }
    const eventSet = new Set(events);
    const expectedMatches = expected.events.filter((event) => eventSet.has(event)).length;
    if (expectedMatches === 0) warnings.push(`scene ${id}: animation events do not match semantic template ${template}.`);
  }
  return resultFrom(errors, warnings);
}
