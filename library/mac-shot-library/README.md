# Mac Shot Library

This directory stores Shot release packages that were visually approved in the Mac local preview workflow, but are not necessarily integrated into the Windows production runtime.

It is a review and adaptation library only. It should not be automatically imported by the production runtime.

Each Shot still requires Windows-side review and adaptation before it can enter the formal `main` runtime.

## Workflow

1. Develop queued Shots locally in the Mac source motion project.
2. Keep raw reference files local in the Mac source reference intake folder.
3. Keep previews, keyframes, contact sheets, and render artifacts local under `outputs/`.
4. Publish a Shot here only after the user explicitly sends `APPROVE SHOT_<ID>`.
5. Published Shots default to:
   - `windowsReviewStatus: "pending"`
   - `runtimeIntegrationStatus: "not_integrated"`

## Status Values

- `draft`
- `preview_ready`
- `visually_approved`
- `github_published`
- `windows_reviewed`
- `runtime_integrated`
- `rejected`

## Required Shot Package Shape

```text
library/mac-shot-library/shot_<ID>/
├── manifest.json
├── analysis/
│   ├── action-breakdown.md
│   ├── atomic-motions.md
│   └── choreography-spec.md
├── runtime/
│   ├── choreography/
│   ├── catalog-entry/
│   ├── shot/
│   └── preset/
└── integration/
    ├── registry-entry.ts
    ├── scene-props-contract.md
    └── windows-adaptation-notes.md
```

## Guardrails

- Do not copy raw reference videos.
- Do not copy preview MP4s, frames, screenshots, or contact sheets.
- Do not copy `references/`, `outputs/`, `node_modules/`, `build/`, or `.env` files.
- Do not copy an entire `src/motion` tree for a single Shot release.
- Do not modify production `src/`, `assets/`, `public/`, or `scripts/` as part of Shot publication.
- Do not auto-integrate a Shot into Windows production runtime.
