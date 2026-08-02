import { useState, type FormEvent } from "react";
import { fmtDate, inr, today } from "@/lib/khata";
import { useDeleteLoan, useLoans, useSaveLoan } from "@/hooks/useKhata";

const field = "num w-full border border-input bg-background px-2 py-1.5 text-sm";
const lbl = "block text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function Udhaar() {
  const { data: loans = [] } = useLoans();
  const save = useSaveLoan();
  const del = useDeleteLoan();
  const [date, setDate] = useState(today());
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const pending = loans.filter((l) => !l.returned).reduce((s, l) => s + l.amount, 0);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!person.trim() || !Number.isFinite(value) || value <= 0) return;
    await save.mutateAsync({
      ...(editId ? { id: editId } : {}),
      lent_on: date,
      person: person.trim(),
      amount: value,
      note: note.trim() || null,
    });
    setPerson("");
    setAmount("");
    setNote("");
    setEditId(null);
  }

  return (
    <section className="paper p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Money lent (Udhaar)</h2>
        <p className="num text-sm">
          <span className="text-muted-foreground">Pending </span>
          <span className={pending > 0 ? "text-ink-red" : "text-ink-green"}>{inr(pending)}</span>
        </p>
      </div>

      <form onSubmit={submit} className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="l-date" className={lbl}>
            Date
          </label>
          <input
            id="l-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field + " mt-1"}
          />
        </div>
        <div>
          <label htmlFor="l-person" className={lbl}>
            Person
          </label>
          <input
            id="l-person"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            maxLength={80}
            required
            className={field + " mt-1 font-sans"}
          />
        </div>
        <div>
          <label htmlFor="l-amt" className={lbl}>
            Amount (₹)
          </label>
          <input
            id="l-amt"
            type="number"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={field + " mt-1"}
          />
        </div>
        <div>
          <label htmlFor="l-note" className={lbl}>
            Note
          </label>
          <input
            id="l-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={140}
            className={field + " mt-1 font-sans"}
          />
        </div>
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="border border-brass bg-brass px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {editId ? "Save changes" : "Add entry"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setPerson("");
                setAmount("");
                setNote("");
              }}
              className="border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-4 divide-y divide-border/60">
        {loans.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
            <span className="num text-muted-foreground">{fmtDate(l.lent_on)}</span>
            <span className="font-medium">{l.person}</span>
            <span className="num">{inr(l.amount)}</span>
            {l.note && <span className="text-muted-foreground">{l.note}</span>}
            <span
              className={
                "border px-2 py-0.5 text-[11px] uppercase tracking-wide " +
                (l.returned ? "border-ink-green text-ink-green" : "border-ink-red text-ink-red")
              }
            >
              {l.returned ? "Returned" : "Pending"}
            </span>
            <span className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={() => save.mutate({ id: l.id, returned: !l.returned })}
                className="text-xs underline underline-offset-2"
              >
                {l.returned ? "Mark pending" : "Mark returned"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditId(l.id);
                  setDate(l.lent_on);
                  setPerson(l.person);
                  setAmount(String(l.amount));
                  setNote(l.note ?? "");
                }}
                className="text-xs underline underline-offset-2"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => del.mutate(l.id)}
                className="text-xs text-ink-red underline underline-offset-2"
              >
                Delete
              </button>
            </span>
          </li>
        ))}
        {loans.length === 0 && (
          <li className="py-4 text-sm text-muted-foreground">Nothing lent out.</li>
        )}
      </ul>
    </section>
  );
}
