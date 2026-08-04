import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyOrderById } from "../api/api";

const ORDER_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function OrderProgress({ status }) {
  const currentIndex = ORDER_STEPS.indexOf(status?.toLowerCase());
  if (status?.toLowerCase() === "cancelled") {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Order Progress
        </h2>
        <p className="text-red-500 text-sm font-medium">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
      <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-6">
        Order Progress
      </h2>
      <div className="flex items-center overflow-x-auto pb-3 pt-1 scrollbar-none">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isLast = index === ORDER_STEPS.length - 1;

          return (
            <div key={step} className="flex items-center flex-1 min-w-[90px] last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium capitalize whitespace-nowrap ${
                    isCompleted
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 min-w-[20px] mb-6 ${
                    index < currentIndex
                      ? "bg-indigo-600"
                      : "bg-gray-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await getMyOrderById(id);
      setOrder(res.data?.order || res.data);
      setError(null);
    } catch (err) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
        <p className="text-center mt-10 dark:text-slate-300">Loading...</p>
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
        <p className="text-center mt-10 text-red-500">
          {error || "Order not found"}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors pt-24 sm:pt-28 pb-16">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Order Details
            </h1>
            <p className="text-sm text-slate-400">
              Order #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              statusStyles[order.status?.toLowerCase()] ||
              "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {formatStatus(order.status)}
          </span>
        </div>
        <OrderProgress status={order.status} />
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">
            📦 Items
          </h2>
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded bg-gray-100 dark:bg-slate-700"
                />
                <div>
                  <p className="text-xs text-slate-400">
                    Qty: {item.quantity} × EGP {item.price}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                EGP {(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">
              📍 Shipping Address
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {order.shippingAddress?.city}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {order.shippingAddress?.address}, {order.shippingAddress?.country}
            </p>
            <p className="text-sm text-indigo-500">
              {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">
              💳 Payment
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">
              {order.paymentMethod} ({order.paymentStatus})
            </p>

            <hr className="my-3 border-gray-100 dark:border-slate-700" />
            <div className="flex justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Total
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                EGP {order.totalPrice?.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}