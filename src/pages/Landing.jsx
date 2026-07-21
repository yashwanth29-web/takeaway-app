import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Navigation, Clock, ShieldCheck, Compass, Sparkles,
  ShoppingBag, Flame, TrendingUp, Store, Award, Utensils, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp,
  Filter, CheckCircle2, Car, ChefHat, User, Tag, ArrowRight, Map, Gift,
  Plus, Minus, Check, Repeat, RefreshCw, Star, Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import ActiveOrderWidget from '../components/ActiveOrderWidget'
import TopCartButton from '../components/cart/TopCartButton'
import RightUtilityPanel from '../components/layout/RightUtilityPanel'
import mockRestaurants from '../mock/restaurants.json'
import useCartStore from '../store/useCartStore'
import useValetStore from '../store/useValetStore'
import useOrderStore from '../store/useOrderStore'

// Pre-defined search location suggestions
const LOCATIONS = [
  { name: 'Financial District, Narsingi', address: 'Main Hub, Hyderabad', lat: 17.412, lng: 78.345 },
  { name: 'Hitech City, Madhapur', address: 'Tech Corridor, Hyderabad', lat: 17.447, lng: 78.376 },
  { name: 'Gachibowli, ORR Junction', address: 'Cyberabad, Hyderabad', lat: 17.44, lng: 78.348 },
  { name: 'Jubilee Hills, Road No. 36', address: 'Boutique Zone, Hyderabad', lat: 17.431, lng: 78.407 },
  { name: 'Banjara Hills, Road No. 12', address: 'Central Hub, Hyderabad', lat: 17.415, lng: 78.434 }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState('takeaway') // 'takeaway' | 'EAT-IN'
  const [activeTab, setActiveTab] = useState('route') // 'route' | 'nearby'
  const [radius, setRadius] = useState(5)
  const [searchNearMe, setSearchNearMe] = useState('')

  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false)
  const [showTabDropdown, setShowTabDropdown] = useState(false)
  const [favorites, setFavorites] = useState({})

  const categoryScrollRef = useRef(null)

  const cart = useCartStore((state) => state.cart)
  const addToCart = useCartStore((state) => state.addToCart)
  const { valetRequests, requestVehicleRetrieval } = useValetStore()
  const orders = useOrderStore((state) => state.orders)

  // Only show active valet card if user has an active order with valet opted
  const activeOrder = orders.find((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
  const activeValet = activeOrder
    ? valetRequests.find((r) => r.orderId === activeOrder.id && r.currentStatus !== 'COMPLETED')
    : null

  const toggleFavorite = (id, e) => {
    e.stopPropagation()
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const scrollCategory = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Carousel HD Cooking Videos & High-Quality Image Fallbacks
  const slides = [
    {
      id: 1,
      image: '/hyderabadi_biryani_hero.png',
      video: '',
      title: 'ROYAL HYDERABADI DUM BIRYANI',
      subtitle: 'Flat 50% OFF on authentic Dum Biryani handis today!',
      restaurant: 'Spice Symphony Partner'
    },
    {
      id: 2,
      image: '/hyderabadi_haleem_hero.png',
      video: '',
      title: 'SHAHI HYDERABADI HALEEM',
      subtitle: 'Rich slow-cooked Haleem topped with golden ghee & cashews',
      restaurant: 'Pista House & Spice Symphony'
    },
    {
      id: 3,
      image: '/hyderabadi_kebabs_hero.png',
      video: '',
      title: 'SIZZLING PATHAR KA GOSHT & KEBABS',
      subtitle: 'Charred spiced succulent kebabs with mint chutney',
      restaurant: 'Bawarchi & Route Partners'
    }
  ]

  // Luxury Food Category Showcase Dishes
  const luxuryCategoryDishes = [
    {
      id: 'dish-1',
      name: 'Hyderabadi Dum Biryani',
      restaurant: 'Spice Symphony',
      restaurantId: 'r1',
      rating: 4.9,
      prepTime: '18 mins',
      price: '$14.99',
      distance: '1.2 km',
      badge: '🔥 50% OFF',
      badgeBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-2',
      name: 'Cheese Burst Gourmet Pizza',
      restaurant: 'La Trattoria',
      restaurantId: 'r4',
      rating: 4.8,
      prepTime: '15 mins',
      price: '$16.50',
      distance: '0.8 km',
      badge: '⚡ BUY 1 GET 1',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-3',
      name: 'Smokey Truffle Burger',
      restaurant: 'Urban Bites',
      restaurantId: 'r5',
      rating: 4.9,
      prepTime: '12 mins',
      price: '$12.99',
      distance: '1.4 km',
      badge: '🔥 Today\'s Bestseller',
      badgeBg: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-4',
      name: 'Creamy Butter Chicken',
      restaurant: 'Spice Symphony',
      restaurantId: 'r1',
      rating: 4.9,
      prepTime: '20 mins',
      price: '$15.99',
      distance: '1.2 km',
      badge: '⭐ Chef\'s Special',
      badgeBg: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-5',
      name: 'Fresh Dragon Sushi Platter',
      restaurant: 'Mizu Sushi Bar',
      restaurantId: 'r3',
      rating: 4.9,
      prepTime: '22 mins',
      price: '$19.50',
      distance: '2.1 km',
      badge: '🟢 FREE VALET PARKING',
      badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-6',
      name: 'Chocolate Molten Lava Cake',
      restaurant: 'The Grind Coffeehouse',
      restaurantId: 'r2',
      rating: 4.8,
      prepTime: '10 mins',
      price: '$8.99',
      distance: '0.4 km',
      badge: '💎 Premium Choice',
      badgeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-7',
      name: 'Artisan Cappuccino',
      restaurant: 'The Grind Coffeehouse',
      restaurantId: 'r2',
      rating: 4.9,
      prepTime: '8 mins',
      price: '$5.99',
      distance: '0.4 km',
      badge: '⚡ BUY 1 GET 1',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dish-8',
      name: 'Tandoori Paneer Tikka',
      restaurant: 'Spice Symphony',
      restaurantId: 'r1',
      rating: 4.8,
      prepTime: '15 mins',
      price: '$11.50',
      distance: '1.2 km',
      badge: '🎉 Flat $5 OFF',
      badgeBg: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80'
    }
  ]

  // Boarding Passes (Reorder) mock items
  const recentPasses = [
    {
      id: 'pass-1',
      gate: 'A3',
      from: 'GYM',
      to: 'HOME',
      duration: '8m ETA',
      item: 'Eggs',
      restaurantName: 'The Grind Coffeehouse',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&auto=format&fit=crop&q=80',
      restaurantId: 'r2'
    },
    {
      id: 'pass-2',
      gate: 'B1',
      from: 'HOME',
      to: 'OFFICE',
      duration: '15m ETA',
      item: 'Tiffin',
      restaurantName: 'Spice Symphony',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80',
      restaurantId: 'r1'
    },
    {
      id: 'pass-3',
      gate: 'C5',
      from: 'OFFICE',
      to: 'PARTY',
      duration: '22m ETA',
      item: 'Cake',
      restaurantName: 'La Trattoria',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=80',
      restaurantId: 'r4'
    }
  ]

  // Where to Eat Today vibes
  const eatVibes = [
    { title: 'Fine Dining Date', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop&q=80', desc: 'Indulge tonight' },
    { title: 'Healthy & Fresh', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80', desc: 'Clean & green' },
    { title: 'Coffee & Chill', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', desc: 'Great cafes' },
    { title: 'Midnight Snacks', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80', desc: 'Open late' }
  ]

  // Hot Offers Today items
  const hotOffers = [
    {
      id: 'offer-1',
      title: '50% Flat Off',
      restaurant: 'Spice Symphony',
      restaurantId: 'r1',
      code: 'ROUTE50',
      bgGradient: 'bg-gradient-to-r from-pink-500 to-rose-600'
    },
    {
      id: 'offer-2',
      title: '1+1 Espresso Special',
      restaurant: 'The Grind Coffeehouse',
      restaurantId: 'r2',
      code: 'COFFEE11',
      bgGradient: 'bg-gradient-to-r from-amber-600 to-orange-600'
    },
    {
      id: 'offer-3',
      title: 'Free Edamame & Roll',
      restaurant: 'Mizu Sushi Bar',
      restaurantId: 'r3',
      code: 'SUSHIFREE',
      bgGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600'
    },
    {
      id: 'offer-4',
      title: 'Flat 20% on Desserts',
      restaurant: 'La Trattoria',
      restaurantId: 'r4',
      code: 'SWEET20',
      bgGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    }
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  const [showAllPasses, setShowAllPasses] = useState(false)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* --- HERO SECTION WITH AUTO-SLIDING BACKGROUNDS (DUAL LAYER VIDEO + HD IMAGE) --- */}
      <div className="relative min-h-[50vh] lg:min-h-[58vh] w-full bg-slate-900 shrink-0 flex flex-col justify-between overflow-hidden pb-6">
        {/* Dual-Layer Background: Base HD Image Poster + Video Overlay */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-90 z-0' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {slide.video && (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={slide.image}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            )}
          </div>
        ))}

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50/95 pointer-events-none z-0" />

        {/* Header Search Box Card */}
        <div className="relative z-10 w-full px-4 pt-4 md:pt-24">
          <header className="max-w-md mx-auto w-full bg-white/85 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50 flex flex-col gap-3">
            {/* Top row: Logo & Cart */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Compass size={18} />
                </div>
                <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 tracking-tight">
                  RouteBite
                </span>
              </div>
              <TopCartButton />
            </div>

            {/* Middle Row: Custom Mode Selectors */}
            <div className="flex justify-between items-center gap-3 text-xs font-bold relative z-[10000]">
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowOrderTypeDropdown(!showOrderTypeDropdown)
                    setShowTabDropdown(false)
                  }}
                  className="w-full flex items-center justify-between gap-1 bg-slate-100 hover:bg-slate-200/90 px-3 py-2.5 rounded-2xl border border-slate-200/60 text-slate-800 transition-all cursor-pointer font-black text-[11px] shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={12} className="text-rose-500 shrink-0" />
                    <span>{orderType === 'EAT-IN' ? 'Eat-In' : 'Takeaway'}</span>
                  </span>
                  <span className="text-[8px] text-slate-500">▼</span>
                </button>
                <AnimatePresence>
                  {showOrderTypeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-100 z-[10001] text-xs font-bold text-slate-800"
                    >
                      <div
                        onClick={() => {
                          setOrderType('takeaway')
                          setShowOrderTypeDropdown(false)
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${
                          orderType !== 'EAT-IN' ? 'text-indigo-600 bg-slate-50' : ''
                        }`}
                      >
                        Takeaway
                      </div>
                      <div
                        onClick={() => {
                          setOrderType('EAT-IN')
                          setShowOrderTypeDropdown(false)
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${
                          orderType === 'EAT-IN' ? 'text-indigo-600 bg-slate-50' : ''
                        }`}
                      >
                        Eat-In
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowTabDropdown(!showTabDropdown)
                    setShowOrderTypeDropdown(false)
                  }}
                  className="w-full flex items-center justify-between gap-1 bg-slate-100 hover:bg-slate-200/90 px-3 py-2.5 rounded-2xl border border-slate-200/60 text-slate-800 transition-all cursor-pointer font-black text-[11px] shadow-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Compass size={12} className="text-indigo-500 shrink-0" />
                    <span>{activeTab === 'route' ? 'Along Route' : 'Near Me'}</span>
                  </span>
                  <span className="text-[8px] text-slate-500">▼</span>
                </button>
                <AnimatePresence>
                  {showTabDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-100 z-[10001] text-xs font-bold text-slate-800"
                    >
                      <div
                        onClick={() => {
                          setActiveTab('route')
                          setShowTabDropdown(false)
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${
                          activeTab === 'route' ? 'text-indigo-600 bg-slate-50' : ''
                        }`}
                      >
                        Along Route
                      </div>
                      <div
                        onClick={() => {
                          setActiveTab('nearby')
                          setShowTabDropdown(false)
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${
                          activeTab === 'nearby' ? 'text-indigo-600 bg-slate-50' : ''
                        }`}
                      >
                        Near Me
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Row: Search Bar */}
            <div
              onClick={() => {
                if (activeTab === 'route') {
                  navigate('/plan-route')
                } else {
                  navigate(`/discovery?mode=nearby&radius=${radius}`)
                }
              }}
              className="relative cursor-pointer group"
            >
              <input
                type="text"
                placeholder='Search "pizza", routes or restaurants...'
                className="w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 border border-slate-200/80 shadow-inner outline-none cursor-pointer"
                readOnly
              />
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors"
                size={16}
              />
            </div>
          </header>
        </div>

        {/* Active Offer Tag overlay with top margin gap clearance */}
        <div className="flex-1 flex flex-col justify-end items-center gap-3 pt-6 mt-6 lg:mt-10 pb-4 z-10">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-slate-950/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl text-white border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center gap-3 max-w-[290px]"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-rose-500/10 shrink-0 text-base">
              {activeSlide === 0 ? '🌶️' : activeSlide === 1 ? '☕' : '🍰'}
            </div>

            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[8px] font-black tracking-widest text-rose-400 uppercase leading-none">
                Exclusive Deal
              </span>
              <h4 className="text-[11px] font-black text-white leading-tight uppercase tracking-wide">
                {slides[activeSlide].title}
              </h4>
              <p className="text-[9px] text-slate-300 font-bold tracking-wide leading-none">
                {slides[activeSlide].restaurant}
              </p>
            </div>
          </motion.div>

          <div className="flex gap-1.5 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/30 shadow-md">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeSlide ? 'bg-indigo-600 w-3.5' : 'bg-slate-400/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE MAIN CONTENT AREA: 3-COLUMN DESKTOP GRID --- */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          
          {/* 📍 LEFT SIDEBAR COLUMN (DESKTOP ONLY: lg:block) */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 space-y-6 sticky top-24">
            {/* 1. YOUR ROUTE RADAR WIDGET */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Navigation size={14} className="text-indigo-600" /> Your Route Radar
                </h4>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Active route: <span className="font-extrabold text-slate-800">Office → Home</span>
              </p>

              {/* Interactive Mini Map Graphic */}
              <div className="h-32 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative overflow-hidden flex items-center justify-center p-2">
                <svg className="w-full h-full text-indigo-400" viewBox="0 0 200 100" fill="none">
                  <path d="M 10 80 Q 70 20 120 70 T 190 20" stroke="#6366f1" strokeWidth="3" strokeDasharray="4 4" />
                  <circle cx="10" cy="80" r="5" fill="#e11d48" />
                  <circle cx="120" cy="70" r="5" fill="#4f46e5" />
                  <circle cx="190" cy="20" r="5" fill="#10b981" />
                </svg>
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-slate-700 shadow-sm">
                  📍 4 Partners En Route
                </div>
              </div>

              <button
                onClick={() => navigate('/plan-route')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Compass size={14} /> View Full Route
              </button>
            </div>

            {/* 2. QUICK REORDER WIDGET */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Repeat size={14} className="text-amber-500" /> Quick Reorder
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Your last 2 regular takeaway items</p>

              <div className="space-y-2.5">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80" alt="Protein Bowl" className="w-9 h-9 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-slate-800 truncate">Gym Protein Bowl</h5>
                      <p className="text-[10px] text-slate-400 font-medium truncate">$16.50 • Lean Kitchen</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/restaurant/r1')}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg shrink-0 border border-indigo-200 transition-colors"
                  >
                    Reorder
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&auto=format&fit=crop&q=80" alt="Espresso" className="w-9 h-9 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-slate-800 truncate">Double Espresso</h5>
                      <p className="text-[10px] text-slate-400 font-medium truncate">$7.99 • The Grind</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/restaurant/r2')}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg shrink-0 border border-indigo-200 transition-colors"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>

            {/* 3. BOARDING PASSES (REORDER) WIDGET */}
            <div className="bg-white p-3.5 rounded-3xl shadow-sm border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                  <Compass size={13} className="text-indigo-600 animate-pulse" /> Boarding Passes (Reorder)
                </h4>
                <span className="text-[8px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                  Passes ({recentPasses.length})
                </span>
              </div>

              <div className="space-y-2">
                {(showAllPasses ? recentPasses : recentPasses.slice(0, 2)).map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => navigate(`/restaurant/${pass.restaurantId}`)}
                    className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer flex overflow-hidden group relative text-left"
                  >
                    {/* Left Ticket Details */}
                    <div className="flex-1 p-2 sm:p-2.5 flex flex-col justify-between min-w-0 bg-white">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[7.5px] font-black uppercase text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded-full border border-indigo-100/80">
                          ROUTE-PASS
                        </span>
                        <span className="text-[7.5px] font-mono font-bold text-slate-400">GATE {pass.gate}</span>
                      </div>

                      {/* Origin -> Dest Route */}
                      <div className="flex items-center justify-between gap-1 my-0.5">
                        <div className="text-left shrink-0">
                          <p className="text-[11px] font-black text-slate-900 leading-none">{pass.from}</p>
                          <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-wider">ORIGIN</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-1">
                          <div className="w-full flex items-center gap-0.5">
                            <div className="h-[1px] flex-1 border-t border-dashed border-slate-300" />
                            <Compass size={9} className="text-indigo-600 shrink-0" />
                            <div className="h-[1px] flex-1 border-t border-dashed border-slate-300" />
                          </div>
                          <span className="text-[7.5px] font-bold text-indigo-600 font-mono mt-0.5">{pass.duration}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[11px] font-black text-slate-900 leading-none">{pass.to}</p>
                          <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-wider">DEST</span>
                        </div>
                      </div>

                      {/* Dish & Restaurant */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 mt-0.5">
                        <img src={pass.image} alt={pass.item} className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs" />
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 truncate text-[10px] leading-tight">{pass.item}</p>
                          <p className="text-[7.5px] text-slate-400 font-medium truncate leading-tight">{pass.restaurant}</p>
                        </div>
                      </div>
                    </div>

                    {/* Perforated Divider Line with Punch Hole Cutouts */}
                    <div className="relative flex flex-col justify-between items-center py-0.5 bg-indigo-600 shrink-0 w-0.5">
                      <div className="w-2 h-2 rounded-full bg-white -mt-1 -ml-0.75 border border-slate-200/70" />
                      <div className="w-[1px] h-full border-r border-dashed border-white/50" />
                      <div className="w-2 h-2 rounded-full bg-white -mb-1 -ml-0.75 border border-slate-200/70" />
                    </div>

                    {/* Right Tear-Off Stub (Indigo Button) */}
                    <div className="w-12 bg-indigo-600 group-hover:bg-indigo-700 text-white flex flex-col items-center justify-center p-1 text-center transition-colors shrink-0">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center mb-0.5">
                        <Compass size={10} className="text-white" />
                      </div>
                      <span className="text-[7px] font-black leading-none uppercase tracking-wider text-white">REORDER</span>
                      <span className="text-[6px] font-bold text-indigo-200 uppercase mt-0.5">NOW</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More / Show Less Toggle Button */}
              {recentPasses.length > 2 && (
                <button
                  onClick={() => setShowAllPasses(!showAllPasses)}
                  className="w-full py-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100 text-center rounded-xl border border-indigo-100 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  {showAllPasses ? (
                    <>Show Less <ChevronUp size={12} /></>
                  ) : (
                    <>View More Passes (+{recentPasses.length - 2}) <ChevronDown size={12} /></>
                  )}
                </button>
              )}
            </div>
          </aside>

          {/* 🍲 CENTER MAIN FEED COLUMN */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* 1. LUXURY FOOD POPULAR CATEGORIES CAROUSEL */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Flame size={22} className="text-rose-500 fill-rose-500" /> Popular Categories
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Explore chef-crafted gourmet dishes near you</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={() => scrollCategory('left')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollCategory('right')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <Link to="/discovery" className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                    View All <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Horizontally scrollable row of Ultra-HD Luxury Food Cards */}
              <div
                ref={categoryScrollRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 snap-x snap-mandatory"
              >
                {luxuryCategoryDishes.map((dish) => (
                  <motion.div
                    key={dish.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={() => navigate(`/restaurant/${dish.restaurantId}`)}
                    className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col shrink-0 w-[240px] sm:w-[260px] md:w-[275px] snap-start"
                  >
                    {/* 75% Full Bleed HD Food Image Area */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Prominent Offer Badge (Top-Left) */}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/20 backdrop-blur-md ${dish.badgeBg}`}>
                        {dish.badge}
                      </span>

                      {/* Interactive Heart Favorite Toggle (Top-Right) */}
                      <button
                        onClick={(e) => toggleFavorite(dish.id, e)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md transition-all ${
                          favorites[dish.id]
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
                        }`}
                      >
                        <Heart size={14} className={favorites[dish.id] ? 'fill-white' : ''} />
                      </button>

                      {/* Bottom Gradient Overlay for Text Readability */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-3 pointer-events-none">
                        <div className="flex justify-between items-center w-full text-white text-[11px] font-bold">
                          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black shadow-sm">
                            <Star size={10} className="fill-slate-950" /> {dish.rating}
                          </span>
                          <span className="flex items-center gap-1 text-slate-200 text-[10px] font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                            <Clock size={10} /> {dish.prepTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Footer */}
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate flex items-center justify-between mt-0.5">
                          <span>{dish.restaurant}</span>
                          <span className="text-slate-500 font-semibold">{dish.distance}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">Starting from</span>
                          <span className="font-mono font-black text-slate-900 text-base">{dish.price}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart({
                              id: dish.id,
                              name: dish.name,
                              price: parseFloat(dish.price.replace('$', '')),
                              restaurantId: dish.restaurantId
                            })
                            navigate(`/restaurant/${dish.restaurantId}`)
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Plus size={14} /> Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 2. WHERE TO EAT TODAY RECOMMENDATIONS SECTION */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> Where to Eat Today?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {eatVibes.map((vibe, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate('/discovery?mode=nearby&radius=5')}
                    className="relative group overflow-hidden rounded-3xl cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-36 border border-slate-100 shadow-sm"
                  >
                    <img
                      src={vibe.image}
                      alt={vibe.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end">
                      <h4 className="font-black text-white text-sm leading-tight transition-colors">
                        {vibe.title}
                      </h4>
                      <p className="text-[9px] text-slate-200 font-extrabold uppercase tracking-widest mt-0.5">
                        {vibe.desc}
                      </p>
                    </div>
                    
                    <div className="absolute right-3.5 bottom-3.5 w-6 h-6 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 shadow-sm z-20 text-white">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HOT OFFERS TODAY SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Hot Offers Today
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Deals Near You
                </span>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
                {hotOffers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() =>
                      navigate(
                        `/restaurant/${offer.restaurantId}?promo=${offer.code}&title=${encodeURIComponent(
                          offer.title
                        )}`
                      )
                    }
                    className={`p-4 rounded-3xl text-white shrink-0 w-64 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col justify-between h-36 ${offer.bgGradient}`}
                  >
                    <div>
                      <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        LIMITED OFFER
                      </span>
                      <h4 className="font-black text-lg text-white mt-1.5 leading-tight">{offer.title}</h4>
                      <p className="text-xs text-white/90 font-medium">at {offer.restaurant}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/20">
                      <span className="font-mono text-[11px] font-bold bg-white text-slate-900 px-2 py-0.5 rounded-md">
                        Code: {offer.code}
                      </span>
                      <span className="text-xs font-black flex items-center gap-1 hover:underline">
                        Claim →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. BOARDING PASSES (REORDER) SECTION (MOBILE ONLY: lg:hidden) */}
            <div className="lg:hidden space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" /> Boarding Passes (Reorder)
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  SWIPE TO REORDER
                </span>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
                {recentPasses.map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => navigate(`/restaurant/${pass.restaurantId}`)}
                    className="bg-white border border-slate-200/80 rounded-3xl shrink-0 w-80 shadow-md hover:shadow-xl transition-all cursor-pointer flex overflow-hidden group"
                  >
                    {/* Left Side: Pass Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          ROUTE-PASS
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-400">GATE {pass.gate}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <div className="text-center">
                          <p className="text-lg font-black text-slate-900 tracking-tight">{pass.from}</p>
                          <p className="text-[9px] font-bold text-slate-400">ORIGIN</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-2">
                          <div className="w-full border-t-2 border-dashed border-slate-200 relative my-2">
                            <Compass size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 bg-white px-0.5" />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{pass.duration}</span>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-slate-900 tracking-tight">{pass.to}</p>
                          <p className="text-[9px] font-bold text-slate-400">DEST</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 min-w-0">
                        <img src={pass.image} alt={pass.item} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{pass.item}</p>
                          <p className="text-[9px] font-medium text-slate-400 truncate">{pass.restaurantName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dashed Separator */}
                    <div className="w-[1px] border-r-2 border-dashed border-slate-200/80 my-3 relative">
                      <div className="absolute -top-1.5 -left-1 w-2.5 h-2.5 bg-slate-50 rounded-full border-b border-slate-200/60" />
                      <div className="absolute -bottom-1.5 -left-1 w-2.5 h-2.5 bg-slate-50 rounded-full border-t border-slate-200/60" />
                    </div>

                    {/* Right Side: Ticket Stub */}
                    <div className="w-24 bg-slate-50/50 p-4 flex flex-col items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                        <Compass size={14} className="animate-spin-slow" />
                      </div>
                      <span className="text-[10px] font-black text-center leading-tight group-hover:text-white text-indigo-600">
                        REORDER NOW
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 group-hover:text-indigo-200 uppercase tracking-widest">
                        TAP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* 🛒 RIGHT SIDEBAR COLUMN (DESKTOP ONLY: lg:block) */}
          <div className="hidden lg:block w-72 xl:w-80 shrink-0">
            <RightUtilityPanel />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 🚀 FULL DESKTOP WIDTH: TRENDING NEAR YOU HORIZONTAL SCROLLER */}
        {/* ========================================================= */}
        <div className="pt-4 space-y-4 border-t border-slate-200/60">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" /> Trending Near You
            </h3>
            <Link to="/discovery" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              See All ({mockRestaurants.length})
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-6">
            {mockRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="w-72 sm:w-80 shrink-0">
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* OWNER & ACCOUNT QUICK LINKS */}
        <div className="border-t border-slate-200/60 pt-6 pb-32 flex justify-center items-center gap-6 text-xs font-black text-slate-500">
          <Link to="/owner/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <ChefHat size={14} className="text-indigo-500" /> Owner Portal
          </Link>
          <span className="text-slate-300 font-normal">|</span>
          <Link to="/profile" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <User size={14} className="text-indigo-500" /> My Profile
          </Link>
        </div>
      </div>

      <ActiveOrderWidget />
    </div>
  )
}
