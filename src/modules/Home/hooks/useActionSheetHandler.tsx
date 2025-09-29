import { useState, useCallback } from "react";
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

  useEventAction(BillHandlerEvent.ON_PRESS_BILL_CARD, useCallback(() => {
    setShowActionsheet(prevState => {
      if (prevState) {
        return prevState; // Prevent setting to true if already true
      }
      return true;
    });
  }, []));

  const handleOnEditActionPress = () => {
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_EDIT_BILL);
  };

  const handleOnPaidActionPress = async () => {
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_PAID_BILL);
  };

  const handleResetPaidActionPress = async () => {
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_RESET_PAID);
  };

  const handleOnDeleteActionPress = async () => {
    
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_DELETE_BILL);
    
  };

  const handleOnCloseActionsheet = () => {
    setShowActionsheet(false);
    eventBus.emit(ActionSheetEvent.ON_CLOSE);
  };

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