import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Navigation, Clock, ShieldCheck, Compass, Sparkles,
  ShoppingBag, Flame, TrendingUp, Store, Award, Utensils, ChevronRight,
  Filter, CheckCircle2, Car, ChefHat, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import ActiveOrderWidget from '../components/ActiveOrderWidget'
import TopCartButton from '../components/cart/TopCartButton'
import mockRestaurants from '../mock/restaurants.json'

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
  const [selectedNearMe, setSelectedNearMe] = useState(null)

  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false)
  const [showTabDropdown, setShowTabDropdown] = useState(false)

  // Carousel HD Cooking Videos with Instant Image Poster Fallbacks
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
      video: 'https://cdn.coverr.co/videos/coverr-sizzling-meat-on-a-grill-5690/1080p.mp4',
      title: '50% FLAT OFF',
      subtitle: 'on all Route Orders today!',
      restaurant: 'All Route Partners'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop&q=80',
      video: 'https://cdn.coverr.co/videos/coverr-barista-pouring-milk-into-coffee-5435/1080p.mp4',
      title: 'BUY 1 GET 1 FREE ESPRESSO',
      subtitle: 'at The Grind Coffeehouse',
      restaurant: 'The Grind Coffeehouse'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=80',
      video: 'https://cdn.coverr.co/videos/coverr-preparing-a-gourmet-dish-5692/1080p.mp4',
      title: 'FREE DESSERT WITH MEAL',
      subtitle: 'at Spice Symphony today',
      restaurant: 'Spice Symphony'
    }
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  const filteredNearMe = searchNearMe
    ? LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchNearMe.toLowerCase()) ||
          l.address.toLowerCase().includes(searchNearMe.toLowerCase())
      ).slice(0, 5)
    : []

  const handleNearMeClick = () => {
    let query = `/discovery?mode=nearby&radius=${radius}`
    if (selectedNearMe) {
      query += `&lat=${selectedNearMe.lat}&lng=${selectedNearMe.lng}`
    }
    navigate(query)
  }

  const categories = [
    { id: 'all', name: 'All Dishes', icon: '🍽️' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'biryani', name: 'Biryani', icon: '🍲' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'coffee', name: 'Coffee', icon: '☕' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* --- HERO SECTION WITH HD COOKING VIDEOS & ZERO-LAG POSTERS --- */}
      <div className="relative min-h-[50vh] w-full bg-slate-900 shrink-0 flex flex-col justify-between overflow-hidden pb-4">
        {/* Stacked HD Video Backgrounds with Instant Image Poster Fallback & Smooth 1s Crossfade */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-90 z-0' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={slide.image}
              className="w-full h-full object-cover"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          </div>
        ))}

        {/* Soft gradient overlay to preserve readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50/95 pointer-events-none z-0" />

        {/* Consolidated Top Bar Header Card */}
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

            {/* Middle Row: Custom Mode Selectors (Capsule styled) */}
            <div className="flex justify-between items-center gap-3 text-xs font-bold relative z-[10000]">
              {/* Order Type custom selector */}
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

              {/* Active Tab custom selector */}
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

            {/* Bottom Row: Single Search Bar */}
            <div
              onClick={() => {
                if (activeTab === 'route') {
                  navigate('/plan-route')
                } else {
                  handleNearMeClick()
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

        {/* Bottom Carousel Controls & Active Offer Tag overlay */}
        <div className="flex-1 flex flex-col justify-end items-center gap-3 pb-6 z-10">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-slate-950/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl text-white border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center gap-3 max-w-[290px]"
          >
            {/* Visual Icon Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-rose-500/10 shrink-0 text-base">
              {activeSlide === 0 ? '🌶️' : activeSlide === 1 ? '☕' : '🍰'}
            </div>

            {/* Deal Text Layout */}
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

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
        {/* CATEGORIES HORIZONTAL SCROLLER */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Flame size={18} className="text-rose-500" /> Popular Categories
            </h3>
            <Link to="/discovery" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/discovery?category=${cat.name}`)}
                className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 text-xs font-extrabold text-slate-800 shrink-0 transition-all active:scale-95"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VALET PARKING FEATURE SPOTLIGHT BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 relative z-10 max-w-lg">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles size={10} /> Contactless Valet Service
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Order Food & Park Vehicles Contactlessly
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Opt for Valet Parking during checkout. Watchmen handle your vehicle, and you request retrieval with a single tap!
            </p>
          </div>

          <button
            onClick={() => navigate('/plan-route')}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-2 transition-all active:scale-95"
          >
            <Car size={16} /> Plan Route & Valet
          </button>
        </div>

        {/* FEATURED ROUTE PARTNER RESTAURANTS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Store size={20} className="text-indigo-600" /> Featured Takeaway Restaurants
              </h3>
              <p className="text-xs text-slate-500 font-medium">Top rated spots with takeaway & valet parking</p>
            </div>
            <Link to="/discovery" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              See All ({mockRestaurants.length})
            </Link>
          </div>

          {/* Responsive 2-column on Tablet, 3-column on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              />
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
