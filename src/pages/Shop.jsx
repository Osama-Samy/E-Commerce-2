import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiFilter, FiX } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/api";
import { useCart } from "../context/CartContext";

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart: cartContextAddToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("koda_wishlist");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem("koda_wishlist", JSON.stringify([...wishlistedItems]));
  }, [wishlistedItems]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const categories = ["All", "Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 20,
      };

      if (searchQuery) params.search = searchQuery;
      if (category !== "All") params.category = category.toLowerCase();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const { data } = await api.get("/products", { params });
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlists/my');
      if (data.success && data.wishlist && Array.isArray(data.wishlist.products)) {
        setWishlistedItems(new Set(data.wishlist.products.map(p => typeof p === 'string' ? p : p._id)));
      }
    } catch (error) {
      console.error("Could not fetch wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, category, minPrice, maxPrice, sort]);

  const handleClearFilters = () => {
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setSearchQuery("");
  };

  const toastStyle = {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: true,
    closeButton: false,
  };

  const handleAddToCart = async (productId) => {
    if (!productId) return;
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to add items to cart");
      return;
    }

    setAddingToCart(productId);
    try {
      await cartContextAddToCart(productId, 1);
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Shop add to cart error:", error);
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const toggleWishlist = async (productId) => {
    const isWishlisted = wishlistedItems.has(productId);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlists/remove/${productId}`);
        toast.success("Removed from wishlist", toastStyle);
        setWishlistedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
      } else {
        await api.post(`/wishlists/add/${productId}`);
        toast.success("Added to wishlist", toastStyle);
        setWishlistedItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "add" } }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update wishlist", toastStyle);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-gray-300" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white py-6 dark:bg-slate-950 w-full">
      
      <div className="w-full px-4 sm:px-8 md:px-12">
        
        {/* Search and Mobile Filter Toggle */}
        <div className="mb-8 flex gap-3 w-full">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm bg-white dark:bg-slate-950"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-[52px] h-[52px] bg-white border border-gray-200 rounded-lg text-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm active:bg-gray-50"
          >
            <FiFilter className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          
          {showMobileFilters && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          <div className={`
            fixed inset-y-0 right-0 w-[280px] bg-white z-50 p-6 shadow-2xl transform transition-transform duration-300 overflow-y-auto
            lg:static lg:w-64 lg:p-0 lg:shadow-none lg:z-auto lg:transform-none lg:overflow-visible flex-shrink-0 dark:bg-slate-950
            ${showMobileFilters ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}>
            
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-500 hover:text-gray-800 transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-white">Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 "
                      />
                      <span className="text-gray-600 hover:text-gray-500 dark:text-white">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-white">Price Range</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-white">Sort By</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-900"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <button
                onClick={handleClearFilters}
                className="w-full py-2 px-4 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {products.map((product) => {
                  const originalPrice = Number(product.price || 0);
                  const salePrice = Number(product.discountPrice || 0);
                  const hasDiscount = Boolean(salePrice && salePrice > 0 && salePrice < originalPrice);
                  const newPrice = hasDiscount ? salePrice : originalPrice;
                  const discountPercent = hasDiscount && originalPrice > 0
                    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                    : 0;
                  const isOutOfStock = product.stock === 0;
                  const isAdding = addingToCart === product._id;
                  const isWishlisted = wishlistedItems.has(product._id);

                  return (
                    <div 
                      key={product._id} 
                      onClick={() => navigate(`/product-details?id=${product._id}`, { state: { product } })}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer dark:bg-slate-950 dark:border-slate-950"
                    >
                      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden flex justify-center items-center p-4">
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.category && (
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                          {hasDiscount && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                              -{discountPercent}%
                            </span>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product._id);
                            }}
                            className={`p-1.5 bg-white rounded-full shadow-sm hover:shadow transition-all ${
                              isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <img 
                          src={product.images?.[0]?.url || 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'} 
                          alt={product.name} 
                          className={`max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                        />

                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-red-100 text-red-600 font-bold px-4 py-1.5 rounded-full border border-red-200">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex text-yellow-400 text-xs">
                            {renderStars(product.averageRating || 0)}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.numReviews || 0})
                          </span>
                        </div>

                        <div className="mt-auto flex flex-col gap-3">
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                              EGP {newPrice}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through mb-0.5">
                                EGP {product.price}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product._id);
                            }}
                            disabled={isOutOfStock || isAdding}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                              isOutOfStock || isAdding
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                            }`}
                          >
                            {isAdding ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                            ) : (
                              <FiShoppingCart className="text-base" />
                            )}
                            {isAdding ? "Adding..." : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}