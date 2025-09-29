import { useState, useCallback, useRef, useEffect } from "react";
import eventBus from "../../../services/EventBus";
import { useEventAction } from "../../../hooks/useEventAction";
import { BillHandlerEvent } from "./useBillHandler";

export enum ActionSheetEvent {
  ON_EDIT_BILL = 'edit',
  ON_PAID_BILL = 'paid',
  ON_RESET_PAID = 'reset-paid',
  ON_DELETE_BILL = 'delete',
  ON_CLOSE = 'close',
}

const useActionSheetHandler = () => {

  const [showActionsheet, setShowActionsheet] = useState(false);
  const isOpeningRef = useRef(false);

  const handleBillCardPress = useCallback(() => {
    // Prevent opening if already opening or already open
    if (isOpeningRef.current || showActionsheet) {
      return;
    }
    
    isOpeningRef.current = true;
    
    setShowActionsheet(true);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isOpeningRef.current = false;
    }, 200);
  }, [showActionsheet]);

  useEventAction(BillHandlerEvent.ON_PRESS_BILL_CARD, handleBillCardPress);

  const handleOnEditActionPress = useCallback(() => {
    isOpeningRef.current = false;
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_EDIT_BILL);
  }, []);

  const handleOnPaidActionPress = useCallback(async () => {
    isOpeningRef.current = false;
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_PAID_BILL);
  }, []);

  const handleResetPaidActionPress = useCallback(async () => {
    isOpeningRef.current = false;
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_RESET_PAID);
  }, []);

  const handleOnDeleteActionPress = useCallback(async () => {
    isOpeningRef.current = false;
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_DELETE_BILL);
  }, []);

  const handleOnCloseActionsheet = useCallback(() => {
    isOpeningRef.current = false; // Reset the flag when closing
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_CLOSE);
  }, []);

  return {
    showActionsheet,
    setShowActionsheet,
    handleOnEditActionPress,
    handleOnPaidActionPress,
    handleResetPaidActionPress,
    handleOnDeleteActionPress,
    handleOnCloseActionsheet
  }
}

export default useActionSheetHandler;