export const typography = {
  hero: { fontSize: 64, lineHeight: 1.05, fontWeight: 760, letterSpacing: -1.8 },
  title: { fontSize: 44, lineHeight: 1.12, fontWeight: 720, letterSpacing: -1.2 },
  subtitle: { fontSize: 28, lineHeight: 1.25, fontWeight: 600, letterSpacing: -0.4 },
  body: { fontSize: 22, lineHeight: 1.38, fontWeight: 500 },
  caption: { fontSize: 16, lineHeight: 1.35, fontWeight: 500 },
  micro: { fontSize: 13, lineHeight: 1.3, fontWeight: 500 },
} as const;

export type TypographyRole = keyof typeof typography;
