import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type FoodCategory = Database["public"]["Enums"]["food_category"];
type FoodRequest = Database["public"]["Tables"]["food_requests"]["Row"];

interface AddRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: Omit<FoodRequest, "id" | "created_at" | "updated_at" | "ngo_id" | "status">) => void;
}

const AddRequestDialog = ({ open, onOpenChange, onSubmit }: AddRequestDialogProps) => {
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [servingsNeeded, setServingsNeeded] = useState("");
  const [preferredCategory, setPreferredCategory] = useState<FoodCategory | "any">("any");
  const [latestPickupTime, setLatestPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    onSubmit({
      quantity_needed_kg: parseFloat(quantityNeeded),
      servings_needed: servingsNeeded ? parseInt(servingsNeeded) : null,
      preferred_category: preferredCategory === "any" ? null : preferredCategory,
      latest_pickup_time: new Date(latestPickupTime).toISOString(),
      notes: notes || null,
    });

    // Reset form
    setQuantityNeeded("");
    setServingsNeeded("");
    setPreferredCategory("any");
    setLatestPickupTime("");
    setNotes("");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Food</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantityNeeded">Quantity Needed (kg) *</Label>
              <Input
                id="quantityNeeded"
                type="number"
                step="0.1"
                min="0.1"
                value={quantityNeeded}
                onChange={(e) => setQuantityNeeded(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servingsNeeded">Servings Needed</Label>
              <Input
                id="servingsNeeded"
                type="number"
                min="1"
                value={servingsNeeded}
                onChange={(e) => setServingsNeeded(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredCategory">Preferred Category</Label>
            <Select value={preferredCategory} onValueChange={(v) => setPreferredCategory(v as FoodCategory | "any")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="latestPickupTime">Latest Pickup Time *</Label>
            <Input
              id="latestPickupTime"
              type="datetime-local"
              value={latestPickupTime}
              onChange={(e) => setLatestPickupTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRequestDialog;
