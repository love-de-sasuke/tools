"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { ResultCard } from "@/components/ResultCard";
import { US_STATES } from "@/config/constants";
import { calculateSalaryAfterTax } from "@/lib/taxEngine";

export function SalaryAfterTaxOverviewTool() {
  const [salary, setSalary] = useState("100000");
  const [stateCode, setStateCode] = useState("CA");

  const stateName = useMemo(() => US_STATES.find((s) => s.code === stateCode)?.name ?? stateCode, [stateCode]);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        data: calculateSalaryAfterTax({ grossAnnualSalaryUSD: salary, stateCode, filingStatus: "single" })
      };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid inputs" };
    }
  }, [salary, stateCode]);

  return (
    <section className="card p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Quick estimate</h2>
          <p className="mt-1 text-sm text-slate-600">Pick a state and salary to get an instant take-home estimate.</p>
        </div>
        <Link
          href={`/salary-after-tax/${stateCode.toLowerCase()}`}
          className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-700"
        >
          Open {stateCode} page →
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <InputField
            label="Gross annual salary"
            name="grossAnnualSalaryUSD"
            value={salary}
            onChange={setSalary}
            suffix="USD"
            helperText="Annualized estimate."
          />

          <div className="space-y-1">
            <label className="label" htmlFor="stateCode">
              State
            </label>
            <select
              id="stateCode"
              name="stateCode"
              className="input"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            <p className="muted">Open the state page for details and FAQs.</p>
          </div>

          {result.ok ? null : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
              {result.error}
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-3">
          {result.ok ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard title={`Net annual (${stateCode})`} value={result.data.netAnnual} subtitle={`Estimated for ${stateName}`} />
                <ResultCard title="Net monthly" value={result.data.netMonthly} subtitle="Net annual ÷ 12" />
                <ResultCard title="Effective tax rate" value={result.data.effectiveTaxRate} subtitle="Total taxes ÷ gross" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-slate-600">Federal</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{result.data.federalTax}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-slate-600">Payroll (FICA)</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{result.data.ficaTax}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-slate-600">State (simplified)</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{result.data.stateTax}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
              Enter a valid salary to compute an estimate.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
