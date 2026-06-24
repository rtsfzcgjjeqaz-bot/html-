# Shot 28 Certification Motion Breakdown

- Source video: `/Users/mac/Desktop/jewelry-video/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `/Users/mac/Desktop/jewelry-video/references/extracted-shots/shot_28_stepFlow_110p87-120p60.mp4`
- Shot ID: `shot_28`
- Queue index: `8`
- Scene type: `stepFlow`
- Source time range: `110.87s-120.60s`
- Duration: `9.73s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot is a dark process timeline with a calculation/progress strip. A large label anchors the left side, while the right side carries date chips, range selection, and a progress line. The reusable structure is a process step reveal: timeline first, active date range second, calculated result third.

## Camera And Motion Language

The motion is a controlled line draw rather than a dramatic camera move. The timeline line draws horizontally, date chips lock to the path, and a formula caption appears after the active range is readable. This keeps the shot operational and avoids generic decoration.

## Atomic Motion Candidates

1. `timeline-draw`
   - Main progress line draws from left to right.
   - Ticks appear as the line crosses them.
   - Motion must imply sequence or duration.

2. `date-range-highlight`
   - Active date range is selected with a bright segment.
   - Start/end date chips lock to the segment.
   - Dates must be configurable and stay inside bounds.

3. `formula-caption`
   - Formula or calculation label appears after range selection.
   - Text is short and anchored close to the selected range.
   - It should explain the timeline result, not float decoratively.

4. `result-chip-lock`
   - Final value chip settles at the end of the line.
   - This gives the shot a clear endpoint.

## Choreography Candidate

`step-flow-timeline-calculation`

This choreography is useful for project schedules, delivery windows, progress calculation, pricing periods, and process analytics. It should be approved only if date labels and formulas have safe text bounds.

## Risks To Check In Review

- Date/math copy can overflow.
- Timeline ticks may become too dense.
- Formula labels can look like decoration if not close to the active range.
- Dark UI contrast needs review for small labels.

## Recommended Review Decision

Review as a first-round `stepFlow` representative. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `step-flow-timeline-calculation`
- Choreography ID: `stepFlowTimelineCalculation`
- Atomic motions: `src/motion/shot_28/shot28-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_28/shot28-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/stepFlowTimelineCalculation.tsx`
- Catalog entry: `src/motion/catalog/step-flow-timeline-calculation.library-entry.ts`
