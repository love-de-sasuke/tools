import Link from "next/link";
import { buildMetadata, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact Finance Calculator Hub for support, corrections, or partnership inquiries.",
  pathname: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={jsonLdWebPage({
          name: "Contact",
          description: "Contact page for Finance Calculator Hub.",
          pathname: "/contact"
        })}
      />
      <section className="card p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Contact</h1>
        <p className="mt-2 text-slate-700">
          For support, corrections, or partnerships, email{" "}
          <Link className="text-brand-700 hover:text-brand-800" href={`mailto:${siteConfig.organization.contactEmail}`}>
            {siteConfig.organization.contactEmail}
          </Link>
          .
        </p>
      </section>
    </>
  );
}

