export const slugify = (s = '') =>
  s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function formatPrice(n) {
  if (!n) return 'Price on request';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.?0+$/, '') + ' L';
  return '₹' + Number(n).toLocaleString('en-IN');
}

export const STATUSES = ['New Launch', 'Under Construction', 'Ready to Move', 'Resale', 'Sold Out'];
export const TYPES = ['residential', 'commercial'];
export const CONFIGS = ['1 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK', '4 BHK', '4.5 BHK', '5 BHK', 'Studio', 'Office', 'Shop', 'Showroom'];
export const LEAD_STATUSES = ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Won', 'Lost'];
