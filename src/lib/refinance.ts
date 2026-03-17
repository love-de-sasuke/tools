import Decimal from "decimal.js";
import { z } from "zod";
import { moneyUSD, toDecimal } from "@/lib/utils";

const RefiSchema = z.object({
  currentMonthlyPayment: z.string().min(1),
  newMonthlyPayment: z.string().min(1),
  closingCosts: z.string().min(1)
});

export type RefinanceResult = {
  monthlySavings: string;
  breakEvenMonths: number;
  breakEvenDateEstimate: string;
};

export function calculateRefinanceBreakEven(raw: unknown): RefinanceResult {
  const parsed = RefiSchema.parse(raw);

  const current = toDecimal(parsed.currentMonthlyPayment, { maxDp: 2 });
  const next = toDecimal(parsed.newMonthlyPayment, { maxDp: 2 });
  const costs = toDecimal(parsed.closingCosts, { maxDp: 2 });

  if (current.lte(0) || next.lt(0) || costs.lt(0)) throw new Error("Invalid refinance inputs");

  const savings = current.sub(next);
  if (savings.lte(0)) {
    return {
      monthlySavings: moneyUSD(savings),
      breakEvenMonths: Number.POSITIVE_INFINITY,
      breakEvenDateEstimate: "No break-even (monthly payment not lower)"
    };
  }

  const months = costs.div(savings).toDecimalPlaces(0, Decimal.ROUND_CEIL).toNumber();
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + months);
  const iso = d.toISOString().slice(0, 10);

  return {
    monthlySavings: moneyUSD(savings),
    breakEvenMonths: months,
    breakEvenDateEstimate: iso
  };
}

