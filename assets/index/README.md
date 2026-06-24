# Remotion Asset System

This folder is the canonical AI video generation asset system for Remotion and batch rendering.

## Rules

- All images, videos, icons, audio, fonts, motion, rules, and presets must be registered in `assets/index/assets.json` or a typed index file under `assets/index/`.
- Remotion code must call assets through `assets/index/asset-resolver.ts`.
- Do not reference raw paths directly inside scenes, templates, or factory planners.
- Do not scan the filesystem at runtime to discover assets.
- Batch generation must use deterministic asset IDs, not ad-hoc file names.

## Core APIs

- `getImage(name)`
- `getVideo(name)`
- `getMotion(name)`

## Batch Compatibility

The resolver is mapping-table based and does not perform runtime filesystem scans, which keeps 400/day generation predictable and cacheable.
