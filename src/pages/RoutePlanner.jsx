import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, Globe, MapPin, Star, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LOCATIONS from '../mock/hyderabad_locations.json';

export default function RoutePlannerPage() {
  const navigate = useNavigate();
  
  const [activeField, setActiveField] = useState('pickup'); // 'pickup' or 'drop'
  
  const [pickup, setPickup] = useState(null);
  const [pickupText, setPickupText] = useState('');
  
  const [drop, setDrop] = useState(null);
  const [dropText, setDropText] = useState('');
  
  const [showForWho, setShowForWho] = useState(false);
  const [forWho, setForWho] = useState('For me');

  const [showPickupTime, setShowPickupTime] = useState(false);
  const [pickupTime, setPickupTime] = useState('After 10 min');

  // Filter locations based on active field's text
  const filteredLocations = useMemo(() => {
    const query = activeField === 'pickup' ? pickupText.toLowerCase() : dropText.toLowerCase();
    if (!query) return LOCATIONS;
    return LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(query) || loc.address.toLowerCase().includes(query)
    );
  }, [activeField, pickupText, dropText]);

  const handleLocationSelect = (loc) => {
    if (activeField === 'pickup') {
      setPickup(loc);
      setPickupText(loc.name);
      setActiveField('drop');
      
      if (drop) {
        navigate(`/discovery?mode=route&startLat=${loc.lat}&startLng=${loc.lng}&endLat=${drop.lat}&endLng=${drop.lng}`);
      }
    } else {
      setDrop(loc);
      setDropText(loc.name);
      
      if (pickup) {
        navigate(`/discovery?mode=route&startLat=${pickup.lat}&startLng=${pickup.lng}&endLat=${loc.lat}&endLng=${loc.lng}`);
      } else {
        setActiveField('pickup'); 
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex items-center justify-center relative bg-white border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Plan your route</h1>
      </header>

      {/* Top Controls */}
      <div className="px-4 py-4 flex gap-2 relative bg-white">
        {/* Pickup Time Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowPickupTime(!showPickupTime)}
            className="bg-white border border-slate-200 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:bg-slate-50 shadow-sm text-slate-700"
          >
            <Clock size={16} className="text-slate-500" /> {pickupTime} <span className="text-[10px] ml-1 text-slate-400">▼</span>
          </button>
          
          {showPickupTime && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50">
              {['After 10 min', 'After 20 min', 'After 30 min'].map(option => (
                <button 
                  key={option}
                  onClick={() => {
                    setPickupTime(option);
                    setShowPickupTime(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* For me Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowForWho(!showForWho)}
            className="bg-white border border-slate-200 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:bg-slate-50 shadow-sm text-slate-700"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
              <User size={12} />
            </span> 
            {forWho} <span className="text-[10px] ml-1 text-slate-400">▼</span>
          </button>
          
          {showForWho && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50">
              {['For me', 'Friend', 'Family', 'Other'].map(option => (
                <button 
                  key={option}
                  onClick={() => {
                    setForWho(option);
                    setShowForWho(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="px-4 pb-6 flex items-start gap-3 bg-white shadow-sm border-b border-slate-200">
        {/* Connection Line */}
        <div className="flex flex-col items-center mt-3 ml-1">
          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          <div className="w-px h-10 bg-slate-200 my-1"></div>
          <div className="w-2 h-2 rounded-full border-2 border-slate-800 bg-white"></div>
        </div>
        
        {/* Inputs */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-inner">
          <div className={`flex items-center px-4 py-1 border-b border-slate-200 transition-colors ${activeField === 'pickup' ? 'bg-blue-50/50' : ''}`}>
            <input 
              type="text"
              placeholder="Pickup location"
              value={pickupText}
              onFocus={() => setActiveField('pickup')}
              onChange={(e) => {
                setPickupText(e.target.value);
                setPickup(null); // Clear selected location when user types
              }}
              className="w-full bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>
          <div className={`flex items-center px-4 py-1 transition-colors ${activeField === 'drop' ? 'bg-blue-50/50' : ''}`}>
            <input 
              type="text"
              placeholder="Where to?"
              value={dropText}
              onFocus={() => setActiveField('drop')}
              onChange={(e) => {
                setDropText(e.target.value);
                setDrop(null); // Clear selected location when user types
              }}
              className="w-full bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Plus Button */}
        <button className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mt-1 text-xl text-slate-600 hover:bg-slate-200 transition-colors">
          +
        </button>
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc) => (
            <div 
              key={loc.id} 
              onClick={() => handleLocationSelect(loc)}
              className="flex items-start gap-4 p-4 border-b border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                <Clock size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-[15px]">{loc.name}</p>
                <p className="text-slate-500 text-xs mt-1 truncate max-w-[280px]">{loc.address}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400 font-medium">
                {loc.distance}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            <Search size={24} className="mx-auto mb-2 opacity-50" />
            <p>No locations found matching "{activeField === 'pickup' ? pickupText : dropText}"</p>
          </div>
        )}

        {/* Fixed Options at bottom */}
        {filteredLocations.length > 0 && (
          <div className="bg-white">
            <div className="flex items-center gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Globe size={16} />
              </div>
              <p className="font-medium text-[15px]">Search in a different city</p>
            </div>
            
            <div className="flex items-center gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MapPin size={16} />
              </div>
              <p className="font-medium text-[15px]">Set location on map</p>
            </div>

            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer text-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Star size={16} />
              </div>
              <p className="font-medium text-[15px]">Saved places</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
