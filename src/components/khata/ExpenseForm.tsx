import { useState, type FormEvent } from "react";
import { PAYMENT_MODES, today } from "@/lib/khata";
import { useAddExpense, type Category } from "@/hooks/useKhata";

const field = "num mt-1 w-full border border-input bg-background px-2 py-1.5 text-sm";
const lbl = "block text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function ExpenseForm({ categories }: { categories: Category[] }) {
  const add = useAddExpense();
  const [date, setDate] = useState(today());
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<string>("Cash");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    await add.mutateAsync({
      spent_on: date,
      category_id: categoryId || categories[0]?.id || null,
      description: description.trim(),
      amount: value,
      payment_mode: mode,
    });
    setDescription("");
    setAmount("");
  }

  return (
    <section className="paper p-4">
      <h2 className="text-lg font-semibold">Add entry</h2>
      <form onSubmit={submit} className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="e-date" className={lbl}>
            Date
          </label>
          <input
            id="e-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="e-cat" className={lbl}>
            Category
          </label>
          <select
            id="e-cat"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={field + " font-sans"}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label htmlFor="e-desc" className={lbl}>
            Description
          </label>
          <input
            id="e-desc"
            type="text"
            maxLength={120}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={field + " font-sans"}
          />
        </div>
        <div>
          <label htmlFor="e-amt" className={lbl}>
            Amount (₹)
          </label>
          <input
            id="e-amt"
            type="number"
            min="0"
            step="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="e-mode" className={lbl}>
            Payment mode
          </label>
          <select
            id="e-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className={field + " font-sans"}
          >
            {PAYMENT_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            disabled={add.isPending}
            className="border border-brass bg-brass px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            Add entry
          </button>
        </div>
      </form>
    </section>
  );
}
