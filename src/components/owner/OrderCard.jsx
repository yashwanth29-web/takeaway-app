import React from 'react';
import { Clock, CheckCircle, ChefHat, Package, ShoppingBag, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import OrderTimeline from './OrderTimeline';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: Clock,
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: ChefHat,
  },
  ready: {
    label: 'Ready',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Package,
  },
  completed: {
    label: 'Completed',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: CheckCircle,
  }
};

export default function OrderCard({ order, onUpdateStatus }) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  const TypeIcon = order.type === 'dine-in' ? Utensils : ShoppingBag;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-black text-white">{order.id}</span>
            <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-widest", config.color)}>
              <Icon size={12} />
              {config.label}
            </div>
            <div className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-600 flex items-center gap-1 uppercase tracking-widest">
               <TypeIcon size={12} />
               {order.type === 'dine-in' ? 'Dine-in' : 'Takeaway'}
            </div>
          </div>
          <h3 className="text-slate-400 font-medium text-sm">{order.customerName}</h3>
        </div>
        <div className="text-right">
          <div className="font-black text-xl text-white">${order.total.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
            {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="flex-1 mb-8">
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">
                  <span className="text-indigo-400 font-bold mr-2">{item.quantity}x</span>
                  {item.name}
                </span>
                <span className="text-slate-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <OrderTimeline currentStatus={order.status} onStatusChange={(newStatus) => onUpdateStatus(order.id, newStatus)} />
      </div>
    </div>
  );
}
