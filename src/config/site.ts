export const siteConfig = {
  name: "Finance Calculator Hub",
  shortName: "FinanceHub",
  domain: "financecalculatorhub.com",
  url: "https://financecalculatorhub.com",
  language: "en-US",
  locale: "en_US",
  twitterHandle: "@FinanceCalcHub",
  defaultOgImage: "/images/og-default.png",
  organization: {
    name: "Finance Calculator Hub",
    legalName: "Finance Calculator Hub",
    contactEmail: "support@financecalculatorhub.com"
  },
  brand: {
    primaryColor: "#4f46e5"
  }
} as const;

export type SiteConfig = typeof siteConfig;

