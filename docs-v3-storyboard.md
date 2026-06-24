# AppCardPricePromo V3 Revision Storyboard

Render target: 1920x1080, 30fps, 900 frames, MP4. Preview deliverable includes visible frame/time counter.

## Data field check

Available structured fields:
- apps[].name, category, iconType
- apps[].regions[].regionCode, regionName, localPriceLabel, convertedPriceValue, currency, trend, updatedAtLabel, riskLevel
- history[].date, value
- rankings[].rank, regionName, categoryAdvantage, advantageLabel
- aiRecommendation.appName, recommendedRegion, reasons

Revision data decision:
- Add more sample regions for the orbit shot: GB, CA, DE, KR, AU, SG.
- Keep price labels as sample/API placeholders only.
- Keep history as relative sample values until the user's real table is provided.

## Frame-based revision plan

### Scene 1 / frames 0-90 / 00:00-00:03
- Remove the fake square "A" icon.
- Rebuild product identity as text + small verified data-system mark, no meaningless icon block.
- Fix right-column signal alignment: single-line signal pills and consistent column width.

### Scene 2 / frames 90-180 / 00:03-00:06
- Expand orbit dots from 4 to 10 regions.
- Animate them around the phone with deterministic circular motion using frame-based sine/cosine.
- Keep the central phone stable; orbit shows "many storefronts hidden behind one checkout price".

### Scene 3 / frames 180-300 / 00:06-00:10
- Remove the unexplained blue diagonal sweep line.
- Rebalance left map card: larger region dots, clearer labels, larger legend, less empty vertical space.
- Keep the right comparison table as the main readable output.

### Scene 4 / frames 300-390 / 00:10-00:13
- Change repeated title copy to a new message: "每次打开，都是新的地区信号".
- Move card lower / reduce internal title scale to create visible breathing space from the scene title.
- Remove decorative arrow-style emphasis.

### Scene 5 / frames 390-480 / 00:13-00:16
- Reposition axis names: x-axis label centered below x-axis; y-axis label centered to the left of y-axis.
- Preserve animated trend line, keep sample data disclaimer.

### Scene 6 / frames 480-600 / 00:16-00:20
- Remove unclear blue connector line.
- Replace with grouped ecosystem signal cards + ranked bars only.

### Scene 7 / frames 600-690 / 00:20-00:23
- Remove duplicated Chinese headline.
- Scene title becomes short English section label; card content becomes the actual recommendation report.
- Fill white space using a two-column report: recommendation summary + evidence stack.

### Scene 9 / frames 780-900 / 00:26-00:30
- Preserve good typing effect.
- Keep stronger CTA button and URL.
- Add preview frame counter overlay only in preview composition/video.
