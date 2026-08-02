import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = { id: string; name: string; monthly_budget: number };
export type Expense = {
  id: string;
  spent_on: string;
  description: string;
  amount: number;
  payment_mode: string;
  category_id: string | null;
};
export type Loan = {
  id: string;
  lent_on: string;
  person: string;
  amount: number;
  note: string | null;
  returned: boolean;
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,monthly_budget")
        .order("name");
      if (error) throw error;
      return (data ?? []).map((c) => ({ ...c, monthly_budget: Number(c.monthly_budget) }));
    },
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id,spent_on,description,amount,payment_mode,category_id")
        .order("spent_on", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((e) => ({ ...e, amount: Number(e.amount) }));
    },
  });
}

export function useLoans() {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async (): Promise<Loan[]> => {
      const { data, error } = await supabase
        .from("loans")
        .select("id,lent_on,person,amount,note,returned")
        .order("lent_on", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l) => ({ ...l, amount: Number(l.amount) }));
    },
  });
}

function useInvalidate(key: string) {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [key] });
}

export function useAddExpense() {
  const done = useInvalidate("expenses");
  return useMutation({
    mutationFn: async (row: Omit<Expense, "id">) => {
      const { error } = await supabase.from("expenses").insert({ ...row, user_id: await uid() });
      if (error) throw error;
    },
    onSuccess: done,
  });
}

export function useDeleteExpense() {
  const done = useInvalidate("expenses");
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: done,
  });
}

export function useSaveCategory() {
  const done = useInvalidate("categories");
  return useMutation({
    mutationFn: async (c: { id?: string; name: string; monthly_budget: number }) => {
      if (c.id) {
        const { error } = await supabase
          .from("categories")
          .update({ name: c.name, monthly_budget: c.monthly_budget })
          .eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("categories")
          .insert({ name: c.name, monthly_budget: c.monthly_budget, user_id: await uid() });
        if (error) throw error;
      }
    },
    onSuccess: done,
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useSaveLoan() {
  const done = useInvalidate("loans");
  return useMutation({
    mutationFn: async (l: Partial<Loan> & { id?: string }) => {
      if (l.id) {
        const { id, ...rest } = l;
        const { error } = await supabase.from("loans").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("loans").insert({
          lent_on: l.lent_on!,
          person: l.person!,
          amount: l.amount!,
          note: l.note ?? null,
          user_id: await uid(),
        });
        if (error) throw error;
      }
    },
    onSuccess: done,
  });
}

export function useDeleteLoan() {
  const done = useInvalidate("loans");
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("loans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: done,
  });
}
