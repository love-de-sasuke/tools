export type FilingStatus = "single";

export type FederalBracket = {
  upTo: number | null;
  rate: number;
};

export type UsTaxData = {
  schemaVersion: number;
  country: "USA";
  currency: "USD";
  year: number;
  filingStatuses: FilingStatus[];
  federal: {
    standardDeduction: Record<FilingStatus, number>;
    brackets: Record<FilingStatus, FederalBracket[]>;
  };
  state: {
    model: "flat_or_none";
    rates: Record<string, { type: "flat" | "none"; rate: number }>;
  };
};

export type SalaryAfterTaxInputs = {
  grossAnnualSalaryUSD: string;
  stateCode: string;
  filingStatus: FilingStatus;
};

export type SalaryAfterTaxResult = {
  grossAnnual: string;
  federalTax: string;
  ficaTax: string;
  stateTax: string;
  netAnnual: string;
  netMonthly: string;
  effectiveTaxRate: string;
};

