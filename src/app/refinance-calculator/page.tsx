import { buildMetadata, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

export const metadata = buildMetadata({
  title: "Refinance Break-even Calculator",
  description:
    "Estimate refinance break-even point based on rates, term, and closing costs. Built for fast SSR, structured data, and E‑E‑A‑T.",
  pathname: "/refinance-calculator"
});

export default function RefinanceCalculatorPage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Refinance Break-even Calculator",
      description: "Estimate refinance break-even and monthly savings.",
      pathname: "/refinance-calculator"
    }),
    jsonLdSoftwareApp({
      name: "Refinance Break-even Calculator",
      description: "Compute refinance break-even based on savings and closing costs.",
      pathname: "/refinance-calculator",
      applicationCategory: "FinanceApplication"
    })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Refinance Break-even Calculator</h1>
        <p className="text-slate-700">This page is SEO-ready. Next step is implementing refinance math in `src/lib/refinance.ts` and UI.</p>
      </header>
      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <section className="card p-6">
          <p className="text-slate-700">Break-even calculations vary by loan type, fees, and amortization method; the final engine will include edge-case validation and transparent assumptions.</p>
        </section>
      </div>
    </>
  );
}

