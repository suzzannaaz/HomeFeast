import { useEffect, useState } from "react";
import { getAdminStatsApi } from "@/lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, cooks: 0, orders: 0, subscriptions: 0 });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStatsApi(token!);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-200 rounded">Users: {stats.users}</div>
        <div className="p-4 bg-green-200 rounded">Cooks: {stats.cooks}</div>
        <div className="p-4 bg-yellow-200 rounded">Orders: {stats.orders}</div>
        <div className="p-4 bg-red-200 rounded">Subscriptions: {stats.subscriptions}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;