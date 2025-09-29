import { useEffect } from "react";
import eventBus from "../services/EventBus";

export function useEventAction(event: any, callback: (data: any) => void) {
  useEffect(() => {
    eventBus.on(event, callback);
    return () => {
      eventBus.off(event, callback);
    };
  }, [event, callback]);
}