import React from 'react';
import { Star } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const FoodTypeIcon = ({ type }) => {
  const isVeg = type === 'veg';
  const color = isVeg ? 'border-green-600' : 'border-red-600';
  const innerColor = isVeg ? 'bg-green-600' : 'bg-red-600';
  return (
    <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${color}`}>
      <div className={`w-2 h-2 rounded-full ${innerColor}`} />
    </div>
  );
};

export default function MenuItemCard({ item, idx }) {
  const { cart, addToCart, removeFromCart } = useCartStore();

  return (
    <div className={`py-6 flex gap-4 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-start">
        <FoodTypeIcon type={item.type || 'veg'} />
        {item.bestseller && (
          <div className="flex items-center gap-1 text-[#d97706] text-xs font-bold mt-1.5 mb-1">
            <Star size={10} className="fill-[#d97706]" /> Bestseller
          </div>
        )}
        <h3 className={`font-bold text-slate-800 text-[17px] leading-tight ${item.bestseller ? '' : 'mt-1.5'}`}>{item.name}</h3>
        <div className="flex items-center gap-1 font-bold text-slate-900 text-[15px] mt-1 mb-2">
          ${item.price.toFixed(2)}
        </div>
        {item.rating && (
          <div className="flex items-center gap-1 text-xs font-bold text-green-700 mb-2">
            <div className="bg-green-700 text-white rounded-[4px] px-1 py-[1px] flex items-center"><Star size={10} className="fill-white" /></div> {item.rating} <span className="text-slate-400 font-medium">({item.votes})</span>
          </div>
        )}
        <p className="text-[13px] text-slate-500 leading-snug line-clamp-2 pr-4">{item.description}</p>
      </div>

      {/* Image & Button Section */}
      <div className="relative w-36 h-36 flex-shrink-0 rounded-2xl">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-100" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28">
          {!cart[item.id] ? (
            <button 
              onClick={() => addToCart(item)}
              className="w-full bg-white text-green-600 font-extrabold text-sm py-2 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-all"
            >
              ADD
            </button>
          ) : (
            <div className="w-full bg-green-600 text-white font-extrabold text-sm py-2 rounded-xl shadow-md flex items-center justify-between px-3">
              <button onClick={() => removeFromCart(item)} className="text-xl leading-none px-2 hover:opacity-80 pb-0.5">−</button>
              <span>{cart[item.id]}</span>
              <button onClick={() => addToCart(item)} className="text-xl leading-none px-2 hover:opacity-80 pb-0.5">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
