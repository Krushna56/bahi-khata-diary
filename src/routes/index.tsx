import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { AuthCard } from "@/components/AuthCard";
import { ExpenseForm } from "@/components/khata/ExpenseForm";
import { LedgerTable } from "@/components/khata/LedgerTable";
import { BudgetStamps } from "@/components/khata/BudgetStamps";
import { Udhaar } from "@/components/khata/Udhaar";
import { useCategories, useExpenses } from "@/hooks/useKhata";
import { inr, monthKey, monthLabel, monthRange, shiftMonth } from "@/lib/khata";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bahi-Khata — Daily Expense & Udhaar Ledger" },
      {
        name: "description",
        content:
          "A traditional ledger-style tracker for daily expenses, monthly category budgets and money lent to others, all in rupees.",
      },
      { property: "og:title", content: "Bahi-Khata — Daily Expense & Udhaar Ledger" },
      {
        property: "og:description",
        content:
          "Track daily expenses, monthly budgets and udhaar in a simple ledger book, with everything in rupees.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { session, loading } = useSession();
  if (loading) return <div className="min-h-screen" />;
  if (!session) return <AuthCard />;
  return <Khata email={session.user.email ?? ""} />;
}

function Khata({ email }: { email: string }) {
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const { data: categories = [] } = useCategories();
  const { data: expenses = [] } = useExpenses();

  const { spentByCat, spent, budget } = useMemo(() => {
    const { start, end } = monthRange(month);
    const byCat: Record<string, number> = {};
    let sum = 0;
    for (const e of expenses) {
      if (e.spent_on < start || e.spent_on > end) continue;
      sum += e.amount;
      if (e.category_id) byCat[e.category_id] = (byCat[e.category_id] ?? 0) + e.amount;
    }
    return {
      spentByCat: byCat,
      spent: sum,
      budget: categories.reduce((s, c) => s + c.monthly_budget, 0),
    };
  }, [expenses, categories, month]);

  const remaining = budget - spent;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bahi-Khata</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, -1))}
              aria-label="Previous month"
              className="border border-border bg-background px-2 py-1 text-sm"
            >
              ‹
            </button>
            <span className="num min-w-[9rem] text-center text-sm font-medium">
              {monthLabel(month)}
            </span>
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, 1))}
              aria-label="Next month"
              className="border border-border bg-background px-2 py-1 text-sm"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="ml-2 border border-border bg-background px-3 py-1 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="paper ruled grid grid-cols-3 gap-4 p-4">
            {[
              ["Total budget", inr(budget), ""],
              ["Total spent", inr(spent), ""],
              ["Remaining", inr(remaining), remaining < 0 ? "text-ink-red" : "text-ink-green"],
            ].map(([label, value, cls]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className={`num mt-1 text-xl font-bold ${cls}`}>{value}</p>
              </div>
            ))}
          </section>

          <BudgetStamps
            categories={categories}
            spentByCat={spentByCat}
            selectedId={catFilter}
            onSelect={(id) => {
              setCatFilter(id);
              if (id) document.getElementById("ledger")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <LedgerTable
            expenses={expenses}
            categories={categories}
            month={month}
            categoryId={catFilter}
            onClearCategory={() => setCatFilter(null)}
          />
        </div>

        <aside className="space-y-6">
          <ExpenseForm categories={categories} />
          <Udhaar />
        </aside>
      </main>
    </div>
  );
}
