import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { getProducts, getCategories, getProductFilters } from '../api/productApi';
import { SORT_OPTIONS } from '../utils/constants';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtersMeta, setFiltersMeta] = useState(null);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [priceInput, setPriceInput] = useState({ min: '', max: '' });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const priceMinParam = searchParams.get('priceMin') || '';
  const priceMaxParam = searchParams.get('priceMax') || '';
  const ratingMinParam = searchParams.get('ratingMin') || '';
  const selectedBrands = searchParams.get('brands')
    ? searchParams
        .get('brands')
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean)
    : [];
  const selectedBrandsKey = selectedBrands.join(',');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [categoriesResponse, filterResponse] = await Promise.all([
          getCategories(),
          getProductFilters(),
        ]);
        setCategories(categoriesResponse.data);
        setFiltersMeta(filterResponse.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPriceInput({
      min: priceMinParam,
      max: priceMaxParam,
    });
  }, [priceMinParam, priceMaxParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          category,
          sort,
          page,
        };

        if (priceMinParam) params.priceMin = priceMinParam;
        if (priceMaxParam) params.priceMax = priceMaxParam;
        if (ratingMinParam) params.ratingMin = ratingMinParam;
        if (selectedBrands.length) params.brands = selectedBrands.join(',');

        const response = await getProducts(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort, page, priceMinParam, priceMaxParam, ratingMinParam, selectedBrandsKey]);

  const updateFilters = (updates = {}) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const updateFilter = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handlePriceInputChange = (type, value) => {
    setPriceInput((prev) => ({ ...prev, [type]: value }));
  };

  const handlePriceApply = () => {
    updateFilters({
      priceMin: priceInput.min,
      priceMax: priceInput.max,
    });
  };

  const clearPriceFilter = () => {
    setPriceInput({ min: '', max: '' });
    updateFilters({ priceMin: null, priceMax: null });
  };

  const handleRatingChange = (value) => {
    updateFilters({ ratingMin: value });
  };

  const toggleBrand = (brand) => {
    const next = new Set(selectedBrands);
    if (next.has(brand)) {
      next.delete(brand);
    } else {
      next.add(brand);
    }
    const serialized = Array.from(next).join(',');
    updateFilters({ brands: serialized || null });
  };

  const clearAllFilters = () => {
    setPriceInput({ min: '', max: '' });
    updateFilters({ priceMin: null, priceMax: null, ratingMin: null, brands: null });
  };

  const ratingOptions = [4, 3, 2, 1];

  const brandList = filtersMeta?.brands || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Category Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => updateFilter('category', '')}
              className={`text-sm whitespace-nowrap px-3 py-1 rounded-full transition ${
                !category
                  ? 'bg-[#2874f0] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilter('category', cat._id)}
                className={`text-sm whitespace-nowrap px-3 py-1 rounded-full transition ${
                  category === cat._id
                    ? 'bg-[#2874f0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full bg-white flex items-center justify-center gap-2 py-2 shadow-sm rounded-sm font-medium text-gray-700 border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-[110] bg-white overflow-y-auto lg:sticky lg:top-[72px] lg:z-30 lg:block lg:bg-white lg:rounded-sm lg:shadow-sm lg:p-4 lg:h-fit lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:self-start ${showMobileFilters ? 'block p-4' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 lg:border-0 lg:pb-0">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={clearAllFilters}
                  className="text-xs uppercase font-semibold text-[#2874f0]"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Price</h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  min={filtersMeta?.priceRange?.min}
                  max={filtersMeta?.priceRange?.max}
                  placeholder={filtersMeta?.priceRange?.min ?? 'Min'}
                  value={priceInput.min}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2874f0]"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  min={filtersMeta?.priceRange?.min}
                  max={filtersMeta?.priceRange?.max}
                  placeholder={filtersMeta?.priceRange?.max ?? 'Max'}
                  value={priceInput.max}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2874f0]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePriceApply}
                  className="flex-1 bg-[#2874f0] text-white text-xs font-semibold py-2 rounded-sm"
                >
                  Apply
                </button>
                <button
                  onClick={clearPriceFilter}
                  className="flex-1 border border-gray-200 text-xs font-semibold py-2 rounded-sm text-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Customer Ratings</h3>
              <div className="space-y-2">
                {ratingOptions.map((rating) => (
                  <label key={rating} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="rating-filter"
                      value={rating}
                      checked={Number(ratingMinParam) === rating}
                      onChange={() => handleRatingChange(String(rating))}
                      className="text-[#2874f0]"
                    />
                    <span className="flex items-center gap-1">
                      {rating}★ & above
                    </span>
                  </label>
                ))}
                <button
                  onClick={() => handleRatingChange(null)}
                  className="text-xs text-[#2874f0] font-semibold"
                >
                  Clear Rating
                </button>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Brand</h3>
              {filtersLoading ? (
                <p className="text-xs text-gray-500">Loading brands...</p>
              ) : brandList.length === 0 ? (
                <p className="text-xs text-gray-500">No brands available</p>
              ) : (
                <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                  {brandList.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="text-[#2874f0]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div>
            {/* Filters & Sort */}
            <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {search && (
                    <span className="text-sm text-gray-600">
                      Results for "<span className="font-medium">{search}</span>"
                    </span>
                  )}
                  {pagination && (
                    <span className="text-sm text-gray-500">
                      ({pagination.total} products)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <select
                    value={sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#2874f0]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title="No products found"
                description="Try adjusting your search or filter to find what you're looking for."
                actionText="Clear Filters"
                actionLink="/"
              />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => updateFilter('page', String(page - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm">
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => updateFilter('page', String(page + 1))}
                      disabled={page >= pagination.pages}
                      className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
