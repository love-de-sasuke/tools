"use client";

import { ReactNode } from "react";

export function ChartWrapper(props: { title: string; children: ReactNode }) {
  return (
    <section className="card p-4">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-900">{props.title}</h2>
        <span className="text-xs text-slate-500">Interactive chart</span>
      </header>
      <div className="mt-4 h-64 w-full">{props.children}</div>
    </section>
  );
}

