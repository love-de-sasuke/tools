import Link from "next/link";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/loan-calculator", label: "Loan" },
  { href: "/credit-card-payoff-calculator", label: "Credit Card Payoff" },
  { href: "/refinance-calculator", label: "Refinance" },
  { href: "/investment-return-calculator", label: "Investment" },
  { href: "/salary-after-tax", label: "Salary After Tax" },
  { href: "/blog", label: "Blog" }
] as const;

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="no-underline">
          <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">F</span>
            {siteConfig.shortName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-700 no-underline hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/loan-calculator"
            className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm hover:bg-brand-700"
          >
            Start Calculating
          </Link>
        </div>
      </div>
    </header>
  );
}

