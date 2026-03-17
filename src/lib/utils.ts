import Decimal from "decimal.js";

export function clampDecimal(value: Decimal, min: Decimal, max: Decimal): Decimal {
  if (value.lessThan(min)) return min;
  if (value.greaterThan(max)) return max;
  return value;
}

export function toDecimal(input: unknown, opts?: { maxDp?: number }): Decimal {
  const maxDp = opts?.maxDp ?? 12;
  if (input instanceof Decimal) return input.toDecimalPlaces(maxDp, Decimal.ROUND_HALF_UP);
  if (typeof input === "number") {
    if (!Number.isFinite(input)) throw new Error("Invalid number");
    return new Decimal(input).toDecimalPlaces(maxDp, Decimal.ROUND_HALF_UP);
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.length === 0) throw new Error("Empty input");
    if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) throw new Error("Invalid numeric string");
    return new Decimal(trimmed).toDecimalPlaces(maxDp, Decimal.ROUND_HALF_UP);
  }
  throw new Error("Unsupported input type");
}

export function moneyUSD(value: Decimal, opts?: { dp?: number }): string {
  const dp = opts?.dp ?? 2;
  const n = value.toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toNumber();
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: dp }).format(n);
}

export function percent(value: Decimal, opts?: { dp?: number }): string {
  const dp = opts?.dp ?? 2;
  const n = value.toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toNumber();
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: dp }).format(n);
}

export function canonicalPath(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p.replace(/\/+$/g, "") || "/";
}

