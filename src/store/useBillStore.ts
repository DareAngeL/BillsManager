
import { create } from "zustand";
import { BillData } from "../types/types";

interface BillsOptimisticAction {
  type: 'delete' | 'delete-group' | 'update' | 'add-group';
  id?: string;
  data?: {
    name: string;
    value?: string | number | boolean;
  };
}

interface BillStore {
  bills: { [group: string]: BillData[] };
  optimisticBills: { [group: string]: BillData[] };
  setBills: (bills: { [group: string]: BillData[] }) => void;
  updateOptimisticBills: (action: BillsOptimisticAction, activeGroup: string) => void;
  selectedBillId: string;
  setSelectedBillId: (id: string) => void;
}

const useBillStore = create<BillStore>((set, get) => ({
  bills: {} as { [group: string]: BillData[] },
  optimisticBills: {} as { [group: string]: BillData[] },
  setBills: (bills: { [group: string]: BillData[] }) => 
    set({ bills, optimisticBills: bills }),
  updateOptimisticBills: (action: BillsOptimisticAction, activeGroup: string) => {
    const { optimisticBills } = get();
    let newOptimisticBills = { ...optimisticBills };

    if (action.type === 'delete-group' && action.data) {
      delete newOptimisticBills[action.data.name || ''];
    }

    if (action.type === 'delete') {
      const updatedActiveBill = newOptimisticBills[activeGroup]?.filter(bill => bill.id !== action.id) || [];
      newOptimisticBills = {
        ...newOptimisticBills,
        [activeGroup]: updatedActiveBill,
      };
    }

    if (action.type === 'update') {
      if (!action.data) {
        return;
      }

      const updatedActiveBill = newOptimisticBills[activeGroup]?.map(bill => {
        if (bill.id === action.id) {
          if (action.data && action.data.value !== undefined) {
            return { ...bill, [action.data.name]: action.data.value };
          }
          return bill;
        }
        return bill;
      }) || [];

      newOptimisticBills = {
        ...newOptimisticBills,
        [activeGroup]: updatedActiveBill,
      };
    }

    if (action.type === 'add-group') {
      if (!action.data) {
        return;
      }

      newOptimisticBills = {
        ...newOptimisticBills,
        [action.data.name]: [],
      };
    }

    set({ optimisticBills: newOptimisticBills });
  },
  selectedBillId: '' as string,
  setSelectedBillId: (id: string) => set({ selectedBillId: id })
}))

export default useBillStore;