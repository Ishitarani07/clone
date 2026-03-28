const QuantitySelector = ({ quantity, onIncrease, onDecrease, max = 10 }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-300">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;
