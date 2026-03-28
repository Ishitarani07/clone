import { formatPrice, calculateDiscount } from '../utils/formatPrice';

const PriceTag = ({ price, finalPrice, size = 'md' }) => {
  const discount = calculateDiscount(price, finalPrice);

  const sizeClasses = {
    sm: {
      final: 'text-base',
      original: 'text-sm',
      discount: 'text-xs',
    },
    md: {
      final: 'text-xl',
      original: 'text-base',
      discount: 'text-sm',
    },
    lg: {
      final: 'text-2xl',
      original: 'text-lg',
      discount: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className={`${classes.final} font-semibold text-gray-900`}>
        {formatPrice(finalPrice)}
      </span>
      {discount > 0 && (
        <>
          <span className={`${classes.original} text-gray-400 line-through`}>
            {formatPrice(price)}
          </span>
          <span className={`${classes.discount} text-green-600 font-medium`}>
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
