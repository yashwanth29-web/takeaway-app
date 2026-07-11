import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  cart: {}, // { itemId: quantity }
  orderType: null, // 'dine-in' or 'takeaway'
  
  setOrderType: (type) => set({ orderType: type }),

  addToCart: (item) => {
    set((state) => ({
      cart: {
        ...state.cart,
        [item.id]: (state.cart[item.id] || 0) + 1
      }
    }));
  },
  
  removeFromCart: (item) => {
    set((state) => {
      const newCart = { ...state.cart };
      if (newCart[item.id] > 1) {
        newCart[item.id] -= 1;
      } else {
        delete newCart[item.id];
      }
      return { cart: newCart };
    });
  },
  
  clearCart: () => set({ cart: {} }),
  
  getTotalItems: () => {
    const { cart } = get();
    return Object.values(cart).reduce((a, b) => a + b, 0);
  },
  
  getTotalPrice: (menu) => {
    const { cart } = get();
    return Object.entries(cart).reduce((sum, [itemId, qty]) => {
      const item = menu.find(m => m.id === itemId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }
}));

export default useCartStore;
