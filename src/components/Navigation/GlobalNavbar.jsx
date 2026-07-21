import React from 'react'
import { Link as RouterLink, useLocation as useRouterLocation } from 'react-router-dom'
import { Home, User, Store, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GlobalNavbar() {
  const location = useRouterLocation()
  const path = location.pathname

  // Hide bottom navbar on checkout page to prevent overlapping the Confirm Order button
  if (path === '/checkout') return null

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Profile', path: '/profile', icon: <User size={20} /> },
    { label: 'Owner', path: '/owner/dashboard', icon: <Store size={20} /> },
    { label: 'Watchman', path: '/watchman', icon: <ShieldCheck size={20} /> }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-3 flex justify-center">
      <nav className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 text-white rounded-3xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around w-full max-w-md pointer-events-auto relative">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? path === '/' || path === '/discovery' || path === '/plan-route'
              : path.startsWith(item.path)

          return (
            <RouterLink
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[11px] font-extrabold transition-all duration-200 ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-2xl z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 tracking-tight">{item.label}</span>
            </RouterLink>
          )
        })}
      </nav>
    </div>
  )
}
