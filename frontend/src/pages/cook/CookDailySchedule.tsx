import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Clock, MapPin, CheckCircle2, Phone } from "lucide-react";
import { getCookOrdersApi, getCookSubscriptionsApi } from "@/lib/api";

export default function CookDailySchedule() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDailyData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [orders, subs] = await Promise.all([
        getCookOrdersApi(token!),
        getCookSubscriptionsApi(token!)
      ]);

      // 1. Filter only today's relevant one-time orders (Accepted)
      const activeOrders = orders.filter((o: any) => o.status === "accepted");

      // 2. Filter only ACTIVE subscriptions (Exclude Paused/Pending)
      const activeSubs = subs.filter((s: any) => s.status === "active");

      // 3. Merge into a unified "Delivery Item" format
      const combined = [
        ...activeOrders.map((o: any) => ({
          id: o._id,
          name: o.user?.name,
          type: "One-Time",
          time: o.deliveryTime,
          plan: o.planType,
          isSub: false
        })),
        ...activeSubs.map((s: any) => ({
          id: s._id,
          name: s.user?.name,
          type: "Subscription",
          time: s.deliveryTime,
          plan: s.planType,
          isSub: true
        }))
      ];

      // Sort by delivery time (e.g., 12:00 PM before 08:00 PM)
      setSchedule(combined.sort((a, b) => a.time.localeCompare(b.time)));
    } catch (err) {
      console.error("Schedule error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDailyData(); }, []);

  if (loading) return <div className="p-10 text-center">Generating Today's Prep List...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Today's Schedule</h2>
          <p className="text-muted-foreground">Confirmed tiffins for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-orange-600">{schedule.length}</div>
          <p className="text-xs font-bold uppercase text-slate-400">Total Tiffins</p>
        </div>
      </div>

      <div className="grid gap-4">
        {schedule.length === 0 ? (
          <Card className="border-dashed border-2 py-20 text-center text-slate-400">
            <Utensils className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>No deliveries scheduled for today.</p>
          </Card>
        ) : (
          schedule.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Time Slot Sidebar */}
                  <div className="bg-slate-900 text-white w-24 flex flex-col items-center justify-center p-2">
                    <Clock className="h-4 w-4 mb-1 text-orange-400" />
                    <span className="text-xs font-bold">{item.time}</span>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.isSub ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] h-5">{item.type}</Badge>
                          <span className="text-xs text-slate-500 capitalize">{item.plan} Meal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Quick Summary Footer */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-xs font-bold text-orange-800 uppercase">Subscriptions</p>
          <p className="text-2xl font-bold">{schedule.filter(i => i.isSub).length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-xs font-bold text-blue-800 uppercase">One-time Orders</p>
          <p className="text-2xl font-bold">{schedule.filter(i => !i.isSub).length}</p>
        </div>
      </div>
    </div>
  );
}

// Sub-component button (Internal UI kit used above)
function Button({ className, variant, size, children, ...props }: any) {
  const variants: any = {
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  };
  return (
    <button className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}