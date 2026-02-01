import { createContext, useContext } from "react";
import { NotificationContextType } from "./interfaces";

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
