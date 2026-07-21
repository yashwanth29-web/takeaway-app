import React from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, Home, CheckCircle2, ShieldCheck, Car, Store, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import useOrderStore from '../store/useOrderStore'
import useValetStore from '../store/useValetStore'

export default function PickupPage() {
  const navigate = useNavigate()
  const orders = useOrderStore((state) => state.orders)
  const activeOrder = orders[0]
  const { valetRequests } = useValetStore()

  const valetRequest = activeOrder ? valetRequests.find((r) => r.orderId === activeOrder.id) : null

  const handleReturnHome = () => {
    useOrderStore.getState().completeActiveOrder()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden pt-20 md:pt-24 pb-28 md:pb-16 px-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Responsive Card Container */}
      <main className="w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl text-center space-y-5 relative"
        >
          {/* Top Check Icon Badge */}
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Order Ready for Pickup!</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              Show this pass at the counter to collect your takeaway
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-5 rounded-2xl shadow-inner max-w-[220px] mx-auto border border-slate-200">
            <QrCode size={180} className="text-slate-950 mx-auto" />
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-2">
              Scan for Counter Verification
            </p>
          </div>

          {/* Order Number Badge */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Pickup Order Pass
              </span>
              <span className="text-xl font-mono font-black text-indigo-400">
                {activeOrder ? `#${activeOrder.id}` : '#ORD-9541'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Status
              </span>
              <span className="text-xs font-bold text-slate-200 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                READY AT COUNTER
              </span>
            </div>
          </div>

          {/* Valet Parking Summary if Opted */}
          {valetRequest && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex items-center justify-between text-left text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Car size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-300">Valet Service Active</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Token: <span className="font-mono text-amber-400">{valetRequest.tokenNumber}</span> • Slot:{' '}
                    <span className="font-mono text-emerald-400">{valetRequest.parkingSlot || 'Assigned'}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-1 rounded-lg">
                {valetRequest.currentStatus}
              </span>
            </div>
          )}

          {/* Return Home Action Button */}
          <button
            onClick={handleReturnHome}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Home size={18} /> Complete & Return Home
          </button>
        </motion.div>
      </main>
    </div>
  )
}
