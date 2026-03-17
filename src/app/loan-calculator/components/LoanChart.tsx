"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { AmortizationRow } from "@/types/loan.types";
import { ChartWrapper } from "@/components/ChartWrapper";

type Point = { i: number; date: string; balance: number };

function parseUSD(formatted: string): number {
  const n = Number(formatted.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function LoanChart({ schedule }: { schedule: AmortizationRow[] }) {
  const points: Point[] = schedule
    .filter((_, idx) => idx % 3 === 0 || idx === schedule.length - 1)
    .map((r) => ({
      i: r.period,
      date: r.dateISO,
      balance: parseUSD(r.balance)
    }));

  return (
    <ChartWrapper title="Remaining balance over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={28} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(v))
            }
          />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value))}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

