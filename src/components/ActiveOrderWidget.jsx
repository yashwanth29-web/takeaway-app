import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import useOrderStore from '../store/useOrderStore';

export default function ActiveOrderWidget() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  
  // Find the most recent active order (for demo purposes, just get the first one that is not completed)
  const activeOrder = orders.find(o => o.status !== 'completed');

  if (!activeOrder) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-4 right-4 z-[90] pointer-events-none flex justify-center"
      >
        <div 
          onClick={() => navigate('/tracking')}
          className="bg-indigo-600 text-white rounded-2xl p-4 shadow-xl shadow-indigo-600/30 flex items-center justify-between w-full max-w-md pointer-events-auto cursor-pointer hover:bg-indigo-700 transition-colors border border-indigo-500"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Order is {activeOrder.status}</h4>
              <p className="text-xs text-indigo-100 opacity-90">{activeOrder.items.length} items • ${activeOrder.total}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-sm font-bold">Track</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
