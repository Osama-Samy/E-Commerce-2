
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { getDiscountPercent, getFinalPrice, hasDiscount } from '../../utils/product';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, isDarkMode, isFavorite, toggleFavorite }) {
    const navigate = useNavigate();
    const imageUrl = product?.images?.[0]?.url;
    const price = Number(product?.price || 0);
    const finalPrice = getFinalPrice(product);
    const discounted = hasDiscount(product);
    const discountPercent = getDiscountPercent(product);
    const outOfStock = product?.stock <= 0;

    return (
        <div
            className={`group block cursor-pointer overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${outOfStock && "opacity-40"
                } ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
        >
            <article>
                <div className="relative h-56 overflow-hidden">
                    {imageUrl ? (
                        <>
                            <img
                                src={imageUrl}
                                alt={product?.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            {outOfStock && (
                                <>
                                    <div className="absolute inset-0 bg-black/45"></div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="rounded-full bg-red-600/90 px-6 py-2 text-lg font-bold text-white shadow-lg backdrop-blur-sm">
                                            Out Of Stock
                                        </span>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={`flex h-full items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            No image
                        </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {product?.category || 'General'}
                    </span>

                    {discounted && (
                        <span className="absolute right-4 top-4 rounded-full bg-danger-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                            -{discountPercent}%
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleFavorite(product?._id);
                        }}
                        className={`absolute bottom-4 right-4 rounded-full p-2.5 shadow-lg transition ${isDarkMode ? 'bg-slate-900/80 text-slate-100' : 'bg-white/90 text-slate-700'} ${isFavorite ? 'text-danger-500' : ''}`}
                    >
                        <FiHeart size={16} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                </div>

                <div className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {product?.subcategory || 'Featured'}
                        </p>
                        <span className={`rounded-full px-2.5 py-1 text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {product?.brand || 'Brand'}
                        </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold">{product?.name || 'Product name'}</h3>
                    <p className={`mb-4 line-clamp-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {product?.shortDescription || product?.description || 'No description available.'}
                    </p>

                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            {/* <p className="text-lg font-bold text-primary-500">${finalPrice}</p> */}
                            <p className="flex items-end gap-2">
                                <span className="text-3xl md:text-4xl font-black tracking-tight text-primary-500">
                                    {Number(finalPrice).toLocaleString("en-US", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </span>

                                <span className="mb-1 text-sm font-bold uppercase">
                                    EGP
                                </span>
                            </p>
                            {discounted && (
                                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <span className="line-through">
                                        {Number(price).toLocaleString("en-US", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}{" "}
                                        EGP
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className={`rounded-full p-2.5 ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}>
                            <FiShoppingCart size={16} />
                        </div>
                    </div>

                    <span
                       onClick={() => navigate(`/product-details?id=${product._id}`, { state: { product } })}
                        className={`block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${outOfStock
                            ? "bg-gray-500 text-black dark:text-white cursor-not-allowed"
                            : "bg-primary-500 text-black dark:text-white group-hover:bg-primary-600"
                            }`}
                    >
                        {outOfStock ? "Out Of Stock" : "View Details"}
                    </span>
                </div>
            </article>
        </div>
    );
}