import { Workstation } from "@/components/os/Workstation";
import { DEFAULT_CASE_ID } from "@/game/registry";

export default function PlayPage() {
  return <Workstation caseId={DEFAULT_CASE_ID} />;
}
