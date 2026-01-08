import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, Leaf, TrendingUp } from "lucide-react";

const ImpactStats = () => {
  const [stats, setStats] = useState({
    totalFoodSaved: 0,
    totalMealsServed: 0,
    co2Saved: 0,
    activeRestaurants: 0,
    activeNgos: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Get completed matches
    const { data: matches } = await supabase
      .from("matches")
      .select("*, food_listings(*)")
      .eq("status", "completed");

    if (matches) {
      const totalKg = matches.reduce((acc, m) => acc + (m.food_listings?.quantity_kg || 0), 0);
      const totalServings = matches.reduce((acc, m) => acc + (m.food_listings?.servings || 0), 0);

      setStats({
        totalFoodSaved: totalKg,
        totalMealsServed: totalServings,
        co2Saved: totalKg * 2.5, // Approximate CO2 saved per kg of food
        activeRestaurants: 0,
        activeNgos: 0,
      });
    }

    // Get active counts
    const { count: restCount } = await supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true });

    const { count: ngoCount } = await supabase
      .from("ngos")
      .select("*", { count: "exact", head: true });

    setStats(prev => ({
      ...prev,
      activeRestaurants: restCount || 0,
      activeNgos: ngoCount || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Food Saved</CardTitle>
            <Scale className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.totalFoodSaved.toFixed(1)} kg</div>
            <p className="text-xs text-green-600">Total food rescued</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Meals Served</CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{stats.totalMealsServed}</div>
            <p className="text-xs text-orange-600">People fed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">CO₂ Reduced</CardTitle>
            <Leaf className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.co2Saved.toFixed(1)} kg</div>
            <p className="text-xs text-blue-600">Carbon emissions saved</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Active Partners</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {stats.activeRestaurants + stats.activeNgos}
            </div>
            <p className="text-xs text-purple-600">
              {stats.activeRestaurants} restaurants, {stats.activeNgos} NGOs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactStats;
