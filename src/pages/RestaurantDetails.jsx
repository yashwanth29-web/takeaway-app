import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchRestaurantById, fetchMenuByRestaurantId } from '../api/restaurantApi'

import MenuItemCard from '../components/restaurant/MenuItemCard';
import FilterChips from '../components/restaurant/FilterChips';
import FloatingCart from '../components/cart/FloatingCart';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurantById(id)
  });

  const { data: menu, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => fetchMenuByRestaurantId(id)
  });
  
  const [vegFilter, setVegFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (isLoadingRestaurant || isLoadingMenu) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!restaurant || !menu) {
    return <div className="min-h-screen flex items-center justify-center">Error loading data.</div>;
  }

  // Filter menu logic
  const filteredMenu = menu.filter(m => {
    if (vegFilter && m.type !== vegFilter) return false;
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    return true;
  });

  const categories = ['All', ...new Set(menu.map(m => m.category))];
  const activeCategories = categoryFilter === 'All' ? [...new Set(filteredMenu.map(m => m.category))] : [categoryFilter];

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      {/* App-like Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-30 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={-1} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-900" />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-900 text-lg leading-tight">{restaurant.name}</h1>
            <p className="text-xs text-slate-500">{restaurant.distance} km away • {restaurant.eta}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
          <Search size={20} />
        </button>
      </header>

      {/* Restaurant Image Gallery */}
      <div className="px-4 pt-4 pb-2">
        <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          {restaurant.offer && (
            <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
              {restaurant.offer}
            </div>
          )}
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white text-sm">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <div className="bg-green-600 text-white p-0.5 rounded-sm"><Star size={12} className="fill-white" /></div>
          {restaurant.rating} (1k+ ratings)
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <Clock size={16} className="text-slate-400" /> {restaurant.preparationTime} mins prep
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="font-medium text-indigo-600">
          Offers available
        </div>
      </div>

      {/* Filter Chips */}
      <FilterChips 
        vegFilter={vegFilter} 
        setVegFilter={setVegFilter} 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
        categories={categories} 
      />

      {/* Menu List */}
      <div className="max-w-3xl mx-auto">
        {activeCategories.map(category => (
          <div key={category} className="mb-4 pt-4">
            <h2 className="font-extrabold text-slate-900 text-xl px-4 mb-4">{category}</h2>
            <div className="px-4">
              {filteredMenu.filter(m => m.category === category).map((item, idx) => (
                <MenuItemCard key={item.id} item={item} idx={idx} />
              ))}
            </div>
            <div className="h-4 bg-slate-100 w-full mt-2" />
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <FloatingCart menu={menu} />
    </div>
  )
}
