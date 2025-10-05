export function formatCurrencyIDR(num) {
  try {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(Number(num || 0))
  } catch {
    return `${num}`
  }
}
