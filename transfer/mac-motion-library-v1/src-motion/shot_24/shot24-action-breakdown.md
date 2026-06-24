# Shot 24 Certification Motion Breakdown

- Source video: `/Users/mac/Desktop/jewelry-video/references/motion-source/2025年 #飞书项目 产品全新升级，从流程到应用全面自定义，AI驱动项目管理，重构存储极致体验，还有整车研发解.mp4`
- Source shot: `/Users/mac/Desktop/jewelry-video/references/extracted-shots/shot_24_stepFlow_89p13-94p00.mp4`
- Shot ID: `shot_24`
- Queue index: `6`
- Scene type: `stepFlow`
- Source time range: `89.13s-94.00s`
- Duration: `4.87s`
- Certification status: `approved`
- Approved: `true`
- Allowed in factory: `true`

## Visual Structure

The shot presents a central product object with feature/module cards arranged in perspective around it. The original reference uses a vehicle, but the reusable structure is broader: one hero object, several functional modules, and connector lines that explain how the modules relate to the core.

## Camera And Motion Language

The motion uses a restrained orbit/push. The product object settles first, module cards fan out in depth, and connector lines draw after card positions are readable. The shot should feel like a system decomposition, not floating decoration.

## Atomic Motion Candidates

1. `product-core-settle`
   - Core object scales and settles into the right/center stage.
   - It carries the visual weight of the shot.
   - It must be replaceable by a product image, 3D render, device, or abstract product block.

2. `product-module-fanout`
   - Module cards fan out from the core object.
   - Cards appear in a deliberate order.
   - Each card must have a semantic label.

3. `card-orbit`
   - Cards maintain light parallax/orbit motion after reveal.
   - Orbit is bounded so cards do not drift off screen.

4. `connector-lines`
   - Lines draw between modules and core.
   - Lines must connect meaningful objects rather than decorate empty space.

## Choreography Candidate

`step-flow-product-module-fanout`

This choreography is highly reusable for feature breakdowns, product architecture maps, capability systems, and step aggregation. It should be approved only if card labels, line endpoints, and object replacement rules are explicit.

## Risks To Check In Review

- Strong 3D/product dependency if the hero object is not configurable.
- Small labels can become unreadable.
- Floating cards can feel decorative without clear grouping.
- Connector lines must not cross important text.

## Recommended Review Decision

Review as a first-round `stepFlow` / `featureHighlight` candidate. Approved for factory catalog after executable asset standardization.

## Executable Asset Package

- Library ID: `step-flow-product-module-fanout`
- Choreography ID: `stepFlowProductModuleFanout`
- Atomic motions: `src/motion/shot_24/shot24-atomic-motions.ts`
- Package choreography entry: `src/motion/shot_24/shot24-choreography.tsx`
- Executable Remotion choreography: `src/motion/choreographies/stepFlowProductModuleFanout.tsx`
- Catalog entry: `src/motion/catalog/step-flow-product-module-fanout.library-entry.ts`
