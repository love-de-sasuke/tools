import Decimal from "decimal.js";
import { z } from "zod";
import { moneyUSD, toDecimal } from "@/lib/utils";
import type { AmortizationRow, LoanResult } from "@/types/loan.types";

Decimal.set({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -30,
  toExpPos: 30
});

const LoanInputSchema = z.object({
  principal: z.string().min(1),
  annualInterestRatePercent: z.string().min(1),
  termYears: z.string().min(1),
  extraMonthlyPayment: z.string().optional(),
  startDateISO: z.string().optional()
});

function addMonthsUTC(date: Date, months: number): Date {
  const d = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  const candidate = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(
    Date.UTC(
      candidate.getUTCFullYear(),
      candidate.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();
  candidate.setUTCDate(Math.min(day, lastDay));
  return candidate;
}

function toISODateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateLoan(raw: unknown): LoanResult {
  const parsed = LoanInputSchema.parse(raw);

  const principal = toDecimal(parsed.principal, { maxDp: 2 });
  if (principal.lte(0)) {
    throw new Error("Principal must be greater than 0");
  }

  const aprPercent = toDecimal(
    parsed.annualInterestRatePercent,
    { maxDp: 6 }
  );
  if (aprPercent.lt(0) || aprPercent.gt(100)) {
    throw new Error("APR must be between 0 and 100");
  }

  const years = toDecimal(parsed.termYears, { maxDp: 6 });
  if (years.lte(0) || years.gt(100)) {
    throw new Error("Term must be between 0 and 100 years");
  }

  const extra = parsed.extraMonthlyPayment
    ? toDecimal(parsed.extraMonthlyPayment, { maxDp: 2 })
    : new Decimal(0);
  if (extra.lt(0)) {
    throw new Error("Extra payment cannot be negative");
  }

  const startDate = parsed.startDateISO
    ? new Date(`${parsed.startDateISO}T00:00:00.000Z`)
    : new Date();
  if (Number.isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }

  const months = years
    .mul(12)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  if (months.lte(0)) {
    throw new Error("Term must be at least 1 month");
  }

  const monthlyRate = aprPercent.div(100).div(12);

  const baseMonthlyPayment = (() => {
    if (monthlyRate.eq(0)) {
      return principal.div(months);
    }
    const onePlusR = monthlyRate.add(1);
    const pow = onePlusR.pow(months);
    return principal
      .mul(monthlyRate.mul(pow))
      .div(pow.sub(1));
  })().toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = new Decimal(0);
  let totalPaid = new Decimal(0);
  let period = 0;

  const ZERO = new Decimal(0);

  for (let i = 1; i <= months.toNumber(); i++) {
    if (balance.lte(0)) break;
    period += 1;

    const interest = monthlyRate.eq(0)
      ? ZERO
      : balance.mul(monthlyRate);

    const scheduledPayment = baseMonthlyPayment;
    const extraPayment = extra;

    const paymentCap = balance.add(interest);
    const rawPayment = scheduledPayment.add(extraPayment);

    const payment = Decimal.min(rawPayment, paymentCap)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    const interestPaid = Decimal.min(interest, payment)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    const principalPaid = payment
      .sub(interestPaid)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    balance = balance
      .sub(principalPaid)
      .toDecimalPlaces(10, Decimal.ROUND_HALF_UP);

    if (balance.abs().lt(new Decimal("0.005"))) {
      balance = ZERO;
    }

    totalInterest = totalInterest.add(interestPaid);
    totalPaid = totalPaid.add(payment);

    const date = addMonthsUTC(startDate, period);

    // ✅ FIXED: use Decimal.max() static method
    const extraActual = Decimal.min(
      extraPayment,
      Decimal.max(payment.sub(scheduledPayment), ZERO)
    );

    // ✅ FIXED: use Decimal.max() static method
    const safeBalance = Decimal.max(balance, ZERO);

    schedule.push({
      period,
      dateISO: toISODateUTC(date),
      payment: moneyUSD(payment),
      principalPaid: moneyUSD(principalPaid),
      interestPaid: moneyUSD(interestPaid),
      extraPayment: moneyUSD(extraActual),
      balance: moneyUSD(safeBalance)
    });
  }

  const payoffDateISO = schedule.length
    ? schedule[schedule.length - 1].dateISO
    : toISODateUTC(startDate);

  return {
    summary: {
      monthlyPayment: moneyUSD(baseMonthlyPayment),
      totalInterest: moneyUSD(totalInterest),
      totalPaid: moneyUSD(totalPaid),
      payoffDateISO
    },
    schedule
  };
}
