# Scene Props Contract

Shot 35 currently renders as a self-contained Remotion component and does not require external scene props.

## Required Runtime Inputs

- Composition width: tested at `1280`
- Composition height: tested at `720`
- FPS: tested at `30`
- Duration: `188 frames`

## Future Optional Props To Consider

- Product name/header label.
- Supporting subtitle.
- Sidebar icon count or active item.
- Content card rows.
- Accent color tokens.

## Integration Guard

Do not import this package from production runtime directly. Adapt it into the Windows project only after review of naming, token, layout, and scene prop conventions.
