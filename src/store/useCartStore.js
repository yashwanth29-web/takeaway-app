import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  cart: {}, // { itemId: quantity }
  orderType: null, // 'dine-in' or 'takeaway'
  restaurantId: null,
  
  setOrderType: (type) => set({ orderType: type }),

  addToCart: (item) => {
    set((state) => {
      let newCart = state.cart;
      // If adding from a different restaurant, clear the cart
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        newCart = {};
      }
      return {
        restaurantId: item.restaurantId,
        cart: {
          ...newCart,
          [item.id]: (newCart[item.id] || 0) + 1
        }
      };
    });
  },
  
  removeFromCart: (item) => {
    set((state) => {
      const newCart = { ...state.cart };
      if (newCart[item.id] > 1) {
        newCart[item.id] -= 1;
      } else {
        delete newCart[item.id];
      }
      return { 
        cart: newCart,
        restaurantId: Object.keys(newCart).length === 0 ? null : state.restaurantId
      };
    });
  },
  
  clearCart: () => set({ cart: {}, restaurantId: null }),
  
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
