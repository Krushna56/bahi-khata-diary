import { useState } from "react";
import { inr } from "@/lib/khata";
import { useDeleteCategory, useSaveCategory, type Category } from "@/hooks/useKhata";

export function BudgetStamps({
  categories,
  spentByCat,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  spentByCat: Record<string, number>;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const save = useSaveCategory();
  const del = useDeleteCategory();
  const [newName, setNewName] = useState("");

  return (
    <section className="paper p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budgets</h2>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="border border-border bg-background px-3 py-1 text-xs"
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {!editing && (
        <div className="mt-4 flex flex-wrap gap-5">
          {categories.map((c) => {
            const spent = spentByCat[c.id] ?? 0;
            const pct = c.monthly_budget > 0 ? Math.round((spent / c.monthly_budget) * 100) : 0;
            const over = c.monthly_budget > 0 && spent > c.monthly_budget;
            return (
              <div key={c.id} className="w-[6.5rem]">
                <div className={"stamp " + (over ? "text-ink-red" : "text-brass")}>
                  <span className="num text-lg font-bold leading-none">
                    {c.monthly_budget > 0 ? `${pct}%` : "—"}
                  </span>
                  <span className="mt-1 max-w-[4.5rem] truncate text-[10px] font-semibold uppercase tracking-wide">
                    {c.name}
                  </span>
                </div>
                <p className="num mt-2 text-center text-[11px] text-muted-foreground">
                  {inr(spent)} / {inr(c.monthly_budget)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="mt-4 space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`n-${c.id}`}>
                Category name
              </label>
              <input
                id={`n-${c.id}`}
                defaultValue={c.name}
                onBlur={(e) =>
                  e.target.value.trim() &&
                  e.target.value !== c.name &&
                  save.mutate({ id: c.id, name: e.target.value.trim(), monthly_budget: c.monthly_budget })
                }
                className="flex-1 border border-input bg-background px-2 py-1 text-sm"
              />
              <label className="sr-only" htmlFor={`b-${c.id}`}>
                Monthly budget for {c.name}
              </label>
              <input
                id={`b-${c.id}`}
                type="number"
                min="0"
                defaultValue={c.monthly_budget}
                onBlur={(e) =>
                  save.mutate({ id: c.id, name: c.name, monthly_budget: Number(e.target.value) || 0 })
                }
                className="num w-28 border border-input bg-background px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => del.mutate(c.id)}
                className="text-xs text-ink-red underline underline-offset-2"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <label className="sr-only" htmlFor="new-cat">
              New category name
            </label>
            <input
              id="new-cat"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category"
              className="flex-1 border border-input bg-background px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (!newName.trim()) return;
                save.mutate({ name: newName.trim(), monthly_budget: 0 });
                setNewName("");
              }}
              className="border border-brass bg-brass px-3 py-1 text-xs text-primary-foreground"
            >
              Add category
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
