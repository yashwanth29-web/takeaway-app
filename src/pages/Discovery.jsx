import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import RestaurantCard from '../components/restaurant/RestaurantCard'
import { fetchRestaurants } from '../api/restaurantApi'
import { fetchRoute } from '../api/routingApi'
import ActiveOrderWidget from '../components/ActiveOrderWidget'
import TopCartButton from '../components/cart/TopCartButton'

// Fix Leaflet's default icon path issues with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom icon to match the design
const createCustomIcon = (isSelected) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${isSelected ? '#4f46e5' : '#0f172a'};
      color: white;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      border: 2px solid white;
      transition: all 0.3s ease;
      transform: scale(${isSelected ? 1.2 : 1});
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to dynamically fly to selected marker
const FlyToMarker = ({ selectedPin, restaurants }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedPin && restaurants) {
      const restaurant = restaurants.find(r => r.id === selectedPin);
      if (restaurant && restaurant.coordinates) {
        map.flyTo([restaurant.coordinates.lat, restaurant.coordinates.lng], 15, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [selectedPin, restaurants, map]);
  return null;
};

// Component to fit map to route bounds
const FitRouteBounds = ({ routeCoordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      // add padding so route isn't exactly touching the edges, especially bottom because of drawer
      map.fitBounds(bounds, { paddingBottomRight: [0, 250], paddingTopLeft: [50, 50] });
    }
  }, [routeCoordinates ? routeCoordinates.length : 0, map]);
  return null;
};

export default function DiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'nearby';
  const radius = parseFloat(searchParams.get('radius')) || 3;
  
  const nearbyLat = parseFloat(searchParams.get('lat'));
  const nearbyLng = parseFloat(searchParams.get('lng'));
  
  const startLat = searchParams.get('startLat');
  const startLng = searchParams.get('startLng');
  const endLat = searchParams.get('endLat');
  const endLng = searchParams.get('endLng');

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants
  });

  const { data: routeCoordinates, isLoading: routeLoading } = useQuery({
    queryKey: ['route', startLng, startLat, endLng, endLat],
    queryFn: () => fetchRoute(startLng, startLat, endLng, endLat),
    enabled: !!(startLat && startLng && endLat && endLng && mode === 'route'),
  });

  const [restaurants, setRestaurants] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    if (!restaurantsData) return;
    
    if (mode === 'nearby') {
      if (nearbyLat && nearbyLng) {
        // Specifically selected a location, show exactly 10 restaurants around it based on radius
        const selected = restaurantsData.slice(0, 10);
        const mappedToRadius = selected.map(r => {
          // Generate uniform random points strictly within the circle
          const rInDeg = radius / 111; // 1 degree is approx 111km
          const angle = Math.random() * 2 * Math.PI;
          const dist = rInDeg * Math.sqrt(Math.random());
          
          const randomLat = nearbyLat + dist * Math.cos(angle);
          const randomLng = nearbyLng + dist * Math.sin(angle);
          
          return {
            ...r,
            coordinates: { lat: randomLat, lng: randomLng }
          };
        });
        setRestaurants(mappedToRadius);
      } else {
        const filtered = restaurantsData.filter(r => parseFloat(r.distance) <= radius);
        setRestaurants(filtered);
      }
    } else if (mode === 'route') {
      if (routeCoordinates && routeCoordinates.length > 0) {
        // Pick 10 dummy restaurants and plot them evenly along the route
        const selected = restaurantsData.slice(0, 10);
        const step = Math.max(1, Math.floor(routeCoordinates.length / 11)); // divide route into segments
        
        const mappedToRoute = selected.map((r, index) => {
          const coordIndex = Math.min((index + 1) * step, routeCoordinates.length - 2); // Avoid origin/dest exact overlap
          return {
            ...r,
            coordinates: { 
              lat: routeCoordinates[coordIndex][0], 
              lng: routeCoordinates[coordIndex][1] 
            }
          };
        });
        setRestaurants(mappedToRoute);
      } else {
        setRestaurants([]);
      }
    } else {
      setRestaurants(restaurantsData);
    }
  }, [mode, radius, restaurantsData, routeCoordinates ? routeCoordinates.map(c => `${c[0]},${c[1]}`).join('|') : '']);

  const handlePinClick = (id) => {
    setSelectedPin(id);
    const element = document.getElementById(`card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  if (restaurantsLoading) {
    return <div className="h-screen flex items-center justify-center">Loading map...</div>;
  }

  // Center map on searched location or default Hyderabad
  const centerPoint = nearbyLat && nearbyLng ? [nearbyLat, nearbyLng] : [17.395, 78.465];

  return (
    <div className="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0 bg-[#e5e3df] overflow-hidden">
        <MapContainer 
          center={centerPoint} 
          zoom={nearbyLat ? 14 : 13} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FlyToMarker selectedPin={selectedPin} restaurants={restaurants} />
          
          {/* User Location (Simulated Center if not routing) */}
          {mode !== 'route' && (
            <>
              {/* Radius Circle */}
              <Circle 
                center={centerPoint} 
                radius={radius * 1000} // Leaflet takes radius in meters
                pathOptions={{ 
                  color: '#3b82f6', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.1, 
                  weight: 1 
                }} 
              />
              
              {/* User Center Pin */}
              <Marker position={centerPoint} icon={
                L.divIcon({
                  className: 'custom-icon',
                  html: `<div style="
                    background-color: #3b82f6;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                  "></div>`,
                  iconSize: [20, 20]
                })
              }>
                <Popup>Your Selected Location</Popup>
              </Marker>
            </>
          )}

          {/* Draw Route Polyline */}
          {routeCoordinates && routeCoordinates.length > 0 && (
            <>
              <Polyline 
                positions={routeCoordinates} 
                pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
              />
              <FitRouteBounds routeCoordinates={routeCoordinates} />
              
              {/* Origin Point */}
              <Marker position={routeCoordinates[0]} icon={
                L.divIcon({
                  className: 'custom-icon',
                  html: `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })
              } />
              
              {/* Destination Point */}
              <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={
                L.divIcon({
                  className: 'custom-icon',
                  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })
              } />
            </>
          )}

          {/* Restaurant Pins */}
          {restaurants.map((r) => {
            if (!r.coordinates || !r.coordinates.lat) return null;
            return (
              <Marker 
                key={r.id}
                position={[r.coordinates.lat, r.coordinates.lng]}
                icon={createCustomIcon(selectedPin === r.id)}
                eventHandlers={{
                  click: () => handlePinClick(r.id),
                }}
              >
                <Popup className="font-sans font-bold shadow-sm rounded-xl">
                  {r.name}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 p-4 z-30 flex items-center gap-4 bg-gradient-to-b from-slate-900/40 to-transparent pb-12 pointer-events-none">
        <Link to="/" className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white transition-colors pointer-events-auto">
          <ArrowLeft size={20} className="text-slate-900" />
        </Link>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg flex-1 pointer-events-auto">
          <h1 className="font-bold text-slate-900 text-sm">
            {mode === 'route' ? 'Restaurants on your route' : `Restaurants within ${radius} km`}
          </h1>
          <p className="text-xs text-slate-500">{restaurants.length} places found</p>
        </div>
        <div className="pointer-events-auto">
          <TopCartButton />
        </div>
      </header>
      
      {/* Bottom Cards Drawer */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 pt-12 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none">
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar pointer-events-auto" style={{ scrollbarWidth: 'none' }}>
          {restaurants.map((r) => (
            <div 
              key={r.id} 
              id={`card-${r.id}`}
              className="snap-center shrink-0"
              onClick={() => setSelectedPin(r.id)}
            >
              <div className={`transition-all duration-300 ${selectedPin === r.id ? '-translate-y-2' : 'scale-95 opacity-90'}`}>
                <RestaurantCard restaurant={r} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ActiveOrderWidget />
    </div>
  )
}
