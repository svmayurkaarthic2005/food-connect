import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LogOut, Package, Handshake, TrendingUp } from "lucide-react";
import AddFoodDialog from "./AddFoodDialog";
import FoodListingCard from "./FoodListingCard";
import MatchesSection from "./MatchesSection";
import ImpactStats from "./ImpactStats";
import { Database } from "@/integrations/supabase/types";

type FoodListing = Database["public"]["Tables"]["food_listings"]["Row"];
type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface RestaurantDashboardProps {
  onSignOut: () => void;
}

const RestaurantDashboard = ({ onSignOut }: RestaurantDashboardProps) => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    if (!user) return;

    const { data: restData } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (restData) {
      setRestaurant(restData);

      const { data: foodData } = await supabase
        .from("food_listings")
        .select("*")
        .eq("restaurant_id", restData.id)
        .order("created_at", { ascending: false });

      if (foodData) {
        setListings(foodData);
      }
    }
    setLoading(false);
  };

  const handleAddListing = async (listing: Omit<FoodListing, "id" | "created_at" | "updated_at" | "restaurant_id">) => {
    if (!restaurant) return;

    const { error } = await supabase.from("food_listings").insert({
      ...listing,
      restaurant_id: restaurant.id,
    });

    if (!error) {
      fetchRestaurantData();
      setShowAddDialog(false);
    }
  };

  const availableCount = listings.filter(l => l.status === "available").length;
  const donatedCount = listings.filter(l => l.status === "donated").length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {restaurant?.name || "Restaurant Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your surplus food donations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Food
          </Button>
          <Button variant="outline" onClick={onSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">Food items ready for pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Donated</CardTitle>
            <Handshake className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donatedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully donated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total KG Donated</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurant?.total_kg_donated || 0}</div>
            <p className="text-xs text-muted-foreground">Kilograms of food saved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No food listings yet</h3>
                <p className="text-muted-foreground mb-4">Add your first surplus food item</p>
                <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Food
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <FoodListingCard
                  key={listing.id}
                  listing={listing}
                  onUpdate={fetchRestaurantData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches">
          <MatchesSection restaurantId={restaurant?.id} />
        </TabsContent>

        <TabsContent value="impact">
          <ImpactStats />
        </TabsContent>
      </Tabs>

      <AddFoodDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddListing}
      />
    </div>
  );
};

export default RestaurantDashboard;
