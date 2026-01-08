import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Scale, Users, Leaf, Drumstick } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];
type FoodStatus = Database["public"]["Enums"]["food_status"];

interface FoodListingCardProps {
  listing: FoodListing;
  onUpdate: () => void;
}

const statusColors: Record<FoodStatus, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  donated: "bg-blue-100 text-blue-800",
  expired: "bg-red-100 text-red-800",
};

const FoodListingCard = ({ listing, onUpdate }: FoodListingCardProps) => {
  const isExpired = new Date(listing.expires_at) < new Date();
  const currentStatus = isExpired && listing.status === "available" ? "expired" : listing.status;

  const updateStatus = async (newStatus: FoodStatus) => {
    const { error } = await supabase
      .from("food_listings")
      .update({ status: newStatus })
      .eq("id", listing.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      onUpdate();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{listing.food_name}</CardTitle>
          <Badge className={statusColors[currentStatus]}>
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {listing.description && (
          <p className="text-sm text-muted-foreground">{listing.description}</p>
        )}

        <div className="flex items-center gap-2">
          {listing.category === "veg" ? (
            <Leaf className="h-4 w-4 text-green-600" />
          ) : listing.category === "non_veg" ? (
            <Drumstick className="h-4 w-4 text-red-600" />
          ) : (
            <div className="flex">
              <Leaf className="h-4 w-4 text-green-600" />
              <Drumstick className="h-4 w-4 text-red-600 -ml-1" />
            </div>
          )}
          <span className="text-sm capitalize">{listing.category.replace("_", "-")}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span>{listing.quantity_kg} kg</span>
          </div>
          {listing.servings && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{listing.servings} servings</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expires: {format(new Date(listing.expires_at), "MMM d, h:mm a")}</span>
        </div>

        {listing.status === "available" && !isExpired && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => updateStatus("expired")}
            >
              Mark Expired
            </Button>
          </div>
        )}

        {listing.status === "reserved" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => updateStatus("donated")}
            >
              Confirm Donated
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodListingCard;
