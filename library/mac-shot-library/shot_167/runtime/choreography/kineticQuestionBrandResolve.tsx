import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const SHOT_167_DURATION_FRAMES = 210;

export type KineticQuestionBrandResolveProps = {
  question?: string;
  emphasisWords?: number;
  brandName?: string;
};

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});

const colors = ["#26d7da", "#25a8f2", "#8a66f6", "#ef5bb2"];

export const Shot167KineticQuestionBrandResolveChoreography: React.FC<KineticQuestionBrandResolveProps> = ({
  question = "Still editing subtitles by hand?",
  emphasisWords = 2,
  brandName = "SubHero",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = question.trim().split(/\s+/).slice(0, 9);
  const questionExit = ease(frame, 112, 136);
  const markIn = ease(frame, 96, 138);
  const nameIn = ease(frame, 124, 160);
  const camera = interpolate(frame, [0, SHOT_167_DURATION_FRAMES], [0.985, 1.02], clamp);
  const markSpring = spring({frame: frame - 100, fps, config: {damping: 18, stiffness: 145, mass: 0.75}});

  return (
    <AbsoluteFill style={{background: "#070a19", overflow: "hidden", fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif"}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 23% 68%, rgba(28,181,194,0.18), transparent 30%), radial-gradient(circle at 78% 30%, rgba(112,68,220,0.18), transparent 33%), linear-gradient(135deg, #080b1c 0%, #0b1026 55%, #090b18 100%)", opacity: 0.72 + ease(frame, 0, 36) * 0.28}} />
      <div style={{position: "absolute", left: "50%", top: "50%", width: 1080, minHeight: 250, transform: `translate(-50%, -50%) scale(${camera})`, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0 20px", padding: "0 74px", opacity: 1 - questionExit, transform: `translateY(${interpolate(questionExit, [0, 1], [0, -18], clamp)}px) scale(${interpolate(questionExit, [0, 1], [1, 0.96], clamp)})`}}>
          {words.map((word, index) => {
            const enter = ease(frame, 4 + index * 10, 26 + index * 10);
            const emphasized = index >= Math.max(0, words.length - emphasisWords);
            return (
              <span key={`${word}-${index}`} style={{fontSize: 64, lineHeight: 1.28, fontWeight: 820, letterSpacing: 0, color: emphasized ? "#cbd2df" : "#f7f9ff", opacity: 0.12 + enter * 0.88, transform: `translateY(${interpolate(enter, [0, 1], [20, 0], clamp)}px)`, display: "inline-block", textShadow: emphasized ? "0 0 24px rgba(111,133,177,0.24)" : "none"}}>{word}</span>
            );
          })}
        </div>

        <div style={{position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: markIn, transform: `translateY(${interpolate(markIn, [0, 1], [24, 0], clamp)}px) scale(${interpolate(markSpring, [0, 1], [0.88, 1], clamp)})`}}>
          <div style={{height: 72, display: "flex", alignItems: "center", gap: 8}}>
            {colors.map((color, index) => {
              const barIn = ease(frame, 100 + index * 6, 128 + index * 6);
              const heights = [34, 58, 64, 42];
              return <div key={color} style={{width: 15, height: heights[index], borderRadius: 8, background: color, opacity: barIn, transform: `scaleY(${interpolate(barIn, [0, 1], [0.2, 1], clamp)})`, boxShadow: `0 0 22px ${color}55`}} />;
            })}
          </div>
          <div style={{fontSize: 70, lineHeight: 1, fontWeight: 860, letterSpacing: 0, color: "#f8faff", opacity: nameIn, transform: `translateY(${interpolate(nameIn, [0, 1], [14, 0], clamp)}px)`}}>{brandName}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
