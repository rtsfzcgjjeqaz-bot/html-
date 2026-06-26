# Choreography Spec

- Shot ID: `shot_35`
- Choreography ID: `websiteHeroAngledProductSurface`
- Library ID: `website-hero-angled-product-surface`
- Scene type: `websiteHero`
- Duration: `188 frames` at `30fps`
- Runtime component: `Shot35WebsiteHeroAngledProductSurfaceChoreography`

## Sequence

1. Product surface is visible from frame 0 to avoid blank first frames.
2. Angled product surface settles from frame 0 to 64.
3. Sidebar structural rail reveals from frame 0 to 76.
4. Header/title settles from frame 42 to 86.
5. Workspace content card appears from frame 104 to 154.
6. Final hold keeps the product surface readable through frame 187.

## Runtime Notes

The choreography is self-contained and uses Remotion `useCurrentFrame`, `useVideoConfig`, `interpolate`, and `Easing`. It does not import project tokens or shared presets.

## Visual QA Requirements

- First frame must show the product surface, not only background glow.
- No white flash or blank hold.
- Product UI must remain inside frame.
- Text must not overflow or become too small for the target video size.
