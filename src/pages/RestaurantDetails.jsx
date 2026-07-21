import React, { useState } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Search, ShieldCheck, Car, Sparkles, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchRestaurantById, fetchMenuByRestaurantId } from '../api/restaurantApi'

import MenuItemCard from '../components/restaurant/MenuItemCard'
import FilterChips from '../components/restaurant/FilterChips'
import FloatingCart from '../components/cart/FloatingCart'
import useCartStore from '../store/useCartStore'

export default function RestaurantDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const promo = searchParams.get('promo')
  const promoTitle = searchParams.get('title')

  const { cart, addToCart, removeFromCart } = useCartStore()

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurantById(id)
  })

  const { data: menu, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => fetchMenuByRestaurantId(id)
  })

  const [vegFilter, setVegFilter] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchInput, setShowSearchInput] = useState(false)

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-extrabold text-slate-600">Loading menu & restaurant...</p>
        </div>
      </div>
    )
  }

  if (!restaurant || !menu) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-base font-bold text-slate-800">Restaurant not found.</p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Return Home
        </Link>
      </div>
    )
  }

  // Filter menu logic
  const filteredMenu = menu.filter((m) => {
    if (vegFilter && m.type !== vegFilter) return false
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false
    if (
      searchQuery &&
      !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const categories = ['All', ...new Set(menu.map((m) => m.category))]
  const activeCategories =
    categoryFilter === 'All' ? [...new Set(filteredMenu.map((m) => m.category))] : [categoryFilter]

  // Desktop sidebar cart items calculation
  const cartEntries = Object.entries(cart).map(([itemId, quantity]) => {
    const item = menu.find((m) => m.id === itemId)
    return { itemId, item, quantity }
  }).filter((entry) => entry.item && entry.quantity > 0)

  const cartTotal = cartEntries.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
  const totalItemsCount = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 md:top-16 bg-white/95 backdrop-blur-xl z-40 border-b border-slate-200/80 shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800 shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            {showSearchInput ? (
              <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-2xl px-3.5 py-2">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search dishes, drinks or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-800 text-sm font-bold placeholder-slate-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchInput(false)
                  }}
                  className="text-slate-400 hover:text-slate-700 font-bold text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col min-w-0">
                <h1 className="font-black text-slate-900 text-base sm:text-lg leading-tight truncate">
                  {restaurant.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {restaurant.cuisine || 'Multi-Cuisine'} • {restaurant.distance} km away • {restaurant.eta}
                </p>
              </div>
            )}
          </div>

          {!showSearchInput && (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        {/* Desktop Hero Restaurant Card */}
        <div className="w-full h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden relative shadow-xl border border-slate-200/60 bg-slate-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

          {/* Floating Glass Badges on Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3 z-10">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white space-y-1 shadow-2xl max-w-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-emerald-400" /> {restaurant.rating} Rating
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} /> {restaurant.preparationTime || 20} mins prep
                </span>
                {restaurant.valetEnabled && (
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Car size={10} /> Valet Service Enabled
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">{restaurant.name}</h2>
              <p className="text-xs text-slate-300 font-medium line-clamp-1">{restaurant.address}</p>
            </div>

            {restaurant.offer && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold px-3 py-2 rounded-2xl shadow-lg border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles size={14} /> {restaurant.offer}
              </div>
            )}
          </div>
        </div>

        {/* Active Promo Applied Alert */}
        {promo && (
          <div className="bg-gradient-to-r from-pink-500 via-rose-600 to-purple-600 text-white rounded-3xl p-4 shadow-xl flex justify-between items-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 select-none">🌶️</div>
            <div>
              <span className="text-[9px] font-black tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full">
                Special Deal Applied
              </span>
              <h4 className="font-extrabold text-base sm:text-lg mt-2 leading-tight">
                {promoTitle || 'Exclusive Offer'}
              </h4>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Use code{' '}
                <span className="font-bold font-mono bg-white text-slate-900 px-2 py-0.5 rounded-md">
                  {promo}
                </span>{' '}
                at checkout for instant savings!
              </p>
            </div>
          </div>
        )}

        {/* Filter Chips Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/80">
          <FilterChips
            vegFilter={vegFilter}
            setVegFilter={setVegFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />
        </div>

        {/* 2-Column Responsive Layout: Left Main Menu + Right Desktop Cart Sidebar */}
        <div className="flex gap-8 items-start">
          {/* Main Menu Items Column */}
          <div className="flex-1 min-w-0 space-y-8">
            {activeCategories.map((category) => {
              const categoryItems = filteredMenu.filter((m) => m.category === category)
              if (categoryItems.length === 0) return null

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h2 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
                      {category}
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {categoryItems.length}
                      </span>
                    </h2>
                  </div>

                  {/* Render 2-column grid on desktop for clean aesthetics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryItems.map((item, idx) => (
                      <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
                        <MenuItemCard item={item} idx={0} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* DESKTOP STICKY ORDER BASKET SIDEBAR */}
          <aside className="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-24 self-start bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-indigo-600" />
                Your Takeaway Basket
              </h3>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full">
                {totalItemsCount} items
              </span>
            </div>

            {cartEntries.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-slate-400">
                <ShoppingBag size={40} className="mx-auto opacity-30" />
                <p className="text-xs font-bold">Your basket is empty</p>
                <p className="text-[11px] text-slate-400">Add delicious items from the menu to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cartEntries.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-slate-400 font-mono">${(item.price * quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 font-extrabold">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded-lg hover:bg-slate-200 text-slate-800 shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-slate-900">{quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Packaging & Taxes</span>
                    <span className="font-mono text-slate-900">$1.50</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="font-mono text-indigo-600">${(cartTotal + 1.5).toFixed(2)}</span>
                  </div>
                </div>

                {restaurant.valetEnabled && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-2xl flex items-center gap-2.5 text-xs">
                    <Car size={16} className="text-indigo-600 shrink-0" />
                    <div>
                      <p className="font-bold text-indigo-950">Valet Service Available</p>
                      <p className="text-[10px] text-indigo-700">You can opt for valet parking during checkout</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout <Sparkles size={14} />
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Floating Cart Button for Mobile View */}
      <FloatingCart menu={menu} />
    </div>
  )
}
