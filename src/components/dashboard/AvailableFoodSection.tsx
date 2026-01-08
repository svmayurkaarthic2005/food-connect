import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Scale, Users, Leaf, Drumstick, MapPin, Navigation, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
// Temporarily disabled due to react-leaflet compatibility issue
// import FoodMap from "./FoodMap";

type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];
type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface AvailableFoodSectionProps {
  ngoId: string | undefined;
  ngoName: string;
  ngoLatitude: number | null;
  ngoLongitude: number | null;
  onMatchCreated: () => void;
}

interface FoodWithRestaurant extends FoodListing {
  restaurants: Restaurant;
  distance?: number;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MAX_DISTANCE_KM = 15;

const AvailableFoodSection = ({ ngoId, ngoName, ngoLatitude, ngoLongitude, onMatchCreated }: AvailableFoodSectionProps) => {
  const [availableFood, setAvailableFood] = useState<FoodWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    fetchAvailableFood();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("food_listings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "food_listings" },
        () => {
          fetchAvailableFood();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ngoLatitude, ngoLongitude]);

  const fetchAvailableFood = async () => {
    const { data, error } = await supabase
      .from("food_listings")
      .select("*, restaurants(*)")
      .eq("status", "available")
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: true });

    if (!error && data) {
      let foodWithDistance = data as FoodWithRestaurant[];
      
      // Filter by distance if NGO has location set
      if (ngoLatitude && ngoLongitude) {
        foodWithDistance = foodWithDistance
          .map(food => {
            const restLat = food.restaurants?.latitude;
            const restLng = food.restaurants?.longitude;
            if (restLat && restLng) {
              const distance = calculateDistance(ngoLatitude, ngoLongitude, restLat, restLng);
              return { ...food, distance };
            }
            return { ...food, distance: undefined };
          })
          .filter(food => {
            // Include food if restaurant has no location (for backwards compatibility)
            // or if within 15km
            if (food.distance === undefined) return true;
            return food.distance <= MAX_DISTANCE_KM;
          })
          .sort((a, b) => {
            // Sort by distance (closest first), then by expiry
            if (a.distance !== undefined && b.distance !== undefined) {
              return a.distance - b.distance;
            }
            return 0;
          });
      }
      
      setAvailableFood(foodWithDistance);
    }
    setLoading(false);
  };

  const requestFood = async (listing: FoodWithRestaurant) => {
    if (!ngoId) {
      toast.error("NGO profile not found");
      return;
    }

    // Create a match with distance info
    const { error: matchError } = await supabase.from("matches").insert({
      food_listing_id: listing.id,
      ngo_id: ngoId,
      match_score: 85,
      status: "pending",
      distance_km: listing.distance || null,
    });

    if (matchError) {
      toast.error("Failed to create match request");
      return;
    }

    // Update listing status
    await supabase
      .from("food_listings")
      .update({ status: "reserved" })
      .eq("id", listing.id);

    toast.success("Food requested successfully!");
    onMatchCreated();
    fetchAvailableFood();
  };

  // Extract unique restaurants with locations for the map
  // All hooks must be called before any conditional returns to satisfy Rules of Hooks
  type RestaurantMapItem = { id: string; name: string; address?: string | null; latitude: number; longitude: number; foodCount: number };
  
  const restaurantsForMap = useMemo((): RestaurantMapItem[] => {
    const restaurantMap: Record<string, RestaurantMapItem> = {};
    
    availableFood.forEach((food) => {
      const r = food.restaurants;
      if (r?.latitude && r?.longitude) {
        const existing = restaurantMap[r.id];
        if (existing) {
          existing.foodCount += 1;
        } else {
          restaurantMap[r.id] = {
            id: r.id,
            name: r.name,
            address: r.address,
            latitude: r.latitude,
            longitude: r.longitude,
            foodCount: 1,
          };
        }
      }
    });
    
    return Object.values(restaurantMap);
  }, [availableFood]);

  if (loading) {
    return <p>Loading available food...</p>;
  }

  if (!ngoLatitude || !ngoLongitude) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Location Required</h3>
          <p className="text-muted-foreground">Please set your location in Settings to see nearby restaurants.</p>
        </CardContent>
      </Card>
    );
  }

  if (availableFood.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            No food available within {MAX_DISTANCE_KM}km
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowMap(!showMap)}
            className="gap-2"
          >
            <MapIcon className="h-4 w-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>

        {showMap && ngoLatitude && ngoLongitude && (
          <div className="h-[300px] w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map temporarily disabled</p>
          </div>
        )}

        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Check back later for available food!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {availableFood.length} listing(s) within {MAX_DISTANCE_KM}km of your location
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMap(!showMap)}
          className="gap-2"
        >
          <MapIcon className="h-4 w-4" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      {showMap && ngoLatitude && ngoLongitude && (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Map temporarily disabled</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableFood.map((food) => (
          <Card key={food.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{food.food_name}</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Available
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{food.restaurants?.name}</span>
              </div>
              {food.restaurants?.address && (
                <p className="text-xs text-muted-foreground truncate">
                  {food.restaurants.address}
                </p>
              )}
              {food.distance !== undefined && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Navigation className="h-3 w-3" />
                  <span>{food.distance.toFixed(1)} km away</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {food.description && (
                <p className="text-sm text-muted-foreground">{food.description}</p>
              )}

              <div className="flex items-center gap-2">
                {food.category === "veg" ? (
                  <Leaf className="h-4 w-4 text-green-600" />
                ) : food.category === "non_veg" ? (
                  <Drumstick className="h-4 w-4 text-red-600" />
                ) : (
                  <div className="flex">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <Drumstick className="h-4 w-4 text-red-600 -ml-1" />
                  </div>
                )}
                <span className="text-sm capitalize">{food.category.replace("_", "-")}</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span>{food.quantity_kg} kg</span>
                </div>
                {food.servings && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{food.servings} servings</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expires: {format(new Date(food.expires_at), "MMM d, h:mm a")}</span>
              </div>

              <Button className="w-full" onClick={() => requestFood(food)}>
                Request This Food
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableFoodSection;
