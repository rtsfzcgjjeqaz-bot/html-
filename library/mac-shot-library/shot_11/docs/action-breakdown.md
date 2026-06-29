# Shot 11 Certification Motion Breakdown

- Source video: `SOURCE_PROJECT/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `SOURCE_PROJECT/references/extracted-shots/shot_11_resultComparison_54p17-55p67.mp4`
- Shot ID: `shot_11`
- Queue index: `5`
- Scene type: `resultComparison`
- Source time range: `54.17s-55.67s`
- Duration: `1.50s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot is a compact dark KPI burst. A large numeric value dominates the center of frame, supported by a short subtitle and high-speed perspective streaks. The value is the entire semantic payload; all background energy should guide attention toward that value.

## Camera And Motion Language

The reference uses a fast push toward the number with radial speed lines. The animation should feel like a result reveal, not a decorative title card. Motion energy is high, but the number must remain readable throughout.

## Atomic Motion Candidates

1. `big-number-burst`
   - Numeric value scales in quickly from compressed/blurred state.
   - Opacity locks early so the value is readable.
   - Short overshoot is acceptable but should not wobble.

2. `speed-line-perspective`
   - Lines radiate inward/outward toward a central vanishing point.
   - Lines support speed/performance semantics.
   - No random decorative particles.

3. `value-count-up`
   - Optional numeric count-up can lead into the final value.
   - Should be short because the shot duration is only 1.5s.
   - Value formatting must be configurable.

4. `subtitle-lock`
   - Subtitle appears after number readability is established.
   - Subtitle should be short and centered.

## Choreography Candidate

`result-comparison-big-number-burst`

This choreography is useful for performance claims, efficiency improvements, savings, and before/after result moments. It should be approved only with a semantic metric guard so teams do not use giant numbers as generic hype.

## Risks To Check In Review

- Overdramatic if used too frequently.
- Large numeric claims require a real metric source.
- Speed lines can become decorative if not tied to performance/result context.
- Subtitle and number must stay inside safe bounds.

## Recommended Review Decision

Review as a first-round `resultComparison` candidate. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `result-comparison-big-number-burst`
- Choreography ID: `resultComparisonBigNumberBurst`
- Atomic motions: `src/motion/shot_11/shot11-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_11/shot11-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/resultComparisonBigNumberBurst.tsx`
- Catalog entry: `src/motion/catalog/result-comparison-big-number-burst.library-entry.ts`
