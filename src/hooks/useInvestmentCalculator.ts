"use client";

import { useMemo } from "react";
import { calculateInvestmentReturn } from "@/lib/investment";

export function useInvestmentCalculator(inputs: {
  initialPrincipal: string;
  annualReturnRatePercent: string;
  monthlyContribution?: string;
  years: string;
}) {
  return useMemo(() => {
    try {
      return { ok: true as const, data: calculateInvestmentReturn(inputs) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [inputs]);
}

