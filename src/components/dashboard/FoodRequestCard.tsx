import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Scale, Users, Leaf, Drumstick } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type FoodRequest = Database["public"]["Tables"]["food_requests"]["Row"];
type RequestStatus = Database["public"]["Enums"]["request_status"];

interface FoodRequestCardProps {
  request: FoodRequest;
  onUpdate: () => void;
}

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  matched: "bg-blue-100 text-blue-800",
  accepted: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const FoodRequestCard = ({ request, onUpdate }: FoodRequestCardProps) => {
  const cancelRequest = async () => {
    const { error } = await supabase
      .from("food_requests")
      .update({ status: "cancelled" })
      .eq("id", request.id);

    if (error) {
      toast.error("Failed to cancel request");
    } else {
      toast.success("Request cancelled");
      onUpdate();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Food Request</CardTitle>
          <Badge className={statusColors[request.status]}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span>{request.quantity_needed_kg} kg needed</span>
          </div>
          {request.servings_needed && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{request.servings_needed} servings</span>
            </div>
          )}
        </div>

        {request.preferred_category && (
          <div className="flex items-center gap-2">
            {request.preferred_category === "veg" ? (
              <Leaf className="h-4 w-4 text-green-600" />
            ) : request.preferred_category === "non_veg" ? (
              <Drumstick className="h-4 w-4 text-red-600" />
            ) : (
              <div className="flex">
                <Leaf className="h-4 w-4 text-green-600" />
                <Drumstick className="h-4 w-4 text-red-600 -ml-1" />
              </div>
            )}
            <span className="text-sm capitalize">
              {request.preferred_category.replace("_", "-")} preferred
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Pickup by: {format(new Date(request.latest_pickup_time), "MMM d, h:mm a")}</span>
        </div>

        {request.notes && (
          <p className="text-sm text-muted-foreground">{request.notes}</p>
        )}

        {request.status === "pending" && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={cancelRequest}
            >
              Cancel Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodRequestCard;
