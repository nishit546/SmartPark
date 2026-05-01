import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Navigation, Car, Search, Flame } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, HeatmapLayer } from '@react-google-maps/api';
import { parkingService } from '../services/apiService';

const containerStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
};

// Define libraries outside the component to avoid re-renders
const libraries = ['places', 'visualization'];

// Default center: Center of India
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const MapPage = () => {
  const [map, setMap] = useState(null);
  const [searchResultMarker, setSearchResultMarker] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '', // Provide your API key in .env.local
    libraries,
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await parkingService.getZones();
        if (response.success) {
          setZones(response.data);
        }
      } catch (error) {
        console.error('Error fetching zones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Real-Time Simulation Effect
  useEffect(() => {
    if (zones.length === 0) return;

    const intervalId = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((zone) => {
          // 30% chance to change spots for any given zone every 4 seconds
          if (Math.random() > 0.7) {
            const change = Math.random() > 0.5 ? 1 : -1;
            // Ensure spots don't drop below 0 and prevent string concatenation
            const currentSpots = parseInt(zone.availableSpots, 10) || 0;
            const newSpots = Math.max(0, currentSpots + change);
            return { ...zone, availableSpots: newSpots };
          }
          return zone;
        })
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, [zones.length]);

  const getMarkerIcon = (zone) => {
    const spots = parseInt(zone.availableSpots, 10) || 0;
    // If valet, we can keep it distinct or color code it too. Let's color code by availability for all.
    if (spots === 0) return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Occupied
    if (spots < 5) return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'; // Limited
    return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // Available
  };

  const heatmapData = React.useMemo(() => {
    if (!window.google || !window.google.maps || zones.length === 0) return [];
    
    return zones.map(zone => {
      // Calculate weight based on low availability (high demand = high weight)
      const spots = parseInt(zone.availableSpots, 10) || 0;
      const weight = Math.max(1, 50 - spots); 
      
      return {
        location: new window.google.maps.LatLng(zone.location.lat, zone.location.lng),
        weight: weight
      };
    });
  }, [zones]);

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSearchResultMarker(location);
        map.panTo(location);
        map.setZoom(15);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <Helmet>
        <title>Live Parking Map — SmartPark</title>
        <meta name="description" content="View real-time parking availability on the map. Find and reserve parking spots near you instantly." />
        <meta property="og:title" content="Live Parking Map — SmartPark" />
        <meta property="og:url" content="https://smartpark.app/map" />
      </Helmet>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">Live Map</h1>
          <p className="text-neutral mt-1">Search locations and find parking spots</p>
        </div>
        <div className="flex gap-3">
          <button 
            className={`px-4 py-2 rounded-xl shadow-sm border flex items-center gap-2 text-sm font-semibold transition-colors ${
              showHeatmap 
                ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30' 
                : 'bg-white text-neutral-dark border-gray-100 hover:bg-gray-50'
            }`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <Flame size={18} className={showHeatmap ? "text-white" : "text-amber-500"} />
            Heatmap
          </button>
          <button 
            className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-semibold text-neutral-dark hover:bg-gray-50 transition-colors"
            onClick={() => {
              if (map) {
                map.panTo(defaultCenter);
                map.setZoom(5);
                setSearchResultMarker(null);
              }
            }}
          >
            <Navigation size={18} className="text-primary" />
            Reset View
          </button>
        </div>
      </div>

      <div className="flex-grow bg-slate-200 rounded-3xl overflow-hidden relative shadow-inner border border-gray-200 flex flex-col min-h-[500px]">
        {/* Search Bar Overlay */}
        {isLoaded && (
          <div className="absolute top-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-10">
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for any location..."
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral" />
              </div>
            </Autocomplete>
          </div>
        )}

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={5} // Initial zoom level for the country view
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Render markers for real parking zones */}
            {!showHeatmap && zones.map((zone) => (
              <Marker
                key={zone._id}
                position={{ lat: zone.location.lat, lng: zone.location.lng }}
                title={`${zone.name} (${zone.availableSpots} spots)`}
                icon={{
                  url: getMarkerIcon(zone)
                }}
              />
            ))}

            {/* Render Heatmap */}
            {showHeatmap && heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                options={{
                  radius: 40,
                  opacity: 0.8,
                  gradient: [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                  ]
                }}
              />
            )}

            {/* Render marker for searched location */}
            {searchResultMarker && (
              <Marker
                position={searchResultMarker}
                title="Searched Location"
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Different color for search
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center relative z-0">
            <MapPin size={48} className="text-primary mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-slate-600">Loading Map...</h2>
          </div>
        )}

        {/* Real UI Overlays from DB */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white p-5 rounded-2xl shadow-xl shadow-neutral/10 border border-gray-100 z-10 pointer-events-none md:pointer-events-auto">
          <h3 className="font-bold text-neutral-dark flex items-center gap-2 mb-3">
            <Car size={20} className="text-primary" />
            Nearby Parking
          </h3>
          <div className="space-y-3 pointer-events-auto max-h-60 overflow-y-auto pr-1">
            {loading ? (
              <div className="py-4 text-center text-sm text-neutral">Finding zones...</div>
            ) : zones.length > 0 ? (
              zones.slice(0, 3).map((zone) => (
                <div 
                  key={zone._id}
                  onClick={() => map && map.panTo({ lat: zone.location.lat, lng: zone.location.lng })}
                  className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-sm">{zone.name}</p>
                    <p className={`text-xs font-medium ${
                      parseInt(zone.availableSpots, 10) === 0 ? 'text-red-500' :
                      parseInt(zone.availableSpots, 10) < 5 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {zone.availableSpots} spots available
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    zone.type === 'valet' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'
                  }`}>
                    {zone.type === 'valet' ? 'Valet' : '₹' + zone.pricePerHour}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-neutral">No zones found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
