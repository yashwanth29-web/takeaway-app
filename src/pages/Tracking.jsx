import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, MapPin, ChefHat, Package, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import useOrderStore from '../store/useOrderStore'
import useValetStore from '../store/useValetStore'
import ValetTrackingCard from '../components/tracking/ValetTrackingCard'

export default function TrackingPage() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(15)

  const orders = useOrderStore((state) => state.orders)
  const activeOrder = orders[0]
  const { valetRequests } = useValetStore()

  // Match active order valet request
  const valetRequest =
    activeOrder && activeOrder.valetOpted !== false
      ? valetRequests.find((r) => r.orderId === activeOrder.id || r.tokenNumber === activeOrder.valetToken) ||
        valetRequests.find((r) => r.customerName === 'You') ||
        valetRequests[0]
      : null

  const isValetActive = Boolean(valetRequest)

  useEffect(() => {
    if (timeLeft === 0 && !isValetActive) {
      navigate('/pickup')
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, navigate, isValetActive])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Top Header */}
      <header className="p-3.5 flex items-center justify-between bg-white/90 backdrop-blur-md shadow-sm z-30 relative border-b border-slate-200/80">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black text-slate-900 tracking-tight">Live Order & Valet Telemetry</h1>
        <button
          onClick={() => navigate('/pickup')}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          Pickup QR
        </button>
      </header>

      {/* Map Background Simulation */}
      <div className="absolute top-12 left-0 right-0 h-[28vh] bg-[#e5e3df] overflow-hidden z-0">
        <iframe
          title="Map Background"
          src="https://www.openstreetmap.org/export/embed.html?bbox=78.4300,17.3600,78.5000,17.4300&layer=mapnik"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-60 mix-blend-multiply filter contrast-125 saturate-50"
        />
        <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-indigo-500 rounded-full opacity-50" />

        {/* User Marker */}
        <motion.div
          animate={{ x: [0, 100] }}
          transition={{ duration: 5, ease: 'linear' }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
        </motion.div>

        {/* Restaurant Marker */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 z-10 text-indigo-600">
          <MapPin size={28} className="drop-shadow-md fill-white" />
        </div>
      </div>

      {/* Main Bottom Sheet Scroll Container */}
      <div className="absolute top-[20vh] md:top-[22vh] bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.12)] z-20 flex flex-col max-w-xl mx-auto w-full overflow-y-auto border-t border-slate-200/60 md:mb-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: "url('/bg-pickup.png')" }}
        />

        <div className="relative z-10 p-4 sm:p-6 flex flex-col pb-28 md:pb-12 space-y-4">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-1 shrink-0" />

          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {activeOrder ? `Order #${activeOrder.id}` : 'Preparing your order'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Status: <span className="font-extrabold text-indigo-600 uppercase">Kitchen Preparing</span>
            </p>
          </div>

          {/* Valet Parking Component */}
          {valetRequest && <ValetTrackingCard valetRequest={valetRequest} />}

          {/* Kitchen Order Status Stepper */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Food Order Progress</h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Order Placed & Confirmed</p>
                  <p className="text-[10px] text-slate-500">Sent to kitchen</p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                <div className="absolute -top-3 left-3.5 bottom-5 w-px bg-indigo-200" />
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1.05 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                  className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 z-10 font-bold"
                >
                  <ChefHat size={15} />
                </motion.div>
                <div>
                  <p className="font-bold text-indigo-600">Preparing Food</p>
                  <p className="text-[10px] text-slate-500">Chef is packaging your takeaway</p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative opacity-50">
                <div className="absolute -top-3 left-3.5 bottom-5 w-px bg-slate-200" />
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 z-10">
                  <Package size={15} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Ready for Counter Pickup</p>
                  <p className="text-[10px] text-slate-500">Collect at counter with QR</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/pickup')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              View Counter Pickup Pass & QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
