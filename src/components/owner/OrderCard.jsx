import React from 'react';
import { Clock, CheckCircle, ChefHat, Package, ShoppingBag, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock,
    nextAction: 'preparing',
    actionLabel: 'Start Preparing'
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ChefHat,
    nextAction: 'ready',
    actionLabel: 'Mark Ready'
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Package,
    nextAction: 'completed',
    actionLabel: 'Complete Order'
  },
  completed: {
    label: 'Completed',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: CheckCircle,
    nextAction: null,
    actionLabel: null
  }
};

export default function OrderCard({ order, onUpdateStatus }) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  const TypeIcon = order.type === 'dine-in' ? Utensils : ShoppingBag;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-900">{order.id}</span>
            <div className={cn("px-2 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1", config.color)}>
              <Icon size={12} />
              {config.label}
            </div>
            <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1">
               <TypeIcon size={12} />
               {order.type === 'dine-in' ? 'Dine-in' : 'Takeaway'}
            </div>
          </div>
          <h3 className="text-slate-600 font-medium">{order.customerName}</h3>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-slate-900">${order.total.toFixed(2)}</div>
          <div className="text-xs text-slate-400">
            {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="flex-1 mb-6">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-slate-700 font-medium">
                  <span className="text-slate-400 mr-2">{item.quantity}x</span>
                  {item.name}
                </span>
                <span className="text-slate-500">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {config.nextAction && (
        <button
          onClick={() => onUpdateStatus(order.id, config.nextAction)}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors mt-auto shadow-sm"
        >
          {config.actionLabel}
        </button>
      )}
    </div>
  );
}
