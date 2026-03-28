import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { useCart } from '../context/CartContext';
import PriceTag from '../components/PriceTag';
import { ProductDetailSkeleton } from '../components/LoadingSkeleton';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product._id, 1);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    const success = await addToCart(product._id, 1);
    setAddingToCart(false);
    if (success) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: PLACEHOLDER_IMAGE }];

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 border rounded overflow-hidden ${
                      selectedImage === index ? 'border-[#2874f0]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 aspect-square border border-gray-200 rounded overflow-hidden">
                <img
                  src={images[selectedImage]?.url || PLACEHOLDER_IMAGE}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Breadcrumb */}
              <p className="text-xs text-gray-500 mb-2">
                {product.categoryId?.name} / {product.brand}
              </p>

              {/* Title */}
              <h1 className="text-xl font-medium text-gray-800 mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              {product.ratingCount > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-600 text-white text-sm px-2 py-0.5 rounded flex items-center gap-1">
                    {product.ratingAverage}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.ratingCount.toLocaleString()} Ratings
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <PriceTag
                  price={product.price}
                  finalPrice={product.finalPrice}
                  size="lg"
                />
              </div>

              {/* Stock Status */}
              {product.stock === 0 ? (
                <p className="text-red-500 font-medium mb-4">Out of Stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-orange-500 font-medium mb-4">
                  Only {product.stock} left in stock - order soon!
                </p>
              ) : (
                <p className="text-green-600 font-medium mb-4">In Stock</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-[#ff9f00] text-white py-3 px-6 rounded-sm font-medium hover:bg-[#e68f00] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-[#fb641b] text-white py-3 px-6 rounded-sm font-medium hover:bg-[#e55a18] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  BUY NOW
                </button>
              </div>

              {/* Highlights */}
              {product.highlights?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Highlights</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Specifications</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="py-2 text-gray-500 w-1/3">{key}</td>
                          <td className="py-2 text-gray-800">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
