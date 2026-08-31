"use client";

import { useMemo } from "react";
import { getCase, DEFAULT_CASE_ID } from "@/game/registry";
import { useGame } from "@/game/store";
import type { Case, Person } from "@/game/types";

export function useActiveCase(): Case {
  const caseId = useGame((s) => s.caseId);
  return getCase(caseId ?? DEFAULT_CASE_ID);
}

export function usePeopleById(): Record<string, Person> {
  const activeCase = useActiveCase();
  return useMemo(
    () => Object.fromEntries(activeCase.people.map((person) => [person.id, person])),
    [activeCase],
  );
}
