export type BillData = {
  id: string;
  title: string;
  tag: string;
  amount: number;
  isPaid: boolean;
};

export type GlobalContext = {
  HomeContext: HomeContext;
};

export type HomeContext = {
  activeGroup: string | undefined;
  setActiveGroup: React.Dispatch<React.SetStateAction<string | undefined>>;
}