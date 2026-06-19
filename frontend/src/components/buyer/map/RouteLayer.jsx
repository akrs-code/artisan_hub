import { useEffect } from 'react';
import { useMap } from '@/components/ui/map';

export const RouteLayer = ({ geojson }) => {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const routeData = geojson
      ? {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: geojson
          }
        ]
      }
      : {
        type: 'FeatureCollection',
        features: []
      };

    // Source
    if (map.getSource('route')) {
      map.getSource('route').setData(routeData);
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: routeData
      });

      // Glow layer
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3D5A3E',
          'line-width': 10,
          'line-opacity': 0.15
        }
      });

      // Main route
      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3D5A3E',
          'line-width': 5,
          'line-opacity': 0.9
        }
      });
    }

    if (
      geojson?.coordinates?.length > 0 &&
      !map.__routeFitted
    ) {
      const bounds = geojson.coordinates.reduce(
        (acc, coord) => [
          [
            Math.min(acc[0][0], coord[0]),
            Math.min(acc[0][1], coord[1])
          ],
          [
            Math.max(acc[1][0], coord[0]),
            Math.max(acc[1][1], coord[1])
          ]
        ],
        [[Infinity, Infinity], [-Infinity, -Infinity]]
      );

      map.fitBounds(bounds, {
        padding: {
          top: 180,
          right: 60,
          bottom: 120,
          left: 60
        },
        duration: 1200
      });

      map.__routeFitted = true;
    }

    return () => {
      if (!map) return;

      try {
        if (map.getLayer('route-layer')) {
          map.removeLayer('route-layer');
        }

        if (map.getLayer('route-glow')) {
          map.removeLayer('route-glow');
        }

        if (map.getSource('route')) {
          map.removeSource('route');
        }
      } catch (err) {
        console.warn("Map route cleanup skipped (map likely already destroyed):", err);
      }
    };
  }, [map, isLoaded, geojson]);

  return null;
};
