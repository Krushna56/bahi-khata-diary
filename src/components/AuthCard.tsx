import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AuthCard() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setErr(error.message);
      else if (!data.session) setMsg("Check your email to confirm the account, then sign in.");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="paper ruled px-6 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Bahi-Khata</h1>
        <p className="mt-1 text-sm text-muted-foreground">Daily expense and lending ledger.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="num mt-1 w-full border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="num mt-1 w-full border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {err && <p className="text-sm text-ink-red">{err}</p>}
          {msg && <p className="text-sm text-ink-green">{msg}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full border border-brass bg-brass px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setErr(null);
            setMsg(null);
          }}
          className="mt-4 text-sm underline underline-offset-4"
        >
          {mode === "in" ? "Create an account" : "I already have an account"}
        </button>
      </div>
    </main>
  );
}
