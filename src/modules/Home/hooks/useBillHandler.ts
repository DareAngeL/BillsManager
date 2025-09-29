import { useEffect } from "react";
import { BillData } from "../../../types/types";
import { getBills, getGroups, saveBill } from "../../../utils/util";
import useBillStore from "../../../store/useBillStore";
import useGroupStore from "../../../store/useGroupStore";
import useCustomToast from "../../../hooks/useToast";

const useBillHandler = () => {

  const { showNewToast } = useCustomToast();

  const { 
    optimisticBills, 
    setBills, 
    updateOptimisticBills, 
    selectedBillId, 
    setSelectedBillId 
  } = useBillStore();
  const { activeGroup, setActiveGroup, setGroups } = useGroupStore();

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

  const handleOnResetAllPaidPress = async () => {
    let hasError = false;
    const activeBills = optimisticBills[activeGroup];
    for (let i = 0; i < activeBills.length; i++) {
      const bill = activeBills[i];

      // updates the UI data
      updateOptimisticBills({
        type: 'update',
        id: bill.id,
        data: { name: 'isPaid', value: false },
      }, activeGroup);
      updateOptimisticBills({
        type: 'update',
        id: bill.id,
        data: { name: 'amount', value: 0 },
      }, activeGroup);

      // the actual update function
      const billToUpdate = activeBills.find((_bill: BillData) => _bill.id === bill.id);
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
    handleOnResetAllPaidPress
  }

}

export default useBillHandler;