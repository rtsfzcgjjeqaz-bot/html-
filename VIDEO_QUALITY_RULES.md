# Video Quality Rules

This project uses a permanent Video Quality Rule Lock System. Every Remotion preview, final, batch, factory, revise, and approve flow must pass the code quality gate before rendering or approval.

## 1. Typography Rules

- All video text must use typography tokens.
- Components must not define arbitrary `fontSize` values for video text.
- Hero, title, subtitle, body, caption, and micro text must be visually distinct.
- Title text must not use the same size as body text.
- One scene may use at most 3 text sizes.
- One video may use at most 4 text sizes.
- All video text must render through `SafeText`.
- Text must not overflow the screen.
- Text must not be clipped.
- Text must not overlap animated subjects or primary visuals.

## 2. Color Rules

- All text colors must use color tokens.
- Components must not define random text colors.
- Normal titles use `textPrimary`.
- Body copy uses `textSecondary`.
- Labels use `textTertiary` or `accentBlue`.
- `danger` red is allowed only for real risk, error, or price-warning context.
- Large red titles are forbidden.
- High-saturation neon colors are forbidden.
- Cyberpunk black/neon styling is forbidden.

## 3. Safe Area Rules

All visible elements must stay inside:

```ts
left: 140
right: 140
top: 90
bottom: 90
```

This applies to titles, body text, labels, screenshots, cards, charts, icons, shapes, and the maximum bounds of animated entry/exit movement.

If an element exceeds the safe area, the system must try in order:

1. Shorten copy.
2. Reduce token role.
3. Adjust layout.
4. Reduce card count.
5. Switch to a safer layout.

If still unsafe, QA must fail and rendering must be blocked.

## 4. Shape Rules

Decorative random shapes are forbidden. The following are not allowed:

- random circle
- random vertical line
- floating dot
- oversized ring
- decorative orbit
- meaningless thin line
- meaningless trajectory line

Every shape must have a `semanticRole` and a `targetRegion`. Allowed roles only:

- `connector`
- `focusMarker`
- `highlightBox`
- `stepLine`
- `chartGuide`
- `priceDeltaArrow`

A shape must be tied to a UI element, flow, data point, or focus region. One scene may contain at most 2 semantic shapes.

## 5. Screenshot Rules

- The same website screenshot may appear at most once in one video.
- A screenshot must not be used both as background and main visual.
- `home.png` may only be used in `websiteHero`.
- If `home.png` is used as `WebsiteFrame`, background must be abstract gradient, glass card, or soft texture.
- Repeated screenshot use is forbidden.
- Low-resolution screenshots are forbidden.
- Screenshot stretching or distortion is forbidden.

## 6. Motion Rules

- A `motionId` may be used at most once per video.
- A `cameraPathId` may be used at most once per video.
- A `layoutId` may be used at most once per video.
- Each scene needs at least 3 animation events.
- Fade/scale-only animation is forbidden.
- CSS transition / CSS animation must not be the main animation engine.
- Key animation must be based on Remotion frame primitives: `useCurrentFrame`, `interpolate`, `spring`, and `Sequence`.
- Random drifting animation is forbidden.
- Animated elements must not leave the safe area.
- High-frequency flicker and white flash transitions are forbidden.

## 7. Video Quality Rules

- The output must not feel like PPT slides.
- Every scene must have a primary visual subject.
- Every scene expresses one core idea only.
- Every scene must use a dense but readable composition: no large unused lower half, no isolated text-only layout, and no tiny subject floating in the safe area.
- Each scene must include at least one active product/data component in addition to text, such as app icons, search flow, comparison panel, recommendation panel, dynamic chart, signal board, or website frame.
- Camera language must be intentional: only key scenes should use visible push, dolly, orbit, rack-focus, jump reframe, or pullback behavior. Non-key scenes should use stable product-ad framing with component/data motion only.
- UI micro-motion must be bound to a website-derived component, app icon, country/price signal, AI decision step, or chart. Decorative HUD chips, random scan lines, floating labels, and unbound motion layers are forbidden.
- The render pipeline must validate structure before render and validate the rendered preview after render; if validation fails, block output and rerender only after the structural issue is fixed.
- Large text blocks must not be used to fill the frame.
- Repeated subtitle lines across scenes are forbidden; each scene must have a distinct second line or no second line.
- Title blocks should not sit near the top edge. Default title top must be at least 190px, except deliberate cover/summary layouts.
- If two scenes show the same primary content group, the second scene must change narrative purpose, data focus, and component composition.
- All scenes must not reuse the same white-card layout.
- Website screenshots must be a single `websiteHero` proof visual, not repeated backgrounds.
- The frame must have camera movement, depth, parallax, UI motion, or data motion.
- The first frame must not be blank.
- The first frame must be usable as a cover.

## 8. Data Authenticity Rules

- Fabricated prices are forbidden.
- Fabricated discounts are forbidden.
- Fabricated regional price differences are forbidden.
- If the website does not provide exact prices, allowed wording only includes general concepts such as price reference, global price differences, subscription cost, AI recommendation, or Low / Average / High.
- Unrelated icons must not be presented as official icons.
