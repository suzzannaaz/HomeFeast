import { useEffect, useState } from "react";
import { getAllSubscriptionsApi, updateSubscriptionStatusApi } from "@/lib/api";

interface Sub {
  _id: string;
  user: { name: string };
   cook: { user: { name: string; email?: string } };
  planType: string;
  deliveryTime: string;
  status: string;
}

const SubscriptionsPage = () => {
  const [subs, setSubs] = useState<Sub[]>([]);
  const token = localStorage.getItem("token");

  const fetchSubs = async () => {
    const data = await getAllSubscriptionsApi(token!);
    setSubs(data);
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateSubscriptionStatusApi(token!, id, status);
    fetchSubs();
  };

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

    {/* ✅ Desktop Table */}
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-[900px] w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">User</th>
            <th className="p-2">Cook</th>
            <th className="p-2">Plan</th>
            <th className="p-2">Delivery</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s._id} className="text-center border-t">
              <td className="p-2">{s.user.name}</td>
              <td className="p-2">{s.cook?.user?.name}</td>
              <td className="p-2 capitalize">{s.planType}</td>
              <td className="p-2">{s.deliveryTime}</td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    s.status === "active"
                      ? "bg-green-100 text-green-600"
                      : s.status === "paused"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.status}
                </span>
              </td>

              <td className="space-x-2 p-2">
                {s.status !== "active" && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(s._id, "active")}
                  >
                    Activate
                  </button>
                )}
                {s.status !== "paused" && (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(s._id, "paused")}
                  >
                    Pause
                  </button>
                )}
                {s.status !== "cancelled" && (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(s._id, "cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Mobile Cards */}
    <div className="md:hidden space-y-4">
      {subs.map((s) => (
        <div key={s._id} className="border rounded-xl p-4 shadow-sm bg-white">
          <p className="font-semibold">{s.user.name}</p>
          <p className="text-sm text-gray-500">
            Cook: {s.cook?.user?.name}
          </p>

          <p className="mt-2 text-sm">Plan: {s.planType}</p>
          <p className="text-sm">Delivery: {s.deliveryTime}</p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                s.status === "active"
                  ? "text-green-500"
                  : s.status === "paused"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {s.status}
            </span>
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {s.status !== "active" && (
              <button
                className="flex-1 bg-green-500 text-white py-1 rounded"
                onClick={() => handleStatusChange(s._id, "active")}
              >
                Activate
              </button>
            )}
            {s.status !== "paused" && (
              <button
                className="flex-1 bg-yellow-500 text-white py-1 rounded"
                onClick={() => handleStatusChange(s._id, "paused")}
              >
                Pause
              </button>
            )}
            {s.status !== "cancelled" && (
              <button
                className="flex-1 bg-red-500 text-white py-1 rounded"
                onClick={() => handleStatusChange(s._id, "cancelled")}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default SubscriptionsPage;