import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LogOut, Package, Users, Heart, Settings } from "lucide-react";
import AddRequestDialog from "./AddRequestDialog";
import FoodRequestCard from "./FoodRequestCard";
import AvailableFoodSection from "./AvailableFoodSection";
import NgoMatchesSection from "./NgoMatchesSection";
import ImpactStats from "./ImpactStats";
import SettingsSection from "./SettingsSection";
import { Database } from "@/integrations/supabase/types";

type FoodRequest = Database["public"]["Tables"]["food_requests"]["Row"];
type Ngo = Database["public"]["Tables"]["ngos"]["Row"];

interface NgoDashboardProps {
  onSignOut: () => void;
}

const NgoDashboard = ({ onSignOut }: NgoDashboardProps) => {
  const { user } = useAuth();
  const [ngo, setNgo] = useState<Ngo | null>(null);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNgoData();
    }
  }, [user]);

  const fetchNgoData = async () => {
    if (!user) return;

    const { data: ngoData } = await supabase
      .from("ngos")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (ngoData) {
      setNgo(ngoData);

      const { data: requestData } = await supabase
        .from("food_requests")
        .select("*")
        .eq("ngo_id", ngoData.id)
        .order("created_at", { ascending: false });

      if (requestData) {
        setRequests(requestData);
      }
    }
    setLoading(false);
  };

  const handleAddRequest = async (request: Omit<FoodRequest, "id" | "created_at" | "updated_at" | "ngo_id" | "status">) => {
    if (!ngo) return;

    const { error } = await supabase.from("food_requests").insert({
      ...request,
      ngo_id: ngo.id,
    });

    if (!error) {
      fetchNgoData();
      setShowAddDialog(false);
    }
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const completedCount = requests.filter(r => r.status === "completed").length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {ngo?.name || "NGO Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">Find and receive surplus food donations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Request Food
          </Button>
          <Button variant="outline" onClick={onSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Active food requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meals Received</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngo?.total_meals_received || 0}</div>
            <p className="text-xs text-muted-foreground">Total meals received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">People Served</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngo?.people_served || 0}</div>
            <p className="text-xs text-muted-foreground">Beneficiaries helped</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Food</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="matches">My Matches</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <AvailableFoodSection ngoId={ngo?.id} onMatchCreated={fetchNgoData} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No food requests yet</h3>
                <p className="text-muted-foreground mb-4">Create a request for food donations</p>
                <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Request Food
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <FoodRequestCard
                  key={request.id}
                  request={request}
                  onUpdate={fetchNgoData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches">
          <NgoMatchesSection ngoId={ngo?.id} />
        </TabsContent>

        <TabsContent value="impact">
          <ImpactStats />
        </TabsContent>

        <TabsContent value="settings">
          {ngo && (
            <SettingsSection
              type="ngo"
              data={{
                id: ngo.id,
                name: ngo.name,
                description: ngo.description,
                address: ngo.address,
                latitude: ngo.latitude,
                longitude: ngo.longitude
              }}
              onUpdate={fetchNgoData}
            />
          )}
        </TabsContent>
      </Tabs>

      <AddRequestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};

export default NgoDashboard;
