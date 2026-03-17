import Link from "next/link";
import { buildMetadata, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "Finance Calculators",
  description:
    "Free, fast finance calculators: loan amortization, credit card payoff strategies, refinancing break-even, investment returns, and salary after tax.",
  pathname: "/"
});

export default function HomePage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Finance calculators",
      description:
        "A hub of fast, SEO-optimized finance calculators with formula explanations and disclaimers for responsible use.",
      pathname: "/"
    }),
    jsonLdSoftwareApp({
      name: "Finance Calculator Hub",
      description: "A collection of finance calculators for educational use.",
      pathname: "/",
      applicationCategory: "FinanceApplication"
    })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Production-grade finance calculators built for speed and clarity
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Transparent formulas, amortization tables, FAQs, and structured data — designed for E‑E‑A‑T and Core Web
            Vitals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/loan-calculator"
              className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white no-underline shadow-sm hover:bg-brand-700"
            >
              Loan Calculator
            </Link>
            <Link
              href="/salary-after-tax"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 no-underline hover:bg-slate-50"
            >
              Salary After Tax
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Popular calculators</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link className="text-brand-700 no-underline hover:text-brand-800" href="/loan-calculator">
                Loan calculator (payment + amortization schedule)
              </Link>
            </li>
            <li>
              <Link className="text-brand-700 no-underline hover:text-brand-800" href="/credit-card-payoff-calculator">
                Credit card payoff (snowball vs avalanche)
              </Link>
            </li>
            <li>
              <Link className="text-brand-700 no-underline hover:text-brand-800" href="/refinance-calculator">
                Refinance break-even
              </Link>
            </li>
            <li>
              <Link className="text-brand-700 no-underline hover:text-brand-800" href="/investment-return-calculator">
                Investment return (compound + contributions)
              </Link>
            </li>
            <li>
              <Link className="text-brand-700 no-underline hover:text-brand-800" href="/salary-after-tax">
                Salary after tax (USA)
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

