# Shot 79 Action Breakdown

- shotId: shot_79
- choreographyId: aiSuggestionCardFromSelection
- libraryId: ai-suggestion-card-from-selection
- sceneType: aiRecommendation
- sourceReferencePath: SOURCE_PROJECT/references/extracted-shots/new-reference-ai-interaction/shot_79_aiRecommendation_7p35-10p35.mp4
- duration: 2.97s / 89 frames at 30fps

## Visual Structure

Dark document editor with selected text, a vertical AI toolbar, and a generated suggestion card that expands from the selected context. The visual hierarchy moves from selected text to toolbar action to suggestion result.

## Motion Structure

1. Blurred selected text establishes context.
2. Vertical AI toolbar docks beside the selection.
3. Command tooltip cycles through edit labels.
4. Suggestion card expands from the action point.
5. Suggestion content resolves inside the card.
6. Cursor/focus settles on the completed suggestion.

## Reuse Value

Reusable for AI rewrite, suggestion, summarization, grammar improvement, recommendation cards, and comment-assisted editing scenes.

## Risks

- Suggestion card must stay anchored to the selected content.
- Dense paragraph text needs clear hierarchy.
- Card copy should be short enough to avoid tiny unreadable text.

## Recommended Action

Generate local certification preview only. Do not publish or allow runtime use until user approval.
