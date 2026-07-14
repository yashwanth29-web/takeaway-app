import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingBag, TrendingUp, Compass, LogOut, Clock, ArrowLeft, Zap, CheckCircle2, Store, Plus, X, Image as ImageIcon } from 'lucide-react';
import useOrderStore from '../../store/useOrderStore';
import useRestaurantStore from '../../store/useRestaurantStore';
import StatCard from '../../components/owner/StatCard';
import OrderCard from '../../components/owner/OrderCard';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const { orders, updateOrderStatus, getRevenueStats, simulateOrder, processPayout, getRestaurantStats } = useOrderStore();
  const { restaurants, addRestaurant } = useRestaurantStore();
  const stats = getRevenueStats();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants'); // restaurants, active, completed
  const [isSimulating, setIsSimulating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRest, setNewRest] = useState({ name: '', cuisine: '', image: '' });

  const activeOrders = orders.filter(o => o.status !== 'completed');
  
  const handleSimulate = () => {
    setIsSimulating(true);
    simulateOrder();
    setTimeout(() => setIsSimulating(false), 300);
  };

  const handleAddRestaurant = (e) => {
    e.preventDefault();
    if (!newRest.name || !newRest.cuisine) return;
    addRestaurant(newRest);
    setNewRest({ name: '', cuisine: '', image: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR (Glassmorphism) */}
      <div className="w-72 bg-slate-800/50 backdrop-blur-2xl border-r border-slate-700/50 hidden md:flex flex-col z-20 relative">
        <div className="p-8 flex items-center gap-4">
           <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Compass size={26} strokeWidth={2.5} />
           </div>
           <div>
             <span className="text-2xl font-black text-white tracking-tight block">RouteBite</span>
             <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">Platform OS</span>
           </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'restaurants' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Store size={20} />
            Partner Network
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'active' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Clock size={20} />
            Live Orders
          </button>
        </nav>

        <div className="p-6">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Exit System
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 p-6 lg:px-10 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="md:hidden w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Command Center</h1>
              <p className="text-slate-400 font-medium text-sm mt-1 hidden sm:block">Real-time marketplace telemetry & vendor payouts.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <motion.button 
               whileTap={{ scale: 0.95 }}
               onClick={handleSimulate}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all border ${isSimulating ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20' : 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-900 border-amber-400 hover:from-amber-300 hover:to-amber-500 shadow-amber-500/20'}`}
             >
               <Zap size={18} className={isSimulating ? 'animate-pulse' : ''} />
               Simulate Network Traffic
             </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={80} />
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Realized Revenue</h3>
              <p className="text-4xl font-black text-white">${stats.platformRevenue}</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={80} />
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Vendor Payouts</h3>
              <p className="text-4xl font-black text-white">${stats.totalPayouts}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShoppingBag size={80} />
              </div>
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Total Network Orders</h3>
              <p className="text-4xl font-black text-white">{stats.totalOrders}</p>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <AnimatePresence mode="wait">
            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Partner Restaurants</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage network commissions and disburse payouts.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <Plus size={18} />
                    Add Partner
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {restaurants.map(restaurant => {
                    const rStats = getRestaurantStats(restaurant.id);
                    const isOwed = rStats.pendingPayout > 0;
                    
                    return (
                      <div key={restaurant.id} className="bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-700/50 p-6 shadow-xl flex flex-col gap-6 hover:border-slate-600/50 transition-colors">
                        <div className="flex gap-5 items-center">
                          <img src={restaurant.image} alt={restaurant.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shadow-md" />
                          <div className="flex-1">
                            <h3 className="font-black text-white text-xl">{restaurant.name}</h3>
                            <p className="text-sm font-medium text-slate-400">{restaurant.cuisine} • ID: {restaurant.id}</p>
                            <div className="mt-3 flex gap-6 text-sm font-bold">
                              <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Gross Volume</span>
                                <span className="text-slate-200">${rStats.grossRevenue.toFixed(2)}</span>
                              </div>
                              <div className="w-px h-8 bg-slate-700" />
                              <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Orders</span>
                                <span className="text-slate-200">{rStats.totalOrders}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Financial Bar */}
                        <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Ledger</span>
                            <span className={`text-2xl font-black ${isOwed ? 'text-indigo-400' : 'text-slate-500'}`}>
                              ${rStats.pendingPayout.toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => processPayout(restaurant.id)}
                            disabled={!isOwed}
                            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isOwed ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                          >
                            <CheckCircle2 size={18} />
                            {isOwed ? 'Disburse Funds' : 'Settled'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-white tracking-tight">Active Network Orders</h2>
                  <div className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                    {activeOrders.length} In Progress
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeOrders.length > 0 ? (
                    activeOrders.map(order => (
                      <div key={order.id} className="bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-700/50 p-6">
                        <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-3xl border border-slate-700/50 border-dashed">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                        <ShoppingBag size={40} />
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">Network Idle</h3>
                      <p className="text-slate-400 font-medium max-w-sm mx-auto">Trigger the Simulator above to flood the network with test orders.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ADD RESTAURANT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-8 w-full max-w-md relative z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-2">New Partner</h2>
              <p className="text-slate-400 font-medium text-sm mb-8">Onboard a new vendor to the platform network.</p>

              <form onSubmit={handleAddRestaurant} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Restaurant Name</label>
                  <input 
                    type="text"
                    required
                    value={newRest.name}
                    onChange={(e) => setNewRest({...newRest, name: e.target.value})}
                    placeholder="e.g. Joe's Pizza"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cuisine Type</label>
                  <input 
                    type="text"
                    required
                    value={newRest.cuisine}
                    onChange={(e) => setNewRest({...newRest, cuisine: e.target.value})}
                    placeholder="e.g. Italian, Sushi, Burgers"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ImageIcon size={14} /> Upload Cover Image
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewRest({...newRest, image: URL.createObjectURL(file)});
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 rounded-xl px-4 py-2 focus:outline-none transition-all text-sm"
                  />
                  {newRest.image && (
                    <div className="mt-2 text-xs text-emerald-400 font-medium">Image selected</div>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Onboard Restaurant
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
