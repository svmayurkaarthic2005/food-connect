import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Scale, Users, Leaf, Drumstick, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];
type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface AvailableFoodSectionProps {
  ngoId: string | undefined;
  onMatchCreated: () => void;
}

interface FoodWithRestaurant extends FoodListing {
  restaurants: Restaurant;
}

const AvailableFoodSection = ({ ngoId, onMatchCreated }: AvailableFoodSectionProps) => {
  const [availableFood, setAvailableFood] = useState<FoodWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fetchAvailableFood = async () => {
    const { data, error } = await supabase
      .from("food_listings")
      .select("*, restaurants(*)")
      .eq("status", "available")
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: true });

    if (!error && data) {
      setAvailableFood(data as FoodWithRestaurant[]);
    }
    setLoading(false);
  };

  const requestFood = async (listing: FoodWithRestaurant) => {
    if (!ngoId) {
      toast.error("NGO profile not found");
      return;
    }

    // Create a match
    const { error: matchError } = await supabase.from("matches").insert({
      food_listing_id: listing.id,
      ngo_id: ngoId,
      match_score: 85, // Simplified score
      status: "pending",
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

  if (loading) {
    return <p>Loading available food...</p>;
  }

  if (availableFood.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No food available at the moment. Check back later!</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

export default AvailableFoodSection;
