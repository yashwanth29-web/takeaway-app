import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, TrendingUp, Compass, Settings, LogOut, LayoutDashboard, Clock } from 'lucide-react';
import useOrderStore from '../../store/useOrderStore';
import StatCard from '../../components/owner/StatCard';
import OrderCard from '../../components/owner/OrderCard';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const { orders, updateOrderStatus, getRevenueStats } = useOrderStore();
  const stats = getRevenueStats();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // active, completed

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Compass size={24} />
           </div>
           <div>
             <span className="text-xl font-bold text-slate-900 tracking-tight block">RouteBite</span>
             <span className="text-xs font-medium text-slate-500">Business</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Exit to App
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, Partner</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Here is what is happening with your restaurant today.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border-2 border-white shadow-sm">
               RP
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Revenue Today" 
              value={`$${stats.totalRevenue}`} 
              icon={DollarSign} 
              trend={12.5}
            />
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={ShoppingBag} 
              trend={8.2}
            />
            <StatCard 
              title="Avg. Order Value" 
              value={`$${stats.averageOrderValue}`} 
              icon={TrendingUp} 
              trend={-2.4}
            />
          </div>

          {/* ORDERS SECTION */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Orders</h2>
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Clock size={16} />
                  Active ({activeOrders.length})
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ShoppingBag size={16} />
                  Completed ({completedOrders.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayOrders.length > 0 ? (
                displayOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No orders yet</h3>
                  <p className="text-slate-500">When customers place orders, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
