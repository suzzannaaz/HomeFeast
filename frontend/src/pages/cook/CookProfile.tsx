import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, ChefHat, MapPin, Clock, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMyCookProfileApi, createCookProfileApi, updateCookProfileApi } from "@/lib/api";

export default function CookProfileSetup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    serviceArea: "",
    deliveryTime: "",
    cuisines: [] as string[],
    mealType: "veg",
    pricePerMeal: 0,
    availablePlans: [] as string[],
  });

  const [newCuisine, setNewCuisine] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const profile = await getMyCookProfileApi(token);
        localStorage.setItem("cookId", profile._id);
        if (profile) {
          setFormData(profile);
          setIsExisting(true);
        }
      } catch (err) {
        console.error("No profile found yet");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleAddCuisine = () => {
    if (newCuisine && !formData.cuisines.includes(newCuisine)) {
      setFormData({ ...formData, cuisines: [...formData.cuisines, newCuisine] });
      setNewCuisine("");
    }
  };

  const handleTogglePlan = (plan: string) => {
    const current = formData.availablePlans;
    const updated = current.includes(plan) 
      ? current.filter(p => p !== plan) 
      : [...current, plan];
    setFormData({ ...formData, availablePlans: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (isExisting) {
        await updateCookProfileApi(token, formData);
        toast({ title: "Kitchen Updated", description: "Your profile is now current." });
      } else {
        await createCookProfileApi(token, formData);
        setIsExisting(true);
        toast({ title: "Kitchen Created!", description: "You are now ready to accept orders." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Chef Kitchen...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <ChefHat className="text-white w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold">Kitchen Profile</CardTitle>
          <CardDescription>Setup your subscription and delivery details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div className="space-y-2">
              <Label>Chef Bio</Label>
              <Textarea 
                placeholder="Tell us about your cooking style and experience..." 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Service Area */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Service Area</Label>
                <Input 
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                  placeholder="e.g. Downtown Mumbai"
                  required
                />
              </div>

              {/* Delivery Time */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Clock className="w-4 h-4" /> Delivery Time Range</Label>
                <Input 
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                  placeholder="e.g. 12:00 PM - 2:00 PM"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
               {/* Meal Type */}
               <div className="space-y-2">
                <Label>Dietary Focus</Label>
                <Select value={formData.mealType} onValueChange={(v) => setFormData({...formData, mealType: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg"> Veg</SelectItem>
                    <SelectItem value="non-veg">Non-Veg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Banknote className="w-4 h-4" /> Basic Price per Meal (₹)</Label>
                <Input 
                  type="number"
                  value={formData.pricePerMeal}
                  onChange={(e) => setFormData({...formData, pricePerMeal: Number(e.target.value)})}
                  required
                />
              </div>
            </div>

            {/* Cuisines */}
            <div className="space-y-2">
              <Label>Cuisines Specialties</Label>
              <div className="flex gap-2">
                <Input 
                  value={newCuisine} 
                  onChange={(e) => setNewCuisine(e.target.value)}
                  placeholder="e.g. Punjabi, South Indian"
                />
                <Button type="button" onClick={handleAddCuisine}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.cuisines.map((c) => (
                  <Badge key={c} variant="secondary" className="px-3 py-1 gap-2">
                    {c} <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({...formData, cuisines: formData.cuisines.filter(item => item !== c)})} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Plans */}
            <div className="space-y-2">
              <Label>Subscription Plans Offered</Label>
              <div className="flex gap-4">
                {['daily', 'weekly', 'monthly'].map((plan) => (
                  <div key={plan} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={plan}
                      checked={formData.availablePlans.includes(plan)}
                      onChange={() => handleTogglePlan(plan)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <Label htmlFor={plan} className="capitalize">{plan}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-lg rounded-xl">
              {isExisting ? "Update My Kitchen" : "Launch My Kitchen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}