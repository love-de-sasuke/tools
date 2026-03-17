import Link from "next/link";

export function DisclaimerNotice() {
  return (
    <aside aria-label="Financial disclaimer" className="card p-4 bg-slate-50">
      <p className="text-sm text-slate-700">
        <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes and does not constitute
        financial, tax, or legal advice. Results can vary based on assumptions, lender policies, and jurisdiction. For
        personalized guidance, consult a qualified professional. See our{" "}
        <Link className="text-brand-700 hover:text-brand-800" href="/disclaimer">
          full disclaimer
        </Link>
        .
      </p>
    </aside>
  );
}

