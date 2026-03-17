import { buildMetadata, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

export const metadata = buildMetadata({
  title: "Investment Return Calculator (Compound + Contributions)",
  description:
    "Estimate investment growth with compound returns and monthly contributions. Fast, transparent, and structured for SEO.",
  pathname: "/investment-return-calculator"
});

export default function InvestmentReturnCalculatorPage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Investment Return Calculator",
      description: "Compound growth calculator with monthly contributions.",
      pathname: "/investment-return-calculator"
    }),
    jsonLdSoftwareApp({
      name: "Investment Return Calculator",
      description: "Estimate investment growth over time with contributions.",
      pathname: "/investment-return-calculator",
      applicationCategory: "FinanceApplication"
    })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Investment Return Calculator</h1>
        <p className="text-slate-700">This route is production-wired for metadata + JSON‑LD. Next step is implementing compounding logic in `src/lib/investment.ts`.</p>
      </header>
      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <section className="card p-6">
          <p className="text-slate-700">Investment returns are uncertain; the final calculator will model scenarios (conservative/base/aggressive) with clear assumptions.</p>
        </section>
      </div>
    </>
  );
}

