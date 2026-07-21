import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, X, ShieldCheck, Store, User } from 'lucide-react'
import useOrderStore from '../store/useOrderStore'

export default function ActiveOrderWidget() {
  const navigate = useNavigate()
  const { orders } = useOrderStore()
  const [isDismissed, setIsDismissed] = useState(false)

  // Find the most recent active order placed by the customer
  const activeOrder = orders.find((o) => o.status !== 'completed' && o.isCustomerOrder)

  if (!activeOrder || isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-40 flex flex-col items-center pointer-events-none"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl p-3 shadow-2xl shadow-slate-950/40 flex items-center justify-between w-full max-w-sm pointer-events-auto cursor-pointer hover:bg-slate-900 transition-all">
          <div onClick={() => navigate('/tracking')} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0 text-indigo-400 font-bold">
              <Clock size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-xs text-white truncate capitalize">
                Order status: <span className="text-indigo-400">{activeOrder.status}</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold truncate">
                {activeOrder.items.length} items • ${activeOrder.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              Track <ChevronRight size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsDismissed(true)
              }}
              className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors"
              title="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
