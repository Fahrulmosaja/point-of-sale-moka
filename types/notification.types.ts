export type NotificationType = "low_stock" | "out_of_stock" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}
