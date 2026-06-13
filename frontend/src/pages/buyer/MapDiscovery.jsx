import { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup, MapControls } from '@/components/ui/map';
import { mockShops } from '../../lib/mockData';
import { useCart } from '../../context/CartContext';
import { MapSearchBar } from '@/components/buyer/map/MapSearchBar';
import { RouteDistanceOverlay } from '@/components/buyer/map/RouteDistanceOverlay';
import { ShopPopupContent } from '@/components/buyer/map/ShopPopupContent';
import { RouteLayer } from '@/components/buyer/map/RouteLayer';
import { NearbyShopStrip } from '@/components/buyer/map/NearbyShopStrip';

const MapDiscovery = () => {
  const { savedShopIds, toggleSaveShop } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [viewport, setViewport] = useState({
    center: [124.8, 7.9],
    zoom: 7.2,
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
        const artisanLng = artisan.location.coordinates[0];
        const artisanLat = artisan.location.coordinates[1];
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${loc.longitude},${loc.latitude};${artisanLng},${artisanLat}?overview=full&geometries=geojson`);
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

  const categories = ['All', ...new Set(mockShops.map((shop) => shop.category))];

  const filteredArtisans = mockShops.filter(
    (shop) => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 border border-border overflow-hidden bg-background">
        <MapSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

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

          <RouteDistanceOverlay
            routeDistance={routeDistance}
            onClose={() => {
              setRouteGeoJSON(null);
              setRouteDistance(null);
            }}
          />

          {userLocation && (
            <MapMarker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <MarkerContent>
                <div className="size-5 rounded-full bg-secondary-dark border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse" />
                <MarkerLabel position="bottom">You</MarkerLabel>
              </MarkerContent>
            </MapMarker>
          )}

          {filteredArtisans.map((artisan) => (
            <MapMarker
              key={artisan._id}
              longitude={artisan.location.coordinates[0]}
              latitude={artisan.location.coordinates[1]}
            >
              <MarkerContent>
                <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg transition-transform hover:scale-110" />
                <MarkerLabel position="bottom">{artisan.category}</MarkerLabel>
              </MarkerContent>
              <MarkerPopup className="w-72 p-0 overflow-hidden rounded-[1.25rem] bg-card border border-border shadow-(--shadow-soft-lg)">
                <ShopPopupContent
                  artisan={artisan}
                  savedShopIds={savedShopIds}
                  toggleSaveShop={toggleSaveShop}
                  routeDistance={routeDistance}
                  onDirections={handleDirections}
                />
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>

        <NearbyShopStrip shops={filteredArtisans} title="Nearby Shops" />
      </div>
    </div>
  );
};

export default MapDiscovery;