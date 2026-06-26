# Windows Adaptation Notes

- Review React and Remotion versions before copying runtime code. Source was tested against `remotion@4.0.477`.
- This package does not include preview MP4, frames, screenshots, or reference videos.
- The registry entry is an increment only. Do not replace an existing target registry wholesale.
- The choreography is self-contained, but text and product labels should be converted to target project props before production integration.
- Confirm first-frame rendering in the Windows project to avoid blank or white-flash regressions.
- Keep `windowsReviewStatus` as `pending` and `runtimeIntegrationStatus` as `not_integrated` until the Windows team explicitly integrates it.
