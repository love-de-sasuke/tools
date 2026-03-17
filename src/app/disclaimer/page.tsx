import { buildMetadata, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Financial calculators and content are provided for educational purposes only. Read our full YMYL disclaimer and limitations.",
  pathname: "/disclaimer",
  noIndex: false
});

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd
        data={jsonLdWebPage({
          name: "Disclaimer",
          description: "Financial and tax disclaimer for an educational calculator platform.",
          pathname: "/disclaimer"
        })}
      />

      <article className="prose prose-slate max-w-none">
        <h1>Disclaimer</h1>
        <p>
          Finance Calculator Hub provides calculators, articles, and tools for <strong>educational</strong> and{" "}
          <strong>informational</strong> purposes only. Nothing on this site constitutes financial, investment, tax, or
          legal advice.
        </p>
        <h2>No professional relationship</h2>
        <p>
          Use of this site does not create a client, advisory, fiduciary, or professional relationship. You should
          consult a qualified professional for advice tailored to your circumstances.
        </p>
        <h2>Accuracy and assumptions</h2>
        <p>
          Results are estimates based on the inputs you provide and on simplified assumptions. Rates, fees, deductions,
          rounding policies, lender servicing rules, tax law changes, and payroll policies can materially change the
          outcome.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Finance Calculator Hub and its operators disclaim all liability for
          any loss or damages arising from reliance on information or results obtained through the site.
        </p>
        <h2>Third-party links and affiliate relationships</h2>
        <p>
          We may link to third-party services or products. If affiliate links are present, we may earn a commission at
          no additional cost to you. We aim to present information fairly and transparently.
        </p>
      </article>
    </>
  );
}

