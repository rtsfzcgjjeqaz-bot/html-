import React from "react";
import { AppIconCard } from "../remotion/components/AppIconCard";
import { AnimatedText } from "../remotion/components/AnimatedText";
import type { TemplateProps } from "./WebsiteHero";

export const AppGrid: React.FC<TemplateProps> = ({ lines, accent }) => (
  <>
    <div style={{ position: "absolute", left: 260, top: 180, display: "grid", gridTemplateColumns: "repeat(3, 170px)", gap: 22 }}>{["ChatGPT", "Claude", "Gemini", "YouTube", "Spotify", "iCloud"].map((label, index) => <AppIconCard key={label} label={label} index={index} accent={accent} />)}</div>
    <div style={{ position: "absolute", left: 1040, top: 282 }}><AnimatedText lines={lines} accent={accent} mode="title" /></div>
  </>
);
