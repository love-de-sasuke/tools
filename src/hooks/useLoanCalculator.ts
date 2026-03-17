"use client";

import { useMemo } from "react";
import type { LoanInputs } from "@/types/loan.types";
import { calculateLoan } from "@/lib/loan";

export function useLoanCalculator(inputs: LoanInputs) {
  return useMemo(() => {
    try {
      return { ok: true as const, data: calculateLoan(inputs) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [inputs]);
}

