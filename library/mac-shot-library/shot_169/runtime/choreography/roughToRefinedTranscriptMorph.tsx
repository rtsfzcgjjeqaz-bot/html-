import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const SHOT_169_DURATION_FRAMES = 201;

export type RoughToRefinedTranscriptMorphProps = {
  headline?: string;
  sourceLabel?: string;
  resultLabel?: string;
};

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const ease = (frame: number, start: number, end: number) => interpolate(frame, [start, end], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});

type Token = {text: string; rough?: string; corrected?: string};
const lines: Token[][] = [
  [{text: "Today"}, {text: "we"}, {text: "shipped"}, {text: "an"}, {text: "update"}, {text: "to"}, {text: "chat gpt", rough: "chat gpt", corrected: "ChatGPT"}],
  [{text: "and"}, {text: "fixed"}, {text: "the"}, {text: "docs"}, {text: "for"}, {text: "you tube", rough: "you tube", corrected: "YouTube."}],
  [{text: "Now"}, {text: "the"}, {text: "transcript"}, {text: "reads"}, {text: "like"}, {text: "it"}, {text: "was"}],
  [{text: "edited"}, {text: "by"}, {text: "a"}, {text: "human."}],
];

export const Shot169RoughToRefinedTranscriptMorphChoreography: React.FC<RoughToRefinedTranscriptMorphProps> = ({headline = "From Rough to Refined", sourceLabel = "ROUGH TRANSCRIPT", resultLabel = "REFINED COPY"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const editorIn = ease(frame, 0, 34);
  const correction = ease(frame, 68, 126);
  const refine = ease(frame, 102, 162);
  const hold = ease(frame, 160, SHOT_169_DURATION_FRAMES);
  const editorSpring = spring({frame, fps, config: {damping: 180, stiffness: 115, mass: 0.9}});
  let tokenIndex = 0;

  return (
    <AbsoluteFill style={{background: "#070b17", overflow: "hidden", fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif"}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 72%, rgba(26,182,166,0.14), transparent 30%), radial-gradient(circle at 82% 24%, rgba(96,65,207,0.16), transparent 34%), linear-gradient(135deg, #080c1b, #0d1226 58%, #080b17)"}} />
      <div style={{position: "absolute", inset: "68px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: 34}}>
        <div style={{fontSize: 58, fontWeight: 840, lineHeight: 1.08, letterSpacing: 0, color: "#f7f9ff", opacity: 0.24 + editorIn * 0.76}}>{headline}</div>
        <div style={{width: 1040, height: 438, borderRadius: 24, overflow: "hidden", background: "rgba(8,13,27,0.92)", border: "1px solid rgba(124,151,190,0.20)", boxShadow: "0 32px 90px rgba(0,0,0,0.38)", opacity: 0.2 + editorIn * 0.8, transform: `translateY(${interpolate(editorIn, [0, 1], [34, 0], clamp)}px) scale(${interpolate(editorSpring, [0, 1], [0.975, 1], clamp)})`}}>
          <div style={{height: 58, display: "flex", alignItems: "center", padding: "0 22px", borderBottom: "1px solid rgba(124,151,190,0.14)", background: "rgba(12,18,35,0.94)"}}>
            <div style={{display: "flex", gap: 8}}>{["#35d1bd", "#527deb", "#9b68e7"].map(color => <div key={color} style={{width: 10, height: 10, borderRadius: 5, background: color, opacity: 0.84}} />)}</div>
            <div style={{marginLeft: 18, fontSize: 13, fontWeight: 760, color: refine < 0.5 ? "#7c879c" : "#70e2c3"}}>{refine < 0.5 ? sourceLabel : resultLabel}</div>
            <div style={{marginLeft: "auto", height: 28, padding: "0 12px", borderRadius: 14, display: "flex", alignItems: "center", background: `rgba(38, 197, 164, ${0.06 + hold * 0.14})`, color: "#66d9bd", fontSize: 12, fontWeight: 760, opacity: 0.42 + refine * 0.58}}>{refine < 0.8 ? "Analyzing" : "Refined"}</div>
          </div>
          <div style={{padding: "48px 58px", display: "flex", flexDirection: "column", gap: 22}}>
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} style={{minHeight: 42, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 11, fontSize: 27, lineHeight: 1.35, fontWeight: 620, color: "#cbd4e5"}}>
                {line.map((token) => {
                  const current = tokenIndex++;
                  const tokenIn = ease(frame, 18 + current * 3.2, 34 + current * 3.2);
                  const targetIn = token.rough ? ease(frame, 68 + lineIndex * 12, 92 + lineIndex * 12) : 0;
                  return (
                    <span key={`${lineIndex}-${current}`} style={{position: "relative", display: "inline-block", minWidth: token.rough ? 112 : undefined, opacity: 0.12 + tokenIn * 0.88, transform: `translateY(${interpolate(tokenIn, [0, 1], [8, 0], clamp)}px)`}}>
                      {token.rough ? (
                        <>
                          <span style={{opacity: 1 - refine, color: "#9ea9bc", textDecoration: correction > 0.74 ? "line-through" : "none", textDecorationColor: "#ef759c"}}>{token.rough}</span>
                          <span style={{position: "absolute", left: 0, top: 0, color: "#65dfbd", fontWeight: 760, opacity: refine, transform: `translateY(${interpolate(refine, [0, 1], [8, 0], clamp)}px)`}}>{token.corrected}</span>
                          <span style={{position: "absolute", left: -5, right: -5, bottom: -5, height: 3, borderRadius: 2, background: "#e95e91", transformOrigin: "left center", transform: `scaleX(${targetIn * (1 - refine)})`, opacity: 0.86}} />
                        </>
                      ) : token.text}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{position: "absolute", left: 58, right: 58, bottom: 34, height: 4, borderRadius: 2, background: "rgba(90,113,150,0.18)", overflow: "hidden"}}>
            <div style={{height: "100%", width: `${interpolate(frame, [18, 162], [4, 100], clamp)}%`, background: "linear-gradient(90deg, #2bd4bf, #566eea)", borderRadius: 2}} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
