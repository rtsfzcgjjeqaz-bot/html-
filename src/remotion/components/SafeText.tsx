import React from "react";
import { colors, safeArea, typography, type TypographyRole } from "../../design/designTokens";

type Tone = "primary" | "secondary" | "tertiary" | "accent" | "success" | "warning" | "danger";

type SafeTextProps = {
  role: TypographyRole;
  tone?: Tone;
  maxLines?: number;
  maxWidth?: number;
  preserveContent?: boolean;
  children: React.ReactNode;
  style?: Omit<React.CSSProperties, "fontSize" | "lineHeight" | "fontWeight" | "color">;
};

const toneColor: Record<Tone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  accent: colors.accentBlue,
  success: colors.accentGreen,
  warning: colors.accentOrange,
  danger: colors.danger,
};

const maxCharsByRole: Record<TypographyRole, number> = {
  hero: 42,
  title: 46,
  subtitle: 58,
  body: 84,
  caption: 76,
  micro: 54,
};

function compactText(value: React.ReactNode, role: TypographyRole) {
  if (typeof value !== "string") return value;
  const normalized = value.replace(/\s+/g, " ").trim();
  const limit = maxCharsByRole[role];
  return normalized.length > limit ? normalized.slice(0, limit).trim() : normalized;
}

export const SafeText: React.FC<SafeTextProps> = ({
  role,
  tone = "primary",
  maxLines = 2,
  maxWidth,
  preserveContent = false,
  children,
  style,
}) => {
  const token = typography[role];
  const resolvedMaxWidth = maxWidth ?? (role === "hero" || role === "title" ? safeArea.titleMaxWidth : safeArea.bodyMaxWidth);

  return (
    <div
      data-safe-text="true"
      data-text-role={role}
      data-text-tone={tone}
      style={{
        ...token,
        color: toneColor[tone],
        maxWidth: resolvedMaxWidth,
        overflow: preserveContent ? "visible" : "hidden",
        display: preserveContent ? "block" : "-webkit-box",
        WebkitLineClamp: preserveContent ? undefined : maxLines,
        WebkitBoxOrient: preserveContent ? undefined : "vertical",
        textOverflow: preserveContent ? "unset" : "clip",
        wordBreak: "normal",
        overflowWrap: "break-word",
        textWrap: "balance",
        ...style,
      }}
    >
      {preserveContent ? children : compactText(children, role)}
    </div>
  );
};
