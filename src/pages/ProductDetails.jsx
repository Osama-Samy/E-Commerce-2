import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Check,
  AlertCircle,
  Send,
  User,
  Trash2,
} from "lucide-react";
import api from "../api/api";
import { useCart } from "../context/CartContext"; // Imported useCart
import { toast, ToastContainer } from "react-toastify";

export default function ProductDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Initialized useCart hook

  // --- States ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // Wishlist state for related products
  const [wishlistIds, setWishlistIds] = useState([]);

  // ============================================
  // FETCH PRODUCT
  // ============================================
  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const prod = response.data.product;
        setProduct(prod);
        setReviews(prod.reviews || []);
        setError(null);
      } catch (err) {
        console.error("Fetch product error:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // ============================================
  // FETCH RELATED PRODUCTS + WISHLIST
  // ============================================
  useEffect(() => {
    if (!product?.category) return;

    async function fetchRelated() {
      try {
        setRelatedLoading(true);
        const response = await api.get(`/products?category=${product.category}&limit=8`);
        const filtered = response.data.products.filter((p) => p._id !== product._id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Related products error:", err);
      } finally {
        setRelatedLoading(false);
      }
    }

    async function fetchWishlist() {
      try {
        const response = await api.get("/wishlists/my");
        const wishlist = response.data.wishlist || response.data.wishlist?.products || [];
        const items = Array.isArray(wishlist)
          ? wishlist
          : Array.isArray(response.data.wishlist?.products)
          ? response.data.wishlist.products
          : [];
        const ids = items.map((item) => {
          if (typeof item === "string") return item;
          if (item.productId?._id) return item.productId._id;
          if (item.productId) return item.productId;
          if (item.product?._id) return item.product._id;
          if (item.product) return item.product;
          if (item._id) return item._id;
          return null;
        }).filter(Boolean);
        setWishlistIds(ids);
        setIsWishlisted(ids.includes(id));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    }

    fetchRelated();
    fetchWishlist();
  }, [product, id]);

  // ============================================
  // HELPERS
  // ============================================
  function getDiscount(price, discountPrice) {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // ============================================
  // IMAGE GALLERY
  // ============================================
  function nextImage() {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  }

  function prevImage() {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  }

  // ============================================
  // QUANTITY
  // ============================================
  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increaseQuantity() {
    setQuantity((prev) => Math.min(product?.stock || 1, prev + 1));
  }

  // ============================================
  // ADD TO CART (FIXED TO USE CONTEXT)
  // ============================================
  async function handleAddToCart(productId, qty = 1) {
    const targetId = productId || id;
    if (!targetId) return;

    setAddingToCart(true);
    try {
      // Using the addToCart function from CartContext
      await addToCart(targetId, qty);
      setCartSuccess(true);
      toast.success("Added to cart successfully!");
      setTimeout(() => setCartSuccess(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  }

  // ============================================
  // WISHLIST (main product)
  // ============================================
  async function toggleWishlist() {
    if (!id) return;
    try {
      if (isWishlisted) {
        await api.delete(`/wishlists/remove/${id}`);
        setIsWishlisted(false);
        setWishlistIds((prev) => prev.filter((wid) => wid !== id));
        toast.info("Removed from wishlist");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
      } else {
        await api.post(`/wishlists/add/${id}`);
        setIsWishlisted(true);
        setWishlistIds((prev) => [...prev, id]);
        toast.success("Added to wishlist!");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "add" } }));
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error(err.response?.data?.message || "Please login to use wishlist.");
    }
  }

  async function toggleRelatedWishlist(e, productId) {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;

    const isInWishlist = wishlistIds.includes(productId);
    try {
      if (isInWishlist) {
        await api.delete(`/wishlists/remove/${productId}`);
        setWishlistIds((prev) => prev.filter((wid) => wid !== productId));
        toast.info("Removed from wishlist");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
      } else {
        await api.post(`/wishlists/add/${productId}`);
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Added to wishlist!");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "add" } }));
      }
    } catch (err) {
      console.error("Related wishlist error:", err);
      toast.error(err.response?.data?.message || "Please login to use wishlist.");
    }
  }

  // ============================================
  // SHARE
  // ============================================
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link.");
    }
  }

  // ============================================
  // SUBMIT REVIEW
  // ============================================
  async function handleSubmitReview(e) {
    e.preventDefault();

    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to submit a review.");
      return;
    }

    if (reviewRating === 0) {
      toast.warning("Please select a star rating!");
      return;
    }
    if (!reviewComment.trim()) {
      toast.warning("Please write a comment!");
      return;
    }

    setReviewSubmitting(true);
    try {
      const response = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      const newReview = response.data.review || {
        _id: Date.now().toString(),
        rating: reviewRating,
        comment: reviewComment,
        username: "You",
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      setReviewSuccess(true);
      toast.success(response.data.message || "Review submitted successfully!");
      setTimeout(() => setReviewSuccess(false), 3000);

      setProduct((prev) => ({
        ...prev,
        rating: response.data.averageRating ?? prev.rating,
        numReviews: response.data.numReviews ?? ((prev.numReviews || 0) + 1),
      }));
    } catch (err) {
      console.error("Submit review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit review. Make sure you are logged in.";
      toast.error(errorMsg);
    } finally {
      setReviewSubmitting(false);
    }
  }

  // ============================================
  // DELETE REVIEW
  // ============================================
  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  function canDeleteReview(review) {
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) return false;
    if (!currentUser) return true; // Show delete button if logged in, API will enforce permissions
    if (currentUser.role === "admin") return true;

    const currentUserId = currentUser._id || currentUser.id;
    const reviewUserId = typeof review.user === "object" ? (review.user?._id || review.user?.id) : review.user;
    if (currentUserId && reviewUserId && String(currentUserId) === String(reviewUserId)) return true;

    const currentUsername = currentUser.username || currentUser.name;
    if (currentUsername && (review.username === currentUsername || review.user?.username === currentUsername || review.user?.name === currentUsername)) return true;

    return true;
  }

  async function handleDeleteReview(reviewId) {
    if (!reviewId) return;

    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to delete a review.");
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      const response = await api.delete(`/products/${id}/reviews/${reviewId}`);

      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
      toast.success(response.data?.message || "Review deleted successfully!");

      setProduct((prev) => ({
        ...prev,
        rating: response.data?.averageRating ?? prev.rating,
        numReviews: response.data?.numReviews ?? Math.max(0, (prev.numReviews || 1) - 1),
      }));
    } catch (err) {
      console.error("Delete review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete review.";
      toast.error(errorMsg);
    } finally {
      setDeletingReviewId(null);
    }
  }

  // ============================================
  // LOADING SCREEN
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white pt-28 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#1e293b] rounded-2xl h-[500px]"></div>
            <div className="space-y-4">
              <div className="h-8 bg-[#1e293b] rounded w-3/4"></div>
              <div className="h-6 bg-[#1e293b] rounded w-1/4"></div>
              <div className="h-4 bg-[#1e293b] rounded w-full"></div>
              <div className="h-12 bg-[#1e293b] rounded w-1/3 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR SCREEN
  // ============================================
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center px-4 pt-28">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{error || "Product not found"}</h2>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // CALCULATE VALUES
  // ============================================
  const originalPrice = Number(product.price || 0);
  const salePrice = Number(product.discountPrice || 0);
  const hasDiscount = Boolean(salePrice && salePrice > 0 && salePrice < originalPrice);
  const finalPrice = hasDiscount ? salePrice : originalPrice;
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen dark:bg-[#0B1120] text-gray-100 pb-20 pt-24">
      {/* ===== BREADCRUMB ===== */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span className="dark:hover:text-white cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span>/</span>
          <span className="dark:hover:text-white cursor-pointer" onClick={() => navigate("/shop")}>
            Shop
          </span>
          <span>/</span>
          <span className="text-indigo-400">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* ===== PRODUCT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative dark:bg-[#1e293b] rounded-2xl overflow-hidden aspect-square group">
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </div>
              )}
              {outOfStock && (
                <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
                  <span className="bg-gray-800 text-white px-6 py-2 rounded-full text-lg font-bold border border-gray-600">
                    Out of Stock
                  </span>
                </div>
              )}

              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.public_id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                {product.subcategory}
              </span>
              <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-full">
                {product.brand}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-gray-400">{product.shortDescription}</p>
            </div>

            {/* Rating + Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
              {!outOfStock && (
                <span className="text-green-400 text-sm font-medium">In Stock</span>
              )}
              {outOfStock && (
                <span className="text-red-400 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-800">
              <span className="text-3xl font-bold text-indigo-400">EGP {finalPrice}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">EGP {product.price}</span>
              )}
              {hasDiscount && (
                <span className="text-sm text-red-400 font-medium">-{discountPercent}%</span>
              )}
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              SKU: <span className="text-gray-300 hover:text-gray-500 cursor-pointer">{product.sku}</span>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-300 text-black dark:bg-gray-800 dark:text-gray-400 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm hover:text-gray-500 cursor-pointer">Quantity:</span>
                <div className="flex items-center dark:bg-[#1e293b] rounded-lg dark:border border-gray-700 text-black dark:text-white">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {lowStock && !outOfStock && (
                  <span className="text-orange-400 text-sm font-medium">Only {product.stock} left</span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart()}
                  disabled={outOfStock || addingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-lg transition-all ${
                    cartSuccess
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500`}
                >
                  {cartSuccess ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? "bg-red-500/10 border-red-500 text-red-500"
                      : "dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-white text-black"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500" : ""}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 rounded-xl border-2 border-gray-700 text-gray-400 dark:hover:border-gray-500 dark:hover:text-white transition-all text-black"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col bg-gray-50 items-center text-center gap-2 p-4 dark:bg-[#1e293b] rounded-xl">
                <Truck className="w-6 h-6 text-indigo-400" />
                <span className="text-xs text-black dark:text-gray-400">Fast Delivery</span>
              </div>
              <div className="flex flex-col bg-gray-50 items-center text-center gap-2 p-4 dark:bg-[#1e293b] rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <span className="text-xs text-black dark:text-gray-400">Secure Payment</span>
              </div>
              <div className="flex flex-col bg-gray-50 items-center text-center gap-2 p-4 dark:bg-[#1e293b] rounded-xl">
                <RotateCcw className="w-6 h-6 text-orange-400" />
                <span className="text-xs text-black dark:text-gray-400">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="mt-16">
          <div className="border-b border-gray-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-sm font-medium capitalize transition-all relative ${
                  activeTab === "description" ? "text-indigo-400" : "text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                Description
                {activeTab === "description" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 text-sm font-medium capitalize transition-all relative ${
                  activeTab === "reviews" ? "text-indigo-400" : "text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                Reviews ({reviews.length || 0})
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          <div className="py-8">
            {/* --- DESCRIPTION --- */}
            {activeTab === "description" && (
              <div>
                <p className="dark:text-gray-300 text-black leading-relaxed text-lg">
                  {product.description || "No description available."}
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold dark:text-white text-black mb-3">Product Details</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex justify-between">
                        <span>Brand</span>
                        <span className="dark:text-white text-black">{product.brand}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Category</span>
                        <span className="dark:text-white text-black">{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Subcategory</span>
                        <span className="dark:text-white text-black">{product.subcategory}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>SKU</span>
                        <span className="dark:text-white text-black">{product.sku}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Stock</span>
                        <span className={outOfStock ? "text-red-400" : lowStock ? "text-orange-400" : "text-green-400"}>
                          {outOfStock ? "Out of Stock" : `${product.stock} available`}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold dark:text-white text-black mb-3">Shipping Info</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>Fast delivery across Egypt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Secure packaging guaranteed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>14-day return policy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* --- REVIEWS --- */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Write Review */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Write a Review</h3>

                  {reviewSuccess && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-500 dark:text-green-400 font-medium">
                      <Check className="w-5 h-5" />
                      <span>Review submitted successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHoverRating(star)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (reviewHoverRating || reviewRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {reviewRating > 0 && (
                        <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {reviewRating === 1 && "Poor"}
                          {reviewRating === 2 && "Fair"}
                          {reviewRating === 3 && "Good"}
                          {reviewRating === 4 && "Very Good"}
                          {reviewRating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-[#0B1120] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all shadow-md"
                    >
                      {reviewSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id || review.id} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-l-indigo-500">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-base">
                                {review.username || review.user?.name || review.user?.username || review.name || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {canDeleteReview(review) && (
                            <button
                              onClick={() => handleDeleteReview(review._id || review.id)}
                              disabled={deletingReviewId === (review._id || review.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Review"
                            >
                              {deletingReviewId === (review._id || review.id) ? (
                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed font-normal">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                      <Star className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400">Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => {
                const relDiscount = getDiscount(related.price, related.discountPrice);
                const relFinalPrice = related.discountPrice || related.price;
                const relHasDiscount = related.discountPrice && related.discountPrice < related.price;
                const isRelWishlisted = wishlistIds.includes(related._id);

                return (
                  <div
                    key={related._id}
                    className="dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 transition-all group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-stone-50 dark:bg-[#0B1120] p-6 overflow-hidden">
                      <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md">
                        {related.category}
                      </span>

                      {relDiscount > 0 && (
                        <span className="absolute top-3 right-10 z-10 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-md">
                          -{relDiscount}%
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleRelatedWishlist(e, related._id)}
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all ${
                          isRelWishlisted
                            ? "bg-red-500/20 text-red-500"
                            : "bg-gray-800/80 text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isRelWishlisted ? "fill-red-500" : ""}`} />
                      </button>

                      <Link to={`/product-details?id=${related._id}`}>
                        <img
                          src={related.images[0]?.url}
                          alt={related.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <Link to={`/product-details?id=${related._id}`}>
                        <h3 className="font-medium text-black dark:text-white dark:hover:text-indigo-400 transition-colors line-clamp-1">
                          {related.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(related.averageRating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({related.numReviews || 0})</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-indigo-400">EGP {relFinalPrice}</span>
                        {relHasDiscount && (
                          <span className="text-sm text-gray-500 line-through">EGP {related.price}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(related._id, 1)}
                        disabled={related.stock === 0}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {related.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
