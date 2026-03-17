import Decimal from "decimal.js";
import { z } from "zod";
import usaTaxData from "@/data/tax/usa.json";
import type { SalaryAfterTaxInputs, SalaryAfterTaxResult, UsTaxData } from "@/types/tax.types";
import { moneyUSD, percent, toDecimal } from "@/lib/utils";

const TaxInputSchema = z.object({
  grossAnnualSalaryUSD: z.string().min(1),
  stateCode: z.string().min(2).max(2),
  filingStatus: z.literal("single")
});

const data: UsTaxData = usaTaxData as unknown as UsTaxData;

function progressiveTax(taxableIncome: Decimal, brackets: { upTo: number | null; rate: number }[]): Decimal {
  let remaining = taxableIncome.max(0);
  let lastCap = new Decimal(0);
  let tax = new Decimal(0);

  for (const b of brackets) {
    if (remaining.lte(0)) break;
    const cap = b.upTo == null ? null : new Decimal(b.upTo);
    const rate = new Decimal(b.rate);

    const slice = cap == null ? remaining : Decimal.min(remaining, cap.sub(lastCap).max(0));
    tax = tax.add(slice.mul(rate));
    remaining = remaining.sub(slice);
    if (cap != null) lastCap = cap;
  }

  return tax;
}

function ficaTax(grossAnnual: Decimal): Decimal {
  const socialSecurityRate = new Decimal("0.062");
  const medicareRate = new Decimal("0.0145");
  const additionalMedicareRate = new Decimal("0.009");
  const additionalThresholdSingle = new Decimal("200000");
  const wageBase = new Decimal("168600");

  const ssTax = Decimal.min(grossAnnual, wageBase).mul(socialSecurityRate);
  const medicare = grossAnnual.mul(medicareRate);
  const additional = grossAnnual.gt(additionalThresholdSingle)
    ? grossAnnual.sub(additionalThresholdSingle).mul(additionalMedicareRate)
    : new Decimal(0);

  return ssTax.add(medicare).add(additional);
}

export function calculateSalaryAfterTax(raw: SalaryAfterTaxInputs): SalaryAfterTaxResult {
  const parsed = TaxInputSchema.parse(raw);
  const grossAnnual = toDecimal(parsed.grossAnnualSalaryUSD, { maxDp: 2 });
  if (grossAnnual.lt(0)) throw new Error("Salary must be 0 or greater");

  const status = parsed.filingStatus;
  const stdDeduction = new Decimal(data.federal.standardDeduction[status] ?? 0);
  const brackets = data.federal.brackets[status] ?? [];
  const federal = progressiveTax(grossAnnual.sub(stdDeduction).max(0), brackets);

  const fica = ficaTax(grossAnnual);

  const stateRateEntry = data.state.rates[parsed.stateCode.toUpperCase()];
  const stateRate = stateRateEntry?.type === "flat" ? new Decimal(stateRateEntry.rate) : new Decimal(0);
  const stateTax = grossAnnual.mul(stateRate);

  const totalTax = federal.add(fica).add(stateTax);
  const netAnnual = grossAnnual.sub(totalTax).max(0);
  const netMonthly = netAnnual.div(12);
  const effective = grossAnnual.eq(0) ? new Decimal(0) : totalTax.div(grossAnnual);

  return {
    grossAnnual: moneyUSD(grossAnnual),
    federalTax: moneyUSD(federal),
    ficaTax: moneyUSD(fica),
    stateTax: moneyUSD(stateTax),
    netAnnual: moneyUSD(netAnnual),
    netMonthly: moneyUSD(netMonthly),
    effectiveTaxRate: percent(effective, { dp: 2 })
  };
}

