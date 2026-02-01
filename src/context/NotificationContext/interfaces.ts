export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: (id: string) => void;
}
