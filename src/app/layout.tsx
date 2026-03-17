import type { Metadata } from "next";
import "./../styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description:
    "Production-grade finance calculators with transparent formulas, structured data, and fast, SEO-optimized pages.",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  creator: siteConfig.organization.name,
  publisher: siteConfig.organization.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630, alt: siteConfig.name }]
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language}>
      <body>
        <Navbar />
        <main className="container-page py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

