export const inr = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y!, m! - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
};

export const monthRange = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  const start = `${key}-01`;
  const endDate = new Date(y!, m!, 0);
  const end = `${key}-${String(endDate.getDate()).padStart(2, "0")}`;
  return { start, end };
};

export const shiftMonth = (key: string, delta: number) => {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y!, m! - 1 + delta, 1));
};

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const PAYMENT_MODES = ["Cash", "Card", "UPI", "Net Banking", "Other"] as const;
