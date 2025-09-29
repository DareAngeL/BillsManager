export type BillData = {
  id: string;
  title: string;
  tag: string;
  amount: number;
  isPaid: boolean;
};

export type GlobalContext = {
  activeGroup: string | undefined;
  setActiveGroup: React.Dispatch<React.SetStateAction<string | undefined>>;
};
