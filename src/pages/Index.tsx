import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Utensils, 
  Heart, 
  ArrowRight, 
  Leaf, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Shield,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <div className="p-1.5 bg-secondary/10 rounded-lg -ml-1">
                  <Heart className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <span className="font-bold text-lg hidden sm:block">Urban Food Router</span>
            </div>
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-accent via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <Leaf className="h-4 w-4" />
              <span>Fighting Food Waste Together</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
              Connect Surplus Food with{" "}
              <span className="text-gradient-primary">Those in Need</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up leading-relaxed">
              A smart platform linking restaurants with surplus food to NGOs and shelters. 
              Reduce waste, fight hunger, and build a sustainable community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/auth">
                <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                  Start Donating <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 w-full sm:w-auto">
                  <Heart className="h-5 w-5" /> Request Food
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Verified Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Location-based Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to connect surplus food with people who need it most
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Utensils className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Step 1</div>
                <h3 className="text-xl font-semibold mb-3">Restaurants List Surplus</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add surplus food with details like quantity, type, and available pickup time.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Step 2</div>
                <h3 className="text-xl font-semibold mb-3">NGOs Find & Request</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse nearby available food and request what you need for your community.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">Step 3</div>
                <h3 className="text-xl font-semibold mb-3">Connect & Deliver</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Confirm pickups, track deliveries, and ensure food reaches those in need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary-foreground mb-12">
            Our Impact
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="group">
              <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Reduce</div>
              <div className="text-2xl font-semibold text-primary-foreground/90 mb-1">Food Waste</div>
              <p className="text-primary-foreground/70">Rescue food before it goes to landfill</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Fight</div>
              <div className="text-2xl font-semibold text-primary-foreground/90 mb-1">Hunger</div>
              <p className="text-primary-foreground/70">Feed those who need it most</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Save</div>
              <div className="text-2xl font-semibold text-primary-foreground/90 mb-1">CO₂</div>
              <p className="text-primary-foreground/70">Reduce carbon emissions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose <span className="text-gradient-primary">Urban Food Router?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our platform makes it easy for restaurants to donate surplus food and for NGOs to find and receive donations - all within your local area.
              </p>
              <ul className="space-y-4">
                {[
                  "Location-based matching within 15km radius",
                  "Real-time updates and notifications",
                  "Easy pickup coordination",
                  "Track your impact and contributions",
                  "Verified restaurants and NGOs",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="p-6 text-center">
                  <Utensils className="h-10 w-10 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">Restaurants</div>
                  <p className="text-sm text-muted-foreground">Donate surplus food easily</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6 text-center">
                  <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">NGOs</div>
                  <p className="text-sm text-muted-foreground">Find food for your community</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">Local</div>
                  <p className="text-sm text-muted-foreground">15km radius matching</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardContent className="p-6 text-center">
                  <Clock className="h-10 w-10 text-purple-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">Fast</div>
                  <p className="text-sm text-muted-foreground">Real-time coordination</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our network of restaurants and NGOs working together to end food waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto shadow-lg">
                Join as Restaurant <Utensils className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 w-full sm:w-auto">
                Join as NGO <Heart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="p-1 bg-primary/10 rounded">
                  <Utensils className="h-4 w-4 text-primary" />
                </div>
                <div className="p-1 bg-secondary/10 rounded -ml-0.5">
                  <Heart className="h-4 w-4 text-secondary" />
                </div>
              </div>
              <span className="font-semibold">Urban Food Router</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Urban Food Router. Fighting food waste, one meal at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
