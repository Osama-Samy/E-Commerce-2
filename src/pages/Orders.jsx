import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/api";

const statusStyles = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  shipped:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  delivered:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data?.orders || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors pt-12 sm:pt-16 pb-16">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          My Orders
        </h1>

        {loading && (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No orders found.</p>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="cursor-pointer bg-white dark:bg-slate-800 border border-gray-100
                         dark:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row
                         sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    #{order._id?.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      statusStyles[order.status?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-400">
                  {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-slate-700">
                <span>{order.totalPrice?.toFixed(2)} EGP</span>
                <span className="text-lg">›</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}