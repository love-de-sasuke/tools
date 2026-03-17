import Decimal from "decimal.js";
import { z } from "zod";
import { moneyUSD, toDecimal } from "@/lib/utils";

const DebtSchema = z.object({
  name: z.string().min(1),
  balance: z.string().min(1),
  aprPercent: z.string().min(1),
  minMonthlyPayment: z.string().min(1)
});

const PayoffSchema = z.object({
  debts: z.array(DebtSchema).min(1),
  extraMonthlyBudget: z.string().optional(),
  strategy: z.enum(["snowball", "avalanche"])
});

export type PayoffInputs = z.infer<typeof PayoffSchema>;

export type PayoffSummary = {
  monthsToDebtFree: number;
  totalInterestPaid: string;
  totalPaid: string;
};

export type PayoffMonthRow = {
  month: number;
  totalBalanceUSD: number;
};

export function calculateCreditCardPayoff(raw: unknown): PayoffSummary {
  const parsed = PayoffSchema.parse(raw);
  const extraBudget = parsed.extraMonthlyBudget ? toDecimal(parsed.extraMonthlyBudget, { maxDp: 2 }) : new Decimal(0);
  if (extraBudget.lt(0)) throw new Error("Extra budget cannot be negative");

  const debts = parsed.debts.map((d) => {
    const balance = toDecimal(d.balance, { maxDp: 2 });
    const apr = toDecimal(d.aprPercent, { maxDp: 6 }).div(100);
    const minPay = toDecimal(d.minMonthlyPayment, { maxDp: 2 });
    if (balance.lte(0) || apr.lt(0) || apr.gt(5) || minPay.lte(0)) throw new Error("Invalid debt inputs");
    return { name: d.name, balance, apr, minPay };
  });

  const order = (items: typeof debts) => {
    if (parsed.strategy === "snowball") return [...items].sort((a, b) => a.balance.comparedTo(b.balance));
    return [...items].sort((a, b) => b.apr.comparedTo(a.apr));
  };

  let month = 0;
  let totalInterest = new Decimal(0);
  let totalPaid = new Decimal(0);
  const maxMonths = 1000;

  let working = debts.map((d) => ({ ...d }));

  while (month < maxMonths) {
    const active = working.filter((d) => d.balance.gt(0));
    if (active.length === 0) break;
    month += 1;

    for (const d of active) {
      const monthlyRate = d.apr.div(12);
      const interest = d.balance.mul(monthlyRate);
      d.balance = d.balance.add(interest);
      totalInterest = totalInterest.add(interest);
    }

    let remainingExtra = extraBudget;
    const prioritized = order(active);

    for (const d of prioritized) {
      if (d.balance.lte(0)) continue;
      const basePay = Decimal.min(d.minPay, d.balance);
      d.balance = d.balance.sub(basePay);
      totalPaid = totalPaid.add(basePay);

      if (remainingExtra.gt(0) && d.balance.gt(0)) {
        const extraPay = Decimal.min(remainingExtra, d.balance);
        d.balance = d.balance.sub(extraPay);
        remainingExtra = remainingExtra.sub(extraPay);
        totalPaid = totalPaid.add(extraPay);
      }
    }
  }

  if (month >= maxMonths) throw new Error("Payoff did not converge; increase payments or reduce debt list.");

  return {
    monthsToDebtFree: month,
    totalInterestPaid: moneyUSD(totalInterest),
    totalPaid: moneyUSD(totalPaid)
  };
}

export function calculateCreditCardPayoffSeries(raw: unknown, opts?: { sampleEveryMonths?: number }) {
  const parsed = PayoffSchema.parse(raw);
  const extraBudget = parsed.extraMonthlyBudget ? toDecimal(parsed.extraMonthlyBudget, { maxDp: 2 }) : new Decimal(0);

  const debts = parsed.debts.map((d) => {
    const balance = toDecimal(d.balance, { maxDp: 2 });
    const apr = toDecimal(d.aprPercent, { maxDp: 6 }).div(100);
    const minPay = toDecimal(d.minMonthlyPayment, { maxDp: 2 });
    return { name: d.name, balance, apr, minPay };
  });

  const order = (items: typeof debts) => {
    if (parsed.strategy === "snowball") return [...items].sort((a, b) => a.balance.comparedTo(b.balance));
    return [...items].sort((a, b) => b.apr.comparedTo(a.apr));
  };

  const rows: PayoffMonthRow[] = [];
  const sampleEvery = Math.max(1, opts?.sampleEveryMonths ?? 1);
  const maxMonths = 1000;
  let month = 0;
  let working = debts.map((d) => ({ ...d }));

  const totalBalance = () => working.reduce((acc, d) => acc.add(d.balance.max(0)), new Decimal(0));
  rows.push({ month: 0, totalBalanceUSD: totalBalance().toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber() });

  while (month < maxMonths) {
    const active = working.filter((d) => d.balance.gt(0));
    if (active.length === 0) break;
    month += 1;

    for (const d of active) {
      const monthlyRate = d.apr.div(12);
      d.balance = d.balance.add(d.balance.mul(monthlyRate));
    }

    let remainingExtra = extraBudget;
    const prioritized = order(active);
    for (const d of prioritized) {
      if (d.balance.lte(0)) continue;
      const basePay = Decimal.min(d.minPay, d.balance);
      d.balance = d.balance.sub(basePay);
      if (remainingExtra.gt(0) && d.balance.gt(0)) {
        const extraPay = Decimal.min(remainingExtra, d.balance);
        d.balance = d.balance.sub(extraPay);
        remainingExtra = remainingExtra.sub(extraPay);
      }
    }

    if (month % sampleEvery === 0) {
      rows.push({ month, totalBalanceUSD: totalBalance().toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber() });
    }
  }

  if (rows[rows.length - 1]?.totalBalanceUSD !== 0) {
    rows.push({ month, totalBalanceUSD: 0 });
  }

  return rows;
}

