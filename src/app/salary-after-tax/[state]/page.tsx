import Link from "next/link";
import { buildMetadata, jsonLdFaqPage, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";
import { US_STATES } from "@/config/constants";
import { SalaryAfterTaxOverviewTool } from "./components/SalaryAfterTaxOverviewTool";

export const metadata = buildMetadata({
  title: "Salary After Tax Calculator (USA by State)",
  description:
    "Estimate take-home pay (net income) after federal payroll taxes and a simplified state income tax model. Browse all 50 state pages.",
  pathname: "/salary-after-tax"
});

export default function SalaryAfterTaxIndexPage() {
  const faq = [
    {
      question: "Why are there separate pages per state?",
      answer:
        "Each state page uses the state’s tax model from our dataset and includes unique intro content and internal links for easy comparison."
    },
    {
      question: "Is this a full payroll calculator?",
      answer:
        "No. This tool provides an annualized estimate using simplified assumptions. Real net pay depends on pay frequency, deductions, benefits, and withholding elections."
    }
  ];

  return (
    <>
      <JsonLd
        data={[
          jsonLdWebPage({
            name: "Salary After Tax (USA by State)",
            description: "State-by-state salary after tax pages with structured data and internal navigation.",
            pathname: "/salary-after-tax"
          }),
          jsonLdSoftwareApp({
            name: "Salary After Tax Calculator (USA)",
            description: "Estimate take-home pay with federal + payroll + simplified state income tax model.",
            pathname: "/salary-after-tax",
            applicationCategory: "FinanceApplication"
          }),
          jsonLdFaqPage({ items: faq })
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Salary After Tax (USA)</h1>
        <p className="text-slate-700">
          Choose a state to view a dedicated, SEO-optimized page with a take-home pay estimate. This is an educational
          estimate — always verify against official tax guidance and your pay stub.
        </p>
      </header>

      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <SalaryAfterTaxOverviewTool />
      </div>

      <section className="mt-10 card p-6">
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

      <article className="prose prose-slate mt-12 max-w-none">
        <h2>FAQs</h2>
        <dl>
          {faq.map((f) => (
            <div key={f.question} className="not-prose mt-4 rounded-2xl border border-slate-200 p-4">
              <dt className="font-semibold text-slate-900">{f.question}</dt>
              <dd className="mt-2 text-slate-700">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </article>
    </>
  );
}

