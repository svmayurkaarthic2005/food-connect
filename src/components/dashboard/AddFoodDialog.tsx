import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type FoodCategory = Database["public"]["Enums"]["food_category"];
type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (listing: Omit<FoodListing, "id" | "created_at" | "updated_at" | "restaurant_id">) => void;
}

const AddFoodDialog = ({ open, onOpenChange, onSubmit }: AddFoodDialogProps) => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<FoodCategory>("veg");
  const [quantityKg, setQuantityKg] = useState("");
  const [servings, setServings] = useState("");
  const [cookedAt, setCookedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [pickupInstructions, setPickupInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    onSubmit({
      food_name: foodName,
      description,
      category,
      quantity_kg: parseFloat(quantityKg),
      servings: servings ? parseInt(servings) : null,
      cooked_at: new Date(cookedAt).toISOString(),
      expires_at: new Date(expiresAt).toISOString(),
      pickup_instructions: pickupInstructions || null,
      status: "available",
      image_url: null,
    });

    // Reset form
    setFoodName("");
    setDescription("");
    setCategory("veg");
    setQuantityKg("");
    setServings("");
    setCookedAt("");
    setExpiresAt("");
    setPickupInstructions("");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Surplus Food</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name *</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Vegetable Biryani"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the food"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FoodCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantityKg">Quantity (kg) *</Label>
              <Input
                id="quantityKg"
                type="number"
                step="0.1"
                min="0.1"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookedAt">Cooked At *</Label>
            <Input
              id="cookedAt"
              type="datetime-local"
              value={cookedAt}
              onChange={(e) => setCookedAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires At *</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
            <Textarea
              id="pickupInstructions"
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="Any special instructions for pickup"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Food"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
