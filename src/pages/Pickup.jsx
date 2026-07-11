import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QrCode, Home, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import useOrderStore from '../store/useOrderStore'

export default function PickupPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[100px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-700 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-sm mx-auto w-full">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] shadow-2xl w-full text-center relative"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full p-2 shadow-xl">
            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Star size={40} className="fill-indigo-600" />
            </div>
          </div>
          
          <div className="pt-8 mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Order Ready!</h2>
            <p className="text-slate-500 text-sm">Show this code at the counter</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 flex justify-center">
            <QrCode size={200} className="text-slate-900" />
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl mb-6">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-3xl font-black text-indigo-600 tracking-widest">#8429</p>
          </div>

          <div className="text-sm font-medium text-slate-600 mb-2">
            Bite Route Cafe
          </div>
          <p className="text-xs text-slate-400 mb-6">
            1.2 km away
          </p>

          <button 
            onClick={() => {
              useOrderStore.getState().completeActiveOrder();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <Home size={20} />
            Return Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}
