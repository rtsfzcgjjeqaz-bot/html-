# Shot 31 Certification Motion Breakdown

- Source video: `/Users/mac/Desktop/jewelry-video/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `/Users/mac/Desktop/jewelry-video/references/extracted-shots/shot_31_finalCTA_142p00-144p13.mp4`
- Shot ID: `shot_31`
- Queue index: `9`
- Scene type: `finalCTA`
- Source time range: `142.00s-144.13s`
- Duration: `2.13s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot is a clean final end card. A compact logo mark sits centered above a one-line slogan. The background is plain white, and the composition relies on restraint rather than visual density.

## Camera And Motion Language

Motion is minimal: logo fades in, settles at center, slogan follows, and the whole lockup holds long enough to read. The shot should feel like a brand close, not a second hero section.

## Atomic Motion Candidates

1. `logo-endcard-fade`
   - Logo fades from soft opacity to full clarity.
   - It moves only a small distance.
   - The logo remains centered and stable.

2. `centered-cta-lockup`
   - Slogan appears after logo is readable.
   - Lockup spacing is fixed and safe.
   - The end card must be brand-neutral and configurable.

3. `white-hold`
   - Final frame holds on white for brand memory.
   - No decorative motion is needed.

## Choreography Candidate

`final-cta-logo-endcard`

This choreography is essential for reusable business videos. It has low novelty, but every pipeline needs a predictable and quiet final CTA template.

## Risks To Check In Review

- Low novelty by design.
- Slogan length can overflow if not constrained.
- Over-animation would make the ending feel cheap.

## Recommended Review Decision

Review as a `finalCTA` representative. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `final-cta-brand-end-card`
- Choreography ID: `finalCtaBrandEndCard`
- Atomic motions: `src/motion/shot_31/shot31-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_31/shot31-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/finalCtaBrandEndCard.tsx`
- Catalog entry: `src/motion/catalog/final-cta-brand-end-card.library-entry.ts`
