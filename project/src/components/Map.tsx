import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

// Constants for circle calculations
const MILES_TO_METERS = 1609.34;
const TRADE_AREA_RADIUS_MILES = 5;
const TRADE_AREA_RADIUS_METERS = TRADE_AREA_RADIUS_MILES * MILES_TO_METERS;

interface MapProps {
  address: string;
  coordinates: [number, number];
}

export function Map({ coordinates }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom] = useState(13);

  // Function to calculate pixel radius based on zoom level
  const calculatePixelRadius = (map: mapboxgl.Map, centerLngLat: [number, number], radiusMeters: number) => {
    // Get the center point in pixels
    const centerPixel = map.project(centerLngLat);
    
    // Calculate a point that is the radius distance east of the center
    const radiusCoord = new mapboxgl.LngLat(centerLngLat[0], centerLngLat[1]).toArray();
    radiusCoord[0] += radiusMeters / (111319.9 * Math.cos(centerLngLat[1] * Math.PI / 180));
    
    // Get the radius point in pixels
    const radiusPixel = map.project(radiusCoord);
    
    // Return the pixel distance
    return Math.abs(radiusPixel.x - centerPixel.x);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: coordinates,
      zoom: zoom,
      maxBounds: [
        [-167.276413, 15.436089], // Southwest coordinates of US
        [-52.233040, 72.553992]   // Northeast coordinates of US
      ]
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current);

    // Add circle overlay
    map.current.on('load', () => {
      if (!map.current) return;

      // Add the trade area circle source
      map.current.addSource('trade-area', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coordinates,
          },
        },
      });

      // Add the circle layer
      map.current.addLayer({
        id: 'trade-area-fill',
        type: 'circle',
        source: 'trade-area',
        paint: {
          'circle-radius': calculatePixelRadius(map.current, coordinates, TRADE_AREA_RADIUS_METERS),
          'circle-color': '#4A90E2',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#4A90E2',
        },
      });

      // Update circle radius on zoom
      map.current.on('zoom', () => {
        if (!map.current) return;
        map.current.setPaintProperty(
          'trade-area-fill',
          'circle-radius',
          calculatePixelRadius(map.current, coordinates, TRADE_AREA_RADIUS_METERS)
        );
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [coordinates]);

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}