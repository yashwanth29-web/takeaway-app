import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/Landing'
import RoutePlannerPage from './pages/RoutePlanner'
import DiscoveryPage from './pages/Discovery'
import RestaurantDetailsPage from './pages/RestaurantDetails'
import CheckoutPage from './pages/Checkout'
import TrackingPage from './pages/Tracking'
import PickupPage from './pages/Pickup'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import WatchmanDashboard from './pages/watchman/WatchmanDashboard'
import ProfilePage from './pages/Profile'
import GlobalNavbar from './components/Navigation/GlobalNavbar'
import useAutoSync from './hooks/useAutoSync'

function AppContent() {
  // Enables 3-second auto-polling & cross-tab real-time sync across Customer, Watchman, and Owner portals
  useAutoSync(3000)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Toaster position="top-right" />
      <GlobalNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plan-route" element={<RoutePlannerPage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/pickup" element={<PickupPage />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/watchman" element={<WatchmanDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
