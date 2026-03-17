import dynamic from "next/dynamic";
import {
  buildMetadata,
  jsonLdFaqPage,
  jsonLdSoftwareApp,
  jsonLdWebPage
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerNotice } from "@/components/DisclaimerNotice";

const LoanCalculatorClient = dynamic(
  () =>
    import("./components/LoanCalculatorClient").then(
      (m) => m.LoanCalculatorClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="card p-6 text-slate-600">Loading calculator…</div>
    )
  }
);

export const metadata = buildMetadata({
  title: "Loan Calculator (Payment & Amortization Schedule)",
  description:
    "Calculate monthly loan payments, total interest, and a full amortization schedule. Transparent formula explanation and FAQs included.",
  pathname: "/loan-calculator",
  ogType: "website"
});

const faq = [
  {
    question: "How is the monthly loan payment calculated?",
    answer:
      "For fixed-rate loans, the standard amortization formula computes a constant payment that pays off principal and interest over the full term. If the interest rate is 0%, the payment equals principal divided by total months."
  },
  {
    question: "What does an amortization schedule show?",
    answer:
      "An amortization schedule breaks down each payment into principal and interest and shows how the remaining balance decreases over time."
  },
  {
    question: "Do extra payments reduce total interest?",
    answer:
      "Yes. Making extra payments toward principal reduces the outstanding balance faster, lowering total interest and shortening the payoff period."
  }
];

export default function LoanCalculatorPage() {
  const jsonLd = [
    jsonLdWebPage({
      name: "Loan Calculator",
      description:
        "Loan payment calculator with amortization schedule and transparent formula explanation.",
      pathname: "/loan-calculator"
    }),
    jsonLdSoftwareApp({
      name: "Loan Calculator",
      description:
        "Compute monthly loan payment, total interest, and full amortization schedule.",
      pathname: "/loan-calculator",
      applicationCategory: "FinanceApplication"
    }),
    jsonLdFaqPage({ items: faq })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Loan Calculator
        </h1>
        <p className="text-slate-700 max-w-3xl">
          Estimate your monthly payment, total interest paid, and view a full
          amortization schedule. This calculator is designed for educational
          and planning purposes only and does not constitute financial advice.
        </p>
      </header>

      <section className="mt-8 space-y-6">
        <DisclaimerNotice />
        <LoanCalculatorClient />
      </section>

      <article className="prose prose-slate mt-14 max-w-none">
        <h2>How the Loan Payment Formula Works</h2>

        <p>
          For a fixed-rate installment loan, the monthly payment is calculated
          using a standard amortization formula.
        </p>

        <p>
          Let:
        </p>

        <ul>
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
          <li><strong>n</strong> = Total number of payments (years × 12)</li>
        </ul>

        <p>The monthly payment formula is:</p>

        <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm">
M = P × r × (1 + r)^n / ((1 + r)^n − 1)
        </pre>

        <p>
          If the interest rate is zero, the formula simplifies to:
        </p>

        <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm">
M = P / n
        </pre>

        <h2>What Is an Amortization Schedule?</h2>

        <p>
          An amortization schedule shows how each payment is divided between
          interest and principal over the life of the loan. In the early
          months, a larger portion of each payment goes toward interest.
          Over time, more of each payment reduces the principal balance.
        </p>

        <h2>Frequently Asked Questions</h2>

        <div className="space-y-6">
          {faq.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.question}
              </h3>
              <p className="mt-2 text-slate-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
