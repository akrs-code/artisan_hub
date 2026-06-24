export const formatPrice = (centavos) => {
  if (centavos == null || isNaN(centavos)) return '₱0.00';
  return (centavos / 100).toLocaleString('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });
};
