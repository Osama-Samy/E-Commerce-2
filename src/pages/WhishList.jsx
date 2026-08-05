import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Heart,
  Star,
  AlertCircle,
} from "lucide-react";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const navigate = useNavigate();
  const { addToCart: cartContextAddToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [removing, setRemoving] = useState({});

  function isLoggedIn() {
    const token = localStorage.getItem("userToken");
    return token && token !== "null" && token !== "undefined" && token.length > 10;
  }
  useEffect(() => {
    let mounted = true;

    async function loadWishlist() {
      if (!isLoggedIn()) {
        if (mounted) {
          setLoading(false);
          setError("Please login to view your wishlist.");
        }
        return;
      }

      try {
        if (mounted) setLoading(true);

        const response = await api.get("/wishlists/my");

        if (!mounted) return;

        const data = response.data;
        let items = [];

        if (data.success && data.wishlist?.products) {
          items = data.wishlist.products;
        } else if (data.wishlist?.items) {
          items = data.wishlist.items;
        } else if (data.items) {
          items = data.items;
        } else if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data.wishlist)) {
          items = data.wishlist;
        } else if (Array.isArray(data.products)) {
          items = data.products;
        }

        setWishlistItems(items);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error("Fetch wishlist error:", err);

        if (err.response?.status === 401) {
          setError("Please login to view your wishlist.");
        } else {
          setError("Failed to load wishlist. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWishlist();

    return () => {
      mounted = false;
    };
  }, [])
  async function removeFromWishlist(productId) {
    if (!productId) return;

    setRemoving((prev) => ({ ...prev, [productId]: true }));
    try {
      await api.delete(`/wishlists/remove/${productId}`);

      setWishlistItems((prev) =>
        prev.filter((item) => {
          const id = getProductId(item);
          return id !== productId;
        })
      );
      toast.info("Removed from wishlist");
      window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
    } catch (err) {
      console.error("Remove wishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to remove item. Please try again.");
    } finally {
      setRemoving((prev) => ({ ...prev, [productId]: false }));
    }
  }
  async function addToCart(productId) {
    if (!productId) return;

    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await cartContextAddToCart(productId, 1);
      toast.success("Added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  }
  function getProductId(item) {
    if (item.productId?._id) return item.productId._id;
    if (item.productId) return item.productId;
    if (item.product?._id) return item.product._id;
    if (item.product) return item.product;
    if (item._id) return item._id;
    return "";
  }

  function getProduct(item) {
    return item.productId || item.product || item;
  }
  function getDiscount(price, discountPrice) {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0B1120] text-white pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1e253b] rounded-2xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error || !isLoggedIn()) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center px-4 pt-28">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {error || "Please login to view your wishlist."}
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen dark:bg-[#0B1120] text-white pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Your Wishlist is Empty</h2>
            <p className="text-gray-400 mb-6">
              Save items you love to your wishlist and buy them later.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#0B1120] text-gray-100 pb-20 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">My Wishlist</h1>
          <span className="text-gray-400">{wishlistItems.length} items</span>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => {
            const product = getProduct(item);
            const productId = getProductId(item);

            if (!productId || !product.name) return null;
            const originalPrice = Number(product.price || 0);
            const salePrice = Number(product.discountPrice || 0);
            const hasDiscount = Boolean(salePrice && salePrice > 0 && salePrice < originalPrice);
            const finalPrice = hasDiscount ? salePrice : originalPrice;
            const discount = hasDiscount && originalPrice > 0
              ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
              : 0;
            const isAdding = addingToCart[productId];
            const isRemoving = removing[productId];

            return (
              <div
                key={productId}
                className="dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-300 dark:border dark:border-gray-800 dark:hover:border-gray-700 transition-all group"
              >
                <div className="relative aspect-square bg-stone-50 dark:bg-[#0B1120] p-6 overflow-hidden">
                  {product.category && (
                    <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md">
                      {product.category}
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="absolute top-3 right-10 z-10 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-md">
                      -{discount}%
                    </span>
                  )}

                  <button
                    onClick={() => removeFromWishlist(productId)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-gray-800/80 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-500 transition-all"
                  >
                    {isRemoving ? (
                      <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  <Link to={`/product-details?id=${productId}`}>
                    <img
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                </div>

                <div className="p-4 space-y-3">
                  <Link to={`/product-details?id=${productId}`}>
                    <h3 className="font-medium text-black dark:text-white hover:text-indigo-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(product.averageRating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.numReviews || 0})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-indigo-400">
                      EGP {finalPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        EGP {product.price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(productId)}
                    disabled={product.stock === 0 || isAdding}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all"
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
