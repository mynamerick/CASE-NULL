/** Dev-only utilities — never enable NEXT_PUBLIC_DEV_TOOLS on production without intent. */

function parseTruthyFlag(value: string | undefined): boolean {
  const flag = value?.trim().toLowerCase();
  return flag === "true" || flag === "1" || flag === "yes";
}

export function isDevToolsEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return parseTruthyFlag(process.env.NEXT_PUBLIC_DEV_TOOLS);
}
