import { useEffect, useState } from "react";
import { getAllCooksApi, approveCookApi, rejectCookApi } from "@/lib/api";

interface Cook {
  _id: string;
  user: { name: string; email: string; location?: string };
  isApproved: boolean;
}

const CooksPage = () => {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const token = localStorage.getItem("token");

  const fetchCooks = async () => {
    const data = await getAllCooksApi(token!);
    setCooks(data);
  };

  useEffect(() => {
    fetchCooks();
  }, []);

  const handleApprove = async (id: string) => {
    await approveCookApi(token!, id);
    fetchCooks();
  };

  const handleReject = async (id: string) => {
    await rejectCookApi(token!, id);
    fetchCooks();
  };

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Cooks</h1>

    {/* ✅ Desktop Table */}
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-[700px] w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Approved</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cooks.map((c) => (
            <tr key={c._id} className="text-center border-t">
              <td className="p-2">{c.user.name}</td>
              <td className="p-2">{c.user.email}</td>
              <td className="p-2">
                {/* {c.isApproved ? "Yes" : "No"} */}
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
  c.isApproved ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
}`}>
  {c.isApproved ? "Approved" : "Pending"}
</span>
              </td>
              <td className="space-x-2 p-2">
                {!c.isApproved && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleApprove(c._id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleReject(c._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Mobile Card View */}
    <div className="md:hidden space-y-4">
      {cooks.map((c) => (
        <div
          key={c._id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <p className="font-semibold">{c.user.name}</p>
          <p className="text-sm text-gray-500">{c.user.email}</p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={
                c.isApproved ? "text-green-500" : "text-yellow-500"
              }
            >
              {c.isApproved ? "Approved" : "Pending"}
            </span>
          </p>

          <div className="flex gap-2 mt-3">
            {!c.isApproved && (
              <button
                className="flex-1 bg-green-500 text-white py-1 rounded"
                onClick={() => handleApprove(c._id)}
              >
                Approve
              </button>
            )}
            <button
              className="flex-1 bg-red-500 text-white py-1 rounded"
              onClick={() => handleReject(c._id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default CooksPage;