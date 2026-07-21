import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Car, Clock, CheckCircle2, AlertTriangle, MapPin, Search, ShieldCheck, ArrowRight, RefreshCw, ChevronRight, Sparkles, BellRing, Navigation } from 'lucide-react'
import useValetStore from '../../store/useValetStore'

export default function WatchmanDashboard() {
  const { valetRequests, parkingSlots, receiveVehicle, startVehicleDelivery, completeVehicleDelivery } = useValetStore()

  const [activeTab, setActiveTab] = useState('waiting') // 'waiting' | 'parked' | 'requests' | 'completed'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequestForPark, setSelectedRequestForPark] = useState(null)
  const [selectedSlotId, setSelectedSlotId] = useState('')

  // High priority requests (customers who clicked "Bring my vehicle now?")
  const urgentRetrievals = valetRequests.filter((r) => r.currentStatus === 'REQUESTED')
  const activeRetrieval = urgentRetrievals[0]

  // Filter requests
  const filteredRequests = valetRequests.filter((r) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      r.vehicleNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.tokenNumber.toLowerCase().includes(q)

    if (!matchesSearch) return false

    if (activeTab === 'waiting') return r.currentStatus === 'WAITING' || r.currentStatus === 'ARRIVED'
    if (activeTab === 'parked') return r.currentStatus === 'PARKED'
    if (activeTab === 'requests') return r.currentStatus === 'REQUESTED' || r.currentStatus === 'DELIVERING'
    if (activeTab === 'completed') return r.currentStatus === 'COMPLETED'
    return true
  })

  const waitingCount = valetRequests.filter((r) => r.currentStatus === 'WAITING' || r.currentStatus === 'ARRIVED').length
  const parkedCount = valetRequests.filter((r) => r.currentStatus === 'PARKED').length
  const requestsCount = valetRequests.filter((r) => r.currentStatus === 'REQUESTED' || r.currentStatus === 'DELIVERING').length
  const completedCount = valetRequests.filter((r) => r.currentStatus === 'COMPLETED').length

  const availableSlots = parkingSlots.filter((s) => s.status === 'Available')

  const handleConfirmParking = () => {
    if (!selectedRequestForPark || !selectedSlotId) return
    receiveVehicle(selectedRequestForPark.id, selectedSlotId, 'wm-1', 'Ramesh Kumar')
    setSelectedRequestForPark(null)
    setSelectedSlotId('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Mobile Top Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 md:top-16 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white flex items-center gap-2">
              Watchman Valet Portal
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400">Duty Watchman: Ramesh Kumar (Shift A)</p>
          </div>
        </div>

        <RouterLink
          to="/owner/dashboard"
          className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-all"
        >
          Owner View
        </RouterLink>
      </header>

      {/* URGENT RETRIEVAL NOTIFICATION BANNER (When Customer clicks "Bring my vehicle now?") */}
      {activeRetrieval && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 text-white p-4 shadow-2xl border-b border-rose-500 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-[73px] z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <BellRing size={22} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                  HIGH PRIORITY ALERT
                </span>
                <span className="font-mono font-bold text-amber-300 text-xs">{activeRetrieval.tokenNumber}</span>
              </div>
              <p className="font-black text-sm text-white mt-0.5">
                Vehicle <span className="font-mono text-amber-200 uppercase">{activeRetrieval.vehicleNumber}</span> from Slot{' '}
                <span className="bg-slate-900 text-emerald-400 font-mono px-2 py-0.5 rounded-md">{activeRetrieval.parkingSlot}</span>
              </p>
              <p className="text-xs text-rose-100 font-medium">Customer {activeRetrieval.customerName} is waiting at Exit Gate 1</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('requests')
              startVehicleDelivery(activeRetrieval.id)
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 border border-amber-500/30 transition-all active:scale-95"
          >
            <Car size={16} /> Fetch Vehicle Now
          </button>
        </div>
      )}

      {/* Metric Quick Stats */}
      <div className="p-3 bg-slate-900/50 border-b border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-slate-400 text-[10px] uppercase font-bold">Arrivals</span>
          <span className="font-black text-amber-400 text-lg">{waitingCount}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-slate-400 text-[10px] uppercase font-bold">Parked</span>
          <span className="font-black text-blue-400 text-lg">{parkedCount}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 relative">
          {requestsCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />}
          <span className="block text-slate-400 text-[10px] uppercase font-bold">Requests</span>
          <span className="font-black text-rose-400 text-lg">{requestsCount}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="block text-slate-400 text-[10px] uppercase font-bold">Free Slots</span>
          <span className="font-black text-emerald-400 text-lg">{availableSlots.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('waiting')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'waiting'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Waiting ({waitingCount})
        </button>

        <button
          onClick={() => setActiveTab('parked')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'parked'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Parked ({parkedCount})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all relative ${
            activeTab === 'requests'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 animate-pulse'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          {requestsCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-1" />}
          Retrievals ({requestsCount})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search vehicle number, token VP-..., name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="p-3 flex-1 space-y-3 pb-24">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <Car size={36} className="mx-auto opacity-30" />
            <p className="text-sm font-semibold">No vehicles in this section</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-slate-900 border p-4 rounded-2xl space-y-3 shadow-lg relative overflow-hidden transition-all ${
                req.currentStatus === 'REQUESTED' ? 'border-rose-500/80 shadow-rose-500/10' : 'border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {req.tokenNumber}
                  </span>
                  <h3 className="text-lg font-black tracking-wider font-mono text-white mt-1 uppercase">
                    {req.vehicleNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {req.customerName} • <span className="text-slate-300 font-medium">{req.vehicleType}</span> ({req.vehicleColor || 'Any'})
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
                      req.currentStatus === 'REQUESTED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {req.currentStatus}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                    <Clock size={12} /> {req.arrivalTime}
                  </p>
                </div>
              </div>

              {/* Slot / Details Tag */}
              {req.parkingSlot && (
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Assigned Slot:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">{req.parkingSlot}</span>
                </div>
              )}

              {/* Action Buttons based on status */}
              <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                {(req.currentStatus === 'WAITING' || req.currentStatus === 'ARRIVED') && (
                  <button
                    onClick={() => {
                      setSelectedRequestForPark(req)
                      setSelectedSlotId(availableSlots[0]?.id || '')
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Car size={16} /> Vehicle Received & Assign Slot
                  </button>
                )}

                {req.currentStatus === 'REQUESTED' && (
                  <button
                    onClick={() => startVehicleDelivery(req.id)}
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Car size={18} /> Bring Vehicle (Fetch from Slot {req.parkingSlot})
                  </button>
                )}

                {req.currentStatus === 'DELIVERING' && (
                  <button
                    onClick={() => completeVehicleDelivery(req.id)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={18} /> Hand Vehicle to Customer (Complete)
                  </button>
                )}

                {req.currentStatus === 'PARKED' && (
                  <div className="w-full text-center text-xs text-slate-400 py-1 font-semibold">
                    Parked safely in slot <strong className="text-emerald-400 font-mono">{req.parkingSlot}</strong>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Parking Slot Modal */}
      {selectedRequestForPark && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Assign Parking Slot</span>
                <h3 className="text-xl font-black font-mono text-white">{selectedRequestForPark.vehicleNumber}</h3>
                <p className="text-xs text-slate-400">Customer: {selectedRequestForPark.customerName}</p>
              </div>
              <button
                onClick={() => setSelectedRequestForPark(null)}
                className="text-slate-400 hover:text-white font-bold p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Available Parking Slots ({availableSlots.length} Free)
              </label>

              {availableSlots.length === 0 ? (
                <p className="text-xs text-rose-400 font-bold p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  No slots currently available! Please create or free a slot.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-2.5 rounded-xl border text-xs font-mono font-bold text-center transition-all ${
                        selectedSlotId === slot.id
                          ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-sm">{slot.name}</span>
                      <span className="text-[9px] font-sans opacity-70 block">{slot.zone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedRequestForPark(null)}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={!selectedSlotId}
                onClick={handleConfirmParking}
                className="py-3 bg-amber-500 disabled:bg-slate-800 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20"
              >
                Confirm & Park
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
