export type Wallet = {
  id: string;
  name: string;
  currency: string;
  balance_cents: number;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  created_at: string;
};

export type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount_cents: number;
  note: string | null;
  date: string;
  created_at: string;
  wallet_id: string;
  category_id: string;

  // view extras:
  wallet_name: string;
  category_name: string;
};

export type Investment = {
  id: string;
  wallet_id: string;
  name: string;
  type: string;
  amount_invested_cents: number;
  current_value_cents: number;
  started_at: string;
  created_at: string;
};
