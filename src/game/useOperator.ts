"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { FALLBACK_OPERATOR, buildOperator, type Operator } from "./operator";

/** The signed-in player, as the workstation refers to them. */
export function useOperator(): Operator {
  const { user, isLoaded } = useUser();

  return useMemo(() => {
    if (!isLoaded || !user) return FALLBACK_OPERATOR;
    return buildOperator({
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
    });
  }, [isLoaded, user]);
}
