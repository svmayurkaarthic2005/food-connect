import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import RestaurantDashboard from "@/components/dashboard/RestaurantDashboard";
import NgoDashboard from "@/components/dashboard/NgoDashboard";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
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
