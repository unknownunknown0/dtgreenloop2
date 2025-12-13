import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
  wasteType: string;
  status: string;
}

interface DeliveryMapProps {
  locations: Location[];
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ locations }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Default center (India)
    const defaultCenter: [number, number] = [20.5937, 78.9629];
    
    // Initialize map
    mapRef.current = L.map(mapContainer.current).setView(defaultCenter, 5);

    // Add OpenStreetMap tiles (FREE!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for each location
    const markers: L.Marker[] = [];
    
    locations.forEach((location, index) => {
      const markerColor = location.status === 'in_progress' ? '#3b82f6' : '#22c55e';
      
      // Create custom icon with number
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${markerColor};
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>Stop ${index + 1}</strong><br/>
            <span style="font-size: 12px; color: #666;">${location.wasteType}</span><br/>
            <span style="font-size: 11px;">${location.address}</span>
          </div>
        `);
      
      markers.push(marker);
    });

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

    // Draw route line between markers
    if (locations.length > 1) {
      const routeCoords: [number, number][] = locations.map(loc => [loc.lat, loc.lng]);
      
      // Remove existing polyline
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Add new polyline
      L.polyline(routeCoords, {
        color: '#00D4AA',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(mapRef.current);
    }
  }, [locations]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg overflow-hidden"
        style={{ zIndex: 1 }}
      />
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <p className="text-muted-foreground text-sm">No pickup locations to display</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
