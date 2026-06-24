# Codex Project Rules

In this project, any change involving Remotion video generation, preview, final, factory, batch, revise, or approve must first read `VIDEO_QUALITY_RULES.md`.

Permanent rules:

- Do not bypass `qualityGate`.
- Do not sacrifice single-video quality for generation quantity.
- Do not approve a preview that has not passed QA.
- Do not render 10 videos at once.
- Follow the sequential preview approval workflow:

```text
plan -> video_01.preview -> human review -> approve -> video_01.final + video_02.preview
```

If the user reports any of the following, fix the current video first and do not move to the next video:

- text overflow
- inconsistent typography or colors
- meaningless lines, circles, or floating shapes
- repeated screenshots
- PPT-like output
- chaotic animation

Factory safety rules:

- `factoryPlan` must run `qualityGate` before rendering a preview.
- `factoryApprove` must read QA and block approve if QA failed.
- `factoryRevise` must rerun `qualityGate` after revising only the current index.
- `previewGate` is the only preview render gate.
- `final` rendering is not allowed if the current QA report failed.
