import React from 'react'
import { MapPin, Star, Clock, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer min-w-[300px] w-[300px] flex-shrink-0"
    >
      <div className="relative h-40">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.offer && (
          <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <Tag size={12} /> {restaurant.offer}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" /> {restaurant.rating}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 text-lg truncate">{restaurant.name}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-3 truncate">{restaurant.cuisine}</p>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-slate-400" />
            <span>{restaurant.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            <span>{restaurant.eta}</span>
          </div>
        </div>
        
        <Link 
          to={`/restaurant/${restaurant.id}`}
          className="mt-4 w-full block text-center py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl transition-colors font-medium text-sm border border-slate-200"
        >
          View Menu
        </Link>
      </div>
    </div>
  )
}
