import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyOrderById } from "../api/api";
import { ArrowLeft, Package, MapPin, CreditCard, Check } from "lucide-react";

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
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
        <h2 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 mb-2">
          Order Progress
        </h2>
        <p className="text-red-500 text-sm font-semibold">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
      <h2 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white mb-4 sm:mb-6">
        Order Progress
      </h2>

      <div className="block sm:hidden space-y-4 relative pl-1">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === ORDER_STEPS.length - 1;

          return (
            <div key={step} className="flex items-center gap-3 relative">
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-7 bottom-[-16px] w-0.5 z-0 ${
                    index < currentIndex
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-gray-200 dark:bg-slate-700"
                  }`}
                />
              )}

              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>

              <span
                className={`text-xs font-bold capitalize transition-all ${
                  isCurrent
                    ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                    : isCompleted
                    ? "text-slate-800 dark:text-slate-200 font-semibold"
                    : "text-gray-400 dark:text-slate-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block w-full pt-1">
        <div className="flex items-start justify-between">
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === ORDER_STEPS.length - 1;

            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {!isLast && (
                  <div
                    className={`absolute top-4 left-[50%] w-full h-1 z-0 transition-all ${
                      index < currentIndex
                        ? "bg-indigo-600 dark:bg-indigo-500"
                        : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  )}
                </div>

                <span
                  className={`text-xs mt-2.5 font-bold capitalize text-center transition-all ${
                    isCurrent
                      ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                      : isCompleted
                      ? "text-slate-800 dark:text-slate-200 font-semibold"
                      : "text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const statusStyles = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 pt-24 sm:pt-28 pb-16 px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading Order Details...</p>
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 pt-24 sm:pt-28 pb-16 px-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
          <p className="text-red-500 font-bold mb-4">{error || "Order not found"}</p>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-28 pb-16 px-3 sm:px-6 lg:px-8">
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shrink-0"
              aria-label="Back to orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Order Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Order #{order._id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <span
            className={`self-start sm:self-center text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${
              statusStyles[order.status?.toLowerCase()] ||
              "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        <OrderProgress status={order.status} />

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-100 dark:border-slate-700/80">
          <h2 className="font-bold text-base sm:text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" /> Order Items ({order.items?.length || 0})
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {order.items?.map((item, i) => {
              const itemName = item.name || item.product?.name || "Product Item";
              const itemImage = item.image || item.product?.images?.[0]?.url || item.product?.image;
              const unitPrice = item.price || item.product?.price || 0;
              const itemTotal = item.quantity * unitPrice;

              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl bg-gray-50 dark:bg-slate-900 p-1.5 shrink-0 border border-gray-100 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {itemName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Qty: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span> × EGP {unitPrice}
                      </p>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white whitespace-nowrap text-right shrink-0">
                    EGP {itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/80">
            <h2 className="font-bold text-base mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" /> Shipping Address
            </h2>
            <div className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium pt-1">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/80">
            <h2 className="font-bold text-base mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> Payment & Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 capitalize">
              Method: <span className="font-semibold text-slate-900 dark:text-white">{order.paymentMethod}</span> ({order.paymentStatus || "pending"})
            </p>

            <hr className="my-3 border-gray-100 dark:border-slate-700/60" />
            
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Total Amount</span>
              <span className="font-extrabold text-lg sm:text-xl text-indigo-600 dark:text-indigo-400">
                EGP {order.totalPrice?.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
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