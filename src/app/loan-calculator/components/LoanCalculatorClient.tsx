"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { calculateLoan } from "@/lib/loan";
import type { LoanInputs } from "@/types/loan.types";
import { InputField } from "@/components/InputField";
import { ResultCard } from "@/components/ResultCard";
import { AmortizationTable } from "./AmortizationTable";

const LoanChart = dynamic(() => import("./LoanChart").then((m) => m.LoanChart), {
  ssr: false
});

const todayISO = new Date().toISOString().slice(0, 10);

const defaultInputs: LoanInputs = {
  principal: "300000",
  annualInterestRatePercent: "6.5",
  termYears: "30",
  extraMonthlyPayment: "0",
  startDateISO: todayISO
};

export function LoanCalculatorClient() {
  const [inputs, setInputs] = useState<LoanInputs>(defaultInputs);
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => {
    try {
      return { ok: true as const, data: calculateLoan(inputs) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [inputs]);

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <div className="card p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
          }}
        >
          <InputField
            label="Loan amount"
            name="principal"
            value={inputs.principal}
            onChange={(v) => {
              setTouched(true);
              setInputs((p) => ({ ...p, principal: v }));
            }}
            placeholder="e.g., 300000"
            helperText="Principal (amount borrowed)."
            suffix="USD"
          />

          <InputField
            label="Interest rate (APR)"
            name="annualInterestRatePercent"
            value={inputs.annualInterestRatePercent}
            onChange={(v) => {
              setTouched(true);
              setInputs((p) => ({ ...p, annualInterestRatePercent: v }));
            }}
            placeholder="e.g., 6.5"
            helperText="Annual percentage rate."
            suffix="%"
          />

          <InputField
            label="Term"
            name="termYears"
            value={inputs.termYears}
            onChange={(v) => {
              setTouched(true);
              setInputs((p) => ({ ...p, termYears: v }));
            }}
            placeholder="e.g., 30"
            helperText="Loan length in years."
            suffix="yrs"
          />

          <InputField
            label="Extra monthly payment"
            name="extraMonthlyPayment"
            value={inputs.extraMonthlyPayment ?? "0"}
            onChange={(v) => {
              setTouched(true);
              setInputs((p) => ({ ...p, extraMonthlyPayment: v }));
            }}
            placeholder="e.g., 0"
            helperText="Extra amount applied to principal each month."
            suffix="USD"
          />

          <div className="space-y-1">
            <label className="label" htmlFor="startDateISO">
              Start date
            </label>
            <input
              id="startDateISO"
              name="startDateISO"
              className="input"
              type="date"
              value={inputs.startDateISO ?? todayISO}
              onChange={(e) => {
                setTouched(true);
                setInputs((p) => ({ ...p, startDateISO: e.target.value }));
              }}
            />
            <p className="muted">Used for schedule dates. Calculation assumes monthly payments.</p>
          </div>

          {result.ok ? null : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
              {result.error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Recalculate
          </button>
        </form>
      </div>

      <div className="space-y-6 lg:col-span-3">
        {result.ok ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard title="Monthly payment" value={result.data.summary.monthlyPayment} subtitle="Base payment (excludes extra)" />
              <ResultCard title="Total interest" value={result.data.summary.totalInterest} subtitle="Over full payoff period" />
              <ResultCard title="Payoff date" value={result.data.summary.payoffDateISO} subtitle="Estimated final payment month" />
            </div>

            <LoanChart schedule={result.data.schedule} />
            <AmortizationTable schedule={result.data.schedule} />
          </>
        ) : (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <p className="mt-2 text-slate-700">Enter valid values to see payment, chart, and amortization schedule.</p>
          </div>
        )}

        {!touched ? (
          <p className="text-xs text-slate-500">
            Tip: add an extra monthly payment to see how payoff date and interest change.
          </p>
        ) : null}
      </div>
    </section>
  );
}

