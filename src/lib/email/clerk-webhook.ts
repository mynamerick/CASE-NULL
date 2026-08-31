export function primaryClerkEmail(user: {
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string | null;
}): string | null {
  const addresses = user.email_addresses ?? [];
  if (!addresses.length) return null;

  const primary = addresses.find((entry) => entry.id === user.primary_email_address_id);
  return (primary ?? addresses[0])?.email_address ?? null;
}

export function payerEmail(data: {
  payer?: {
    email?: string | null;
    first_name?: string | null;
  } | null;
}): { email: string; firstName?: string | null } | null {
  const email = data.payer?.email?.trim();
  if (!email) return null;
  return {
    email,
    firstName: data.payer?.first_name ?? null,
  };
}

export function isPremiumPlanSlug(planSlug?: string | null, freePlanSlug = "free_user"): boolean {
  return Boolean(planSlug && planSlug !== freePlanSlug);
}
