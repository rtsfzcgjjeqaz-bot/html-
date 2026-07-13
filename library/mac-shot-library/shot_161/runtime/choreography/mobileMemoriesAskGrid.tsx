import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const SHOT_161_DURATION_FRAMES = 90;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const media = [
  {background: "linear-gradient(145deg, #9cc7ca 0%, #416c72 52%, #19363d 100%)", accent: "#e7f4ef"},
  {background: "linear-gradient(145deg, #ead7bd 0%, #bd885e 48%, #704331 100%)", accent: "#fff1d9"},
  {background: "linear-gradient(145deg, #b9c8dd 0%, #657b9e 48%, #293b59 100%)", accent: "#e6eefc"},
  {background: "linear-gradient(145deg, #d8b6c9 0%, #9a657e 48%, #542f45 100%)", accent: "#fae7f1"},
  {background: "linear-gradient(145deg, #cfdbad 0%, #7f9658 50%, #3d5129 100%)", accent: "#f1f7db"},
  {background: "linear-gradient(145deg, #c6b9a8 0%, #826c58 48%, #47382d 100%)", accent: "#f4e9dc"},
  {background: "linear-gradient(145deg, #a8c8df 0%, #547fa6 50%, #234461 100%)", accent: "#e7f5ff"},
  {background: "linear-gradient(145deg, #e5c4a8 0%, #b96e50 50%, #6c382c 100%)", accent: "#fff0df"},
  {background: "linear-gradient(145deg, #c4bfdd 0%, #756e9e 50%, #403958 100%)", accent: "#f1efff"},
];

export const Shot161MobileMemoriesAskGridChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const deviceIn = progress(frame, 0, 24);
  const railIn = progress(frame, 38, 64);
  const settle = progress(frame, 70, SHOT_161_DURATION_FRAMES);
  const deviceSpring = spring({frame, fps, config: {damping: 180, stiffness: 120, mass: 0.9}});
  const askSpring = spring({frame: frame - 52, fps, config: {damping: 14, stiffness: 150, mass: 0.7}});
  const camera = interpolate(frame, [0, SHOT_161_DURATION_FRAMES], [0.985, 1.018], clamp);

  return (
    <AbsoluteFill style={{background: "#edf1f7", overflow: "hidden", fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif"}}>
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(135deg, #e8edf5 0%, #f8fafc 48%, #e7eef7 100%)"}} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 392,
          height: 664,
          borderRadius: 54,
          padding: 10,
          background: "#15191f",
          boxShadow: "0 42px 110px rgba(34, 48, 70, 0.24)",
          opacity: 0.22 + deviceIn * 0.78,
          transform: `translate(-50%, -50%) translateY(${interpolate(deviceIn, [0, 1], [48, 0], clamp)}px) scale(${camera * interpolate(deviceSpring, [0, 1], [0.94, 1], clamp)})`,
        }}
      >
        <div style={{position: "relative", width: "100%", height: "100%", borderRadius: 45, overflow: "hidden", background: "#fbfcff"}}>
          <div style={{height: 68, padding: "16px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div>
              <div style={{fontSize: 12, fontWeight: 700, color: "#7b8493"}}>YOUR LIBRARY</div>
              <div style={{fontSize: 26, fontWeight: 820, color: "#172033", marginTop: 2}}>Memories</div>
            </div>
            <div style={{width: 38, height: 38, borderRadius: 19, background: "#e8eef8", display: "grid", placeItems: "center", color: "#36435b", fontSize: 13, fontWeight: 800}}>Q</div>
          </div>

          <div style={{height: 44, padding: "8px 18px 6px", display: "flex", gap: 8}}>
            {["All", "People", "Places"].map((label, index) => (
              <div key={label} style={{height: 30, padding: "0 14px", borderRadius: 15, display: "flex", alignItems: "center", background: index === 0 ? "#202735" : "#edf1f6", color: index === 0 ? "#fff" : "#667085", fontSize: 12, fontWeight: 720}}>{label}</div>
            ))}
          </div>

          <div style={{padding: "6px 14px 96px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: 132, gap: 7}}>
            {media.map((tile, index) => {
              const tileIn = progress(frame, 12 + index * 3, 32 + index * 3);
              return (
                <div key={index} style={{position: "relative", overflow: "hidden", borderRadius: 13, background: tile.background, opacity: tileIn, transform: `translateY(${interpolate(tileIn, [0, 1], [16, 0], clamp)}px) scale(${interpolate(tileIn, [0, 1], [0.94, 1], clamp)})`}}>
                  <div style={{position: "absolute", left: index % 2 ? 14 : 24, bottom: -15, width: 70, height: 88, borderRadius: "42px 42px 18px 18px", background: tile.accent, opacity: 0.78}} />
                  <div style={{position: "absolute", right: -14, top: 18 + (index % 3) * 5, width: 58, height: 58, borderRadius: 29, background: "rgba(255,255,255,0.32)"}} />
                </div>
              );
            })}
          </div>

          <div style={{position: "absolute", left: 12, right: 12, bottom: 12, height: 76, borderRadius: 27, padding: "0 12px 0 18px", display: "flex", alignItems: "center", gap: 15, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(100,116,139,0.14)", boxShadow: "0 16px 36px rgba(30,41,59,0.16)", opacity: railIn, transform: `translateY(${interpolate(railIn, [0, 1], [28, 0], clamp)}px)`}}>
            <div style={{width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", background: "#eef2f8", color: "#637085", fontSize: 12, fontWeight: 800}}>H</div>
            <div style={{width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", color: "#637085", fontSize: 12, fontWeight: 800}}>G</div>
            <div style={{marginLeft: "auto", height: 50, minWidth: 154, padding: "0 20px", borderRadius: 25, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "linear-gradient(135deg, #3457e5 0%, #7c4ee4 100%)", color: "white", fontSize: 15, fontWeight: 780, boxShadow: `0 10px ${20 + askSpring * 8}px rgba(67, 76, 220, ${0.18 + askSpring * 0.12})`, transform: `scale(${1 + askSpring * 0.045 - settle * 0.025})`}}>
              <span style={{fontSize: 18}}>*</span>
              Ask memories
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
