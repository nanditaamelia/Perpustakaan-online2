/**
 * Utility functions for the application
 */

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Format date to Indonesian locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return '-';

  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateShort(date) {
  if (!date) return '-';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Get days remaining until deadline
 * @param {string|Date} deadline - Deadline date
 * @returns {number} Days remaining (negative if overdue)
 */
export function getDaysRemaining(deadline) {
  if (!deadline) return 0;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Get days overdue
 * @param {string|Date} deadline - Deadline date
 * @returns {number} Days overdue (0 if not overdue)
 */
export function getDaysOverdue(deadline) {
  const days = getDaysRemaining(deadline);
  return days < 0 ? Math.abs(days) : 0;
}

/**
 * Check if date is overdue
 * @param {string|Date} deadline - Deadline date
 * @returns {boolean} True if overdue
 */
export function isOverdue(deadline) {
  return getDaysRemaining(deadline) < 0;
}

/**
 * Add days to date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === 0) return 'Rp 0';
  if (!amount) return '-';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string with ellipsis
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  if (str.length <= length) return str;

  return str.substring(0, length) + '...';
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to URL-friendly slug
 * @param {string} str - String to convert
 * @returns {string} URL slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

/**
 * Validate ISBN format (basic check)
 * @param {string} isbn - ISBN to validate
 * @returns {boolean} True if valid format
 */
export function isValidISBN(isbn) {
  if (!isbn) return false;

  // Remove hyphens and spaces
  const cleaned = isbn.replace(/[-\s]/g, '');

  // Check if it's 10 or 13 digits
  return /^\d{10}$/.test(cleaned) || /^\d{13}$/.test(cleaned);
}

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid format
 */
export function isValidPhone(phone) {
  if (!phone) return false;

  // Indonesian phone: 08xx-xxxx-xxxx or 62xxx
  const cleaned = phone.replace(/[-\s]/g, '');
  return /^(08|62)\d{8,12}$/.test(cleaned);
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter array by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export function filterBySearch(array, searchTerm, keys) {
  if (!searchTerm) return array;

  const term = searchTerm.toLowerCase();

  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
}

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} page - Current page (1-based)
 * @param {number} perPage - Items per page
 * @returns {Object} Paginated data with metadata
 */
export function paginate(array, page = 1, perPage = 10) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    currentPage: page,
    totalPages: Math.ceil(array.length / perPage),
    totalItems: array.length,
    perPage,
    hasNext: endIndex < array.length,
    hasPrev: page > 1
  };
}

// ============================================================================
// FILE UTILITIES
// ============================================================================

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

/**
 * Check if file is image
 * @param {string} filename - Filename
 * @returns {boolean} True if image
 */
export function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} Unique filename
 */
export function generateUniqueFilename(originalName) {
  const ext = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

// ============================================================================
// STATUS UTILITIES
// ============================================================================

/**
 * Get status badge color
 * @param {string} status - Status value
 * @returns {string} Tailwind color class
 */
export function getStatusColor(status) {
  const colors = {
    pending: 'yellow',
    approved: 'blue',
    rejected: 'red',
    returned: 'green',
    active: 'green',
    inactive: 'gray'
  };

  return colors[status] || 'gray';
}

/**
 * Get status label in Indonesian
 * @param {string} status - Status value
 * @returns {string} Status label
 */
export function getStatusLabel(status) {
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    returned: 'Dikembalikan',
    active: 'Aktif',
    inactive: 'Nonaktif'
  };

  return labels[status] || status;
}

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// CLASS NAME UTILITY
// ============================================================================

/**
 * Conditionally join class names
 * @param  {...any} classes - Class names
 * @returns {string} Joined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
