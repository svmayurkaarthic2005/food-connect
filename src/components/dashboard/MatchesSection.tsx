import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Match = Database["public"]["Tables"]["matches"]["Row"];
type Ngo = Database["public"]["Tables"]["ngos"]["Row"];
type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];

interface MatchWithDetails extends Match {
  ngos: Ngo;
  food_listings: FoodListing;
}

interface MatchesSectionProps {
  restaurantId: string | undefined;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  matched: "bg-blue-100 text-blue-800",
  accepted: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const MatchesSection = ({ restaurantId }: MatchesSectionProps) => {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      fetchMatches();
    }
  }, [restaurantId]);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        ngos(*),
        food_listings!inner(*)
      `)
      .eq("food_listings.restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMatches(data as MatchWithDetails[]);
    }
    setLoading(false);
  };

  const confirmPickup = async (match: MatchWithDetails) => {
    const { error } = await supabase
      .from("matches")
      .update({ 
        status: "completed",
        pickup_confirmed_at: new Date().toISOString()
      })
      .eq("id", match.id);

    if (error) {
      toast.error("Failed to confirm pickup");
      return;
    }

    // Update food listing
    await supabase
      .from("food_listings")
      .update({ status: "donated" })
      .eq("id", match.food_listing_id);

    toast.success("Pickup confirmed!");
    fetchMatches();
  };

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No matches yet. When NGOs request your food, they'll appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{match.food_listings.food_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Requested by: {match.ngos.name}
                </p>
              </div>
              <Badge className={statusColors[match.status]}>
                {match.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Quantity: {match.food_listings.quantity_kg} kg</span>
              <span>Match Score: {match.match_score}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Requested: {format(new Date(match.created_at), "MMM d, h:mm a")}
            </p>

            {match.status === "accepted" && (
              <Button onClick={() => confirmPickup(match)} className="w-full">
                Confirm Pickup Completed
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchesSection;
