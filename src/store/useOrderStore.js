import { create } from 'zustand'

const generateMockOrders = () => {
  return [
    {
      id: 'ORD-1001',
      restaurantId: 'r1',
      customerName: 'Alice Johnson',
      items: [
        { name: 'Classic Cheeseburger', quantity: 2, price: 8.99 },
        { name: 'Truffle Parmesan Fries', quantity: 1, price: 4.50 }
      ],
      total: 22.48,
      status: 'pending',
      type: 'takeaway',
      time: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: 'ORD-1002',
      restaurantId: 'r3',
      customerName: 'Bob Smith',
      items: [
        { name: 'Sushi Platter', quantity: 1, price: 24.99 }
      ],
      total: 24.99,
      status: 'preparing',
      type: 'dine-in',
      time: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: 'ORD-1003',
      restaurantId: 'r2',
      customerName: 'Charlie Brown',
      items: [
        { name: 'Avocado Toast', quantity: 1, price: 8.50 },
        { name: 'Smoothie', quantity: 1, price: 5.50 }
      ],
      total: 14.00,
      status: 'completed',
      type: 'takeaway',
      time: new Date(Date.now() - 60 * 60000).toISOString()
    }
  ];
};

import useRestaurantStore from './useRestaurantStore';

const useOrderStore = create((set, get) => ({
  orders: generateMockOrders(),
  payouts: [], // { id, restaurantId, amount, date }

  updateOrderStatus: (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    }));
  },

  completeActiveOrder: () => {
    set((state) => ({
      orders: state.orders.map(order => 
        (order.status !== 'completed' && order.isCustomerOrder) ? { ...order, status: 'completed' } : order
      )
    }));
  },

  addOrder: (newOrder) => {
    set((state) => ({
      orders: [
        {
          ...newOrder,
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          time: new Date().toISOString(),
          status: 'pending',
          isCustomerOrder: true
        },
        ...state.orders
      ]
    }));
  },

  simulateOrder: () => {
    const restaurants = useRestaurantStore.getState().restaurants;
    const restaurantIds = restaurants.map(r => r.id);
    if (restaurantIds.length === 0) return; // safeguard

    const randomRestaurant = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];
    const total = parseFloat((Math.random() * 40 + 10).toFixed(2));
    const newOrder = {
      restaurantId: randomRestaurant,
      customerName: 'Simulated User',
      items: [{ name: 'Simulated Item', quantity: 1, price: total }],
      total: total,
      type: 'takeaway'
    };
    get().addOrder(newOrder);
  },

  processPayout: (restaurantId) => {
    const { getRestaurantStats } = get();
    const stats = getRestaurantStats(restaurantId);
    
    if (stats.pendingPayout > 0) {
      set((state) => ({
        payouts: [
          ...state.payouts,
          {
            id: `PAY-${Date.now()}`,
            restaurantId,
            amount: stats.pendingPayout,
            date: new Date().toISOString()
          }
        ]
      }));
    }
  },

  getRevenueStats: () => {
    const { orders, payouts } = get();
    const allOrders = orders; // Using all for demo
    
    const totalGrossRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = allOrders.length;
    
    // Total vendor payouts is the sum of all payouts processed
    const totalPayouts = payouts.reduce((sum, pay) => sum + pay.amount, 0);
    
    // Realized Platform Revenue is calculated based on disbursed amounts
    // Since payout = 90% of gross, the 10% platform fee is (payout / 9)
    const platformRevenue = totalPayouts / 9;

    return {
      totalGrossRevenue: totalGrossRevenue.toFixed(2),
      platformRevenue: platformRevenue.toFixed(2),
      totalPayouts: totalPayouts.toFixed(2),
      totalOrders
    };
  },

  getRestaurantStats: (restaurantId) => {
    const { orders, payouts } = get();
    const restOrders = orders.filter(o => o.restaurantId === restaurantId);
    
    const grossRevenue = restOrders.reduce((sum, order) => sum + order.total, 0);
    const netRevenue = grossRevenue * 0.90; // Restaurant keeps 90%
    const paidOut = payouts.filter(p => p.restaurantId === restaurantId).reduce((sum, p) => sum + p.amount, 0);
    const pendingPayout = netRevenue - paidOut;

    return {
      totalOrders: restOrders.length,
      grossRevenue,
      netRevenue,
      pendingPayout
    };
  }
}));

export default useOrderStore;
