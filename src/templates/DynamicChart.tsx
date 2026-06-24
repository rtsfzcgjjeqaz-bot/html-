import React from "react";
import { BarChartRace } from "../remotion/components/BarChartRace";
import { AnimatedText } from "../remotion/components/AnimatedText";
import type { TemplateProps } from "./WebsiteHero";

export const DynamicChart: React.FC<TemplateProps> = ({ lines, items, accent, variant }) => (
  <div style={{ position: "absolute", left: 240, top: 150, display: "grid", gridTemplateColumns: "620px 1fr", gap: 70 }}>
    <AnimatedText lines={lines} accent={accent} mode="compact" />
    <BarChartRace items={items.length ? items : ["Price data", "Country data", "App list", "AI logic"]} accent={accent} variant={variant} />
  </div>
);
