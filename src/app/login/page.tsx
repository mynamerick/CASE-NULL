import type { Metadata } from "next";
import { AuthShell } from "@/components/marketing/AuthShell";
import { LoginForm } from "@/components/marketing/LoginForm";
import { BRAND } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: `Sign in to your ${BRAND.name} account and continue your investigation.`,
  path: "/login",
  index: false,
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      eyebrow="Session resume"
      tagline="Return to your open case files and forensic workstation."
      dossier={[
        { label: "Case ref", value: "MP26-0431" },
        { label: "Workstation", value: "Forensic terminal" },
        { label: "Sync", value: "Profile linked" },
      ]}
      alternate={{
        prompt: "Need an account?",
        href: "/signup",
        label: "Sign up",
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
