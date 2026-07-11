import { create } from 'zustand'

const generateMockOrders = () => {
  return [
    {
      id: 'ORD-1001',
      customerName: 'Alice Johnson',
      items: [
        { name: 'Spicy Chicken Burger', quantity: 2, price: 8.99 },
        { name: 'French Fries', quantity: 1, price: 3.49 }
      ],
      total: 21.47,
      status: 'pending', // pending, preparing, ready, completed
      type: 'takeaway',
      time: new Date(Date.now() - 5 * 60000).toISOString() // 5 mins ago
    },
    {
      id: 'ORD-1002',
      customerName: 'Bob Smith',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Garlic Bread', quantity: 1, price: 4.99 },
        { name: 'Cola', quantity: 2, price: 1.99 }
      ],
      total: 21.96,
      status: 'preparing',
      type: 'dine-in',
      time: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    },
    {
      id: 'ORD-1003',
      customerName: 'Charlie Brown',
      items: [
        { name: 'Vegan Bowl', quantity: 1, price: 11.50 },
        { name: 'Smoothie', quantity: 1, price: 5.50 }
      ],
      total: 17.00,
      status: 'ready',
      type: 'takeaway',
      time: new Date(Date.now() - 25 * 60000).toISOString() // 25 mins ago
    },
    {
      id: 'ORD-1004',
      customerName: 'Diana Prince',
      items: [
        { name: 'Sushi Platter', quantity: 1, price: 24.99 },
        { name: 'Miso Soup', quantity: 2, price: 2.99 }
      ],
      total: 30.97,
      status: 'completed',
      type: 'dine-in',
      time: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
    }
  ];
};

const useOrderStore = create((set, get) => ({
  orders: generateMockOrders(),

  updateOrderStatus: (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
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
          status: 'pending'
        },
        ...state.orders
      ]
    }));
  },

  getRevenueStats: () => {
    const { orders } = get();
    // For a real app, this would only count 'completed' or paid orders.
    // Here we count everything to show data.
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'ready' || o.status === 'preparing' || o.status === 'pending');
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = completedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(2)
    };
  }
}));

export default useOrderStore;
