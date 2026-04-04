import { useEffect, useState } from "react";
import { getAllUsersApi, deleteUserApi, toggleBlockUserApi } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsersApi(token!);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteUserApi(token!, id);
    fetchUsers();
  };

  const handleBlock = async (id: string) => {
    await toggleBlockUserApi(token!, id);
    fetchUsers();
  };

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Users</h1>

    {/* ✅ Desktop Table */}
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-[700px] w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Blocked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="text-center border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                {u.isBlocked ? "Yes" : "No"}
              </td>
              <td className="space-x-2 p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleBlock(u._id)}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Mobile Card View */}
    <div className="md:hidden space-y-4">
      {users.map((u) => (
        <div
          key={u._id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <p className="font-semibold">{u.name}</p>
          <p className="text-sm text-gray-500">{u.email}</p>

          <p className="mt-2">
            Status:{" "}
            <span className={u.isBlocked ? "text-red-500" : "text-green-500"}>
              {u.isBlocked ? "Blocked" : "Active"}
            </span>
          </p>

          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 bg-red-500 text-white py-1 rounded"
              onClick={() => handleDelete(u._id)}
            >
              Delete
            </button>
            <button
              className="flex-1 bg-yellow-500 text-white py-1 rounded"
              onClick={() => handleBlock(u._id)}
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default UsersPage;