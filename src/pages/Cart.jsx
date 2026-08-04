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
    <div className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
          {/* Left Side: Cart Items & Coupon */}
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
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center transition-all duration-300 hover:border-indigo-500/30"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-2 shrink-0 border border-gray-100 dark:border-slate-800"
                    />
                    <div className="flex-1 sm:hidden">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {itemName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          EGP {unitPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            EGP {originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="hidden sm:flex justify-between items-start">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                        {itemName}
                      </h2>
                      <div className="font-extrabold text-lg text-slate-900 dark:text-white ml-4 whitespace-nowrap">
                        EGP {itemTotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span>Unit price: EGP {unitPrice}</span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          (EGP {originalPrice})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4 mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 sm:border-0 sm:pt-0">
                      <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
                        <button
                          onClick={() => item.quantity > 1 && updateQuantity(productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm w-10 text-center text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(productId)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ml-auto sm:ml-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>

                      <div className="sm:hidden font-extrabold text-base text-slate-900 dark:text-white whitespace-nowrap">
                        EGP {itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coupon Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-5 mt-6 transition-all duration-300">
              <h3 className="font-bold text-base mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" /> Have a discount code?
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  onClick={() => applyCoupon(coupon)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm"
                >
                  Apply Code
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 lg:sticky lg:top-28 h-fit transition-all duration-300">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm">
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

            <hr className="my-5 border-gray-200 dark:border-slate-800" />

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                EGP {cart.total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-center font-bold text-base shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block w-full mt-3 border border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl text-center font-medium text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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