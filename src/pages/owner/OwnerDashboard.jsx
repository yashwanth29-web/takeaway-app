import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingBag, TrendingUp, Compass, LogOut, LayoutDashboard, Clock, ArrowLeft, Zap, CheckCircle2, Store } from 'lucide-react';
import useOrderStore from '../../store/useOrderStore';
import StatCard from '../../components/owner/StatCard';
import OrderCard from '../../components/owner/OrderCard';
import { useNavigate } from 'react-router-dom';
import restaurantsData from '../../mock/restaurants.json';

export default function OwnerDashboard() {
  const { orders, updateOrderStatus, getRevenueStats, simulateOrder, processPayout, getRestaurantStats } = useOrderStore();
  const stats = getRevenueStats();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants'); // restaurants, active, completed
  const [isSimulating, setIsSimulating] = useState(false);

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const handleSimulate = () => {
    setIsSimulating(true);
    simulateOrder();
    setTimeout(() => setIsSimulating(false), 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20 shadow-sm relative">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Compass size={24} />
           </div>
           <div>
             <span className="text-xl font-black text-slate-900 tracking-tight block">RouteBite</span>
             <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Platform</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-2">
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'restaurants' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Store size={20} />
            Restaurants
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'active' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Clock size={20} />
            Active Orders
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} />
            Exit to App
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="md:hidden w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Command Center</h1>
              <p className="text-slate-500 font-medium text-sm mt-1 hidden sm:block">Manage your marketplace and vendor payouts.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <motion.button 
               whileTap={{ scale: 0.95 }}
               onClick={handleSimulate}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${isSimulating ? 'bg-amber-100 text-amber-700 shadow-amber-500/20' : 'bg-amber-500 text-white shadow-amber-500/30 hover:bg-amber-400'}`}
             >
               <Zap size={18} className={isSimulating ? 'animate-pulse' : ''} />
               Simulate Order
             </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Realized Platform Revenue" 
              value={`$${stats.platformRevenue}`} 
              icon={DollarSign} 
              trend={10.5}
            />
            <StatCard 
              title="Total Vendor Payouts" 
              value={`$${stats.totalPayouts}`} 
              icon={TrendingUp} 
              trend={5.2}
            />
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={ShoppingBag} 
              trend={12.4}
            />
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
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Partner Restaurants</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage commissions and disburse payouts (90% of sales).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {restaurantsData.map(restaurant => {
                    const rStats = getRestaurantStats(restaurant.id);
                    const isOwed = rStats.pendingPayout > 0;
                    
                    return (
                      <div key={restaurant.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                        <div className="flex gap-4">
                          <img src={restaurant.image} alt={restaurant.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg">{restaurant.name}</h3>
                            <p className="text-sm text-slate-500">{restaurant.cuisine}</p>
                            <div className="mt-2 flex gap-4 text-sm font-semibold">
                              <div className="flex flex-col">
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Gross Sales</span>
                                <span className="text-slate-700">${rStats.grossRevenue.toFixed(2)}</span>
                              </div>
                              <div className="w-px h-8 bg-slate-100" />
                              <div className="flex flex-col">
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Orders</span>
                                <span className="text-slate-700">{rStats.totalOrders}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Financial Bar */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Payout</span>
                            <span className={`text-xl font-black ${isOwed ? 'text-indigo-600' : 'text-slate-400'}`}>
                              ${rStats.pendingPayout.toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => processPayout(restaurant.id)}
                            disabled={!isOwed}
                            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isOwed ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-500' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                          >
                            <CheckCircle2 size={16} />
                            {isOwed ? 'Disburse' : 'Paid Up'}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900">Active Network Orders</h2>
                  <div className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-lg">
                    {activeOrders.length} In Progress
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeOrders.length > 0 ? (
                    activeOrders.map(order => (
                      <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <ShoppingBag size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">No active orders</h3>
                      <p className="text-slate-500 font-medium">Use the Simulate Order button above to test the flow.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
