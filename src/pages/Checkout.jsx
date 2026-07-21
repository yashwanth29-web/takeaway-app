import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, ChevronRight, ShoppingBag, Plus, Minus, Trash2, Sparkles, Tag, CheckCircle2, Store } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../store/useCartStore'
import useOrderStore from '../store/useOrderStore'
import useValetStore from '../store/useValetStore'
import useRestaurantStore from '../store/useRestaurantStore'
import menuData from '../mock/menu.json'
import ValetSelection from '../components/checkout/ValetSelection'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice, orderType, restaurantId } = useCartStore()
  const { addOrder } = useOrderStore()
  const { createValetRequest } = useValetStore()
  const restaurants = useRestaurantStore((state) => state.restaurants)

  const [valetData, setValetData] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const activeRestaurantId = restaurantId || 'r1'
  const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0]
  const isValetEnabled = activeRestaurant?.valetEnabled ?? true

  const itemsTotal = getTotalPrice(menuData)
  const taxesAndFees = itemsTotal > 0 ? 1.5 : 0
  const deliveryFee = itemsTotal > 0 ? 3.99 : 0
  const deliveryDiscount = itemsTotal > 0 ? 3.99 : 0
  const totalBeforeDiscount = itemsTotal + taxesAndFees + deliveryFee - deliveryDiscount
  const finalTotal = Math.max(0, totalBeforeDiscount - appliedDiscount)

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TAKEAWAY10') {
      setAppliedDiscount(2.50)
      toast.success('Promo code TAKEAWAY10 applied! Saved $2.50', { icon: '🎉' })
    } else {
      toast.error('Invalid Promo Code. Try "TAKEAWAY10"')
    }
  }

  const handleConfirmOrder = () => {
    if (valetData?.enabled && !valetData.vehicleNumber?.trim()) {
      toast.error('Please enter your vehicle number for valet parking!')
      return
    }

    const items = Object.entries(cart).map(([itemId, qty]) => {
      const item = menuData.find((m) => m.id === itemId)
      return {
        name: item?.name || 'Unknown Item',
        quantity: qty,
        price: item?.price || 0
      }
    })

    const newOrder = {
      customerName: 'You',
      restaurantId: activeRestaurantId,
      items,
      total: finalTotal,
      type: orderType || 'takeaway',
      valetOpted: Boolean(valetData?.enabled)
    }

    addOrder(newOrder)

    const latestOrders = useOrderStore.getState().orders
    const createdOrderId = latestOrders[0]?.id || `ORD-${Date.now()}`

    if (valetData?.enabled) {
      createValetRequest({
        orderId: createdOrderId,
        restaurantId: activeRestaurantId,
        customerName: 'You',
        vehicleNumber: valetData.vehicleNumber,
        vehicleType: valetData.vehicleType,
        vehicleColor: valetData.vehicleColor,
        arrivalTime: valetData.arrivalTime,
        notes: valetData.notes
      })
    }

    clearCart()
    navigate('/tracking')
  }

  const cartItemEntries = Object.entries(cart).filter(([_, qty]) => qty > 0)

  return (
    <div
      className="min-h-screen flex flex-col relative bg-cover bg-center bg-fixed font-sans selection:bg-indigo-500/20"
      style={{ backgroundImage: "url('/bg-pickup.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/20 z-0 pointer-events-none" />

      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-xs text-slate-500 font-medium">Review cart items & takeaway details</p>
          </div>
        </div>

        {activeRestaurant && (
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/60 text-indigo-700 rounded-full text-xs font-bold">
            <Store size={14} />
            <span className="truncate max-w-[120px] sm:max-w-none">{activeRestaurant.name}</span>
          </div>
        )}
      </header>

      {/* Main Form Content */}
      <div className="p-4 sm:p-6 flex-1 max-w-xl mx-auto w-full space-y-6 relative z-10 pb-56 md:pb-64">
        {/* Order Summary & Interactive Cart Items Card */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 flex items-center justify-center font-bold">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Order Basket</h2>
                <p className="text-xs text-slate-500 font-medium">{cartItemEntries.length} items in cart</p>
              </div>
            </div>

            {cartItemEntries.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-all"
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>

          {/* Cart Items List with + / - controls */}
          <div className="space-y-3">
            {cartItemEntries.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <ShoppingBag size={36} className="mx-auto opacity-30" />
                <p className="text-sm font-semibold text-slate-600">Your cart is currently empty.</p>
                <Link
                  to="/discovery"
                  className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200"
                >
                  Explore Restaurants & Add Food
                </Link>
              </div>
            ) : (
              <AnimatePresence>
                {cartItemEntries.map(([itemId, qty]) => {
                  const item = menuData.find((m) => m.id === itemId)
                  if (!item) return null

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-center gap-3.5 hover:border-slate-300 transition-all shadow-sm"
                    >
                      {/* Item Image */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          🍔
                        </div>
                      )}

                      {/* Name & Subtitle */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 mt-0.5">${item.price.toFixed(2)} / item</p>
                      </div>

                      {/* Interactive Quantity Control Pill (- / +) */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart({ id: item.id })}
                          className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          title="Reduce quantity"
                        >
                          {qty === 1 ? <Trash2 size={14} className="text-rose-500" /> : <Minus size={14} />}
                        </button>

                        <span className="px-3 text-xs font-extrabold text-slate-900 min-w-[24px] text-center font-mono">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => addToCart({ id: item.id, restaurantId: item.restaurantId })}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right shrink-0 min-w-[50px]">
                        <span className="font-black text-slate-900 text-sm font-mono">${(item.price * qty).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Promo Code Input */}
          {cartItemEntries.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. TAKEAWAY10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </div>

              {appliedDiscount > 0 && (
                <p className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Coupon applied! -$2.50 discount saved
                </p>
              )}
            </div>
          )}

          {/* Detailed Price Breakdown */}
          {cartItemEntries.length > 0 && (
            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-slate-900">${itemsTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600 font-medium">
                <span>Platform Taxes & Services</span>
                <span className="font-mono font-bold text-slate-900">${taxesAndFees.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-emerald-600">
                <span>Takeaway Delivery Fee (Saved)</span>
                <span className="font-mono">-${deliveryDiscount.toFixed(2)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Promo Discount</span>
                  <span className="font-mono">-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-slate-900">
                <div>
                  <span className="font-extrabold text-base block">To Pay</span>
                  <span className="text-[10px] text-slate-500 font-medium">Includes taxes & applied savings</span>
                </div>
                <span className="text-2xl font-black font-mono text-indigo-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Valet Parking Section */}
        <ValetSelection enabled={isValetEnabled} onValetChange={setValetData} />

        {/* Payment Method Option */}
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
          <h2 className="font-extrabold text-slate-900 text-sm mb-3">Payment Method</h2>
          <div className="flex items-center justify-between p-3.5 border border-indigo-200 bg-indigo-50/80 rounded-2xl cursor-pointer shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Apple Pay / One-Touch</p>
                <p className="text-[11px] text-slate-500 font-medium">Verified & Encrypted</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Amount</span>
            <span className="text-xl font-black text-slate-900 font-mono">${finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={cartItemEntries.length === 0}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-600/25 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
          >
            <Sparkles size={18} />
            Confirm Order {valetData?.enabled ? '& Valet Request' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
