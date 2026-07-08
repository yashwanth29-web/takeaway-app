import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, MapPin, ChefHat, Package } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TrackingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/pickup');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Map Background Simulation */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-[#e5e3df] overflow-hidden">
        <iframe 
          title="Map Background"
          src="https://www.openstreetmap.org/export/embed.html?bbox=78.4300,17.3600,78.5000,17.4300&layer=mapnik" 
          className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-60 mix-blend-multiply filter contrast-125 saturate-50"
        />
        {/* Route Line Simulation */}
        <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-indigo-500 rounded-full opacity-50" />
        
        {/* User Marker */}
        <motion.div 
          animate={{ x: [0, 100] }}
          transition={{ duration: 5, ease: 'linear' }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg" />
        </motion.div>

        {/* Restaurant Marker */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 z-10 text-indigo-600">
          <MapPin size={32} className="drop-shadow-md fill-white" />
        </div>
      </div>

      <div className="absolute top-[35vh] bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 flex flex-col max-w-lg mx-auto w-full overflow-hidden">
        {/* Background Image for Bottom Half */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: "url('/bg-pickup.png')" }}
        />
        
        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0" />
          
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Preparing your order</h2>
          <p className="text-slate-500 text-center mb-8">Arriving in <span className="font-bold text-indigo-600">Fast</span></p>

          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Order Received</p>
                <p className="text-xs text-slate-500">12:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative">
              <div className="absolute -top-6 left-5 bottom-8 w-px bg-indigo-200" />
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30 z-10"
              >
                <ChefHat size={20} />
              </motion.div>
              <div>
                <p className="font-bold text-indigo-600">Preparing</p>
                <p className="text-xs text-slate-500">Your food is being prepared</p>
              </div>
            </div>

            <div className="flex items-center gap-4 relative opacity-40">
              <div className="absolute -top-6 left-5 bottom-8 w-px bg-slate-200" />
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 z-10">
                <Package size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Ready for Pickup</p>
                <p className="text-xs text-slate-500">Waiting for you to arrive</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 text-center">
            <p className="text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm inline-block px-4 py-1.5 rounded-full">
              Auto-transitioning in {timeLeft}s
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
