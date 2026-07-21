import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'

export default function FloatingCart({ menu }) {
  const navigate = useNavigate()
  const { getTotalItems, getTotalPrice } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice(menu)

  if (totalItems === 0) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-0 right-0 px-4 z-40 max-w-lg mx-auto"
    >
      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white p-4 rounded-2xl shadow-2xl shadow-slate-950/40 flex items-center justify-between hover:bg-slate-900 transition-all active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
            <ShoppingBag size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm tracking-wide text-white">
              {totalItems} Item{totalItems > 1 ? 's' : ''} in Basket
            </span>
            <span className="text-xs text-indigo-400 font-semibold">Tap to view checkout & valet</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-black text-lg font-mono text-emerald-400">${totalPrice.toFixed(2)}</span>
          <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-indigo-600 text-white flex items-center justify-center transition-colors">
            <ArrowRight size={16} />
          </div>
        </div>
      </button>
    </motion.div>
  )
}
