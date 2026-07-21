import React from 'react'
import { Link as RouterLink, useLocation as useRouterLocation } from 'react-router-dom'
import { Home, User, Store, ShieldCheck, Compass, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GlobalNavbar() {
  const location = useRouterLocation()
  const path = location.pathname

  if (path === '/checkout') return null

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Profile', path: '/profile', icon: <User size={18} /> },
    { label: 'Owner Portal', path: '/owner/dashboard', icon: <Store size={18} /> },
    { label: 'Watchman', path: '/watchman', icon: <ShieldCheck size={18} /> }
  ]

  return (
    <>
      {/* 1. DESKTOP VIEW NAVBAR (Fixed at Top of Screen - Never covers bottom UI) */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 text-white px-8 py-3.5 items-center justify-between shadow-xl">
        <RouterLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass size={20} />
          </div>
          <div>
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 tracking-tight">
              RouteBite
            </span>
            <span className="text-[10px] font-bold text-amber-400 block -mt-1 tracking-wider uppercase">
              TakeAway & Valet
            </span>
          </div>
        </RouterLink>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? path === '/' || path === '/discovery' || path === '/plan-route'
                : path.startsWith(item.path)

            return (
              <RouterLink
                key={item.label}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </RouterLink>
            )}
          )}
        </nav>
      </header>

      {/* 2. MOBILE VIEW NAVBAR (Fixed at Bottom of Screen) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-2.5 flex justify-center">
        <nav className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 text-white rounded-3xl p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around w-[calc(100vw-1.5rem)] max-w-md pointer-events-auto relative">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? path === '/' || path === '/discovery' || path === '/plan-route'
                : path.startsWith(item.path)

            return (
              <RouterLink
                key={item.label}
                to={item.path}
                className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[10px] font-extrabold transition-all duration-200 ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBgMobile"
                    className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-2xl z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10 tracking-tight">{item.label.replace(' Portal', '')}</span>
              </RouterLink>
            )
          })}
        </nav>
      </div>
    </>
  )
}
