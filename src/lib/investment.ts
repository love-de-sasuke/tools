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

export type InvestmentPoint = { month: number; dateISO: string; valueUSD: number; contributedUSD: number };

function addMonthsUTC(date: Date, months: number): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  const candidate = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(candidate.getUTCFullYear(), candidate.getUTCMonth() + 1, 0)).getUTCDate();
  candidate.setUTCDate(Math.min(day, lastDay));
  return candidate;
}

function toISODateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

export function calculateInvestmentSeries(raw: unknown, opts?: { startDateISO?: string; sampleEveryMonths?: number }) {
  const parsed = InvestmentSchema.parse(raw);
  const principal = toDecimal(parsed.initialPrincipal, { maxDp: 2 });
  const apr = toDecimal(parsed.annualReturnRatePercent, { maxDp: 6 }).div(100);
  const years = toDecimal(parsed.years, { maxDp: 6 });
  const contrib = parsed.monthlyContribution ? toDecimal(parsed.monthlyContribution, { maxDp: 2 }) : new Decimal(0);

  const months = years.mul(12).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const r = apr.div(12);
  const startDate = opts?.startDateISO ? new Date(`${opts.startDateISO}T00:00:00.000Z`) : new Date();
  const sampleEvery = Math.max(1, opts?.sampleEveryMonths ?? 1);

  let value = principal;
  let contributed = principal;

  const points: InvestmentPoint[] = [];
  points.push({
    month: 0,
    dateISO: toISODateUTC(startDate),
    valueUSD: value.toNumber(),
    contributedUSD: contributed.toNumber()
  });

  for (let i = 1; i <= months.toNumber(); i++) {
    value = value.mul(r.add(1)).add(contrib);
    contributed = contributed.add(contrib);
    if (i % sampleEvery === 0 || i === months.toNumber()) {
      const date = addMonthsUTC(startDate, i);
      points.push({
        month: i,
        dateISO: toISODateUTC(date),
        valueUSD: value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        contributedUSD: contributed.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
      });
    }
  }

  return points;
}

