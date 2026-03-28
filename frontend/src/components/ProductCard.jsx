import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const discount = calculateDiscount(product.price, product.finalPrice);
  const imageUrl = product.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const wished = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wished) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 group"
    >
      <div className="p-4 relative">
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
        >
          <Heart className={wished ? 'text-red-500' : 'text-gray-400'} />
        </button>
        {/* Image */}
        <div className="relative aspect-square mb-3 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Brand */}
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>

        {/* Title */}
        <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.ratingCount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {product.ratingAverage}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-xs text-gray-500">
              ({product.ratingCount.toLocaleString()})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(product.finalPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-green-600 font-medium">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-2">Out of Stock</p>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-2">Only {product.stock} left</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
