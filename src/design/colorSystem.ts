export const colors = {
  background: "#F6F9FF",
  backgroundAlt: "#EEF5FF",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#6B7280",
  accentBlue: "#2563EB",
  accentCyan: "#38BDF8",
  accentGreen: "#10B981",
  accentOrange: "#F97316",
  danger: "#EF4444",
  card: "rgba(255,255,255,0.78)",
  border: "rgba(37,99,235,0.14)",
  shadow: "rgba(15,23,42,0.12)",
} as const;

export type ColorToken = keyof typeof colors;
