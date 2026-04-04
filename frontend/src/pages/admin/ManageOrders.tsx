import { useEffect, useState } from "react";
import { getAllOrdersApi } from "@/lib/api";

interface Order {
  _id: string;
  user: { name: string; email: string };
  cook: { name: string };
  planType: string;
  deliveryTime: string;
  status: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    const data = await getAllOrdersApi(token!);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Orders</h1>

    {/* ✅ Desktop Table */}
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-[800px] w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">User</th>
            <th className="p-2">Cook</th>
            <th className="p-2">Plan</th>
            <th className="p-2">Delivery</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="text-center border-t">
              <td className="p-2">{o.user.name}</td>
              <td className="p-2">{o.cook.name}</td>
              <td className="p-2 capitalize">{o.planType}</td>
              <td className="p-2">{o.deliveryTime}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    o.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : o.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Mobile Cards */}
    <div className="md:hidden space-y-4">
      {orders.map((o) => (
        <div key={o._id} className="border rounded-xl p-4 shadow-sm bg-white">
          <p className="font-semibold">{o.user.name}</p>
          <p className="text-sm text-gray-500">Cook: {o.cook.name}</p>

          <p className="mt-2 text-sm">Plan: {o.planType}</p>
          <p className="text-sm">Delivery: {o.deliveryTime}</p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                o.status === "delivered"
                  ? "text-green-500"
                  : o.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {o.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
);
};

export default OrdersPage;