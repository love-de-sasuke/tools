import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { US_STATES } from "@/config/constants";
import { buildMetadata, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import usaTaxData from "@/data/tax/usa.json";
import type { UsTaxData } from "@/types/tax.types";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

const SalaryAfterTaxClient = dynamic(() => import("./components/SalaryAfterTaxClient").then((m) => m.SalaryAfterTaxClient), {
  ssr: false,
  loading: () => <div className="card p-6">Loading calculator…</div>
});

export function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.code.toLowerCase() }));
}

function getState(stateParam: string) {
  const code = stateParam.toUpperCase();
  const state = US_STATES.find((s) => s.code === code);
  if (!state) return null;
  return state;
}

function stateIntro(stateCode: string, stateName: string) {
  const data = usaTaxData as unknown as UsTaxData;
  const entry = data.state.rates[stateCode];
  const model =
    entry?.type === "none"
      ? `${stateName} has no state income tax in this simplified model, so take-home pay is mostly driven by federal and payroll taxes.`
      : `${stateName} is modeled with a simplified flat state income tax rate in addition to federal and payroll taxes.`;

  return `${model} Use this page to sanity-check net pay, compare scenarios, and understand what drives your effective tax rate.`;
}

export function generateMetadata({ params }: { params: { state: string } }) {
  const state = getState(params.state);
  if (!state) return {};
  return buildMetadata({
    title: `Salary After Tax Calculator: ${state.name} (${state.code})`,
    description: stateIntro(state.code, state.name).slice(0, 155),
    pathname: `/salary-after-tax/${state.code.toLowerCase()}`
  });
}

export default function SalaryAfterTaxStatePage({ params }: { params: { state: string } }) {
  const state = getState(params.state);
  if (!state) return notFound();

  const jsonLd = [
    jsonLdWebPage({
      name: `Salary After Tax: ${state.name}`,
      description: `Estimate take-home pay in ${state.name} using a fast, educational tax model.`,
      pathname: `/salary-after-tax/${state.code.toLowerCase()}`
    }),
    jsonLdSoftwareApp({
      name: `Salary After Tax Calculator (${state.code})`,
      description: `Estimate net income after taxes for ${state.name}.`,
      pathname: `/salary-after-tax/${state.code.toLowerCase()}`,
      applicationCategory: "FinanceApplication"
    })
  ];

  const neighbors = (() => {
    const idx = US_STATES.findIndex((s) => s.code === state.code);
    const prev = US_STATES[(idx - 1 + US_STATES.length) % US_STATES.length];
    const next = US_STATES[(idx + 1) % US_STATES.length];
    return { prev, next };
  })();

  return (
    <>
      <JsonLd data={jsonLd} />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Salary After Tax in {state.name} ({state.code})
        </h1>
        <p className="text-slate-700">{stateIntro(state.code, state.name)}</p>
      </header>

      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <SalaryAfterTaxClient stateCode={state.code} stateName={state.name} />
      </div>

      <section className="mt-10 card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Explore other states</h2>
        <p className="mt-1 text-sm text-slate-600">Internal links help discovery and let users compare scenarios.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/salary-after-tax/${neighbors.prev.code.toLowerCase()}`}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50"
          >
            ← {neighbors.prev.name}
          </Link>
          <Link
            href={`/salary-after-tax/${neighbors.next.code.toLowerCase()}`}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50"
          >
            {neighbors.next.name} →
          </Link>
          <Link
            href="/salary-after-tax"
            className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-700"
          >
            All states
          </Link>
        </div>
      </section>
    </>
  );
}

