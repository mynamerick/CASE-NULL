import { PostHog } from "posthog-node";

type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, string | number | boolean | null | undefined>;

let client: PostHog | null = null;

function getPostHogKey(): string | null {
  return (
    process.env.POSTHOG_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ||
    null
  );
}

function getPostHogHost(): string {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com"
  );
}

function getClient(): PostHog | null {
  const key = getPostHogKey();
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: getPostHogHost(),
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

export function isPostHogServerConfigured(): boolean {
  return Boolean(getPostHogKey());
}

function cleanFields(fields: LogFields): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function distinctId(fields: LogFields): string {
  if (typeof fields.userId === "string" && fields.userId) return fields.userId;
  if (fields.kind === "client") return "client-error";
  return "server";
}

export async function logEvent(
  level: LogLevel,
  message: string,
  fields: LogFields = {},
): Promise<void> {
  const posthog = getClient();
  if (!posthog) return;

  const properties = {
    level,
    service: "casenull",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    ...cleanFields(fields),
  };

  const id = distinctId(fields);

  try {
    if (level === "error") {
      const error = new Error(message);
      if (typeof fields.stack === "string") error.stack = fields.stack;
      posthog.captureException(error, id, properties);
    } else {
      posthog.capture({
        distinctId: id,
        event: `log_${level}`,
        properties: { message, ...properties },
      });
    }
    await posthog.flush();
  } catch {
    // Logging must never break requests.
  }
}

export function logInfo(message: string, fields?: LogFields): void {
  void logEvent("info", message, fields);
}

export function logWarn(message: string, fields?: LogFields): void {
  void logEvent("warn", message, fields);
}

export function logError(message: string, fields?: LogFields): void {
  void logEvent("error", message, fields);
}
