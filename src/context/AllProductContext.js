import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

export const AllProductContext = createContext(null);

export function AllProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const items = response?.data?.products ?? [];
                setProducts(items);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Unable to load products from the API.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const featuredProducts = useMemo(
        () => products.filter((product) => product?.featured),
        [products]
    );

    // Function to check if user is logged in
    function isLoggedIn() {
        const token = localStorage.getItem("userToken");
        return token && token !== "null" && token !== "undefined" && token.length > 10;
    }

    // Fetch wishlist count
    const fetchWishlistCount = async () => {
        if (!isLoggedIn()) {
            setWishlistCount(0);
            setWishlistItems([]);
            return;
        }

        try {
            const response = await api.get("/wishlists/my");
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
            setWishlistCount(items.length);
        } catch (err) {
            console.error("Fetch wishlist count error:", err);
            setWishlistCount(0);
            setWishlistItems([]);
        }
    };

    // Initial fetch and listen for wishlist updates
    useEffect(() => {
        fetchWishlistCount();

        const handleWishlistUpdate = (e) => {
            if (e?.detail?.count !== undefined) {
                setWishlistCount(e.detail.count);
            } else if (e?.detail?.action === 'add') {
                setWishlistCount((prev) => prev + 1);
            } else if (e?.detail?.action === 'remove') {
                setWishlistCount((prev) => Math.max(0, prev - 1));
            }
            fetchWishlistCount();
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    }, []);

    const value = {
        products,
        featuredProducts,
        loading,
        error,
        wishlistCount,
        wishlistItems,
        fetchWishlistCount,
    };

    return createElement(AllProductContext.Provider, { value }, children);
}

export function useAllProduct() {
    const context = useContext(AllProductContext);
    if (!context) {
        throw new Error('useAllProduct must be used inside AllProductProvider');
    }
    return context;
}