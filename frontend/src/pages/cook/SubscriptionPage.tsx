import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Check, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCookSubscriptionsApi, updateSubStatusApi } from "@/lib/api";

export default function CookSubscriptionsPage() {
  const { toast } = useToast();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await getCookSubscriptionsApi(token!);
      setSubs(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load subscriptions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleAction = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
      await updateSubStatusApi(token!, id, status);
      toast({ title: "Success", description: `Subscription is now ${status}` });
      fetchSubs();
    } catch (err) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Subscriptions...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Subscription Requests</h2>
          <p className="text-muted-foreground">Manage your long-term tiffin customers</p>
        </div>
      </div>

      <div className="grid gap-4">
        {subs.length === 0 && <p className="text-center py-20 text-slate-400">No subscriptions found.</p>}
        
        {subs.map((sub) => (
          <Card key={sub._id} className="border-l-4 border-l-orange-500">
            <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{sub.user?.name}</h3>
                  <div className="flex gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {sub.planType}</span>
                    <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Ends: {new Date(sub.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Badge className={sub.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
                  {sub.status.toUpperCase()}
                </Badge>
                
                {sub.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(sub._id, 'active')}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(sub._id, 'rejected')}>
                      <X className="h-4 w-4 mr-1" /> Decline
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}