import { DevTools } from "@/components/dev/DevTools";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { isDevToolsEnabled } from "@/lib/dev-tools";

export function DevToolsMount() {
  if (!isDevToolsEnabled()) return null;
  return <DevTools comingSoonEnabled={isComingSoonEnabled()} />;
}
