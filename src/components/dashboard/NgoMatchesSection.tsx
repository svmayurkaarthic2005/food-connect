import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Match = Database["public"]["Tables"]["matches"]["Row"];
type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];

interface MatchWithDetails extends Match {
  food_listings: FoodListing & {
    restaurants: Restaurant;
  };
}

interface NgoMatchesSectionProps {
  ngoId: string | undefined;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  matched: "bg-blue-100 text-blue-800",
  accepted: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NgoMatchesSection = ({ ngoId }: NgoMatchesSectionProps) => {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ngoId) {
      fetchMatches();
    }
  }, [ngoId]);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        food_listings(*, restaurants(*))
      `)
      .eq("ngo_id", ngoId)
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
        delivery_confirmed_at: new Date().toISOString()
      })
      .eq("id", match.id);

    if (error) {
      toast.error("Failed to confirm pickup");
      return;
    }

    // Delete the food listing after pickup is complete
    await supabase
      .from("food_listings")
      .delete()
      .eq("id", match.food_listing_id);

    toast.success("Pickup confirmed! Food listing removed.");
    fetchMatches();
  };

  const cancelRequest = async (match: MatchWithDetails) => {
    const { error } = await supabase
      .from("matches")
      .update({ status: "cancelled" })
      .eq("id", match.id);

    if (error) {
      toast.error("Failed to cancel request");
      return;
    }

    // Make food available again
    await supabase
      .from("food_listings")
      .update({ status: "available" })
      .eq("id", match.food_listing_id);

    toast.success("Request cancelled");
    fetchMatches();
  };

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No matches yet. Request food from the Available Food tab.</p>
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
                  From: {match.food_listings.restaurants?.name}
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
              {match.food_listings.servings && (
                <span>Servings: {match.food_listings.servings}</span>
              )}
            </div>

            {match.food_listings.pickup_instructions && (
              <p className="text-sm bg-muted p-2 rounded">
                <strong>Pickup:</strong> {match.food_listings.pickup_instructions}
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              Requested: {format(new Date(match.created_at), "MMM d, h:mm a")}
            </p>

            {match.status === "pending" && (
              <div className="flex gap-2 items-center">
                <p className="text-sm text-yellow-600 flex-1">Waiting for restaurant to accept...</p>
                <Button variant="outline" size="sm" onClick={() => cancelRequest(match)}>
                  Cancel Request
                </Button>
              </div>
            )}

            {match.status === "accepted" && (
              <Button onClick={() => confirmPickup(match)} className="w-full">
                Confirm Food Received
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NgoMatchesSection;
