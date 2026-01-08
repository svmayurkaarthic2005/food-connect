import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons using data URIs for reliability
const ngoIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "ngo-marker",
});

// Red marker using a different CDN that's more reliable
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  iconRetinaUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Restaurant {
  id: string;
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  foodCount?: number;
}

interface FoodMapProps {
  ngoName: string;
  ngoLatitude: number;
  ngoLongitude: number;
  restaurants: Restaurant[];
}

const FoodMap = ({ ngoName, ngoLatitude, ngoLongitude, restaurants }: FoodMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([ngoLatitude, ngoLongitude], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add NGO marker
    L.marker([ngoLatitude, ngoLongitude], { icon: ngoIcon })
      .addTo(map)
      .bindPopup(`<div class="text-center"><strong>${ngoName}</strong><br/><span class="text-xs">Your Location (NGO)</span></div>`);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ngoLatitude, ngoLongitude, ngoName]);

  // Update markers when restaurants change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    console.log("FoodMap: restaurants data received:", restaurants);

    // Create a layer group for restaurant markers
    const restaurantMarkers = L.layerGroup().addTo(map);

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      console.log("FoodMap: Adding marker for restaurant:", restaurant.name, "at", restaurant.latitude, restaurant.longitude);
      const popupContent = `
        <div>
          <strong>${restaurant.name}</strong>
          ${restaurant.address ? `<br/><span class="text-xs">${restaurant.address}</span>` : ""}
          ${restaurant.foodCount !== undefined ? `<br/><span class="text-xs text-muted-foreground">${restaurant.foodCount} item(s) available</span>` : ""}
        </div>
      `;
      L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
        .addTo(restaurantMarkers)
        .bindPopup(popupContent);
    });

    // Fit bounds if there are restaurants
    if (restaurants.length > 0) {
      const allPoints: [number, number][] = [
        [ngoLatitude, ngoLongitude],
        ...restaurants.map((r) => [r.latitude, r.longitude] as [number, number]),
      ];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup markers when restaurants change
    return () => {
      restaurantMarkers.clearLayers();
      map.removeLayer(restaurantMarkers);
    };
  }, [restaurants, ngoLatitude, ngoLongitude]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapRef} 
        className="h-[400px] w-full rounded-lg overflow-hidden border"
        style={{ zIndex: 0 }}
      />
      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Your NGO</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Restaurants</span>
        </div>
      </div>
    </div>
  );
};

export default FoodMap;