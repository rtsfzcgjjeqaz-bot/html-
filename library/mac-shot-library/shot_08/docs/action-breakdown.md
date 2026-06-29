# Shot 08 Certification Motion Breakdown

- Source video: `SOURCE_PROJECT/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `SOURCE_PROJECT/references/extracted-shots/shot_08_aiRecommendation_31p53-36p20.mp4`
- Shot ID: `shot_08`
- Queue index: `4`
- Scene type: `aiRecommendation`
- Source time range: `31.53s-36.20s`
- Duration: `4.67s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot shows an AI assist moment over a product workspace. The background is a soft, blurred app surface. The foreground is a right-side AI analysis panel, anchored by a small AI label/pill and a cursor that implies user intent. The panel is the main reading surface, while the background exists only to provide context.

## Camera And Motion Language

The reference motion is a cursor-triggered focus shift. First the workspace sits in soft focus, then the cursor moves toward the action area, the AI pill appears, and the analysis panel slides/fades in. Motion should be intentional and semantic, not a generic card entrance.

## Atomic Motion Candidates

1. `focus-blur-background`
   - Background workspace starts visible but subdued.
   - Blur and opacity increase as the AI panel takes focus.
   - Background must not compete with panel text.

2. `cursor-trigger-panel`
   - Cursor travels along a short purposeful path.
   - It pauses near the trigger label before the panel expands.
   - Cursor movement must feel like user intent, not random decoration.

3. `ai-pill-pop`
   - Small label/pill identifies the AI action.
   - It appears just before the panel reveal.
   - The pill should remain compact and readable.

4. `ai-card-slide-in`
   - Panel enters from the right with opacity and slight scale.
   - Body text reveals in rows.
   - The panel must keep all copy inside safe bounds.

## Choreography Candidate

`ai-recommendation-cursor-panel-reveal`

This is a strong choreography candidate because it captures a reusable AI product moment: intent, recommendation, and result. It should be reviewed for cursor semantics, panel text containment, and whether the background blur is strong enough to guide attention.

## Risks To Check In Review

- Cursor motion can feel fake if the trigger target is unclear.
- Panel body copy can overflow if future AI responses are longer.
- A generic glowing AI card can become decorative unless tied to a real product action.
- Background UI should stay contextual but not readable enough to fight the foreground.

## Recommended Review Decision

Review as a first-round `aiRecommendation` template candidate. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `ai-recommendation-cursor-panel-reveal`
- Choreography ID: `aiRecommendationCursorPanelReveal`
- Atomic motions: `src/motion/shot_08/shot08-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_08/shot08-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/aiRecommendationCursorPanelReveal.tsx`
- Catalog entry: `src/motion/catalog/ai-recommendation-cursor-panel-reveal.library-entry.ts`
