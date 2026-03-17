import { buildMetadata, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn how Finance Calculator Hub builds fast, transparent calculators with clear formulas, structured data, and responsible YMYL disclaimers.",
  pathname: "/about"
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={jsonLdWebPage({
          name: "About",
          description: "About the Finance Calculator Hub platform and its principles.",
          pathname: "/about"
        })}
      />
      <article className="prose prose-slate max-w-none">
        <h1>About Finance Calculator Hub</h1>
        <p>
          We build finance calculators for people who value clarity: transparent formulas, fast performance, and
          responsible financial guidance boundaries.
        </p>
        <h2>E‑E‑A‑T and YMYL principles</h2>
        <ul>
          <li>We separate calculation logic from UI and validate inputs carefully.</li>
          <li>We disclose assumptions and limitations alongside results.</li>
          <li>We add structured data to help search engines understand calculators and FAQs.</li>
        </ul>
      </article>
    </>
  );
}

