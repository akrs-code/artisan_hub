import { useState, useEffect } from 'react';
import { Search, Filter, Star, Navigation, Clock, ExternalLink } from 'lucide-react';
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup, MapControls, useMap } from '@/components/ui/map';

const RouteLayer = ({ geojson }) => {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!geojson) {
      if (map.getSource('route')) {
        map.getSource('route').setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 5,
          'line-opacity': 0.8
        }
      });
    }
  }, [map, isLoaded, geojson]);

  return null;
};

const MapDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [viewport, setViewport] = useState({
    center: [124.6, 7.8], // Centered on Mindanao
    zoom: 6,
  });

  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => console.error("Error watching location:", error),
            { enableHighAccuracy: true }
          );
        }
      });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleDirections = async (artisan) => {
    const fetchAndSetRoute = async (loc) => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${loc.longitude},${loc.latitude};${artisan.longitude},${artisan.latitude}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          setRouteGeoJSON(data.routes[0].geometry);
          setRouteDistance((data.routes[0].distance / 1000).toFixed(1));
        } else {
          alert("Could not find a route.");
        }
      } catch (err) {
        console.error("Routing error:", err);
        alert("Error fetching directions.");
      }
    };

    if (userLocation) {
      fetchAndSetRoute(userLocation);
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            setUserLocation(loc);
            fetchAndSetRoute(loc);
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not access your location. Please enable location permissions.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  };

  const artisans = [
    {
      id: 1,
      name: 'The Iron Loom',
      label: 'Textiles',
      category: 'Textiles',
      rating: 4.8,
      reviews: 1245,
      hours: '10:00 AM - 5:00 PM',
      image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=300&h=200&fit=crop',
      latitude: 7.0731,
      longitude: 125.6128,
      description: 'Premium hand-woven textiles using traditional patterns',
    },
    {
      id: 2,
      name: 'Maranao Woodworks',
      label: 'Woodwork',
      category: 'Woodwork',
      rating: 4.9,
      reviews: 823,
      hours: '8:00 AM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1610444535313-255d644de732?w=300&h=200&fit=crop',
      latitude: 8.0167,
      longitude: 124.2833,
      description: 'Traditional Okir wooden crafts and intricate carvings',
    },
    {
      id: 3,
      name: 'Yakan Weavers',
      label: 'Woven Crafts',
      category: 'Woven Crafts',
      rating: 4.7,
      reviews: 562,
      hours: '9:00 AM - 5:00 PM',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0f?w=300&h=200&fit=crop',
      latitude: 6.9214,
      longitude: 122.0790,
      description: 'Vibrant geometric weaves and traditional Yakan fabrics',
    },
  ];

  const categories = ['All', ...new Set(artisans.map((artisan) => artisan.category))];

  const filteredArtisans = artisans.filter(
    (artisan) => {
      const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || artisan.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="flex flex-col h-full">
      {/* Map Container */}
      <div className="relative flex-1 border border-neutral-dark/20 overflow-hidden shadow-md bg-white">
        {/* Floating Search Bar, Filters & Category Tabs */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-md">
          <div className="flex gap-2 w-full">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark/40" />
              <input
                type="text"
                placeholder="Search artisans, shops, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-dark/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-neutral-dark placeholder:text-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-md"
              />
            </div>

            {/* Filter Button */}
            <button className="p-2.5 bg-white border border-neutral-dark/20 rounded-lg hover:bg-neutral-dark/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-md shrink-0">
              <Filter className="w-4 h-4 text-neutral-dark/60" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto py-1 px-0.5 scrollbar-none nav-hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap shadow-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${selectedCategory === cat
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-neutral-dark/15 text-neutral-dark/70 hover:bg-neutral-dark/5 hover:text-neutral-dark'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Map
          theme="light"
          viewport={viewport}
          onViewportChange={setViewport}
          className="w-full h-full"
        >
          <MapControls
            position="top-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
            onLocate={(coords) => setUserLocation({ latitude: coords.latitude, longitude: coords.longitude })}
          />
          <RouteLayer geojson={routeGeoJSON} />

          {routeDistance && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-lg border border-neutral-dark/10 font-medium text-sm text-neutral-dark flex items-center gap-2 animate-in slide-in-from-top-4">
              <Navigation className="w-4 h-4 text-primary" />
              <span>{routeDistance} km away</span>
              <button
                onClick={() => { setRouteGeoJSON(null); setRouteDistance(null); }}
                className="ml-1 text-neutral-dark/40 hover:text-neutral-dark transition-colors font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {userLocation && (
            <MapMarker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <MarkerContent>
                <div className="size-5 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse" />
                <MarkerLabel position="bottom">You</MarkerLabel>
              </MarkerContent>
            </MapMarker>
          )}

          {filteredArtisans.map((artisan) => (
            <MapMarker
              key={artisan.id}
              longitude={artisan.longitude}
              latitude={artisan.latitude}
            >
              <MarkerContent>
                <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg transition-transform hover:scale-110" />
                <MarkerLabel position="bottom">{artisan.label}</MarkerLabel>
              </MarkerContent>

              <MarkerPopup className="w-64 p-0">
                <div className="relative h-32 w-full overflow-hidden rounded-t-md">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <div>
                    <p className="text-neutral-dark/60 pb-0.5 text-[11px] font-medium tracking-wide uppercase">
                      {artisan.category}
                    </p>
                    <h3 className="text-neutral-dark leading-tight font-semibold">
                      {artisan.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-neutral-dark">{artisan.rating}</span>
                      <span className="text-neutral-dark/60">
                        ({artisan.reviews.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div className="text-neutral-dark/60 flex items-center gap-1.5 text-sm">
                    <Clock className="size-3.5" />
                    <span>{artisan.hours}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleDirections(artisan)}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary text-white py-1.5 px-3 rounded text-sm hover:bg-primary-dark transition-colors"
                    >
                      <Navigation className="size-3.5" />
                      Directions
                    </button>
                    <button className="flex items-center justify-center border border-neutral-dark/20 py-1.5 px-2.5 rounded text-neutral-dark hover:bg-neutral-dark/5 transition-colors">
                      <ExternalLink className="size-3.5" />
                    </button>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
};

export default MapDiscovery;
