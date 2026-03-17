"use client";

import { useMemo } from "react";
import type { SalaryAfterTaxInputs } from "@/types/tax.types";
import { calculateSalaryAfterTax } from "@/lib/taxEngine";

export function useTaxCalculator(inputs: SalaryAfterTaxInputs) {
  return useMemo(() => {
    try {
      return { ok: true as const, data: calculateSalaryAfterTax(inputs) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [inputs]);
}

