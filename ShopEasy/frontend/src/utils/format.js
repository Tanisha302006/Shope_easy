export const CURRENCY = '₹';

export const formatPrice = (price) => {
  return `${CURRENCY}${Number(price).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
