import { redirect } from "next/navigation";
import { DEFAULT_CASE_ID } from "@/game/registry";

/** Legacy `/play` URL — always routes to the default case slug. */
export default function PlayIndexPage() {
  redirect(`/play/${DEFAULT_CASE_ID}`);
}
