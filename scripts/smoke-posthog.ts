import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

async function main() {
  const { logEvent, isPostHogServerConfigured } = await import("../src/lib/logger");

  if (!isPostHogServerConfigured()) {
    console.error("FAIL: PostHog server key not configured");
    process.exit(1);
  }

  await logEvent("error", "PostHog smoke test (server direct)", {
    kind: "server",
    source: "smoke-posthog-script",
    route: "/smoke-test",
  });

  console.log("OK: server smoke test sent to PostHog");
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
