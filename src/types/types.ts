export type BillData = {
  id: string;
  title: string;
  tag: string;
  amount: number;
  isPaid: boolean;
};

export type SortOption = 'none' | 'tag-asc' | 'tag-desc' | 'paid-first' | 'unpaid-first';