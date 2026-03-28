export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (originalPrice, finalPrice) => {
  if (!originalPrice || originalPrice <= finalPrice) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};
