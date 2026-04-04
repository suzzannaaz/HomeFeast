import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Package, Clock, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCookOrdersApi, updateOrderStatusApi } from "@/lib/api";

export default function CookOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await getCookOrdersApi(token);
      setOrders(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: string, action: 'accept' | 'reject' | 'delivered') => {
    const token = localStorage.getItem("token");
    try {
      await updateOrderStatusApi(token!, orderId, action);
      toast({ 
        title: `Order ${action === 'delivered' ? 'Delivered' : action + 'ed'}`, 
        description: `Successfully updated order status.` 
      });
      fetchOrders(); // Refresh list
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card key={order._id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="font-medium text-slate-900">{order.user?.name || "Customer"}</span>
            </div>
            <Badge variant="outline" className="capitalize bg-orange-50 text-orange-700 border-orange-200">
              {order.planType} Plan
            </Badge>
          </div>
          <Badge className={
            order.status === 'pending' ? 'bg-yellow-500' :
            order.status === 'accepted' ? 'bg-blue-500' :
            order.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'
          }>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            {order.deliveryTime}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-orange-500" />
            {new Date(order.date).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {order.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleStatusUpdate(order._id, 'accept')}
                className="flex-1 bg-green-600 hover:bg-green-700 h-9 text-xs"
              >
                <CheckCircle className="mr-2 h-3.5 w-3.5" /> Accept
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleStatusUpdate(order._id, 'reject')}
                className="flex-1 h-9 text-xs text-red-600 border-red-100 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
              </Button>
            </>
          )}

          {order.status === 'accepted' && (
            <Button 
              onClick={() => handleStatusUpdate(order._id, 'delivered')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Package className="mr-2 h-4 w-4" /> Mark as Delivered
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <p className="text-muted-foreground">Manage incoming meal requests and deliveries</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="pending">New Requests ({orders.filter(o => o.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="active">Active ({orders.filter(o => o.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="history">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.filter(o => o.status === 'pending').length > 0 ? (
            orders.filter(o => o.status === 'pending').map(order => <OrderCard key={order._id} order={order} />)
          ) : (
            <p className="col-span-full text-center py-12 text-slate-400">No new order requests.</p>
          )}
        </TabsContent>

        <TabsContent value="active" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.filter(o => o.status === 'accepted').length > 0 ? (
            orders.filter(o => o.status === 'accepted').map(order => <OrderCard key={order._id} order={order} />)
          ) : (
            <p className="col-span-full text-center py-12 text-slate-400">No active orders being prepared.</p>
          )}
        </TabsContent>

        <TabsContent value="history" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.filter(o => ['delivered', 'rejected', 'cancelled'].includes(o.status)).map(order => <OrderCard key={order._id} order={order} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}