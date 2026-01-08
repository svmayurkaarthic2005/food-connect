import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Heart, ArrowRight, Leaf, Users, TrendingUp } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-full">
              <Utensils className="h-8 w-8 text-orange-600" />
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Urban Food
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
              {" "}Waste to Demand{" "}
            </span>
            Router
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connecting restaurants with surplus food to NGOs and shelters in need. 
            Reduce waste, fight hunger, and build a sustainable community together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-lg px-8">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 border-orange-100 hover:border-orange-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Restaurants List Surplus</h3>
              <p className="text-muted-foreground">
                Restaurants add their surplus food with details like quantity, type, and pickup time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">NGOs Find & Request</h3>
              <p className="text-muted-foreground">
                NGOs browse available food and request what they need for their communities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Deliver</h3>
              <p className="text-muted-foreground">
                Matches are made, pickups confirmed, and food reaches those who need it most.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Impact</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <Leaf className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">Reduce Waste</div>
              <p className="text-green-100">Rescue food before it goes to landfill</p>
            </div>
            <div>
              <Heart className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">Fight Hunger</div>
              <p className="text-green-100">Feed those who need it most</p>
            </div>
            <div>
              <TrendingUp className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">Save CO₂</div>
              <p className="text-green-100">Reduce carbon emissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join our network of restaurants and NGOs working together to end food waste.
        </p>
        <Link to="/auth">
          <Button size="lg" className="gap-2 text-lg px-8">
            Join Now <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Urban Food Router. Fighting food waste, one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
