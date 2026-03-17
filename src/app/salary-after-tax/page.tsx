import Link from "next/link";
import { buildMetadata, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { US_STATES } from "@/config/constants";

export const metadata = buildMetadata({
  title: "Salary After Tax Calculator (USA by State)",
  description:
    "Estimate take-home pay (net income) after federal payroll taxes and a simplified state income tax model. Browse all 50 state pages.",
  pathname: "/salary-after-tax"
});

export default function SalaryAfterTaxIndexPage() {
  return (
    <>
      <JsonLd
        data={jsonLdWebPage({
          name: "Salary After Tax (USA by State)",
          description: "State-by-state salary after tax pages with structured data and internal navigation.",
          pathname: "/salary-after-tax"
        })}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Salary After Tax (USA)</h1>
        <p className="text-slate-700">
          Choose a state to view a dedicated, SEO-optimized page with a take-home pay estimate. This is an educational
          estimate — always verify against official tax guidance and your pay stub.
        </p>
      </header>

      <section className="mt-8 card p-6">
        <h2 className="text-lg font-semibold text-slate-900">All states</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {US_STATES.map((s) => (
            <Link
              key={s.code}
              href={`/salary-after-tax/${s.code.toLowerCase()}`}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50"
            >
              {s.name} ({s.code})
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

