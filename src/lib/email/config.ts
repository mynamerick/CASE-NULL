import { SITE } from "@/lib/site";

export const EMAIL_FROM = `CASE NULL <hello@mail.${SITE.domain}>`;

export const EMAIL_REPLY_TO = SITE.supportEmail;

export const EMAIL_COLORS = {
  void: "#07090d",
  abyss: "#0a0d13",
  shell: "#10141c",
  panel: "#161b25",
  line: "#262d3b",
  ink: "#e7e9ee",
  inkDim: "#a5adbd",
  inkFaint: "#6f7889",
  amber: "#9f3838",
  verified: "#4d8a72",
} as const;
