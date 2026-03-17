import { buildMetadata, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

export const metadata = buildMetadata({
  title: "Credit Card Payoff Calculator (Snowball vs Avalanche)",
  description:
    "Compare debt payoff strategies: snowball vs avalanche. Estimate payoff time and interest cost with transparent assumptions and FAQs.",
  pathname: "/credit-card-payoff-calculator"
});

export default function CreditCardPayoffCalculatorPage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Credit Card Payoff Calculator",
      description: "Compare snowball vs avalanche payoff strategies.",
      pathname: "/credit-card-payoff-calculator"
    }),
    jsonLdSoftwareApp({
      name: "Credit Card Payoff Calculator",
      description: "Estimate payoff time and interest for credit card debt.",
      pathname: "/credit-card-payoff-calculator",
      applicationCategory: "FinanceApplication"
    })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Credit Card Payoff Calculator</h1>
        <p className="text-slate-700">Snowball vs avalanche comparisons will live here (UI + logic modules in `src/lib/creditCard.ts`).</p>
      </header>
      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <section className="card p-6">
          <p className="text-slate-700">
            This route is wired for SEO, structured data, and monetization-friendly layout. Next step is implementing the payoff engine and UI components.
          </p>
        </section>
      </div>
    </>
  );
}

