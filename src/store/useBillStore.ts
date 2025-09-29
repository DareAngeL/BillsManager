
import { create } from "zustand";
import { BillData } from "../types/types";

interface BillStore {
  bills: { [group: string]: BillData[] };
  setBills: (bills: { [group: string]: BillData[] }) => void;
  selectedBillId: string;
  setSelectedBillId: (id: string) => void;
}

const useBillStore = create<BillStore>((set) => ({
  bills: {} as { [group: string]: BillData[] },
  setBills: (bills: { [group: string]: BillData[] }) => set({ bills }),
  selectedBillId: '' as string,
  setSelectedBillId: (id: string) => set({ selectedBillId: id })
}))

export default useBillStore;