# Shot 82 Action Breakdown

## Identity

- shotId: shot_82
- choreographyId: codePreviewToggleFocus
- libraryId: code-preview-toggle-focus
- sceneType: featureHighlight
- sourceReferencePath: references/extracted-shots/new-reference-ai-interaction/shot_82_featureHighlight_14p45-16p7.mp4
- duration: 67 frames at 30fps

## Visual Structure

Shot 82 focuses on a dark code editor toolbar. The user-facing action is a segmented `Code / Preview` control. A cursor moves toward the `Preview` segment, clicks it, then the toggle becomes the hero element through a circular magnified focus glow. The left edge retains a hint of code context so the preview action has meaning.

## Motion Language

1. Dark code workspace appears with a shallow angled crop.
2. Toolbar and segmented control resolve near the upper center.
3. Cursor glides into the Preview segment.
4. The Preview segment activates with blue-violet glow and checkmark.
5. A circular focus lens enlarges the toggle.
6. The activated state holds for review.

## Reuse Value

This is a strong feature-highlight template for developer tools, AI app builders, design-to-code flows, code preview, publishing, deploy, or mode switching. Its value is the clear micro-interaction, not generic UI decoration.

## Risks

- Toggle labels can become unreadable if localized into long strings.
- Cursor must visibly target the Preview segment and not float without purpose.
- Lens glow can become decorative if the segmented control is not the semantic focus.
- Code context should remain background context, not compete with the toggle.

## Recommended Review Action

Render local preview and confirm the click-to-preview interaction reads immediately. Keep `approved` and `allowedInFactory` false until visual review passes.
