import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The floating dev badge sits over the dock and breaks the illusion.
  devIndicators: false,
  // Don't emit AGENTS.md / CLAUDE.md into the repo on dev start.
  agentRules: false,
};

export default nextConfig;
