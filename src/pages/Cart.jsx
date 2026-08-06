import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, getItemUnitPrice } from "../context/CartContext";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag } from "lucide-react";

const Cart = () => {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 pt-24 pb-16">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-md w-full shadow-sm">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pt-16 sm:pt-20 pb-16 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              You have <span className="font-semibold text-indigo-500">{cart.itemCount}</span> items in your cart
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productId = item.product?._id || item.product || item.id || item._id;
              const unitPrice = getItemUnitPrice(item);
              const originalPrice = item.price ?? item.product?.price;
              const hasDiscount = Boolean(originalPrice && originalPrice > unitPrice);
              const itemTotal = unitPrice * item.quantity;
              const itemImage = item.image || item.product?.images?.[0]?.url || item.product?.image;
              const itemName = item.name || item.product?.name || "Product Item";

              return (
                <div
                  key={item._id || item.id || productId}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 transition-all duration-300 hover:border-indigo-500/30 relative"
                >
                  <button
                    onClick={() => removeItem(productId)}
                    className="sm:hidden absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-6 sm:pr-0">
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1.5 sm:p-2 shrink-0 border border-gray-100 dark:border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {itemName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                          EGP {unitPrice}
                        </span>
                        {hasDiscount && (
                          <span className="line-through text-slate-400 text-[11px] sm:text-xs">
                            EGP {originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800/80">
                    <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 shrink-0">
                      <button
                        onClick={() => item.quantity > 1 && updateQuantity(productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs sm:text-sm w-7 sm:w-10 text-center text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(productId)}
                      className="hidden sm:inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>

                    <div className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white whitespace-nowrap text-right shrink-0">
                      EGP {itemTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 sm:p-5 mt-6 transition-all duration-300">
              <h3 className="font-bold text-sm sm:text-base mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" /> Have a discount code?
              </h3>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 sm:py-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  onClick={() => applyCoupon(coupon)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all shadow-sm shrink-0"
                >
                  Apply Code
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-5 sm:p-6 lg:sticky lg:top-28 h-fit transition-all duration-300">
            <h2 className="text-lg sm:text-xl font-bold mb-5 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Items Count</span>
                <span className="font-semibold text-slate-900 dark:text-white">{cart.itemCount}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">EGP {cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>Discount</span>
                  <span>-EGP {cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <hr className="my-4 sm:my-5 border-gray-200 dark:border-slate-800" />

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                EGP {cart.total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 sm:py-3.5 rounded-xl text-center font-bold text-sm sm:text-base shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block w-full mt-3 border border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 sm:py-3 rounded-xl text-center font-medium text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;