import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Utensils, Heart, MapPin, Loader2, ArrowLeft } from "lucide-react";

type UserRole = "restaurant" | "ngo";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<UserRole>("restaurant");
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setAddress(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
        setGettingLocation(false);
        toast.success("Location detected");
      },
      () => {
        setGettingLocation(false);
        toast.error("Failed to get location");
      }
    );
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { name },
          },
        });
        if (error) throw error;

        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role });

          if (roleError) throw roleError;

          if (role === "restaurant") {
            const { error: restError } = await supabase
              .from("restaurants")
              .insert({ 
                user_id: data.user.id, 
                name,
                address: address || null,
                latitude,
                longitude
              });
            if (restError) throw restError;
          } else {
            const { error: ngoError } = await supabase
              .from("ngos")
              .insert({ 
                user_id: data.user.id, 
                name,
                address: address || null,
                latitude,
                longitude
              });
            if (ngoError) throw ngoError;
          }

          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-background to-secondary/5">
      {/* Header */}
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 pb-8">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center gap-2 mb-4">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Utensils className="h-6 w-6 text-secondary" />
              </div>
              <div className="p-2 bg-primary/10 rounded-xl">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to your account to continue" : "Join our community to fight food waste"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your organization name"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        className="flex-1 h-11"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0"
                        onClick={getCurrentLocation}
                        disabled={gettingLocation}
                        title="Use current location"
                      >
                        {gettingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {latitude && longitude && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {latitude.toFixed(4)}, {longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label>I am a</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)}>
                      <label 
                        htmlFor="restaurant"
                        className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          role === "restaurant" 
                            ? "border-secondary bg-secondary/5" 
                            : "border-border hover:border-secondary/50 hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value="restaurant" id="restaurant" className="sr-only" />
                        <div className={`p-2 rounded-lg ${role === "restaurant" ? "bg-secondary/20" : "bg-muted"}`}>
                          <Utensils className={`h-5 w-5 ${role === "restaurant" ? "text-secondary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Restaurant</div>
                          <div className="text-sm text-muted-foreground">Donate surplus food</div>
                        </div>
                      </label>
                      <label 
                        htmlFor="ngo"
                        className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          role === "ngo" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value="ngo" id="ngo" className="sr-only" />
                        <div className={`p-2 rounded-lg ${role === "ngo" ? "bg-primary/20" : "bg-muted"}`}>
                          <Heart className={`h-5 w-5 ${role === "ngo" ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">NGO / Shelter</div>
                          <div className="text-sm text-muted-foreground">Receive food donations</div>
                        </div>
                      </label>
                    </RadioGroup>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
