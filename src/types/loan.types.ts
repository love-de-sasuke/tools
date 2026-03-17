export type LoanInputs = {
  principal: string;
  annualInterestRatePercent: string;
  termYears: string;
  extraMonthlyPayment?: string;
  startDateISO?: string;
};

export type LoanSummary = {
  monthlyPayment: string;
  totalInterest: string;
  totalPaid: string;
  payoffDateISO: string;
};

export type AmortizationRow = {
  period: number;
  dateISO: string;
  payment: string;
  principalPaid: string;
  interestPaid: string;
  extraPayment: string;
  balance: string;
};

export type LoanResult = {
  summary: LoanSummary;
  schedule: AmortizationRow[];
};

