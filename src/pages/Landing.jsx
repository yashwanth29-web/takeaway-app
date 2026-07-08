import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Compass, Coffee, ShoppingBag, Utensils, Car, ChefHat, Route } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import LOCATIONS from '../mock/hyderabad_locations.json'
import RESTAURANTS from '../mock/restaurants.json'
import RestaurantCard from '../components/restaurant/RestaurantCard'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('route'); // 'route' or 'nearby'
  const [radius, setRadius] = useState(3);
  const [searchNearMe, setSearchNearMe] = useState('');
  const [selectedNearMe, setSelectedNearMe] = useState(null);
  const [showNearMeDropdown, setShowNearMeDropdown] = useState(false);
  const navigate = useNavigate();

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
      
      {/* --- HERO SECTION WITH MAP BACKGROUND --- */}
      <div className="relative h-[65vh] w-full bg-slate-200 shrink-0">
        <iframe 
          title="Map Background"
          src="https://www.openstreetmap.org/export/embed.html?bbox=78.3300,17.3600,78.5300,17.5300&layer=mapnik" 
          className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-40 mix-blend-luminosity filter contrast-125 saturate-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-slate-50" />
        
        <div className="absolute inset-0 flex flex-col pt-6 px-4 pb-12 z-10">
          <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Compass size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">RouteBite</span>
            </div>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              Order on the way.
            </h1>
            <p className="text-slate-700 font-medium">Pick up without waiting.</p>
          </motion.div>

          {/* UBER STYLE FLOATING SEARCH CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md mx-auto w-full bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50"
          >
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button 
                onClick={() => setActiveTab('route')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'route' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Along Route
              </button>
              <button 
                onClick={() => setActiveTab('nearby')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'nearby' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Near Me
              </button>
            </div>

            {/* Content Route */}
            {activeTab === 'route' && (
              <div className="space-y-4">
                <div onClick={() => navigate('/plan-route')} className="cursor-pointer relative group">
                  <div className="absolute left-4 top-4 w-2 h-2 bg-slate-300 rounded-full z-10" />
                  <div className="absolute left-[19px] top-7 w-[2px] h-6 bg-slate-200 z-10" />
                  <div className="absolute left-4 top-[50px] w-2 h-2 bg-indigo-600 rounded-sm z-10" />
                  
                  <div className="w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-500 border border-slate-200 mb-2">
                    Enter Pickup Location
                  </div>
                  <div className="w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-500 border border-slate-200">
                    Enter Destination
                  </div>
                </div>
                <button onClick={() => navigate('/plan-route')} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">
                  Find Restaurants
                </button>
              </div>
            )}

            {/* Content Nearby */}
            {activeTab === 'nearby' && (
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Current Location..." 
                    value={searchNearMe}
                    onFocus={() => setShowNearMeDropdown(true)}
                    onChange={(e) => {
                      setSearchNearMe(e.target.value);
                      setSelectedNearMe(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                  {showNearMeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div 
                        onClick={() => {
                          setSelectedNearMe(null);
                          setSearchNearMe('Current Location');
                          setShowNearMeDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center gap-3"
                      >
                        <Navigation size={16} className="text-indigo-600" />
                        <p className="text-sm font-bold text-indigo-600">Use Current Location</p>
                      </div>
                      {filteredNearMe.map(loc => (
                        <div 
                          key={loc.id}
                          onClick={() => {
                            setSelectedNearMe(loc);
                            setSearchNearMe(loc.name);
                            setShowNearMeDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                        >
                          <p className="text-sm font-bold text-slate-800">{loc.name}</p>
                          <p className="text-xs text-slate-500 truncate">{loc.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Radius</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{radius} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>

                <button onClick={handleNearMeClick} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors mt-2">
                  Explore Nearby
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 z-20 relative -mt-4 rounded-t-3xl border-t border-white/50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
          
          {/* QUICK CATEGORIES REMOVED */}

          {/* 3D HOW IT WORKS */}
          <div className="pt-4">
            <h3 className="text-center font-bold text-slate-900 mb-10 text-2xl">How RouteBite Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pb-4">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-1 bg-slate-200 rounded-full z-0 shadow-inner"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white to-blue-50 flex items-center justify-center mb-6 border-4 border-white shadow-[0_10px_20px_rgba(59,130,246,0.15),inset_0_-4px_6px_rgba(0,0,0,0.05)] text-blue-600 transform transition-transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(59,130,246,0.2),inset_0_-4px_6px_rgba(0,0,0,0.05)]">
                  <Route size={36} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-slate-900 mb-2 text-lg">1. You Drive</h4>
                <p className="text-sm text-slate-500 font-medium">Enter your route or select your current location.</p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white to-orange-50 flex items-center justify-center mb-6 border-4 border-white shadow-[0_10px_20px_rgba(249,115,22,0.15),inset_0_-4px_6px_rgba(0,0,0,0.05)] text-orange-500 transform transition-transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(249,115,22,0.2),inset_0_-4px_6px_rgba(0,0,0,0.05)]">
                  <ChefHat size={36} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-slate-900 mb-2 text-lg">2. They Cook</h4>
                <p className="text-sm text-slate-500 font-medium">We time the order perfectly with your arrival ETA.</p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white to-green-50 flex items-center justify-center mb-6 border-4 border-white shadow-[0_10px_20px_rgba(34,197,94,0.15),inset_0_-4px_6px_rgba(0,0,0,0.05)] text-green-600 transform transition-transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(34,197,94,0.2),inset_0_-4px_6px_rgba(0,0,0,0.05)]">
                  <ShoppingBag size={36} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-slate-900 mb-2 text-lg">3. Grab & Go</h4>
                <p className="text-sm text-slate-500 font-medium">Your food is hot and ready. <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Zero waiting.</span></p>
              </div>
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

        </div>
      </div>
    </div>
  )
}
