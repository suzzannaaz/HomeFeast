// import { useEffect, useState } from "react";
// import {
//   getSubscriptionsApi, // ✅ Import the GET function
//   pauseSubscriptionApi,
//   cancelSubscriptionApi,
//   resumeSubscriptionApi,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast"; // Recommended for error handling

// export default function MySubscriptions() {
//   const [subs, setSubs] = useState<any[]>([]);
//   const { toast } = useToast();

//   const fetchSubs = async () => {
//     try {
//       // ✅ Use getSubscriptionsApi instead of createSubscriptionApi
//       const data = await getSubscriptionsApi();
      
//       // Handle cases where data might be an object containing an array
//       const subscriptionList = Array.isArray(data) ? data : data.subscriptions || [];
//       setSubs(subscriptionList);
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSubs();
//   }, []);

// // ✅ New Resume Handler
//   const handleResume = async (id: string) => {
//     try {
//       await resumeSubscriptionApi(id);
//       toast({ title: "Resumed", description: "Your meals are back on track!" });
//       fetchSubs(); 
//     } catch (err: any) {
//       toast({ title: "Error", description: "Failed to resume", variant: "destructive" });
//     }
//   };

//   const handlePause = async (id: string) => {
//     try {
//       await pauseSubscriptionApi(id);
//       toast({ title: "Paused", description: "Subscription status updated." });
//       fetchSubs(); // Refresh the list
//     } catch (err: any) {
//       toast({ title: "Error", description: "Failed to pause", variant: "destructive" });
//     }
//   };

//   const handleCancel = async (id: string) => {
//     try {
//       await cancelSubscriptionApi(id);
//       toast({ title: "Cancelled", description: "Subscription has been cancelled." });
//       fetchSubs(); // Refresh the list
//     } catch (err: any) {
//       toast({ title: "Error", description: "Failed to cancel", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>

//       {subs.length === 0 ? (
//         <p className="text-muted-foreground">You don't have any active subscriptions yet.</p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2">
//           {subs.map((sub) => (
//             <div
//               key={sub._id}
//               className="border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className="font-bold text-lg text-slate-800">
//                   {sub.cook?.name || "Chef"} 
//                 </h3>
//                 {/* Status Badge */}
//                 <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
//                   sub.status === 'active' ? 'bg-green-100 text-green-700' : 
//                   sub.status === 'paused' ? 'bg-amber-100 text-amber-700' : 
//                   'bg-slate-100 text-slate-600'
//                 }`}>
//                   {sub.status}
//                 </span>
//               </div>

//               <div className="mt-3 space-y-1">
//                 <p className="text-sm text-slate-600">
//                   <span className="font-medium">Plan:</span> {sub.planType}
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   <span className="font-medium">Delivery:</span> {sub.deliveryTime}
//                 </p>
//                 {/* Visual indicator of end date */}
//                 <p className="text-xs text-slate-400 mt-2">
//                   Expires: {new Date(sub.endDate).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="flex gap-3 mt-5">
//                 {/* ✅ Toggle logic: If paused, show Resume. If active, show Pause. */}
//                 {sub.status === 'paused' ? (
//                   <button
//                     onClick={() => handleResume(sub._id)}
//                     className="flex-1 px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Resume
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handlePause(sub._id)}
//                     disabled={sub.status === 'cancelled'}
//                     className="flex-1 px-3 py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors disabled:hidden"
//                   >
//                     Pause
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleCancel(sub._id)}
//                   disabled={sub.status === 'cancelled'}
//                   className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
//                 >
//                   {sub.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  getSubscriptionsApi,
  pauseSubscriptionApi,
  cancelSubscriptionApi,
  resumeSubscriptionApi,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"; // Helpful icons

export default function MySubscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchSubs = async () => {
    try {
      const data = await getSubscriptionsApi();
      const subscriptionList = Array.isArray(data) ? data : data.subscriptions || [];
      setSubs(subscriptionList);
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleResume = async (id: string) => {
    try {
      await resumeSubscriptionApi(id);
      toast({ title: "Resumed", description: "Your meals are back on track!" });
      fetchSubs();
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to resume", variant: "destructive" });
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseSubscriptionApi(id);
      toast({ title: "Paused", description: "Subscription status updated." });
      fetchSubs();
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to pause", variant: "destructive" });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelSubscriptionApi(id);
      toast({ title: "Cancelled", description: "Subscription has been cancelled." });
      fetchSubs();
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to cancel", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">My Subscriptions</h1>
      <p className="text-slate-500 mb-8">Manage your recurring meal plans and track delivery status.</p>

      {subs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
           <p className="text-muted-foreground">You don't have any active subscriptions yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {subs.map((sub) => (
            <div
              key={sub._id}
              className={`relative border p-6 rounded-2xl bg-white shadow-sm transition-all ${
                sub.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : 'hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">
                    {sub.cook?.user?.name || sub.cook?.name || "Chef"} 
                  </h3>
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                    {sub.planType} Plan
                  </p>
                </div>

                {/* --- Dynamic Status Badge --- */}
                <div className="flex flex-col items-end gap-1">
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
                    sub.status === 'active' ? 'bg-green-100 text-green-700' : 
                    sub.status === 'paused' ? 'bg-blue-100 text-blue-700' : 
                    sub.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {sub.status === 'pending' && <Clock className="w-3 h-3" />}
                    {sub.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                    {sub.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {sub.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery Slot</span>
                  <span className="font-semibold text-slate-700">{sub.deliveryTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Renewal Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* --- Contextual Actions --- */}
              <div className="flex gap-3 mt-5">
                {sub.status === 'pending' ? (
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    Waiting for Chef to accept...
                  </div>
                ) : sub.status === 'rejected' ? (
                  <div className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg text-center">
                    Chef declined this request.
                  </div>
                ) : (
                  <>
                    {sub.status === 'paused' ? (
                      <button
                        onClick={() => handleResume(sub._id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Resume
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePause(sub._id)}
                        disabled={sub.status === 'cancelled'}
                        className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:hidden"
                      >
                        Pause
                      </button>
                    )}
                  </>
                )}

                {/* Cancel button is usually available unless already cancelled or rejected */}
                {!['cancelled', 'rejected'].includes(sub.status) && (
                  <button
                    onClick={() => handleCancel(sub._id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}