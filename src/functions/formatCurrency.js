export function formatCurrency(value, currency = 'USD') {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2, // Tampilkan minimal 2 desimal
    maximumFractionDigits: 4, // Batasi hingga 4 desimal
  }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0, // Tidak ada desimal
    maximumFractionDigits: 0, // Tidak ada desimal
  }).format(value);
}
