# 📚 Perpustakaan Online

Aplikasi web modern untuk manajemen perpustakaan dengan fitur peminjaman buku, manajemen member, dan dashboard admin yang lengkap.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 👥 For Members
- ✅ Browse katalog buku dengan search & filter
- ✅ Pinjam buku online (maksimal 3 buku aktif)
- ✅ Track peminjaman dengan countdown timer
- ✅ Perpanjang peminjaman (1x untuk 7 hari tambahan)
- ✅ View history peminjaman lengkap
- ✅ Edit profile & upload avatar

### 🔐 For Admin
- ✅ Dashboard analytics dengan statistik lengkap
- ✅ CRUD Buku (dengan upload cover)
- ✅ CRUD Kategori dengan color picker
- ✅ Kelola member
- ✅ Approve/reject peminjaman
- ✅ Calculate denda otomatis (Rp 1.000/hari)
- ✅ View laporan peminjaman dengan filter

### 🎨 UI/UX
- ✅ Dark mode support (default)
- ✅ Glassmorphism design
- ✅ Gradient blue theme
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations & transitions
- ✅ Toast notifications
- ✅ Loading states & empty states

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: JSON files (no setup needed!)
- **Authentication**: Session-based with cookies
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Password Hashing**: bcryptjs

## 📦 Installation

1. **Clone repository:**
```bash
git clone <repo-url>
cd Perpustakaan-online
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:3000
```

**That's it! No database setup needed!**

## 🔑 Demo Credentials

### Admin
- **Email**: admin@library.com
- **Password**: admin123

### Member 1
- **Email**: member@test.com
- **Password**: member123

### Member 2
- **Email**: member2@test.com
- **Password**: member123

## 📁 Project Structure

```
perpustakaan-online/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── books/                # Books CRUD
│   │   ├── categories/           # Categories CRUD
│   │   ├── loans/                # Loans management
│   │   └── users/                # Users management
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/
│   │   ├── books/
│   │   ├── categories/
│   │   ├── members/
│   │   └── loans/
│   ├── member/                   # Member pages
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── history/
│   ├── catalog/                  # Public catalog
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Modal.js
│   │   ├── Input.js
│   │   ├── Select.js
│   │   ├── Badge.js
│   │   ├── LoadingSpinner.js
│   │   └── Toast.js
│   ├── layout/                   # Layout components
│   │   ├── Navbar.js
│   │   ├── MemberLayout.js
│   │   ├── AdminLayout.js
│   │   └── Footer.js
│   ├── features/                 # Feature components
│   │   ├── BookCard.js
│   │   ├── StatsCard.js
│   │   ├── LoanTable.js
│   │   └── BookForm.js
│   ├── providers/                # Context providers
│   │   └── ThemeProvider.js
│   └── DarkModeToggle.js
│
├── lib/                          # Utilities & helpers
│   ├── db.js                     # Database operations
│   ├── auth.js                   # Authentication helpers
│   ├── utils.js                  # Utility functions
│   └── constants.js              # App constants
│
├── data/                         # JSON database
│   ├── users.json                # Users data
│   ├── books.json                # Books data (20 books)
│   ├── categories.json           # Categories data
│   └── loans.json                # Loans data
│
├── public/                       # Static files
│   └── uploads/                  # Upload directories
│       ├── books/                # Book covers
│       └── users/                # User avatars
│
├── middleware.js                 # Route protection
├── package.json
├── tailwind.config.js
├── next.config.js
└── jsconfig.json
```

## 🎯 Business Rules

1. **Member maksimal pinjam 3 buku aktif** (status: approved)
2. **Durasi peminjaman**: 7 hari dari tanggal approve
3. **Perpanjang**: 1x maksimal (tambah 7 hari)
   - Hanya jika belum pernah diperpanjang
   - Belum melewati deadline
   - Buku masih status "approved"
4. **Denda**: Rp 1.000 per hari keterlambatan (hitung otomatis saat dikembalikan)
5. **Admin approval**: Peminjaman harus disetujui manual oleh admin
6. **Stok otomatis**:
   - Berkurang saat peminjaman di-approve
   - Bertambah saat buku dikembalikan
7. **Tidak bisa delete buku** jika ada peminjaman aktif
8. **Tidak bisa delete kategori** jika ada buku di kategori tersebut
9. **Auto-generate nomor anggota**: Format `MBR-YYYYMMDD-XXX`
10. **Password hashing**: Menggunakan bcryptjs (10 rounds)

## 🌟 Key Features Details

### Authentication & Authorization
- Session-based auth dengan httpOnly cookies
- Password hashing dengan bcryptjs
- Role-based access control (admin/member)
- Protected routes dengan middleware
- Auto-redirect berdasarkan role

### Book Management
- CRUD operations lengkap
- Upload cover image
- Kategori dengan color coding
- Stock tracking otomatis
- Search & filter
- Pagination

### Loan Management
- Request peminjaman (member)
- Approve/reject (admin)
- Perpanjang (member, max 1x)
- Return dengan calculate denda
- Status tracking (pending/approved/returned/rejected)
- Countdown timer untuk deadline

### Dashboard & Statistics
- Total buku & stok tersedia
- Total member
- Peminjaman aktif
- Pending approvals
- Total denda bulan ini
- Recent activities

## 🚀 Deployment

### Deploy to Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Deploy (zero config needed!)

### Environment Variables

Tidak ada environment variables yang required. Aplikasi langsung jalan dengan JSON files.

Optional untuk production:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new member
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session

### Books
- `GET /api/books` - Get all books
- `GET /api/books/[id]` - Get book by ID
- `POST /api/books` - Add new book (Admin)
- `PUT /api/books/[id]` - Update book (Admin)
- `DELETE /api/books/[id]` - Delete book (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category (Admin)
- `PUT /api/categories/[id]` - Update category (Admin)
- `DELETE /api/categories/[id]` - Delete category (Admin)

### Loans
- `GET /api/loans` - Get loans (filtered by user)
- `POST /api/loans` - Create loan request (Member)
- `POST /api/loans/approve` - Approve loan (Admin)
- `POST /api/loans/reject` - Reject loan (Admin)
- `POST /api/loans/return` - Return book (Admin)
- `POST /api/loans/extend` - Extend loan (Member)

### Users
- `GET /api/users` - Get users
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user profile

### Statistics
- `GET /api/stats` - Get dashboard statistics (Admin)

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    light: '#3b82f6',
    DEFAULT: '#1e40af',
    dark: '#1e3a8a',
  },
  accent: '#06b6d4',
}
```

### Change Business Rules

Edit `lib/constants.js`:
```js
export const BUSINESS_RULES = {
  MAX_ACTIVE_LOANS: 3,        // Max buku yang bisa dipinjam
  LOAN_DURATION_DAYS: 7,      // Durasi peminjaman (hari)
  MAX_EXTENSIONS: 1,           // Max perpanjangan
  FINE_PER_DAY: 1000,         // Denda per hari (Rp)
  MIN_PASSWORD_LENGTH: 6,     // Min panjang password
};
```

### Add More Books

Edit `data/books.json` dan tambahkan:
```json
{
  "id": "21",
  "judul": "Judul Buku",
  "pengarang": "Nama Pengarang",
  "penerbit": "Nama Penerbit",
  "tahunTerbit": 2024,
  "isbn": "9781234567890",
  "kategoriId": "1",
  "sinopsis": "Sinopsis buku...",
  "stokTotal": 5,
  "stokTersedia": 5,
  "coverUrl": "/uploads/books/cover.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
kill -9 $(lsof -ti:3000)
npm run dev
```

### Dark mode not working
Clear browser localStorage dan refresh:
```js
localStorage.clear()
```

### Data tidak muncul
Check apakah file JSON di folder `data/` ada dan valid.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Developer

Developed for client project (Semester 3 - Sistem Informasi)

## 🙏 Credits

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Lucide Icons** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **bcryptjs** - Password hashing

## 📧 Support

For issues or questions, please create an issue on GitHub.

---

**Happy Coding! 🚀**
