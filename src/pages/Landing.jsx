import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Compass, Coffee, ShoppingBag, Utensils, Car, ChefHat, Route, User, Menu, X, ArrowRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import LOCATIONS from '../mock/hyderabad_locations.json'
import RESTAURANTS from '../mock/restaurants.json'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import useCartStore from '../store/useCartStore'
import ActiveOrderWidget from '../components/ActiveOrderWidget'
import TopCartButton from '../components/cart/TopCartButton'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('route'); // 'route' or 'nearby'
  const [radius, setRadius] = useState(3);
  const [searchNearMe, setSearchNearMe] = useState('');
  const [selectedNearMe, setSelectedNearMe] = useState(null);
  const [showNearMeDropdown, setShowNearMeDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false);
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const navigate = useNavigate();
  const { orderType, setOrderType } = useCartStore();

  React.useEffect(() => {
    if (!orderType) {
      setOrderType('takeaway');
    }
  }, [orderType, setOrderType]);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
      title: '50% FLAT OFF',
      subtitle: 'on all Route Orders today!',
      restaurant: 'All Route Partners'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop&q=80',
      title: 'BUY 1 GET 1 FREE ESPRESSO',
      subtitle: 'at The Grind Coffeehouse',
      restaurant: 'The Grind Coffeehouse'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=80',
      title: 'FREE DESSERT WITH MEAL',
      subtitle: 'at Spice Symphony today',
      restaurant: 'Spice Symphony'
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const filteredNearMe = searchNearMe
    ? LOCATIONS.filter(l => l.name.toLowerCase().includes(searchNearMe.toLowerCase()) || l.address.toLowerCase().includes(searchNearMe.toLowerCase())).slice(0, 5)
    : [];

  const handleNearMeClick = () => {
    let query = `/discovery?mode=nearby&radius=${radius}`;
    if (selectedNearMe) {
      query += `&lat=${selectedNearMe.lat}&lng=${selectedNearMe.lng}`;
    }
    navigate(query);
  };

  const categories = [
    { name: 'Coffee', icon: <Coffee size={24} /> },
    { name: 'Fast Food', icon: <Utensils size={24} /> },
    { name: 'Drive-Thru', icon: <Car size={24} /> },
    { name: 'Healthy', icon: <ShoppingBag size={24} /> }
  ];

  const trendingRestaurants = RESTAURANTS.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">


      {/* --- HERO SECTION WITH AUTO-SLIDING BACKGROUNDS (ZERO BLACK FLASH STACKED CROSSFADE) --- */}
      <div className="relative min-h-[50vh] w-full bg-slate-100 shrink-0 flex flex-col justify-between overflow-hidden pb-4">
        {/* Stacked Background Images with smooth 1s crossfade transition */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-95' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}

        {/* Extremely soft gradient overlay to preserve image center clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-slate-50/95 pointer-events-none" />

        {/* Consolidated Top Bar Header Card */}
        <div className="relative z-10 w-full px-4 pt-4">
          <header className="max-w-md mx-auto w-full bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/40 flex flex-col gap-3">
            {/* Top row: Logo & Cart */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Compass size={18} />
                </div>
                <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 tracking-tight">RouteBite</span>
              </div>
              <TopCartButton />
            </div>

            {/* Middle Row: Custom Mode Selectors (Capsule styled) */}
            <div className="flex justify-between items-center gap-3 text-xs font-bold relative z-[10000]">
              {/* Order Type custom selector */}
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowOrderTypeDropdown(!showOrderTypeDropdown);
                    setShowTabDropdown(false);
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
                          setOrderType('takeaway');
                          setShowOrderTypeDropdown(false);
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${orderType !== 'EAT-IN' ? 'text-indigo-600 bg-slate-50' : ''}`}
                      >
                        Takeaway
                      </div>
                      <div
                        onClick={() => {
                          setOrderType('EAT-IN');
                          setShowOrderTypeDropdown(false);
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${orderType === 'EAT-IN' ? 'text-indigo-600 bg-slate-50' : ''}`}
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
                    setShowTabDropdown(!showTabDropdown);
                    setShowOrderTypeDropdown(false);
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
                          setActiveTab('route');
                          setShowTabDropdown(false);
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${activeTab === 'route' ? 'text-indigo-600 bg-slate-50' : ''}`}
                      >
                        Along Route
                      </div>
                      <div
                        onClick={() => {
                          setActiveTab('nearby');
                          setShowTabDropdown(false);
                        }}
                        className={`px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${activeTab === 'nearby' ? 'text-indigo-600 bg-slate-50' : ''}`}
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
                  navigate('/plan-route');
                } else {
                  navigate(`/discovery?mode=nearby&radius=${radius}`);
                }
              }}
              className="relative cursor-pointer group"
            >
              <input
                type="text"
                placeholder={activeTab === 'route' ? 'Search "pizza", routes or restaurants...' : 'Search "pizza", restaurants or dishes nearby...'}
                className="w-full bg-slate-50 text-slate-800 rounded-2xl py-3 pl-10 pr-4 shadow-inner border border-slate-200 outline-none font-extrabold text-[13px] cursor-pointer placeholder-slate-400 hover:bg-slate-100 transition-colors"
                readOnly
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
            </div>

            {/* Radius Slider (only visible when "Near Me" is selected) */}
            <AnimatePresence>
              {activeTab === 'nearby' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-2.5 bg-slate-900/5 rounded-xl border border-slate-900/5 space-y-1 overflow-hidden"
                >
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Search Radius</span>
                    <span className="text-indigo-600 font-extrabold">{radius} km</span>
                  </div>
                  <input
                    type="range"
                    min="1" max="10"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </header>
        </div>

        {/* Bottom Carousel Controls & Active Offer Tag overlay */}
        <div className="flex-1 flex flex-col justify-end items-center gap-3 pb-6 z-10">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-slate-950/75 backdrop-blur-xl px-4 py-2.5 rounded-2xl text-white border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.25)] flex items-center gap-3 max-w-[280px]"
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
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeSlide ? 'bg-indigo-600 w-3.5' : 'bg-slate-400/75'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 z-20 relative -mt-4 rounded-t-3xl border-t border-white/50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

          {/* QUICK CATEGORIES REMOVED */}

          {/* DEALS & OFFERS CAROUSEL */}
          <div className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Hot Offers Today
              </h3>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Deals Near You</span>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-1">
              {[
                { id: 1, title: '50% Flat Off', desc: 'at Spice Symphony', code: 'ROUTE50', color: 'from-pink-500 to-rose-600', icon: '🌶️', restaurantId: 'r5' },
                { id: 2, title: '1+1 Espresso Special', desc: 'at The Grind Coffeehouse', code: 'COFFEE11', color: 'from-amber-600 to-orange-700', icon: '☕', restaurantId: 'r1' },
                { id: 3, title: 'Free Edamame & Roll', desc: 'at Mizu Sushi Bar', code: 'SUSHIFREE', color: 'from-emerald-500 to-teal-600', icon: '🍣', restaurantId: 'r3' },
                { id: 4, title: 'Flat 20% on Desserts', desc: 'at La Trattoria', code: 'SWEET20', color: 'from-violet-500 to-purple-600', icon: '🍰', restaurantId: 'r4' },
              ].map(deal => (
                <div
                  key={deal.id}
                  onClick={() => navigate(`/restaurant/${deal.restaurantId}?promo=${deal.code}&title=${encodeURIComponent(deal.title)}`)}
                  className={`w-64 shrink-0 bg-gradient-to-br ${deal.color} text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
                >
                  <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 select-none">{deal.icon}</div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">Limited Offer</span>
                    <h4 className="font-extrabold text-lg mt-1.5 leading-tight">{deal.title}</h4>
                    <p className="text-xs text-white/95 font-medium mt-0.5">{deal.desc}</p>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                    <span className="text-xs font-mono font-bold tracking-wider bg-white text-slate-800 px-2 py-1 rounded">Code: {deal.code}</span>
                    <span className="text-xs font-extrabold flex items-center gap-1 cursor-pointer">Claim <ArrowRight size={12} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOARDING PASS PAST TRIPS (CREATIVE REORDER) */}
          <div className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                Boarding Passes (Reorder)
              </h3>
              <span className="text-xs font-semibold text-slate-400">SWIPE TO REORDER</span>
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-1">
              {[
                {
                  id: 1,
                  from: 'GYM',
                  to: 'HOME',
                  item: 'Eggs',
                  restaurantId: 'r1',
                  restaurantName: 'The Grind Coffeehouse',
                  image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&auto=format&fit=crop&q=80',
                  duration: '8m ETA',
                  gate: 'A3'
                },
                {
                  id: 2,
                  from: 'HOME',
                  to: 'OFFICE',
                  item: 'Tiffin',
                  restaurantId: 'r5',
                  restaurantName: 'Spice Symphony',
                  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
                  duration: '15m ETA',
                  gate: 'B1'
                },
                {
                  id: 3,
                  from: 'OFFICE',
                  to: 'PARTY',
                  item: 'Cake',
                  restaurantId: 'r4',
                  restaurantName: 'La Trattoria',
                  image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80',
                  duration: '22m ETA',
                  gate: 'C5'
                }
              ].map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                  className="w-[320px] shrink-0 bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300 flex cursor-pointer relative group"
                >
                  {/* Left Side: Pass Details */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">ROUTE-PASS</span>
                      <span className="text-[9px] font-mono font-medium text-slate-400">GATE {order.gate}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <div className="text-center">
                        <p className="text-lg font-black text-slate-900 tracking-tight">{order.from}</p>
                        <p className="text-[9px] font-bold text-slate-400">ORIGIN</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <div className="w-full border-t-2 border-dashed border-slate-200 relative my-2">
                          <Compass size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 bg-white px-0.5" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">{order.duration}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-slate-900 tracking-tight">{order.to}</p>
                        <p className="text-[9px] font-bold text-slate-400">DEST</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 min-w-0">
                      <img src={order.image} alt={order.item} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{order.item}</p>
                        <p className="text-[9px] font-medium text-slate-400 truncate">{order.restaurantName}</p>
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
                    <span className="text-[10px] font-black text-center leading-tight group-hover:text-white text-indigo-600">REORDER NOW</span>
                    <span className="text-[8px] font-bold text-slate-400 group-hover:text-indigo-200 uppercase tracking-widest">TAP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* "WHERE TO EAT TODAY?" RECOMMENDATIONS */}
          <div className="pb-4">
            <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Where to Eat Today?
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { title: 'Fine Dining Date', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=250&auto=format&fit=crop&q=80', desc: 'Indulge tonight' },
                { title: 'Healthy & Fresh', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=250&auto=format&fit=crop&q=80', desc: 'Clean & green' },
                { title: 'Coffee & Chill', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=250&auto=format&fit=crop&q=80', desc: 'Great cafes' },
                { title: 'Midnight Snacks', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=250&auto=format&fit=crop&q=80', desc: 'Open late' },
              ].map((vibe, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/discovery?mode=nearby&radius=5')}
                  className="relative group overflow-hidden rounded-3xl cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-36 border border-slate-100/10 shadow-sm"
                >
                  {/* Full image backdrop with scale animation on hover */}
                  <img 
                    src={vibe.image} 
                    alt={vibe.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Premium dark gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                  
                  {/* Title & Desc stack */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end">
                    <h4 className="font-black text-white text-sm leading-tight transition-colors">
                      {vibe.title}
                    </h4>
                    <p className="text-[9px] text-slate-200 font-extrabold uppercase tracking-widest mt-0.5">
                      {vibe.desc}
                    </p>
                  </div>
                  
                  {/* Slide-in arrow button indicator */}
                  <div className="absolute right-3.5 bottom-3.5 w-6 h-6 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 shadow-sm z-20 text-white">
                    <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING CAROUSEL */}
          <div className="pb-12">
            <h3 className="font-bold text-slate-900 mb-4 text-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Trending Near You
            </h3>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-1">
              {trendingRestaurants.map(restaurant => (
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
      </div>
      <ActiveOrderWidget />
    </div>
  )
}
