import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationInput from "./LocationInput";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface SettingsSectionProps {
  type: "restaurant" | "ngo";
  data: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    cuisine_type?: string | null;
    operating_hours?: string | null;
  };
  onUpdate: () => void;
}

const SettingsSection = ({ type, data, onUpdate }: SettingsSectionProps) => {
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || "");
  const [address, setAddress] = useState(data.address || "");
  const [latitude, setLatitude] = useState<number | null>(data.latitude);
  const [longitude, setLongitude] = useState<number | null>(data.longitude);
  const [cuisineType, setCuisineType] = useState(data.cuisine_type || "");
  const [operatingHours, setOperatingHours] = useState(data.operating_hours || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    const table = type === "restaurant" ? "restaurants" : "ngos";
    const updateData: Record<string, unknown> = {
      name,
      description: description || null,
      address: address || null,
      latitude,
      longitude
    };

    if (type === "restaurant") {
      updateData.cuisine_type = cuisineType || null;
      updateData.operating_hours = operatingHours || null;
    }

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", data.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully");
      onUpdate();
    }
    setSaving(false);
  };

  const handleLocationChange = (location: { address: string; latitude: number | null; longitude: number | null }) => {
    setAddress(location.address);
    setLatitude(location.latitude);
    setLongitude(location.longitude);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>Update your organization details and location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your organization"
            rows={3}
          />
        </div>

        {type === "restaurant" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Input
                id="cuisineType"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                placeholder="e.g., Italian, Indian, Multi-cuisine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="e.g., Mon-Fri 9AM-10PM"
              />
            </div>
          </>
        )}

        <div className="pt-2">
          <h4 className="text-sm font-medium mb-3">Location</h4>
          <LocationInput
            address={address}
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
