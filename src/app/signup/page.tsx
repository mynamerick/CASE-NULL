import type { Metadata } from "next";
import { AuthShell } from "@/components/marketing/AuthShell";
import { SignupForm } from "@/components/marketing/SignupForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create a free ${BRAND.name} account. Three investigations included.`,
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create account"
      eyebrow="New clearance"
      tagline="Issue a profile and enter the investigations archive."
      dossier={[
        { label: "Archive", value: "Case catalog" },
        { label: "Terminal", value: "Browser workstation" },
        { label: "Access", value: "Profile required" },
      ]}
      alternate={{
        prompt: "Already have an account?",
        href: "/login",
        label: "Sign in",
      }}
    >
      <SignupForm />
    </AuthShell>
  );
}
