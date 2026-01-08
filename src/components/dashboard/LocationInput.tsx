import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LocationInputProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: { address: string; latitude: number | null; longitude: number | null }) => void;
  disabled?: boolean;
}

const LocationInput = ({ address, latitude, longitude, onLocationChange, disabled }: LocationInputProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const displayAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          onLocationChange({
            address: displayAddress,
            latitude: lat,
            longitude: lng
          });
          toast.success("Location detected successfully");
        } catch {
          onLocationChange({
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng
          });
          toast.success("Coordinates captured");
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error("Failed to get location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            value={address}
            onChange={(e) => onLocationChange({ address: e.target.value, latitude, longitude })}
            placeholder="Enter your address"
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={getCurrentLocation}
            disabled={disabled || isGettingLocation}
            title="Use current location"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude ?? ""}
            onChange={(e) => onLocationChange({
              address,
              latitude: e.target.value ? parseFloat(e.target.value) : null,
              longitude
            })}
            placeholder="Latitude"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude ?? ""}
            onChange={(e) => onLocationChange({
              address,
              latitude,
              longitude: e.target.value ? parseFloat(e.target.value) : null
            })}
            placeholder="Longitude"
            disabled={disabled}
          />
        </div>
      </div>
      
      {latitude && longitude && (
        <p className="text-xs text-muted-foreground">
          📍 Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
