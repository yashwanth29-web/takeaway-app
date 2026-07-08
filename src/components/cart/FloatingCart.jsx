import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

export default function FloatingCart({ menu }) {
  const navigate = useNavigate();
  const { getTotalItems, getTotalPrice } = useCartStore();
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice(menu);

  if (totalItems === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-3xl mx-auto"
    >
      <button 
        onClick={() => navigate('/checkout')}
        className="w-full bg-[#60b246] text-white p-4 rounded-xl shadow-2xl flex items-center justify-between hover:bg-green-600 transition-colors"
      >
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm uppercase tracking-wide">{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
          <span className="font-extrabold text-sm">View Cart <ArrowLeft className="inline rotate-180 mb-0.5" size={14} /></span>
        </div>
        <span className="font-extrabold text-lg">
          ${totalPrice.toFixed(2)}
        </span>
      </button>
    </motion.div>
  );
}
