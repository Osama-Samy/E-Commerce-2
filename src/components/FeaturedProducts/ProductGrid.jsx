import ProductCard from './ProductCard';

export default function ProductGrid({ products, isDarkMode, isFavorite, toggleFavorite }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product?._id}
                    product={product}
                    isDarkMode={isDarkMode}
                    isFavorite={isFavorite(product?._id)}
                    toggleFavorite={toggleFavorite}
                />
            ))}
        </div>
    );
}