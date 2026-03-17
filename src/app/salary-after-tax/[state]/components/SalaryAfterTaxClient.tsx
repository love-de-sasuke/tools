"use client";

import { useMemo, useState } from "react";
import { calculateSalaryAfterTax } from "@/lib/taxEngine";
import { InputField } from "@/components/InputField";
import { ResultCard } from "@/components/ResultCard";

export function SalaryAfterTaxClient(props: { stateCode: string; stateName: string }) {
  const [salary, setSalary] = useState("100000");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        data: calculateSalaryAfterTax({ grossAnnualSalaryUSD: salary, stateCode: props.stateCode, filingStatus: "single" })
      };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [salary, props.stateCode]);

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <div className="card p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
        <div className="mt-4 space-y-4">
          <InputField
            label="Gross annual salary"
            name="grossAnnualSalaryUSD"
            value={salary}
            onChange={setSalary}
            placeholder="e.g., 100000"
            helperText={`Estimated take-home pay for ${props.stateName}.`}
            suffix="USD"
          />

          {result.ok ? null : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
              {result.error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-3">
        {result.ok ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard title="Net annual (estimate)" value={result.data.netAnnual} subtitle="After federal + payroll + state model" />
              <ResultCard title="Net monthly (estimate)" value={result.data.netMonthly} subtitle="Net annual ÷ 12" />
              <ResultCard title="Effective tax rate" value={result.data.effectiveTaxRate} subtitle="Total taxes ÷ gross" />
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900">Tax breakdown</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <dt className="text-sm font-medium text-slate-700">Federal income tax (estimate)</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-900">{result.data.federalTax}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <dt className="text-sm font-medium text-slate-700">Payroll taxes (FICA)</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-900">{result.data.ficaTax}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <dt className="text-sm font-medium text-slate-700">State income tax (simplified)</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-900">{result.data.stateTax}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <dt className="text-sm font-medium text-slate-700">Gross annual</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-900">{result.data.grossAnnual}</dd>
                </div>
              </dl>
            </div>
          </>
        ) : (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <p className="mt-2 text-slate-700">Enter a valid salary to compute an estimate.</p>
          </div>
        )}
      </div>
    </section>
  );
}

