export type InvestmentInputs = {
  initialPrincipal: string;
  annualReturnRatePercent: string;
  monthlyContribution?: string;
  years: string;
};

export type InvestmentSummary = {
  finalValue: string;
  totalContributions: string;
  totalGrowth: string;
  annualReturnRate: string;
};

