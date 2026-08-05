import { useMemo, useState } from "react";
import { fmtDate, inr, monthRange } from "@/lib/khata";
import { useDeleteExpense, type Category, type Expense } from "@/hooks/useKhata";

export function LedgerTable({
  expenses,
  categories,
  month,
  categoryId,
  onClearCategory,
}: {
  expenses: Expense[];
  categories: Category[];
  month: string;
  categoryId?: string | null;
  onClearCategory?: () => void;
}) {
  const [scope, setScope] = useState<"month" | "all">("month");
  const [q, setQ] = useState("");
  const del = useDeleteExpense();
  const names = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const rows = useMemo(() => {
    const { start, end } = monthRange(month);
    const term = q.trim().toLowerCase();
    return expenses.filter((e) => {
      if (categoryId && e.category_id !== categoryId) return false;
      if (scope === "month" && (e.spent_on < start || e.spent_on > end)) return false;
      if (!term) return true;
      const cat = (e.category_id && names[e.category_id]) || "";
      return (
        e.description.toLowerCase().includes(term) || cat.toLowerCase().includes(term)
      );
    });
  }, [expenses, scope, q, month, names, categoryId]);

  const total = rows.reduce((s, e) => s + e.amount, 0);

  return (
    <section id="ledger" className="paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Ledger</h2>
        <div className="flex gap-2">
          {(["month", "all"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              aria-pressed={scope === s}
              className={
                "border px-3 py-1 text-xs " +
                (scope === s
                  ? "border-brass bg-brass text-primary-foreground"
                  : "border-border bg-background")
              }
            >
              {s === "month" ? "This month" : "All history"}
            </button>
          ))}
        </div>
      </div>

      {categoryId && (
        <div className="mt-3 flex items-center gap-2 border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs">
          <span>
            Showing only <strong>{names[categoryId] ?? "category"}</strong>
          </span>
          <button
            type="button"
            onClick={onClearCategory}
            className="ml-auto underline underline-offset-2"
          >
            Clear filter
          </button>
        </div>
      )}


      <label htmlFor="search" className="sr-only">
        Search entries
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search description or category"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mt-3 w-full border border-input bg-background px-2 py-1.5 text-sm"
      />

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">Mode</th>
              <th className="py-2 pr-3 text-right font-medium">Amount</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-border/60">
                <td className="num py-2 pr-3 whitespace-nowrap">{fmtDate(e.spent_on)}</td>
                <td className="py-2 pr-3">{(e.category_id && names[e.category_id]) || "—"}</td>
                <td className="py-2 pr-3">{e.description || "—"}</td>
                <td className="py-2 pr-3 text-muted-foreground">{e.payment_mode}</td>
                <td className="num py-2 pr-3 text-right">{inr(e.amount)}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => del.mutate(e.id)}
                    className="text-xs text-ink-red underline underline-offset-2"
                    aria-label={`Delete entry ${e.description || fmtDate(e.spent_on)}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                  No entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="num mt-3 text-right text-sm">
        <span className="text-muted-foreground">Shown total </span>
        {inr(total)}
      </p>
    </section>
  );
}
