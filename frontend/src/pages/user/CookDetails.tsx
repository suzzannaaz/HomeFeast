import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/StarRating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ChefHat, MapPin, Clock, ArrowLeft, CalendarCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createOrderApi, createSubscriptionApi, getMenusByCookApi } from "@/lib/api";

export default function CookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [cook, setCook] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [open, setOpen] = useState(false);
  const [planType, setPlanType] = useState("daily");
  const [deliveryTime, setDeliveryTime] = useState("12:00");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users/cooks/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const cookData = await res.json();
        if (!res.ok) throw new Error(cookData.message || "Failed to fetch cook");
        
        setCook(cookData);
        const menuData = await getMenusByCookApi(cookData.user._id);
        setMenus(menuData);
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  // 2. Handle Subscription Logic
  const handleConfirmOrder = async () => {
  const token = localStorage.getItem("token");
  
  // 1. Auth Check
  if (!token) {
    toast({ title: "Login Required", variant: "destructive" });
    return navigate("/login");
  }

  setIsSubmitting(true);

  try {
    // 2. THE LOGIC GATE
    if (planType === "daily") {
      // Calls the Order API for a single day
      // cook.user._id
      await createOrderApi(token, cook._id, planType, deliveryTime, startDate);
      toast({ title: "Order Placed!", description: "Daily tiffin confirmed!" });
    } else {
      // Calls the Subscription API for Weekly/Monthly
      await createSubscriptionApi({
        cook: cook._id, // ✅ FIXED
        planType,
        deliveryTime,
      });
      toast({ title: "Subscribed!", description: `Started your ${planType} plan.` });
    }

    setOpen(false);
    navigate("/user/orders"); 
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) return <div className="text-center py-20 animate-pulse">Loading Chef Profile...</div>;
  if (!cook) return <div className="text-center py-20">Chef not found</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-transparent -ml-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Explore More Chefs
      </Button>

      {/* Chef Profile Header */}
      <Card className="border-none shadow-md bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <ChefHat className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800">{cook.user?.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  {cook.cuisines?.map((c: string) => (
                    <Badge key={c} variant="outline" className="bg-white/50">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm font-medium text-slate-600 border-t pt-4">
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-500" /> {cook.deliveryTime}</div>
            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-500" /> {cook.serviceArea}</div>
            <div className="flex items-center gap-1.5"><StarRating value={Math.round(cook.rating || 0)} readonly /></div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Section */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🍽️ Chef's Specialties
        </h3>
        <div className="grid gap-3">
          {menus.length > 0 ? menus.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-4 rounded-xl border bg-white hover:border-orange-200 transition-colors">
              <div>
                <p className="font-bold text-slate-700">{item.name}</p>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{item.category}</Badge>
              </div>
              <p className="font-bold text-orange-600 text-lg">₹{item.price}</p>
            </div>
          )) : (
            <p className="text-muted-foreground italic">No items listed yet.</p>
          )}
        </div>
      </section>

      {/* Subscription Action */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-orange-100 bg-orange-500 hover:bg-orange-600 transition-all">
            Choose a Meal Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Subscription</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Plan Selector */}
            <div className="space-y-3">
              <Label className="text-slate-500">Select Frequency</Label>
              <div className="grid grid-cols-3 gap-2">
                {['daily', 'weekly', 'monthly'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlanType(p)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                      planType === p ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Logistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-500">Delivery Time</Label>
                <Input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-500">Start Date</Label>
                <Input type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex gap-3 items-center">
              <CalendarCheck className="h-5 w-5 text-slate-400" />
              <p className="text-xs text-slate-500">
                You can pause or cancel your <b>{planType}</b> subscription anytime from your dashboard.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              disabled={isSubmitting} 
              onClick={handleConfirmOrder} 
              className="w-full py-6 bg-orange-500 rounded-xl text-lg font-bold"
            >
              {isSubmitting ? "Processing..." : 
              planType === 'daily' ? "Order Today's Tiffin" : `Start ${planType} Subscription`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}