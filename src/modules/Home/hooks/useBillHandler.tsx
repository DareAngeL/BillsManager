import { useEffect, useState } from "react";
import { BillData } from "../../../types/types";
import useOptimistic from "../../../hooks/useOptimistic";
import { deleteBill, getBills, getGroups, saveBill } from "../../../utils/util";
import useBillStore from "../../../store/useBillStore";
import useGroupStore from "../../../store/useGroupStore";
import { useEventAction } from "../../../hooks/useEventAction";
import { ActionSheetEvent } from "./useActionSheetHandler";
import useCustomToast from "../../../hooks/useToast";
import { GroupHandlerEvent } from "./useGroupHandler";
import eventBus from "../../../services/EventBus";

interface BillsOptimisticAction {
  type: 'delete' | 'delete-group' | 'update' | 'add-group';
  id?: string;
  data?: {
    name: string;
    value?: string | number | boolean;
  };
}

export enum BillHandlerEvent {
  ON_PRESS_BILL_CARD = 'press-bill-card',
  ON_PRESS_RESET_ALL_PAID = 'press-reset-all-paid',
}

const useBillHandler = () => {

  const { showNewToast } = useCustomToast();

  const { bills, setBills, selectedBillId, setSelectedBillId } = useBillStore();
  const { activeGroup, setActiveGroup, setGroups } = useGroupStore();

  const [billsData, updateBillsData] = useOptimistic(
    bills,
    (curr, action: BillsOptimisticAction) => {
      if (action.type === 'delete-group' && !action.data) {
        delete curr[action.data!.name || ''];
        return curr;
      }

      if (action.type === 'delete') {
        const updatedActiveBill = curr[activeGroup].filter(bill => bill.id !== action.id);
        return {
          ...curr,
          [activeGroup]: updatedActiveBill,
        }
      }

      if (action.type === 'update') {
        if (!action.data) {
          return curr;
        }

        const updatedActiveBill = curr[activeGroup].map(bill => {
          if (bill.id === action.id) {
            if (action.data && action.data.value !== undefined) {
              return { ...bill, [action.data.name]: action.data.value };
            }
            return bill;
          }
          return bill;
        });

        return {
          ...curr,
          [activeGroup]: updatedActiveBill,
        }
      }

      if (action.type === 'add-group') {
        if (!action.data) {
          return curr;
        }

        return {
          ...curr,
          [action.data.name]: [],
        }
      }

      return curr;
    },
  );

  useEffect(() => {
    const fetchBills = async () => {
      const _groups = await getGroups();
      setGroups(_groups ?? []);

      if (_groups.length > 0) {
        setBills(await getBills() || {});
        setActiveGroup(activeGroup || _groups?.[0] || '');
      }
    };

    fetchBills();
  }, []);

  useEventAction(ActionSheetEvent.ON_PAID_BILL, async () => {
    // Handle paid action
    updateBillsData({
      type: 'update',
      id: selectedBillId,
      data: { name: 'isPaid', value: true },
    });
    updateBillsData({
      type: 'update',
      id: selectedBillId,
      data: { name: 'amount', value: 0 },
    });

    // the actual update function
    const billToUpdate = billsData[activeGroup].find(bill => bill.id === selectedBillId);
    let isSaved = false;
    if (billToUpdate) {
      isSaved = await saveBill(activeGroup, {
        ...billToUpdate,
        isPaid: true,
        amount: 0,
      });
    }

    setSelectedBillId('');
    if (isSaved) {
      showNewToast('Paid Success', 'Mark the bill as paid successfully');
    } else {
      showNewToast('Error', 'Failed to mark the bill as paid', 'err');
    }
  });

  useEventAction(ActionSheetEvent.ON_RESET_PAID, async () => {
    // Handle reset action
    updateBillsData({
      type: 'update',
      id: selectedBillId,
      data: { name: 'isPaid', value: false },
    });
    updateBillsData({
      type: 'update',
      id: selectedBillId,
      data: { name: 'amount', value: 0 },
    });

    // the actual update function
    const billToUpdate = billsData[activeGroup].find(bill => bill.id === selectedBillId);
    let isSaved = false;
    if (billToUpdate) {
      isSaved = await saveBill(activeGroup, {
        ...billToUpdate,
        isPaid: false,
        amount: 0,
      });
    }

    setSelectedBillId('');
    if (isSaved) {
      showNewToast('Reset Success', 'Reset the paid bill successfully');
    } else {
      showNewToast('Error', 'Failed to reset the paid bill', 'err');
    }
  });

  useEventAction(ActionSheetEvent.ON_DELETE_BILL, async () => {
    // Handle delete action
    updateBillsData({ type: 'delete', id: selectedBillId });
    // the actual delete function
    const isDeleted = await deleteBill(activeGroup, selectedBillId);
    setSelectedBillId('');
    if (isDeleted) {
      showNewToast('Delete Success', 'Delete the bill successfully');
    } else {
      showNewToast('Error', 'Failed to delete the bill', 'err');
    }
  });

  useEventAction(ActionSheetEvent.ON_CLOSE, () => {
    // Handle close action
    setSelectedBillId('');
  });

  useEventAction(GroupHandlerEvent.ON_ADD_GROUP, (groupName: string | undefined) => {
    if (groupName) {
      updateBillsData({
        type: 'add-group',
        data: { name: groupName },
      });
    }
  });

  useEventAction(GroupHandlerEvent.ON_DELETE_GROUP, (groupName: string | undefined) => {
    if (groupName) {
      updateBillsData({
        type: 'delete-group',
        data: { name: groupName },
      });
    }
  });

  const handleOnBillCardPress = (id: string) => {
    setSelectedBillId(id);
    eventBus.emit(BillHandlerEvent.ON_PRESS_BILL_CARD);
  };

  const handleOnResetAllPaidPress = async () => {
    eventBus.emit(BillHandlerEvent.ON_PRESS_RESET_ALL_PAID);
    
    let hasError = false;
    const activeBills = billsData[activeGroup];
    for (let i = 0; i < activeBills.length; i++) {
      const bill = activeBills[i];

      // updates the UI data
      updateBillsData({
        type: 'update',
        id: bill.id,
        data: { name: 'isPaid', value: false },
      });
      updateBillsData({
        type: 'update',
        id: bill.id,
        data: { name: 'amount', value: 0 },
      });

      // the actual update function
      const billToUpdate = activeBills.find(_bill => _bill.id === bill.id);
      if (billToUpdate) {
        hasError = hasError
          ? hasError
          : !(await saveBill(activeGroup, {
            ...billToUpdate,
            isPaid: false,
            amount: bill.amount,
          }));
      }
    }

    setSelectedBillId('');
    if (!hasError) {
      showNewToast(
        'Reset All Success',
        'Reset all the paid bills successfully',
      );
    } else {
      showNewToast('Error', 'Failed to reset all the paid bills', 'err');
    }
  };

  return {
    billsData,
    updateBillsData,
    handleOnBillCardPress,
    handleOnResetAllPaidPress
  }

}

export default useBillHandler;