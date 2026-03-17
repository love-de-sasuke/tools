import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">{siteConfig.name}</div>
            <p className="mt-2 text-sm text-slate-600">
              Fast, privacy-friendly financial calculators with transparent formulas and educational explanations.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">Calculators</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/loan-calculator">
                  Loan calculator
                </Link>
              </li>
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/credit-card-payoff-calculator">
                  Credit card payoff
                </Link>
              </li>
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/salary-after-tax">
                  Salary after tax
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">Company</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/disclaimer">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link className="text-slate-700 no-underline hover:text-slate-900" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {siteConfig.organization.legalName}. All rights reserved.</div>
          <div>
            Educational content only. Use at your own risk.{" "}
            <Link className="text-slate-600 no-underline hover:text-slate-800" href="/disclaimer">
              Read the disclaimer
            </Link>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}

