import { AppNotification } from '../types/notification.types';

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif1',
    type: 'out_of_stock',
    message: 'Oat Milk is out of stock!',
    timestamp: new Date().toISOString(),
    isRead: false,
    link: '/inventory',
  },
  {
    id: 'notif2',
    type: 'low_stock',
    message: 'Fresh Milk is running low (2 L remaining)',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    isRead: true,
    link: '/inventory',
  },
  {
    id: 'notif3',
    type: 'low_stock',
    message: 'Almond Croissant is running low (2 pcs remaining)',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: false,
    link: '/inventory',
  }
];
