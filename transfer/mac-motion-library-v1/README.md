# Mac Motion Library Transfer Package

该目录仅用于审核和适配，不应被当前 production runtime 自动 import。

## Source

- Source project path: `/Users/mac/Desktop/jewelry-video`
- Migration date: 2026-06-24
- Remotion version: `remotion@4.0.477`
- Target branch: `transfer/mac-motion-library-v1`

## Scope

This package is an isolated review transfer. It does not modify target runtime files under `src/`, `assets/`, `public/`, `scripts/`, or production factory code.

## Choreography IDs

- `aiRecommendationCursorPanelReveal`
- `resultComparisonBigNumberBurst`
- `stepFlowProductModuleFanout`
- `appGridTiltedDashboardCallout`
- `stepFlowTimelineCalculation`
- `finalCtaBrandEndCard`

## Shot Purpose

| Shot | Choreography ID | Purpose |
| --- | --- | --- |
| `shot_08` | `aiRecommendationCursorPanelReveal` | AI recommendation panel reveal with cursor-triggered focus shift. |
| `shot_11` | `resultComparisonBigNumberBurst` | High-impact metric/result reveal with count-up and burst lines. |
| `shot_24` | `stepFlowProductModuleFanout` | Product/module fanout around a central system card with semantic connectors. |
| `shot_26` | `appGridTiltedDashboardCallout` | Tilted dashboard walkthrough with callouts, cursor focus, and action lock. |
| `shot_28` | `stepFlowTimelineCalculation` | Timeline draw, active date range, formula caption, and result card. |
| `shot_31` | `finalCtaBrandEndCard` | Clean brand end card with centered logo and short CTA/slogan. |

## Main Entries And Exports

- `src-motion/choreographyRegistry.ts`
  - `choreographyRegistry`
  - `resolveChoreography`
  - `RegistryEntry`
  - `ChoreographyComponentProps`
- `src-motion/presets/index.ts`
  - `motionPresetRegistry`
  - `resolveMotionPreset`
  - `backgroundParallax`
  - `cameraPushIn`
  - `websiteTiltIn`
  - `titleReveal`
  - `HighlightBoxReveal`
  - `highlightBoxReveal`
  - `featureCardReveal`
  - `softSettle`
- `src-motion/catalog/index.ts`
  - `shotLibraryCatalog`
  - `shotLibraryCatalogById`
  - `shotLibraryCatalogByChoreographyId`

## Review Package Layout

```text
transfer/mac-motion-library-v1/
├── README.md
├── src-motion/
│   ├── choreographyRegistry.ts
│   ├── catalog/
│   ├── choreographies/
│   ├── presets/
│   ├── shot_08/
│   ├── shot_11/
│   ├── shot_24/
│   ├── shot_26/
│   ├── shot_28/
│   └── shot_31/
└── remotion-dependencies/
    ├── MotionComposer.tsx
    └── tokens.ts
```

## Windows Project Compatibility Points To Review

1. Confirm target Remotion and React versions are compatible with `remotion@4.0.477` code patterns.
2. Review whether target `SceneRenderer` has a `choreographyId` dispatch path before adapting `MotionComposer`.
3. Review token compatibility: `presets/backgroundParallax.ts` and `presets/highlightBoxReveal.tsx` depend on `colors`, `layout`, and `fontFamily` semantics from `tokens.ts`.
4. Review import paths before runtime integration. Files are staged under `transfer/`, not under production `src/`.
5. Review naming collisions for choreography IDs and catalog library IDs before copying any file into runtime paths.
6. Review text fitting and safe-area behavior for Windows project compositions and aspect ratios.
7. Review whether `websiteHeroAngledPushIn` should remain unapproved, because its registry flags are `approved: false` and `allowedInFactory: false`.

## Do Not Auto Import

This package is for human review, diffing, and manual adaptation only. Production runtime should not import from `transfer/mac-motion-library-v1/` directly.
