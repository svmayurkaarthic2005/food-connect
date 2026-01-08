import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import RestaurantDashboard from "@/components/dashboard/RestaurantDashboard";
import NgoDashboard from "@/components/dashboard/NgoDashboard";
import { Loader2, Utensils, Heart } from "lucide-react";

const Dashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Utensils className="h-6 w-6 text-secondary" />
          </div>
          <div className="p-2 bg-primary/10 rounded-xl">
            <Heart className="h-6 w-6 text-primary" />
          </div>
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      {role === "restaurant" && <RestaurantDashboard onSignOut={signOut} />}
      {role === "ngo" && <NgoDashboard onSignOut={signOut} />}
      {role === "admin" && (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Admin features coming soon</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
