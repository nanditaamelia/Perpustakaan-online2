# 📦 Vercel Storage Setup Guide

Complete guide untuk setup Vercel Blob Storage (official Vercel storage untuk file uploads).

---

## 🎯 Kenapa Vercel Blob Storage?

### ❌ Masalah dengan Local Storage di Vercel:
- Vercel filesystem is **READ-ONLY**
- File uploads akan **hilang** setelah redeploy
- JSON data tidak bisa di-update (write operations fail)

### ✅ Solusi: Vercel Blob Storage
- ✅ **Gratis** 500 GB transfer/month
- ✅ **Built-in CDN** - fast worldwide
- ✅ **Zero config** - auto-integrated di Vercel
- ✅ **Official** - by Vercel team
- ✅ **Simple API** - easy to use

---

## 📊 Storage Priority di Aplikasi Ini

Aplikasi ini sudah support **3 storage backends** dengan auto-fallback:

```
1️⃣ Vercel Blob Storage (Priority #1)
    ↓ (jika tidak configured)
2️⃣ Cloudinary (Priority #2)
    ↓ (jika tidak configured)
3️⃣ Local Storage (Fallback)
```

**Smart Switching:**
- Di production (Vercel): Auto use Blob Storage
- Di development (local): Use local storage
- Fallback automatic jika primary storage gagal

---

## 🚀 Setup Vercel Blob Storage

### Step 1: Create Blob Store di Vercel Dashboard

1. **Login ke Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Open Your Project:**
   - Click project `perpustakaan-online`

3. **Go to Storage Tab:**
   - Click tab **Storage** (top menu)
   - Atau langsung: `https://vercel.com/YOUR_USERNAME/perpustakaan-online/stores`

4. **Create Blob Store:**
   - Click **Create Database** atau **Create**
   - Pilih **Blob** (untuk file storage)
   - Click **Continue**

5. **Configure Store:**
   - **Store Name**: `perpustakaan-blob` (atau nama lain)
   - **Region**: Singapore (SIN1) - fastest untuk Indonesia
   - Click **Create**

6. **Connect to Project:**
   - Vercel akan auto-connect store ke project Anda
   - Environment variable `BLOB_READ_WRITE_TOKEN` otomatis ditambahkan
   - Click **Done**

---

### Step 2: Verify Environment Variable

1. **Check Environment Variables:**
   - Go to: Settings → Environment Variables
   - Pastikan ada: `BLOB_READ_WRITE_TOKEN`
   - Value: `vercel_blob_rw_xxxxxx` (auto-generated)

2. **Jika Tidak Ada (Manual Setup):**
   - Go to Storage → Blob Store → `.env.local` tab
   - Copy token yang ditampilkan
   - Paste di Settings → Environment Variables:
     ```
     Name: BLOB_READ_WRITE_TOKEN
     Value: vercel_blob_rw_xxxxxxxxxxxxx
     ```
   - Check all environments: Production, Preview, Development
   - Click **Save**

---

### Step 3: Redeploy

1. **Trigger Redeploy:**
   - Go to: Deployments
   - Click **...** (three dots) pada latest deployment
   - Click **Redeploy**
   - Tunggu hingga selesai (1-3 menit)

2. **Verify:**
   - Deployment berhasil
   - Green checkmark ✅

---

### Step 4: Test Upload

1. **Open Your App:**
   ```
   https://your-app.vercel.app
   ```

2. **Login as Admin:**
   - Email: `admin@library.com`
   - Password: `admin123`

3. **Upload Book Cover:**
   - Go to: Admin → Books → Add New Book
   - Fill form
   - **Upload cover image**
   - Click **Save**

4. **Verify:**
   - Image shows up correctly
   - Inspect URL (should start with `https://xxxxx.public.blob.vercel-storage.com`)
   - This means Blob Storage is working! 🎉

5. **Check Logs (Optional):**
   - Vercel → Deployments → View Function Logs
   - Look for: `"provider": "vercel-blob"`

---

## 📊 Storage Dashboard

### View Uploaded Files

1. **Go to Storage Tab:**
   - Vercel Dashboard → Storage
   - Click your Blob store name

2. **Browse Files:**
   - See all uploaded files
   - File sizes, upload dates
   - Download/delete files

3. **Usage Stats:**
   - Total storage used
   - Bandwidth used
   - Number of files

---

## 💰 Vercel Blob Free Tier Limits

| Metric | Free Tier | Pro Plan |
|--------|-----------|----------|
| **Storage** | 500 MB | 100 GB |
| **Bandwidth** | 500 GB/month | 1 TB/month |
| **File Size** | 5 MB max | 500 MB max |
| **Requests** | Unlimited | Unlimited |

**Free tier is enough untuk:**
- 100 book covers (@ 5MB each)
- 1000s of user avatars
- Small to medium projects

**Upgrade ke Pro jika:**
- Need more than 500 MB storage
- High traffic (>500 GB bandwidth)
- Larger file uploads (>5 MB)

---

## 🔧 Configuration di Aplikasi

### Environment Variables

Add di Vercel → Settings → Environment Variables:

**Required:**
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Optional (File limits):**
```
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

### Storage Priority

Aplikasi akan auto-detect storage yang available:

```javascript
// lib/storage.js
Priority:
1. Vercel Blob (if BLOB_READ_WRITE_TOKEN exists)
2. Cloudinary (if credentials exist)
3. Local Storage (fallback)
```

### Check Current Storage

Add di halaman admin:

```javascript
import { getStorageProvider } from '@/lib/storage';

const provider = getStorageProvider();
console.log('Current storage:', provider);
// Output: 'blob' | 'cloudinary' | 'local'
```

---

## 🔄 Migration dari Local/Cloudinary ke Blob

### Option 1: Fresh Start (Recommended)
- Deploy ke Vercel dengan Blob Storage
- Upload file baru akan otomatis ke Blob
- Old files tetap di local/Cloudinary (static files)

### Option 2: Migrate Existing Files

Jika mau migrate existing files ke Blob:

1. **Download all files** dari local/Cloudinary
2. **Manual upload** via admin interface
3. **Update database** URLs (jika perlu)

**Script Helper** (untuk advanced users):

```javascript
// scripts/migrate-to-blob.js
import { uploadFile } from '@/lib/storage';
import fs from 'fs';

async function migrateFiles() {
  const files = fs.readdirSync('public/uploads/books');

  for (const file of files) {
    const buffer = fs.readFileSync(`public/uploads/books/${file}`);
    const result = await uploadFile(buffer, file, 'books');
    console.log('Migrated:', file, '→', result.url);
  }
}

migrateFiles();
```

---

## 🐛 Troubleshooting

### Upload Fails dengan Error "Blob storage not configured"

**Solusi:**
- Verify `BLOB_READ_WRITE_TOKEN` exists di Environment Variables
- Check token format: `vercel_blob_rw_xxxxx`
- Redeploy after adding token

### Files Upload tapi Tidak Muncul

**Solusi:**
- Check browser console for URL
- Verify URL format: `https://xxxxx.public.blob.vercel-storage.com/...`
- Check CORS (Blob auto-configured, should work)
- Clear browser cache

### Error: "File too large"

**Solusi:**
- Free tier: max 5 MB per file
- Upgrade ke Pro: max 500 MB
- Or compress images before upload
- Set `MAX_FILE_SIZE` env var

### Fallback ke Local Storage di Production

**Kenapa:**
- `BLOB_READ_WRITE_TOKEN` not set
- Token invalid/expired
- Blob store deleted

**Solusi:**
- Re-create Blob store
- Verify environment variables
- Check Vercel logs for errors

---

## 📚 Alternative: Cloudinary

Jika lebih prefer Cloudinary:

### Advantages:
- ✅ Image transformation API
- ✅ More storage (25 GB free)
- ✅ Better image optimization
- ✅ Works outside Vercel too

### Setup Cloudinary:
See: [DEPLOYMENT.md - Cloudinary Section](./DEPLOYMENT.md#cloudinary-setup)

**Aplikasi akan auto-use Cloudinary** jika:
- Cloudinary credentials configured
- Blob storage not configured
- Or Blob upload fails (auto-fallback)

---

## 🎯 Best Practices

### 1. Use Vercel Blob untuk Production
- Native integration
- Zero config
- Best performance on Vercel

### 2. Use Local Storage untuk Development
- Fast testing
- No API calls needed
- Free & unlimited

### 3. Keep Cloudinary as Backup
- Configure both Blob + Cloudinary
- Auto-fallback jika Blob down
- Redundancy

### 4. File Naming
- Auto-generated unique names
- Timestamp prefix: `1234567890-filename.jpg`
- No special characters (sanitized)

### 5. Cleanup Old Files
- Vercel Blob dashboard: Manual delete
- Or use `deleteFile()` function
- Keep storage under free tier

---

## 📝 API Usage

### Upload File

```javascript
import { uploadFile } from '@/lib/storage';

const buffer = Buffer.from(fileData);
const result = await uploadFile(buffer, 'image.jpg', 'books');

console.log(result);
// {
//   url: 'https://xxxxx.public.blob.vercel-storage.com/books/123-image.jpg',
//   publicId: 'books/123-image.jpg',
//   provider: 'vercel-blob',
//   size: 123456
// }
```

### Delete File

```javascript
import { deleteFile } from '@/lib/storage';

await deleteFile('https://xxxxx.public.blob.vercel-storage.com/books/123-image.jpg');
```

### Check Provider

```javascript
import { getStorageProvider } from '@/lib/storage';

const provider = getStorageProvider();
// 'blob' | 'cloudinary' | 'local'
```

---

## 🔗 Useful Links

- **Vercel Blob Docs**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Pricing**: [vercel.com/docs/storage/vercel-blob/usage-and-pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)
- **SDK Reference**: [@vercel/blob npm](https://www.npmjs.com/package/@vercel/blob)

---

## ✅ Summary

**3 Steps to Enable Vercel Blob:**

1. **Create Blob Store** di Vercel Dashboard
2. **Verify** `BLOB_READ_WRITE_TOKEN` environment variable
3. **Redeploy** & test upload

**That's it!** File uploads akan otomatis ke Vercel Blob Storage dengan CDN global! 🚀

---

## 💡 Next Steps

- ✅ Setup Blob Storage (follow guide di atas)
- ✅ Test file upload
- ✅ Monitor usage di Storage Dashboard
- 📚 Optional: Setup Cloudinary as backup
- 📊 Optional: Migrate to Vercel Postgres untuk data (lihat section selanjutnya)

---

**Vercel Blob Storage = Production-Ready File Storage dengan $0/month!** 🎉
