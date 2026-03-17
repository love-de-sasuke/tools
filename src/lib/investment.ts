import Decimal from "decimal.js";
import { z } from "zod";
import { moneyUSD, percent, toDecimal } from "@/lib/utils";

const InvestmentSchema = z.object({
  initialPrincipal: z.string().min(1),
  annualReturnRatePercent: z.string().min(1),
  monthlyContribution: z.string().optional(),
  years: z.string().min(1)
});

export type InvestmentResult = {
  finalValue: string;
  totalContributions: string;
  totalGrowth: string;
  annualReturnRate: string;
};

export function calculateInvestmentReturn(raw: unknown): InvestmentResult {
  const parsed = InvestmentSchema.parse(raw);

  const principal = toDecimal(parsed.initialPrincipal, { maxDp: 2 });
  const apr = toDecimal(parsed.annualReturnRatePercent, { maxDp: 6 }).div(100);
  const years = toDecimal(parsed.years, { maxDp: 6 });
  const contrib = parsed.monthlyContribution ? toDecimal(parsed.monthlyContribution, { maxDp: 2 }) : new Decimal(0);

  if (principal.lt(0) || contrib.lt(0)) throw new Error("Amounts must be non-negative");
  if (years.lte(0) || years.gt(100)) throw new Error("Years must be between 0 and 100");
  if (apr.lt(-0.99) || apr.gt(10)) throw new Error("Return rate out of range");

  const months = years.mul(12).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const r = apr.div(12);

  let value = principal;
  let totalContrib = principal;

  for (let i = 0; i < months.toNumber(); i++) {
    value = value.mul(r.add(1));
    value = value.add(contrib);
    totalContrib = totalContrib.add(contrib);
  }

  const growth = value.sub(totalContrib);
  return {
    finalValue: moneyUSD(value),
    totalContributions: moneyUSD(totalContrib),
    totalGrowth: moneyUSD(growth),
    annualReturnRate: percent(apr)
  };
}

