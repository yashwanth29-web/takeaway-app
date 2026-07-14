import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react'
import useCartStore from '../store/useCartStore'
import useOrderStore from '../store/useOrderStore'
import menuData from '../mock/menu.json'

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart, orderType } = useCartStore();
  const { addOrder } = useOrderStore();

  const itemsTotal = getTotalPrice(menuData);
  const taxesAndFees = itemsTotal > 0 ? 1.50 : 0;
  const deliveryFee = itemsTotal > 0 ? 3.99 : 0;
  const deliveryDiscount = itemsTotal > 0 ? 3.99 : 0; // Simulated free delivery
  
  const finalTotal = itemsTotal + taxesAndFees + deliveryFee - deliveryDiscount;

  const handleConfirmOrder = () => {
    const items = Object.entries(cart).map(([itemId, qty]) => {
      const item = menuData.find(m => m.id === itemId);
      return { 
        name: item?.name || 'Unknown Item', 
        quantity: qty, 
        price: item?.price || 0 
      };
    });

    // We fetch the latest state directly to ensure we get restaurantId
    const currentRestaurantId = useCartStore.getState().restaurantId;

    addOrder({
      customerName: 'You', 
      restaurantId: currentRestaurantId,
      items,
      total: finalTotal,
      type: orderType || 'takeaway'
    });

    clearCart();
    navigate('/tracking');
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/bg-pickup.png')" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      
      <header className="p-4 flex items-center gap-4 bg-white/90 backdrop-blur-md shadow-sm z-10 relative">
        <Link to={-1} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
      </header>

      <div className="p-4 flex-1 max-w-lg mx-auto w-full space-y-6 relative z-10">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-indigo-600" /> 
            Order Summary
          </h2>
          
          {/* Cart Items List */}
          <div className="mb-4 space-y-3 max-h-48 overflow-y-auto">
            {Object.keys(cart).length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Your cart is empty.</p>
            ) : (
              Object.entries(cart).map(([itemId, qty]) => {
                const item = menuData.find(m => m.id === itemId);
                if (!item) return null;
                return (
                  <div key={itemId} className="flex justify-between text-sm">
                    <span className="text-slate-700">
                      <span className="font-medium mr-2">{qty}x</span> 
                      {item.name}
                    </span>
                    <span className="font-medium text-slate-900">${(item.price * qty).toFixed(2)}</span>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="border-t border-slate-100 pt-4 space-y-3 mb-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Items Total</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            {itemsTotal > 0 && (
              <>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Taxes & Fees</span>
                  <span>${taxesAndFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>Delivery Fee (Saved)</span>
                  <span>-${deliveryDiscount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg text-slate-900">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-900 mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-3 border border-indigo-200 bg-indigo-50 rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Apple Pay</p>
                <p className="text-xs text-slate-500">Linked</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 max-w-lg mx-auto w-full relative z-10">
        <button 
          onClick={handleConfirmOrder}
          disabled={itemsTotal === 0}
          className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Confirm Order
        </button>
      </div>
    </div>
  )
}
