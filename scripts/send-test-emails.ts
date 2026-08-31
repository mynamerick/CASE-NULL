import { EMAIL_TEMPLATES, sendTestEmail, type EmailTemplateId } from "@/lib/email/send";

const TEST_RECIPIENT = "rick@sublimedigital.net";

function preview(label: string, subject: string) {
  console.log(`\n=== ${label} ===`);
  console.log(`Subject: ${subject}`);
}

async function main() {
  const only = process.argv[2] as EmailTemplateId | undefined;
  const templates = only ? [only] : EMAIL_TEMPLATES;

  if (only && !EMAIL_TEMPLATES.includes(only)) {
    console.error(`Unknown template "${only}". Available: ${EMAIL_TEMPLATES.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Preview recipient: ${TEST_RECIPIENT}`);
  console.log(`Templates: ${templates.join(", ")}`);

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.log("\nRESEND_API_KEY is not set. Add the key to send live tests.");
    return;
  }

  const results: Array<{ template: EmailTemplateId; sent: boolean }> = [];

  for (const template of templates) {
    const sent = await sendTestEmail({
      to: TEST_RECIPIENT,
      template,
      firstName: "Rick",
    });
    results.push({ template, sent });
    preview(template, sent ? "sent" : "failed");
  }

  console.log("\nSend results:");
  for (const { template, sent } of results) {
    console.log(`- ${template}: ${sent ? "sent" : "failed"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
