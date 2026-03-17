import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { canonicalPath } from "@/lib/utils";

export type OpenGraphType = "website" | "article";

export type SeoInput = {
  title: string;
  description: string;
  pathname: string;
  ogType?: OpenGraphType;
  imagePath?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata(input: SeoInput): Metadata {
  const url = new URL(siteConfig.url);
  url.pathname = canonicalPath(input.pathname);

  const title = input.title.includes(siteConfig.name) ? input.title : `${input.title} | ${siteConfig.name}`;
  const description = input.description.slice(0, 155);
  const imageUrl = new URL(input.imagePath ?? siteConfig.defaultOgImage, siteConfig.url).toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: { canonical: url.toString() },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.ogType ?? "website",
      title,
      description,
      url: url.toString(),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: input.title }],
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [imageUrl]
    }
  };
}

export type JsonLdThing = Record<string, unknown>;

export function jsonLdWebPage(input: {
  name: string;
  description: string;
  pathname: string;
}): JsonLdThing {
  const url = new URL(siteConfig.url);
  url.pathname = canonicalPath(input.pathname);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: url.toString(),
    inLanguage: siteConfig.language,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      url: siteConfig.url
    }
  };
}

export function jsonLdSoftwareApp(input: {
  name: string;
  description: string;
  pathname: string;
  applicationCategory: "FinanceApplication" | "BusinessApplication";
}): JsonLdThing {
  const url = new URL(siteConfig.url);
  url.pathname = canonicalPath(input.pathname);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    applicationCategory: input.applicationCategory,
    operatingSystem: "Web",
    url: url.toString(),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      url: siteConfig.url
    }
  };
}

export type FaqItem = { question: string; answer: string };

export function jsonLdFaqPage(input: { items: FaqItem[] }): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer }
    }))
  };
}

