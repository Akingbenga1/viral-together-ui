'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom animated marker icon
const createAnimatedIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin">
        <div class="marker-bounce"></div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
};

// Enhanced map controller component with zoom control
 const MapController = ({ 
   position, 
   onLocationSelect,
   zoomLevel = 15,
   isSearchResult = false,
   isAnimating = false
 }: { 
   position: [number, number]; 
   onLocationSelect: (lat: number, lng: number) => void;
   zoomLevel?: number;
   isSearchResult?: boolean;
   isAnimating?: boolean;
 }) => {
  const map = useMap();
  
     useEffect(() => {
     if (map && position) {
       // Determine optimal zoom level based on context
       let optimalZoom = zoomLevel;
       
       if (isSearchResult) {
         // For search results, use a closer zoom to show more detail
         optimalZoom = 16;
       }
       
       // Smooth fly to new location with animation and controlled zoom
       map.flyTo(position, optimalZoom, {
         duration: 1.5,
         easeLinearity: 0.25
       });
     }
   }, [position, map, zoomLevel, isSearchResult]);
   
   // Add effect to handle zoom level changes independently
   useEffect(() => {
     if (map && !isAnimating) {
       // Only change zoom if not currently animating to avoid conflicts
       // Add a small delay to make zoom changes smoother
       const timeoutId = setTimeout(() => {
         map.setZoom(zoomLevel);
       }, 100);
       
       return () => clearTimeout(timeoutId);
     }
   }, [zoomLevel, map, isAnimating]);
  
  return null;
}

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number, cityName?: string, countryCode?: string, countryName?: string, displayName?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log('Map clicked at:', { lat, lng });
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const InteractiveMap = ({ 
  onLocationSelect, 
  initialLat = 40.7128, 
  initialLng = -74.0060
}: InteractiveMapProps) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [markerKey, setMarkerKey] = useState(0); // For marker animation
  const [zoomLevel, setZoomLevel] = useState(15); // Default zoom level
  const [isSearchResult, setIsSearchResult] = useState(false); // Track if current position is from search
  const [loadingMessage, setLoadingMessage] = useState(''); // Message for full-page loader
     const [autocompleteResults, setAutocompleteResults] = useState<Array<{display_name: string, lat: string, lon: string}>>([]);
   const [showAutocomplete, setShowAutocomplete] = useState(false);
   const [isSearching, setIsSearching] = useState(false);
   
   // Close autocomplete when clicking outside
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       const target = event.target as Element;
       if (!target.closest('.search-container')) {
         setShowAutocomplete(false);
       }
     };
     
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('InteractiveMap handleLocationSelect called with:', { lat, lng });
    
    // Trigger marker animation
    setMarkerKey(prev => prev + 1);
    
    setPosition([lat, lng]);
    
    // Reset search result flag for manual map clicks
    setIsSearchResult(false);
    
    // Get city and country info from coordinates using reverse geocoding
    // This is just for form filling, not for API calls
    getLocationInfo(lat, lng);
  };

  const getLocationInfo = async (lat: number, lng: number) => {
    try {
      console.log('Getting location info from coordinates for form update only');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        // Extract street name (road) for the toast message
        const streetName = data.address.road || data.address.street || data.address.highway || '';
        const cityName = data.address.city || data.address.town || data.address.village || data.address.county || '';
        const countryCode = data.address.country_code?.toUpperCase() || '';
        const countryName = data.address.country || '';
        
        // Use street name if available, otherwise fall back to city name
        const displayName = streetName || cityName;
        
        console.log('Location info obtained - calling onLocationSelect for form update only:', { displayName, cityName, countryCode, countryName });
        // This is just for form filling, not for API calls
        onLocationSelect(lat, lng, cityName, countryCode, countryName, displayName);
      } else {
        console.log('No address data found - calling onLocationSelect for form update only');
        // This is just for form filling, not for API calls
        onLocationSelect(lat, lng);
      }
    } catch (error) {
      console.error('Error getting location info:', error);
      console.log('Error occurred - calling onLocationSelect for form update only');
      // This is just for form filling, not for API calls
      onLocationSelect(lat, lng);
    }
  };

         const searchLocation = async (query?: string) => {
     const searchTerm = query || searchQuery;
     if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) return;
    
    setIsLoading(true);
    setIsAnimating(true);
    setLoadingMessage('Finding your location...');
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        // Trigger marker animation
        setMarkerKey(prev => prev + 1);
        
        // Set position and trigger smooth animation
        setPosition(newPosition);
        
        // Mark this as a search result for zoom control
        setIsSearchResult(true);
        
        // After finding coordinates from search, get detailed address info using reverse geocoding
        // This ensures we get the same detailed address structure as map clicks
        try {
          const reverseResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
          );
          const reverseData = await reverseResponse.json();
          
          if (reverseData && reverseData.address) {
            // Extract street name (road) for the toast message - same logic as getLocationInfo
            const streetName = reverseData.address.road || reverseData.address.street || reverseData.address.highway || '';
            const cityName = reverseData.address.city || reverseData.address.town || reverseData.address.village || reverseData.address.county || '';
            const countryCode = reverseData.address.country_code?.toUpperCase() || '';
            const countryName = reverseData.address.country || '';
            
            // Use street name if available, otherwise fall back to city name
            const displayName = streetName || cityName;
            
            // This is just for form filling, not for API calls
            onLocationSelect(parseFloat(lat), parseFloat(lon), cityName, countryCode, countryName, displayName);
          } else {
            // Fallback to basic info from search result
            const parts = data[0].display_name.split(', ');
            const cityName = parts[0] || '';
            const countryCode = parts[parts.length - 1]?.substring(0, 2).toUpperCase() || '';
            const countryName = parts[parts.length - 1] || '';
            const displayName = cityName;
            
            onLocationSelect(parseFloat(lat), parseFloat(lon), cityName, countryCode, countryName, displayName);
          }
        } catch (reverseError) {
          console.error('Error getting reverse geocoding:', reverseError);
          // Fallback to basic info from search result
          const parts = data[0].display_name.split(', ');
          const cityName = parts[0] || '';
          const countryCode = parts[parts.length - 1]?.substring(0, 2).toUpperCase() || '';
          const countryName = parts[parts.length - 1] || '';
          const displayName = cityName;
          
          onLocationSelect(parseFloat(lat), parseFloat(lon), cityName, countryCode, countryName, displayName);
        }
      } else {
        console.log('Location not found:', searchTerm);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage(''); // Clear loading message
      // Keep animation state for a bit longer for smooth transition
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

           // Autocomplete search function
  const searchAutocomplete = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setAutocompleteResults(data);
        setShowAutocomplete(true);
      } else {
        setAutocompleteResults([]);
        setShowAutocomplete(false);
      }
    } catch (error) {
      console.error('Error searching autocomplete:', error);
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = async (result: {display_name: string, lat: string, lon: string}) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Update search query
    setSearchQuery(result.display_name);
    setShowAutocomplete(false);
    
    // Trigger marker animation
    setMarkerKey(prev => prev + 1);
    
    // Set position and trigger smooth animation
    setPosition([lat, lng]);
    
    // Mark this as a search result for zoom control
    setIsSearchResult(true);
    
    // Get detailed address info using reverse geocoding
    try {
      const reverseResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const reverseData = await reverseResponse.json();
      
      if (reverseData && reverseData.address) {
        // Extract street name (road) for the toast message
        const streetName = reverseData.address.road || reverseData.address.street || reverseData.address.highway || '';
        const cityName = reverseData.address.city || reverseData.address.town || reverseData.address.village || reverseData.address.county || '';
        const countryCode = reverseData.address.country_code?.toUpperCase() || '';
        const countryName = reverseData.address.country || '';
        
        // Use street name if available, otherwise fall back to city name
        const displayName = streetName || cityName;
        
        // This is just for form filling, not for API calls
        onLocationSelect(lat, lng, cityName, countryCode, countryName, displayName);
      } else {
        // Fallback to basic info from search result
        const parts = result.display_name.split(', ');
        const cityName = parts[0] || '';
        const countryCode = parts[parts.length - 1]?.substring(0, 2).toUpperCase() || '';
        const countryName = parts[parts.length - 1] || '';
        const displayName = cityName;
        
        onLocationSelect(lat, lng, cityName, countryCode, countryName, displayName);
      }
    } catch (reverseError) {
      console.error('Error getting reverse geocoding:', reverseError);
      // Fallback to basic info from search result
      const parts = result.display_name.split(', ');
      const cityName = parts[0] || '';
      const countryCode = parts[parts.length - 1]?.substring(0, 2).toUpperCase() || '';
      const countryName = parts[parts.length - 1] || '';
      const displayName = cityName;
      
      onLocationSelect(lat, lng, cityName, countryCode, countryName, displayName);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setIsAnimating(true);
      setLoadingMessage('Finding your current location...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition: [number, number] = [latitude, longitude];
          
          // Trigger marker animation
          setMarkerKey(prev => prev + 1);
          
          setPosition(newPosition);
          
          // Reset search result flag for current location
          setIsSearchResult(false);
          console.log('Current location obtained - calling getLocationInfo for form update only');
          // Get city and country info for current location and update form
          // This is ONLY for form filling, NOT for API calls
          getLocationInfo(latitude, longitude);
          
          // Reset loading state
          setIsLoading(false);
          setLoadingMessage(''); // Clear loading message
          setTimeout(() => setIsAnimating(false), 2000);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please search manually or click on the map.');
          setIsLoading(false);
          setIsAnimating(false);
          setLoadingMessage(''); // Clear loading message
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Full Page Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Search</h3>
            <p className="text-gray-600">{loadingMessage}</p>
          </div>
        </div>
      )}
                           <div className="flex gap-2 relative search-container">
                   <input
            type="text"
            value={searchQuery}
                         onChange={(e) => {
               const value = e.target.value;
               setSearchQuery(value);
               // Trigger autocomplete search as user types
               searchAutocomplete(value);
             }}
            placeholder="Search location (e.g., New York, London)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchLocation();
              }
            }}
                     />
           
           {/* Autocomplete Dropdown */}
           {showAutocomplete && (
             <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-40 max-h-60 overflow-y-auto light-scrollbar">
               {isSearching ? (
                 <div className="px-3 py-4 text-center text-gray-500">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                   Searching...
                 </div>
               ) : autocompleteResults.length > 0 ? (
                 autocompleteResults.map((result, index) => (
                   <div
                     key={index}
                     onClick={() => handleAutocompleteSelect(result)}
                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                   >
                     <div className="text-sm text-gray-900">{result.display_name}</div>
                   </div>
                 ))
               ) : (
                 <div className="px-3 py-2 text-gray-500 text-sm">No locations found</div>
               )}
             </div>
           )}
           
                                    <button
            type="button"
            onClick={() => searchLocation(searchQuery)}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md transition-all duration-200 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
                 <button
           type="button"
           onClick={getCurrentLocation}
           disabled={isLoading}
           className={`px-4 py-2 text-white rounded-md transition-all duration-200 ${
             isLoading 
               ? 'bg-green-400 cursor-not-allowed' 
               : 'bg-green-600 hover:bg-green-700'
           }`}
           title="Use my current location"
         >
           {isLoading ? (
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
           ) : (
             '📍'
           )}
         </button>
      </div>

      {/* Zoom Level Control */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Zoom Level: {zoomLevel}</label>
          <span className="text-xs text-gray-500">
            {zoomLevel <= 10 ? 'Country/Region' : 
             zoomLevel <= 13 ? 'City' : 
             zoomLevel <= 16 ? 'Street' : 'Building'}
          </span>
        </div>
                 <input
           type="range"
           min="5"
           max="18"
           value={zoomLevel}
           onChange={(e) => setZoomLevel(parseInt(e.target.value))}
           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-200"
         />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 (Far)</span>
          <span>18 (Close)</span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
                     <Marker 
             position={position} 
             key={markerKey}
             icon={createAnimatedIcon()}
             eventHandlers={{
               click: () => {
                 // When marker is clicked, trigger location selection
                 handleLocationSelect(position[0], position[1]);
               }
             }}
           >
             <Popup>
               Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
             </Popup>
           </Marker>
          <MapClickHandler onLocationSelect={handleLocationSelect} />
                     <MapController 
             position={position} 
             onLocationSelect={handleLocationSelect}
             zoomLevel={zoomLevel}
             isSearchResult={isSearchResult}
             isAnimating={isAnimating}
           />
        </MapContainer>
      </div>

      {/* Animation Status Indicator */}
      {isAnimating && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-700 font-medium">
              Smoothly navigating to new location...
            </span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-600 mb-2">Coordinates:</p>
        <div className="grid grid-cols-2 gap-4">
                     <div>
             <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
             <input
               type="number"
               value={position[0]}
               onChange={(e) => {
                 const lat = parseFloat(e.target.value) || 0;
                 setPosition([lat, position[1]]);
                 // This is just for form filling, not for API calls
                 onLocationSelect(lat, position[1]);
               }}
               step="any"
               className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
             />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
             <input
               type="number"
               value={position[1]}
               onChange={(e) => {
                 const lng = parseFloat(e.target.value) || 0;
                 setPosition([position[0], lng]);
                 // This is just for form filling, not for API calls
                 onLocationSelect(position[0], lng);
               }}
               step="any"
               className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
             />
           </div>
        </div>
      </div>

             {/* Instructions */}
               <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">💡 How to use the map:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Click anywhere on the map to select a location</li>
            <li>Type in the search field to see autocomplete suggestions</li>
            <li>Click on any autocomplete result to instantly navigate to that location</li>
            <li>Use the &quot;Search&quot; button to manually search and place markers</li>
            <li>Use the 📍 button to get your current location</li>
            <li>Coordinates are automatically updated when you select a location</li>
          </ul>
        </div>
    </div>
  );
};

export default InteractiveMap;
