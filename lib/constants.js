/**
 * Application constants
 */

// ============================================================================
// USER ROLES
// ============================================================================

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
};

// ============================================================================
// LOAN STATUS
// ============================================================================

export const LOAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned'
};

export const LOAN_STATUS_LABELS = {
  [LOAN_STATUS.PENDING]: 'Menunggu Persetujuan',
  [LOAN_STATUS.APPROVED]: 'Disetujui',
  [LOAN_STATUS.REJECTED]: 'Ditolak',
  [LOAN_STATUS.RETURNED]: 'Dikembalikan'
};

export const LOAN_STATUS_COLORS = {
  [LOAN_STATUS.PENDING]: 'yellow',
  [LOAN_STATUS.APPROVED]: 'blue',
  [LOAN_STATUS.REJECTED]: 'red',
  [LOAN_STATUS.RETURNED]: 'green'
};

// ============================================================================
// BUSINESS RULES
// ============================================================================

export const BUSINESS_RULES = {
  MAX_ACTIVE_LOANS: 3,
  LOAN_DURATION_DAYS: 7,
  MAX_EXTENSIONS: 1,
  FINE_PER_DAY: 1000, // Rp 1.000
  MIN_PASSWORD_LENGTH: 6
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  BOOKS_PER_PAGE: 12,
  LOANS_PER_PAGE: 10,
  MEMBERS_PER_PAGE: 10,
  HISTORY_PER_PAGE: 10
};

// ============================================================================
// FILE UPLOAD
// ============================================================================

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  UPLOAD_DIR_BOOKS: '/uploads/books',
  UPLOAD_DIR_USERS: '/uploads/users'
};

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  LOGIN: '/login',
  REGISTER: '/register',

  // Member routes
  MEMBER_DASHBOARD: '/member/dashboard',
  MEMBER_PROFILE: '/member/profile',
  MEMBER_HISTORY: '/member/history',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_LOANS: '/admin/loans'
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_SESSION: '/api/auth/session',

  BOOKS: '/api/books',
  BOOK_BY_ID: (id) => `/api/books/${id}`,

  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,

  LOANS: '/api/loans',
  LOAN_BY_ID: (id) => `/api/loans/${id}`,
  LOAN_APPROVE: '/api/loans/approve',
  LOAN_REJECT: '/api/loans/reject',
  LOAN_RETURN: '/api/loans/return',
  LOAN_EXTEND: '/api/loans/extend',

  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`
};

// ============================================================================
// SORT OPTIONS
// ============================================================================

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  AUTHOR_ASC: 'author_asc',
  AUTHOR_DESC: 'author_desc'
};

export const SORT_OPTIONS_LABELS = {
  [SORT_OPTIONS.NEWEST]: 'Terbaru',
  [SORT_OPTIONS.OLDEST]: 'Terlama',
  [SORT_OPTIONS.TITLE_ASC]: 'Judul A-Z',
  [SORT_OPTIONS.TITLE_DESC]: 'Judul Z-A',
  [SORT_OPTIONS.AUTHOR_ASC]: 'Penulis A-Z',
  [SORT_OPTIONS.AUTHOR_DESC]: 'Penulis Z-A'
};

// ============================================================================
// MESSAGES
// ============================================================================

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login berhasil!',
    REGISTER: 'Registrasi berhasil! Silakan login.',
    LOGOUT: 'Logout berhasil!',
    BOOK_CREATED: 'Buku berhasil ditambahkan!',
    BOOK_UPDATED: 'Buku berhasil diperbarui!',
    BOOK_DELETED: 'Buku berhasil dihapus!',
    CATEGORY_CREATED: 'Kategori berhasil ditambahkan!',
    CATEGORY_UPDATED: 'Kategori berhasil diperbarui!',
    CATEGORY_DELETED: 'Kategori berhasil dihapus!',
    LOAN_CREATED: 'Peminjaman berhasil diajukan!',
    LOAN_APPROVED: 'Peminjaman berhasil disetujui!',
    LOAN_REJECTED: 'Peminjaman berhasil ditolak!',
    LOAN_RETURNED: 'Buku berhasil dikembalikan!',
    LOAN_EXTENDED: 'Peminjaman berhasil diperpanjang!',
    PROFILE_UPDATED: 'Profil berhasil diperbarui!',
    PASSWORD_CHANGED: 'Password berhasil diubah!'
  },

  ERROR: {
    GENERIC: 'Terjadi kesalahan. Silakan coba lagi.',
    UNAUTHORIZED: 'Anda harus login terlebih dahulu.',
    FORBIDDEN: 'Anda tidak memiliki akses.',
    NOT_FOUND: 'Data tidak ditemukan.',
    INVALID_CREDENTIALS: 'Email atau password salah.',
    EMAIL_EXISTS: 'Email sudah terdaftar.',
    INVALID_EMAIL: 'Format email tidak valid.',
    WEAK_PASSWORD: 'Password minimal 6 karakter.',
    PASSWORD_MISMATCH: 'Password tidak cocok.',
    MAX_LOANS_REACHED: 'Anda sudah mencapai batas maksimal peminjaman (3 buku).',
    BOOK_NOT_AVAILABLE: 'Buku tidak tersedia.',
    BOOK_HAS_ACTIVE_LOANS: 'Buku sedang dipinjam dan tidak dapat dihapus.',
    CATEGORY_HAS_BOOKS: 'Kategori memiliki buku dan tidak dapat dihapus.',
    CANNOT_EXTEND: 'Peminjaman tidak dapat diperpanjang.',
    ALREADY_EXTENDED: 'Peminjaman sudah pernah diperpanjang.',
    EXTENSION_EXPIRED: 'Batas waktu perpanjangan sudah lewat.'
  }
};

// ============================================================================
// THEME
// ============================================================================

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
};

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(08|62)\d{8,12}$/,
  ISBN: /^\d{10}$|^\d{13}$/
};
