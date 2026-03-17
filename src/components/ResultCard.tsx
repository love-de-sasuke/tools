import { ReactNode } from "react";

export function ResultCard(props: { title: string; value: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <section className="card p-4" aria-label={props.title}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-700">{props.title}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{props.value}</div>
          {props.subtitle ? <div className="mt-1 text-xs text-slate-600">{props.subtitle}</div> : null}
        </div>
        {props.icon ? <div className="text-slate-500">{props.icon}</div> : null}
      </div>
    </section>
  );
}

