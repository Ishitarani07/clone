export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-sm border border-gray-100 p-4 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-full mb-1" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
    <div className="h-5 bg-gray-200 rounded w-1/2" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="bg-white p-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-200 rounded" />
      <div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded w-32" />
          <div className="h-12 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  </div>
);
