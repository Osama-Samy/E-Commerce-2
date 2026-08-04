import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'koda-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((productId) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    }, []);

    const isFavorite = useCallback(
        (productId) => favorites.includes(productId),
        [favorites]
    );

    return { favorites, toggleFavorite, isFavorite };
}