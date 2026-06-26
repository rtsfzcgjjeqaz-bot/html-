# Atomic Motions

Source runtime file: `runtime/shot/shot35-atomic-motions.ts`

## angled-product-surface-enter

Purpose: Bring the main product surface into view as the hero object.

Timing: frames `0-64`.

Properties: opacity `0 -> 1`, translateX `24vw -> 8vw`, rotateY `-14 -> -7`, rotateZ `-1.8 -> -0.8`, scale `0.97 -> 1.02`.

Review risk: Panel must not crop meaningful UI or create a blank white frame.

## sidebar-reveal

Purpose: Expose the app navigation rail and make the surface feel like a real product.

Timing: frames `18-76`.

Properties: opacity `0 -> 1`, translateX `-34 -> 0`.

Review risk: Sidebar should be structural, not decorative icon noise.

## hero-header-settle

Purpose: Lock the product label/header into a readable top region.

Timing: frames `42-86`.

Properties: opacity `0 -> 1`, translateY `10 -> 0`.

Review risk: Header must remain replaceable and not hard-coded to a brand during production integration.

## workspace-content-card

Purpose: Prevent the hero from becoming an empty white app shell.

Timing: frames `104-154`.

Properties: opacity `0 -> 1`, translateY `24 -> 0`, rowCount `3`.

Review risk: Content card should communicate product context without becoming fake data.
