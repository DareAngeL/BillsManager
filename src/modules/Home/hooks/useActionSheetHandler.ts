import { useState } from "react";
import useBillStore from "../../../store/useBillStore";
import useGroupStore from "../../../store/useGroupStore";
import { BillData } from "../../../types/types";
import { deleteBill, saveBill } from "../../../utils/util";
import useCustomToast from "../../../hooks/useToast";

const useActionSheetHandler = () => {
  const { showNewToast } = useCustomToast();

  const { selectedBillId, optimisticBills, setSelectedBillId, updateOptimisticBills } = useBillStore();
  const { activeGroup } = useGroupStore();

  const [showActionsheet, setShowActionsheet] = useState(false);

  const handleOnShowActionsheet = (id: string) => {
    setSelectedBillId(id);
    setShowActionsheet(true);
  };

  const handleOnEditActionPress = () => {
    setShowActionsheet(false);
    setSelectedBillId('');
  };

  const handleOnPaidActionPress = async () => {
    setShowActionsheet(false);
    // Handle paid action
    updateOptimisticBills({
      type: 'update',
      id: selectedBillId,
      data: { name: 'isPaid', value: true },
    }, activeGroup);

    // the actual update function
    const billToUpdate = optimisticBills[activeGroup].find((bill: BillData) => bill.id === selectedBillId);
    let isSaved = false;
    if (billToUpdate) {
      isSaved = await saveBill(activeGroup, {
        ...billToUpdate,
        isPaid: true,
      });
    }

    setSelectedBillId('');
    if (isSaved) {
      showNewToast('Paid Success', 'Mark the bill as paid successfully');
    } else {
      showNewToast('Error', 'Failed to mark the bill as paid', 'err');
    }
  };

  const handleResetPaidActionPress = async () => {
    setShowActionsheet(false);
    // Handle reset action
    updateOptimisticBills({
      type: 'update',
      id: selectedBillId,
      data: { name: 'isPaid', value: false },
    }, activeGroup);

    // the actual update function
    const billToUpdate = optimisticBills[activeGroup].find((bill: BillData) => bill.id === selectedBillId);
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
  };

  const handleOnDeleteActionPress = async () => {
    setShowActionsheet(false);
    // Handle delete action
    updateOptimisticBills({ type: 'delete', id: selectedBillId }, activeGroup);
    // the actual delete function
    const isDeleted = await deleteBill(activeGroup, selectedBillId);
    setSelectedBillId('');
    if (isDeleted) {
      showNewToast('Delete Success', 'Delete the bill successfully');
    } else {
      showNewToast('Error', 'Failed to delete the bill', 'err');
    }
  };

  const handleOnCloseActionsheet = () => {
    setShowActionsheet(false);
    setSelectedBillId('');
  };

  return {
    showActionsheet,
    setShowActionsheet,
    handleOnShowActionsheet,
    handleOnEditActionPress,
    handleOnPaidActionPress,
    handleResetPaidActionPress,
    handleOnDeleteActionPress,
    handleOnCloseActionsheet
  }
}

export default useActionSheetHandler;