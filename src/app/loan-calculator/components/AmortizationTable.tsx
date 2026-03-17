"use client";

import type { AmortizationRow } from "@/types/loan.types";

export function AmortizationTable({ schedule }: { schedule: AmortizationRow[] }) {
  return (
    <section className="card p-4">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Amortization schedule</h2>
        <span className="text-xs text-slate-500">{schedule.length.toLocaleString("en-US")} payments</span>
      </header>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs text-slate-600">
              <th className="sticky left-0 bg-white py-2 pr-4">#</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Payment</th>
              <th className="py-2 pr-4">Principal</th>
              <th className="py-2 pr-4">Interest</th>
              <th className="py-2 pr-4">Extra</th>
              <th className="py-2 pr-0">Balance</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {schedule.slice(0, 360).map((r) => (
              <tr key={`${r.period}-${r.dateISO}`} className="border-t border-slate-200">
                <td className="sticky left-0 bg-white py-2 pr-4 font-medium text-slate-800">{r.period}</td>
                <td className="py-2 pr-4 text-slate-700">{r.dateISO}</td>
                <td className="py-2 pr-4 text-slate-900">{r.payment}</td>
                <td className="py-2 pr-4 text-slate-700">{r.principalPaid}</td>
                <td className="py-2 pr-4 text-slate-700">{r.interestPaid}</td>
                <td className="py-2 pr-4 text-slate-700">{r.extraPayment}</td>
                <td className="py-2 pr-0 text-slate-900">{r.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > 360 ? (
        <p className="mt-3 text-xs text-slate-500">
          Showing first 360 rows for performance. Export/download can be added without changing calculation logic.
        </p>
      ) : null}
    </section>
  );
}

