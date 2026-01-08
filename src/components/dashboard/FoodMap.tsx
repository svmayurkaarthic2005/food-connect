import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Lazy load the react-leaflet components to avoid SSR issues
const MapContainer = lazy(() => import("react-leaflet").then(mod => ({ default: mod.MapContainer })));
const TileLayer = lazy(() => import("react-leaflet").then(mod => ({ default: mod.TileLayer })));
const Marker = lazy(() => import("react-leaflet").then(mod => ({ default: mod.Marker })));
const Popup = lazy(() => import("react-leaflet").then(mod => ({ default: mod.Popup })));

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const ngoIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const restaurantIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

const LoadingFallback = () => (
  <div className="h-[400px] w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
    <p className="text-muted-foreground">Loading map...</p>
  </div>
);

const FoodMap = ({ ngoName, ngoLatitude, ngoLongitude, restaurants }: FoodMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />;
  }

  if (hasError) {
    return (
      <div className="h-[400px] w-full rounded-lg overflow-hidden border bg-muted flex flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">Unable to load map</p>
        <button 
          onClick={() => setHasError(false)} 
          className="text-sm text-primary underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <Suspense fallback={<LoadingFallback />}>
          <MapContainer
            center={[ngoLatitude, ngoLongitude]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <Suspense fallback={null}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[ngoLatitude, ngoLongitude]} icon={ngoIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-primary">{ngoName}</strong>
                    <p className="text-xs text-muted-foreground">Your Location (NGO)</p>
                  </div>
                </Popup>
              </Marker>
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  position={[restaurant.latitude, restaurant.longitude]}
                  icon={restaurantIcon}
                >
                  <Popup>
                    <div>
                      <strong className="text-destructive">{restaurant.name}</strong>
                      {restaurant.address && (
                        <p className="text-xs">{restaurant.address}</p>
                      )}
                      {restaurant.foodCount !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {restaurant.foodCount} item(s) available
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </Suspense>
          </MapContainer>
        </Suspense>
      </div>
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