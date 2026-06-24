import React from "react";
import { SafeText } from "../remotion/components/SafeText";
import { AnimatedText } from "../remotion/components/AnimatedText";
import type { TemplateProps } from "./WebsiteHero";

export const SearchFlow: React.FC<TemplateProps> = ({ lines }) => (
  <>
    <div style={{ position: "absolute", left: 260, top: 188 }}><AnimatedText lines={lines} mode="title" /></div>
    <div style={{ position: "absolute", left: 260, top: 505, display: "flex", gap: 34 }}>{["Search app", "Compare regions", "Choose route"].map((step, index) => <div key={step} style={{ width: 340, height: 180, padding: 28 }}><SafeText role="micro" tone="accent">STEP {index + 1}</SafeText><SafeText role="title" tone="primary" maxWidth={280}>{step}</SafeText></div>)}</div>
  </>
);
