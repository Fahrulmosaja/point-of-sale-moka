import { Order } from '../types/order.types';
import { PRODUCTS } from './products.constant';

// Mocking some past orders for the Activity tab and Online Order page
export const ORDERS: Order[] = [
  {
    id: 'ord1',
    invoiceNumber: 'INV-001',
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: 'dine_in',
    status: 'completed',
    items: [
      {
        id: 'oi1',
        productId: 'p1',
        product: PRODUCTS.find(p => p.id === 'p1'),
        quantity: 2,
        price: 25000,
        notes: 'Less ice',
      },
      {
        id: 'oi2',
        productId: 'p9',
        product: PRODUCTS.find(p => p.id === 'p9'),
        quantity: 1,
        price: 20000,
      }
    ],
    subtotal: 70000,
    tax: 7000,
    total: 77000,
    paymentMethod: 'Cash',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord2',
    invoiceNumber: 'INV-002',
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: 'take_away',
    status: 'completed',
    items: [
      {
        id: 'oi3',
        productId: 'p2',
        product: PRODUCTS.find(p => p.id === 'p2'),
        quantity: 1,
        price: 30000,
      }
    ],
    subtotal: 30000,
    tax: 3000,
    total: 33000,
    paymentMethod: 'QRIS',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord3',
    invoiceNumber: 'INV-003',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: 'online',
    status: 'refunded',
    items: [
      {
        id: 'oi4',
        productId: 'p5',
        product: PRODUCTS.find(p => p.id === 'p5'),
        quantity: 1,
        price: 32000,
      }
    ],
    subtotal: 32000,
    tax: 3200,
    total: 35200,
    paymentMethod: 'Gopay',
    cashierName: 'Jane Doe',
  },
  // --- Online Orders ---
  {
    id: 'ord4',
    invoiceNumber: 'INV-004',
    date: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    type: 'online',
    status: 'pending',
    items: [
      {
        id: 'oi5',
        productId: 'p3',
        product: PRODUCTS.find(p => p.id === 'p3'),
        quantity: 2,
        price: 28000,
      },
      {
        id: 'oi6',
        productId: 'p7',
        product: PRODUCTS.find(p => p.id === 'p7'),
        quantity: 1,
        price: 22000,
      }
    ],
    subtotal: 78000,
    tax: 7800,
    total: 85800,
    paymentMethod: 'Gopay',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord5',
    invoiceNumber: 'INV-005',
    date: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    type: 'online',
    status: 'pending',
    items: [
      {
        id: 'oi7',
        productId: 'p1',
        product: PRODUCTS.find(p => p.id === 'p1'),
        quantity: 1,
        price: 25000,
      }
    ],
    subtotal: 25000,
    tax: 2500,
    total: 27500,
    paymentMethod: 'OVO',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord6',
    invoiceNumber: 'INV-006',
    date: new Date(Date.now() - 3000000).toISOString(), // 50 min ago
    type: 'online',
    status: 'completed',
    items: [
      {
        id: 'oi8',
        productId: 'p4',
        product: PRODUCTS.find(p => p.id === 'p4'),
        quantity: 3,
        price: 30000,
      }
    ],
    subtotal: 90000,
    tax: 9000,
    total: 99000,
    paymentMethod: 'QRIS',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord7',
    invoiceNumber: 'INV-007',
    date: new Date(Date.now() - 5400000).toISOString(), // 90 min ago
    type: 'online',
    status: 'cancelled',
    items: [
      {
        id: 'oi9',
        productId: 'p2',
        product: PRODUCTS.find(p => p.id === 'p2'),
        quantity: 1,
        price: 30000,
      },
      {
        id: 'oi10',
        productId: 'p6',
        product: PRODUCTS.find(p => p.id === 'p6'),
        quantity: 2,
        price: 27000,
      }
    ],
    subtotal: 84000,
    tax: 8400,
    total: 92400,
    paymentMethod: 'Gopay',
    cashierName: 'Jane Doe',
  },
  {
    id: 'ord8',
    invoiceNumber: 'INV-008',
    date: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    type: 'online',
    status: 'completed',
    items: [
      {
        id: 'oi11',
        productId: 'p8',
        product: PRODUCTS.find(p => p.id === 'p8'),
        quantity: 2,
        price: 18000,
      }
    ],
    subtotal: 36000,
    tax: 3600,
    total: 39600,
    paymentMethod: 'Dana',
    cashierName: 'Jane Doe',
  },
];
