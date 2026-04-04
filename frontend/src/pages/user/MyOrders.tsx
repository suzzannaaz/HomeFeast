import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, statusConfig } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getUserOrdersApi,
  cancelOrderApi,
  createReviewApi,
  getReviewedOrderIdsApi,
} from "@/lib/api";

export default function MyOrders() {
  const { toast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [reviewedOrderIds, setReviewedOrderIds] = useState<string[]>([]); // ✅ ADD THIS
  const [loading, setLoading] = useState(true);

  const [reviewOrder, setReviewOrder] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ Fetch Orders
 // 2. Wrap fetchOrders in useCallback to prevent re-creation on every render
  // const fetchOrders = useCallback(async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     const data = await getUserOrdersApi(token);
      
  //     // ✅ Ensure we replace the state rather than appending to it
  //     // Some APIs return { orders: [] }, others return []
  //     const freshOrders = Array.isArray(data) ? data : data.orders || [];
  //     setOrders(freshOrders); 
      
  //   } catch (err: any) {
  //     toast({
  //       title: "Error",
  //       description: err.message || "Failed to load orders",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [toast]); // Dependency on toast is fine

  // ✅ Updated Fetch Orders to include Reviewed IDs check
  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // 1. Fetch both APIs simultaneously for better performance
      const [orderData, reviewedIds] = await Promise.all([
        getUserOrdersApi(token),
        getReviewedOrderIdsApi(token) // Make sure this is in your lib/api.ts
      ]);
      
      // 2. Process Orders
      const freshOrders = Array.isArray(orderData) ? orderData : orderData.orders || [];
      setOrders(freshOrders); 
      
      // 3. Process Reviewed IDs (State we added earlier)
      setReviewedOrderIds(reviewedIds); 
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Cancel Order
  const handleCancel = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await cancelOrderApi(token, id);

      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled",
      });

      fetchOrders(); // refresh
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  // ✅ Submit Review (CONNECTED TO BACKEND)
  const submitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !reviewOrder) return;

    const order = orders.find((o) => o._id === reviewOrder);

    if (!order?.cook?._id) {
      toast({
        title: "Error",
        description: "Cook not found",
        variant: "destructive",
      });
      return;
    }

    try {
    await createReviewApi(token, {
  cook: order.cook,// ✅
  order: order._id,   // ✅ ADD THIS
  rating,
  comment,
});

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setReviewedOrderIds((prev) => [...prev, reviewOrder]);

      setReviewOrder(null);
      setRating(0);
      setComment("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  // ✅ Loading / Empty
  if (loading)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Loading your orders...
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-center py-12 text-muted-foreground">
        No orders found.
      </p>
    );

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold">My Orders</h2>
        <p className="text-muted-foreground">
          Track your meal orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* LEFT SIDE */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {order.cook?.user?.name || "Chef"}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {order.deliveryTime || "N/A"}
                    </span>

                    <span className="capitalize">
                      {order.planType} plan
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="flex gap-2">
                  
                  {/* Cancel */}
                  {order.status === "pending" && (
                    <Button
                      className={`${statusConfig.pending.className} border`}
                      size="sm"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </Button>
                  )}

                  {/* Review */}
                  {/* ✅ Updated Review Section */}
{order.status === "delivered" && (
  <>
    {/* Check if this specific order ID exists in our reviewed list */}
    {reviewedOrderIds.includes(order._id) ? (
      <Button variant="ghost" disabled className="text-green-600 bg-green-50 font-semibold">
        Reviewed ✅
      </Button>
    ) : (
      <Dialog
        open={reviewOrder === order._id}
        onOpenChange={(open) => {
          if (!open) setReviewOrder(null);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReviewOrder(order._id)}
          >
            Leave Review
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Review {order.cook?.user?.name || "Chef"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <StarRating
                value={rating}
                onChange={setRating}
              />
            </div>

            <Textarea
              placeholder="How was your meal? Your feedback helps the chef!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={submitReview}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </>
)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}