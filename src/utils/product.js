export function getFinalPrice(product) {
    const price = Number(product?.price || 0);
    const discountPrice = Number(product?.discountPrice || 0);
    return discountPrice > 0 && discountPrice < price ? discountPrice : price;
}

export function hasDiscount(product) {
    const price = Number(product?.price || 0);
    const discountPrice = Number(product?.discountPrice || 0);
    return discountPrice > 0 && discountPrice < price;
}

export function getDiscountPercent(product) {
    const price = Number(product?.price || 0);
    const discountPrice = Number(product?.discountPrice || 0);
    if (discountPrice <= 0 || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
}
