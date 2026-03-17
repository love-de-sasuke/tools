import dynamic from "next/dynamic";
import { buildMetadata, jsonLdFaqPage, jsonLdSoftwareApp, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

const LoanCalculatorClient = dynamic(() => import("./components/LoanCalculatorClient").then((m) => m.LoanCalculatorClient), {
  ssr: false,
  loading: () => <div className="card p-6">Loading calculator…</div>
});

export const metadata = buildMetadata({
  title: "Loan Calculator (Payment & Amortization Schedule)",
  description:
    "Calculate monthly loan payments, total interest, and a full amortization schedule. Transparent formula explanation, FAQs, and downloadable insights.",
  pathname: "/loan-calculator",
  ogType: "website"
});

const faq = [
  {
    question: "How is the monthly loan payment calculated?",
    answer:
      "For fixed-rate loans, the standard amortization formula computes the constant payment that pays off principal plus interest over the term. If the rate is 0%, payment is principal divided by number of months."
  },
  {
    question: "What does an amortization schedule show?",
    answer:
      "An amortization schedule breaks each monthly payment into interest and principal and shows the remaining balance after each payment."
  },
  {
    question: "Do extra payments reduce interest?",
    answer:
      "Yes. Extra principal payments reduce the outstanding balance faster, which reduces future interest and can shorten the payoff date."
  }
];

export default function LoanCalculatorPage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Loan Calculator",
      description: "Loan payment calculator with amortization schedule and formula explanations.",
      pathname: "/loan-calculator"
    }),
    jsonLdSoftwareApp({
      name: "Loan Calculator",
      description: "Compute monthly payment, interest, and amortization schedule for a loan.",
      pathname: "/loan-calculator",
      applicationCategory: "FinanceApplication"
    }),
    jsonLdFaqPage({ items: faq })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Loan Calculator</h1>
        <p className="text-slate-700">
          Estimate monthly payment, total interest, and view a full amortization schedule. Use this for education and
          planning — not as personalized financial advice.
        </p>
      </header>

      <div className="mt-6 space-y-6">
        <DisclaimerNotice />
        <LoanCalculatorClient />
      </div>

      <article className="prose prose-slate mt-12 max-w-none">
        <h2>Formula (fixed-rate installment loan)</h2>
        <p>
          Let principal be \(P\), monthly interest rate be \(r\), and total number of payments be \(n\). The standard
          monthly payment \(M\) is:
        </p>
        <p>
          \[
          M = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}
          \]
        </p>
        <p>
          When \(r = 0\), the payment simplifies to \(M = P / n\).
        </p>

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

