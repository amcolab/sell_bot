export const formatNumber = (value: string | number): string => {
  if (!value || value === '') return '0'
  
  // Remove all non-digit characters
  const numericValue = String(value).replace(/[^\d]/g, '')
  
  // If empty after removing non-digits, return '0'
  if (!numericValue) return '0'
  
  // If the value is just '0', return it as is
  if (numericValue === '0') return '0'
  
  // Format with commas
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
