import React, { createContext, useContext, useState, useCallback } from "react";
import {
  NotificationType,
  Notification,
  NotificationContextType,
} from "./interfaces";
import { NotificationContext } from "./utils";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Math.random().toString(36).substring(7);
      setNotifications((prev) => [...prev, { id, message, type }]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    [],
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
