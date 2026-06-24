import React from "react";
import { PriceCard } from "../remotion/components/PriceCard";
import { AnimatedText } from "../remotion/components/AnimatedText";
import { SafeText } from "../remotion/components/SafeText";
import type { TemplateProps } from "./WebsiteHero";

export const RecommendationPanel: React.FC<TemplateProps> = ({ lines, items, accent }) => (
  <>
    <div style={{ position: "absolute", left: 260, top: 186 }}><AnimatedText lines={lines} accent={accent} mode="title" /></div>
    <div style={{ position: "absolute", left: 920, top: 180, width: 700 }}><SafeText role="hero" tone="primary">Best route</SafeText><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 44 }}>{(items.length ? items : ["Low price", "Risk check", "Region", "Confidence"]).slice(0, 4).map((item, index) => <PriceCard key={item} label={item} index={index} accent={accent} />)}</div></div>
  </>
);
