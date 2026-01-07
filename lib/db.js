import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// ============================================================================
// GENERIC JSON OPERATIONS
// ============================================================================

/**
 * Read JSON file from data directory
 * @param {string} filename - Name of the JSON file
 * @returns {Array} Parsed JSON data
 */
export function readJSON(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

/**
 * Write data to JSON file in data directory
 * @param {string} filename - Name of the JSON file
 * @param {Array} data - Data to write
 */
export function writeJSON(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// ============================================================================
// USERS OPERATIONS
// ============================================================================

export function getUsers() {
  return readJSON('users.json');
}

export function saveUsers(users) {
  writeJSON('users.json', users);
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
  return null;
}

export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
}

// ============================================================================
// BOOKS OPERATIONS
// ============================================================================

export function getBooks() {
  return readJSON('books.json');
}

export function saveBooks(books) {
  writeJSON('books.json', books);
}

export function getBookById(id) {
  const books = getBooks();
  return books.find(b => b.id === id);
}

export function addBook(book) {
  const books = getBooks();
  books.push(book);
  saveBooks(books);
  return book;
}

export function updateBook(id, updates) {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    saveBooks(books);
    return books[index];
  }
  return null;
}

export function deleteBook(id) {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== id);
  saveBooks(filtered);
}

// ============================================================================
// CATEGORIES OPERATIONS
// ============================================================================

export function getCategories() {
  return readJSON('categories.json');
}

export function saveCategories(categories) {
  writeJSON('categories.json', categories);
}

export function getCategoryById(id) {
  const categories = getCategories();
  return categories.find(c => c.id === id);
}

export function addCategory(category) {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
  return category;
}

export function updateCategory(id, updates) {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    saveCategories(categories);
    return categories[index];
  }
  return null;
}

export function deleteCategory(id) {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
}

// ============================================================================
// LOANS OPERATIONS
// ============================================================================

export function getLoans() {
  return readJSON('loans.json');
}

export function saveLoans(loans) {
  writeJSON('loans.json', loans);
}

export function getLoanById(id) {
  const loans = getLoans();
  return loans.find(l => l.id === id);
}

export function getLoansByUserId(userId) {
  const loans = getLoans();
  return loans.filter(l => l.userId === userId);
}

export function getActiveLoansByUserId(userId) {
  const loans = getLoans();
  return loans.filter(l => l.userId === userId && l.status === 'approved');
}

export function getPendingLoans() {
  const loans = getLoans();
  return loans.filter(l => l.status === 'pending');
}

export function addLoan(loan) {
  const loans = getLoans();
  loans.push(loan);
  saveLoans(loans);
  return loan;
}

export function updateLoan(id, updates) {
  const loans = getLoans();
  const index = loans.findIndex(l => l.id === id);
  if (index !== -1) {
    loans[index] = { ...loans[index], ...updates };
    saveLoans(loans);
    return loans[index];
  }
  return null;
}

export function deleteLoan(id) {
  const loans = getLoans();
  const filtered = loans.filter(l => l.id !== id);
  saveLoans(filtered);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate fine for late return
 * @param {string} deadlineDate - ISO date string
 * @returns {number} Fine amount in Rupiah
 */
export function calculateDenda(deadlineDate) {
  const now = new Date();
  const deadline = new Date(deadlineDate);

  if (now <= deadline) return 0;

  const diffTime = Math.abs(now - deadline);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays * 1000; // Rp 1.000 per hari
}

/**
 * Generate unique member number
 * Format: MBR-YYYYMMDD-XXX
 * @returns {string} Member number
 */
export function generateMemberNumber() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const users = getUsers();
  const membersToday = users.filter(u =>
    u.noAnggota && u.noAnggota.startsWith(`MBR-${dateStr}`)
  );

  const sequence = String(membersToday.length + 1).padStart(3, '0');
  return `MBR-${dateStr}-${sequence}`;
}

/**
 * Generate unique ID for any entity
 * @returns {string} Unique ID
 */
export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Get books with category information
 * @returns {Array} Books with category details
 */
export function getBooksWithCategory() {
  const books = getBooks();
  const categories = getCategories();

  return books.map(book => {
    const category = categories.find(c => c.id === book.kategoriId);
    return {
      ...book,
      kategori: category || null
    };
  });
}

/**
 * Get loans with user and book information
 * @returns {Array} Loans with user and book details
 */
export function getLoansWithDetails() {
  const loans = getLoans();
  const users = getUsers();
  const books = getBooks();

  return loans.map(loan => {
    const user = users.find(u => u.id === loan.userId);
    const book = books.find(b => b.id === loan.bookId);

    return {
      ...loan,
      user: user ? { id: user.id, nama: user.nama, email: user.email, noAnggota: user.noAnggota } : null,
      book: book ? { id: book.id, judul: book.judul, pengarang: book.pengarang, coverUrl: book.coverUrl } : null
    };
  });
}

/**
 * Check if book has active loans
 * @param {string} bookId - Book ID
 * @returns {boolean} True if book has active loans
 */
export function hasActiveLoans(bookId) {
  const loans = getLoans();
  return loans.some(l => l.bookId === bookId && l.status === 'approved');
}

/**
 * Check if category has books
 * @param {string} categoryId - Category ID
 * @returns {boolean} True if category has books
 */
export function categoryHasBooks(categoryId) {
  const books = getBooks();
  return books.some(b => b.kategoriId === categoryId);
}

/**
 * Get statistics for dashboard
 * @returns {Object} Statistics object
 */
export function getStatistics() {
  const books = getBooks();
  const users = getUsers();
  const loans = getLoans();

  const totalBooks = books.reduce((sum, book) => sum + book.stokTotal, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.stokTersedia, 0);
  const totalMembers = users.filter(u => u.role === 'member').length;
  const activeLoans = loans.filter(l => l.status === 'approved').length;
  const pendingLoans = loans.filter(l => l.status === 'pending').length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const totalDendaThisMonth = loans
    .filter(l => {
      if (l.status !== 'returned' || !l.tanggalKembali) return false;
      const returnDate = new Date(l.tanggalKembali);
      return returnDate.getMonth() === thisMonth && returnDate.getFullYear() === thisYear;
    })
    .reduce((sum, loan) => sum + (loan.denda || 0), 0);

  return {
    totalBooks,
    availableBooks,
    totalMembers,
    activeLoans,
    pendingLoans,
    totalDendaThisMonth
  };
}
