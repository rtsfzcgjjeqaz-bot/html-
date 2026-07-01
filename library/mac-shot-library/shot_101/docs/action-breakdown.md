# Shot 101 Action Breakdown

shotId: shot_101
sceneType: appGrid
choreographyId: saasRowStreamOverview
libraryId: saas-row-stream-overview
source: references/extracted-shots/new-reference-software-feature-clarity/shot_101_appGrid_3p30-6p53.mp4

## Visual Structure

Bright SaaS list overview with stacked horizontal rows, avatars, status pills, and a small cursor pointer. Rows move as a layered stream over a white/lavender background.

## Motion Structure

- rowStreamEnter: 0-34 frames. Rows slide in from the right with depth offsets.
- statusPillSweep: 20-58 frames. Colored status chips resolve inside rows.
- cursorGuide: 38-72 frames. Cursor pointer moves to a row-level focus point.
- depthBlurPass: 54-88 frames. Background rows blur slightly while focus row stays readable.
- listSettle: 78-97 frames. Rows hold as a usable app overview.

## Reuse Value

Reusable for appGrid, task list, CRM rows, review queues, tickets, and workflow-table scenes.

## Risks

- Small row text can become unreadable.
- Too much blur can make the shot feel like a generic transition.
- Cursor should point to a semantic row/action, not float randomly.

## Recommended Action

Generate local certification preview and wait for explicit user approval.
