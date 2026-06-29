# Shot 26 Certification Motion Breakdown

- Source video: `SOURCE_PROJECT/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `SOURCE_PROJECT/references/extracted-shots/shot_26_appGrid_100p50-106p97.mp4`
- Shot ID: `shot_26`
- Queue index: `7`
- Scene type: `appGrid`
- Source time range: `100.50s-106.97s`
- Duration: `6.47s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot is a dark product walkthrough built around a tilted dashboard. The app surface is shown in perspective, with callout pills stacked along one side and a cursor/action point highlighting a meaningful workflow step.

## Camera And Motion Language

The camera pushes across the dashboard at a shallow angle. Callouts appear in sequence, then the cursor focuses one action area. The motion should feel like guided product walkthrough, not a floating screenshot wall.

## Atomic Motion Candidates

1. `tilted-dashboard-callout`
   - Dashboard enters as a perspective surface.
   - Callouts attach to real regions of the UI.
   - Tilt remains bounded to preserve readability.

2. `cursor-focus`
   - Cursor moves toward a highlighted action button.
   - It lands briefly and implies user intent.
   - Cursor path must be short and purposeful.

3. `callout-stack`
   - Labels appear in a staggered stack.
   - Each label corresponds to a visible dashboard area.
   - Stack cannot cover primary data.

4. `action-button-lock`
   - Action button brightens after cursor focus.
   - This gives the shot a clear semantic endpoint.

## Choreography Candidate

`app-grid-tilted-dashboard-callout`

This choreography is a strong dark appGrid/walkthrough candidate for complex SaaS interfaces. It should be approved only if perspective and label density remain readable.

## Risks To Check In Review

- Perspective can make text unreadable.
- Cursor path can feel fake if target is unclear.
- Callout labels may become decorative if not tied to UI regions.
- Dark UI contrast needs accessibility review.

## Recommended Review Decision

Review as a dark `appGrid` representative. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `app-grid-tilted-dashboard-callout`
- Choreography ID: `appGridTiltedDashboardCallout`
- Atomic motions: `src/motion/shot_26/shot26-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_26/shot26-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/appGridTiltedDashboardCallout.tsx`
- Catalog entry: `src/motion/catalog/app-grid-tilted-dashboard-callout.library-entry.ts`
