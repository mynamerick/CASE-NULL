import { notFound } from "next/navigation";
import { Workstation } from "@/components/os/Workstation";
import { isKnownCaseId } from "@/lib/progress-state";

export default async function PlayCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  if (!isKnownCaseId(caseId)) notFound();
  return <Workstation caseId={caseId} />;
}
