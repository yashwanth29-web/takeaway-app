import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing'
import RoutePlannerPage from './pages/RoutePlanner'
import DiscoveryPage from './pages/Discovery'
import RestaurantDetailsPage from './pages/RestaurantDetails'
import CheckoutPage from './pages/Checkout'
import TrackingPage from './pages/Tracking'
import PickupPage from './pages/Pickup'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ProfilePage from './pages/Profile'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan-route" element={<RoutePlannerPage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
