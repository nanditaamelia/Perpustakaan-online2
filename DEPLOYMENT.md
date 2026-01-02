# 🚀 Deployment Guide - Vercel + Freenom Custom Domain

Panduan lengkap untuk deploy aplikasi Perpustakaan Online ke Vercel dengan custom domain gratis dari Freenom.

---

## 📋 Prerequisites

- ✅ Akun GitHub (untuk menyimpan repository)
- ✅ Akun Vercel (sign up di [vercel.com](https://vercel.com))
- ✅ Akun Freenom (untuk domain gratis)
- ✅ Akun Cloudinary (opsional, untuk cloud storage)

---

## Part 1: Deploy ke Vercel

### Step 1: Push Code ke GitHub

1. **Buat repository baru di GitHub:**
   - Kunjungi [github.com/new](https://github.com/new)
   - Nama repository: `perpustakaan-online`
   - Visibility: Public atau Private
   - **JANGAN** centang "Add README" (sudah ada)
   - Klik **Create repository**

2. **Push code ke GitHub:**
```bash
# Jika belum add remote
git remote add origin https://github.com/USERNAME/perpustakaan-online.git

# Push ke GitHub
git push -u origin claude/review-changes-mjvmxyl3lg8jz9lo-BByMG

# Atau push ke main branch
git checkout -b main
git merge claude/review-changes-mjvmxyl3lg8jz9lo-BByMG
git push -u origin main
```

---

### Step 2: Deploy di Vercel

1. **Login ke Vercel:**
   - Buka [vercel.com](https://vercel.com)
   - Klik **Sign Up** atau **Log In**
   - **Login dengan GitHub** (recommended)

2. **Import Project:**
   - Klik **Add New...** → **Project**
   - Pilih repository `perpustakaan-online`
   - Klik **Import**

3. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables:**

   Klik **Environment Variables** dan tambahkan:

   **Required:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://your-app.vercel.app
   SESSION_SECRET = <generate-with-openssl-rand-base64-32>
   JWT_SECRET = <generate-with-openssl-rand-base64-32>
   ```

   **Generate secrets:**
   ```bash
   # Di terminal local
   openssl rand -base64 32  # Copy hasil untuk SESSION_SECRET
   openssl rand -base64 32  # Copy hasil untuk JWT_SECRET
   ```

   **Optional (Cloudinary):**
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```

   **Optional (Konfigurasi):**
   ```
   RATE_LIMIT_MAX = 100
   RATE_LIMIT_WINDOW = 900000
   LOG_LEVEL = info
   MAX_FILE_SIZE = 5242880
   ALLOWED_FILE_TYPES = image/jpeg,image/png,image/jpg,image/webp
   ```

5. **Deploy:**
   - Klik **Deploy**
   - Tunggu proses build (2-5 menit)
   - ✅ Deployment berhasil!

6. **Test Deployment:**
   - Klik **Visit** atau buka URL: `https://your-app.vercel.app`
   - Test login dengan credentials:
     - Admin: `admin@library.com` / `admin123`
     - Member: `member@test.com` / `member123`

---

## Part 2: Setup Custom Domain dari Freenom

### Step 1: Daftar Domain Gratis di Freenom

1. **Buka Freenom:**
   - Kunjungi [freenom.com](https://www.freenom.com)

2. **Cari Domain:**
   - Ketik nama domain yang diinginkan (contoh: `perpustakaan`)
   - Klik **Check Availability**
   - Pilih domain dengan ekstensi `.tk`, `.ml`, `.ga`, `.cf`, atau `.gq` (gratis)
   - Klik **Get it now!**
   - Klik **Checkout**

3. **Setup Domain:**
   - **Period**: 12 Months @ FREE
   - Klik **Continue**

4. **Buat Akun:**
   - Isi email & details
   - **Centang** "I have read and agree to the Terms & Conditions"
   - Klik **Complete Order**
   - **Verifikasi email** (check inbox/spam)

5. **Domain Aktif:**
   - Setelah verifikasi, domain sudah aktif
   - Contoh: `perpustakaan.tk`

---

### Step 2: Connect Domain ke Vercel

#### Option A: Menggunakan Nameservers Vercel (Recommended)

1. **Di Vercel Dashboard:**
   - Pilih project `perpustakaan-online`
   - Klik tab **Settings**
   - Klik **Domains**
   - Klik **Add Domain**
   - Ketik domain Anda: `perpustakaan.tk`
   - Klik **Add**

2. **Copy Nameservers dari Vercel:**

   Vercel akan menampilkan nameservers, contoh:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **Di Freenom:**
   - Login ke [my.freenom.com](https://my.freenom.com)
   - Klik **Services** → **My Domains**
   - Klik **Manage Domain** untuk domain Anda
   - Klik **Management Tools** → **Nameservers**
   - Pilih **Use custom nameservers**
   - Masukkan:
     ```
     Nameserver 1: ns1.vercel-dns.com
     Nameserver 2: ns2.vercel-dns.com
     ```
   - Klik **Change Nameservers**

4. **Tunggu Propagasi:**
   - DNS propagation bisa memakan waktu **5 menit - 48 jam**
   - Biasanya aktif dalam **30 menit - 2 jam**
   - Cek status: [dnschecker.org](https://dnschecker.org)

---

#### Option B: Menggunakan DNS Records (Alternative)

Jika nameservers tidak bekerja, gunakan A Record:

1. **Di Vercel:**
   - Settings → Domains → Add Domain
   - Vercel akan memberikan IP address

2. **Di Freenom:**
   - Manage Domain → Manage Freenom DNS
   - Tambahkan A Record:
     ```
     Type: A
     Name: (kosongkan atau @)
     Target: 76.76.21.21 (IP dari Vercel)
     TTL: 14400
     ```
   - Tambahkan A Record untuk www:
     ```
     Type: A
     Name: www
     Target: 76.76.21.21
     TTL: 14400
     ```
   - Klik **Save Changes**

---

### Step 3: Verifikasi Domain di Vercel

1. **Kembali ke Vercel:**
   - Settings → Domains
   - Domain Anda akan muncul dengan status **Pending**

2. **Tunggu Verifikasi:**
   - Vercel akan auto-verify dalam beberapa menit
   - Status akan berubah menjadi **Valid** ✅

3. **SSL Certificate:**
   - Vercel otomatis generate SSL certificate (HTTPS)
   - Domain Anda akan accessible via `https://perpustakaan.tk`

---

### Step 4: Update Environment Variables

Update `NEXT_PUBLIC_API_URL` di Vercel:

1. **Di Vercel:**
   - Settings → Environment Variables
   - Edit `NEXT_PUBLIC_API_URL`
   - Ganti value dengan domain baru:
     ```
     https://perpustakaan.tk
     ```
   - Klik **Save**

2. **Redeploy:**
   - Klik **Deployments**
   - Klik **...** (three dots) pada latest deployment
   - Klik **Redeploy**
   - Tunggu hingga selesai

---

## Part 3: Setup File Storage

**PENTING:** Vercel filesystem is READ-ONLY. File uploads perlu cloud storage!

### Option A: Vercel Blob Storage (Recommended ⭐)

**Kenapa Vercel Blob?**
- ✅ **Native** Vercel integration
- ✅ **Gratis** 500 GB transfer/month
- ✅ **Zero config** - auto-setup
- ✅ **Built-in CDN** - fast worldwide
- ✅ **Official** - by Vercel

**📚 Complete Guide:** [VERCEL-STORAGE.md](./VERCEL-STORAGE.md)

**Quick Setup (3 Steps):**

1. **Create Blob Store:**
   - Vercel Dashboard → Storage → Create
   - Pilih **Blob**
   - Name: `perpustakaan-blob`
   - Region: Singapore (SIN1)
   - Click **Create**

2. **Auto-Connected:**
   - Environment variable `BLOB_READ_WRITE_TOKEN` otomatis ditambahkan
   - Verify di Settings → Environment Variables

3. **Redeploy:**
   - Deployments → Redeploy
   - Done! File uploads sekarang ke Blob Storage 🎉

**Test Upload:**
- Login as admin → Books → Upload cover
- Image URL should start with: `https://xxxxx.public.blob.vercel-storage.com`

---

### Option B: Cloudinary (Alternative)

### Step 1: Daftar Cloudinary

1. **Sign Up:**
   - Kunjungi [cloudinary.com](https://cloudinary.com)
   - Klik **Sign Up for Free**
   - Isi form atau sign up dengan Google/GitHub

2. **Get Credentials:**
   - Setelah login, klik **Dashboard**
   - Copy credentials:
     - Cloud Name
     - API Key
     - API Secret

### Step 2: Add ke Vercel

1. **Di Vercel:**
   - Settings → Environment Variables
   - Add:
     ```
     CLOUDINARY_CLOUD_NAME = your-cloud-name
     CLOUDINARY_API_KEY = your-api-key
     CLOUDINARY_API_SECRET = your-api-secret
     ```
   - Klik **Save**

2. **Redeploy:**
   - Deployments → Redeploy

3. **Test Upload:**
   - Upload file di aplikasi
   - File akan otomatis ke Cloudinary (bukan local storage)
   - Response akan include `cloudinary: true`

---

## Part 4: Post-Deployment Checklist

### ✅ Testing

- [ ] Website accessible via custom domain
- [ ] HTTPS working (SSL certificate active)
- [ ] Login functionality works
- [ ] File uploads working (Cloudinary or local)
- [ ] Rate limiting active (check headers)
- [ ] Logs being generated (check Vercel Functions logs)
- [ ] All pages load correctly
- [ ] Admin dashboard accessible
- [ ] Member dashboard accessible

### ✅ Security

- [ ] Environment variables set correctly
- [ ] Session secrets are secure (not default values)
- [ ] `.env` file is gitignored
- [ ] Cloudinary credentials secure
- [ ] Rate limiting configured

### ✅ Performance

- [ ] Images optimized (Cloudinary or Next.js Image)
- [ ] API responses fast
- [ ] No console errors in browser
- [ ] Lighthouse score > 80

---

## 📊 Monitoring & Maintenance

### View Logs

**Vercel Dashboard:**
- Project → Deployments → Latest Deployment
- Klik **View Function Logs**
- Filter by function/route

**Local Logs (Development):**
```bash
# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log
```

### Update Code

Setiap push ke GitHub akan otomatis trigger deployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel akan auto-deploy dalam 1-3 menit
```

### Renew Domain

Freenom domains gratis perlu di-renew setiap 12 bulan:

1. **1 bulan sebelum expired:**
   - Login ke [my.freenom.com](https://my.freenom.com)
   - Services → My Domains
   - Klik **Renew Domain**
   - Pilih **12 Months @ FREE**
   - Confirm

---

## 🐛 Troubleshooting

### Domain tidak bisa diakses

**Cek DNS Propagation:**
```bash
# Di terminal
nslookup perpustakaan.tk
dig perpustakaan.tk

# Online tools
# https://dnschecker.org
# https://whatsmydns.net
```

**Solusi:**
- Tunggu 24-48 jam untuk DNS propagation
- Flush DNS cache local:
  ```bash
  # Windows
  ipconfig /flushdns

  # Mac
  sudo dscacheutil -flushcache

  # Linux
  sudo systemd-resolve --flush-caches
  ```

### SSL Certificate Error

**Solusi:**
- Tunggu beberapa menit (Vercel auto-generate)
- Vercel → Settings → Domains → Renew Certificate
- Pastikan domain status "Valid"

### Build Error di Vercel

**Cek error di Build Logs:**
- Vercel → Deployments → Failed Deployment → View Logs

**Common issues:**
- Missing environment variables → Add di Settings
- Package errors → Check `package.json`
- Memory limit → Upgrade Vercel plan atau optimize code

### File Upload Error

**Local Storage (Default):**
- ⚠️ Vercel filesystem is read-only
- File uploads will fail on serverless
- **Solution**: Use Cloudinary

**Cloudinary:**
- Verify credentials di Vercel env vars
- Check API key validity di Cloudinary dashboard
- Test with manual upload

### Rate Limit Too Strict

**Adjust in Vercel:**
- Settings → Environment Variables
- Update:
  ```
  RATE_LIMIT_MAX = 200
  RATE_LIMIT_WINDOW = 900000
  ```
- Redeploy

---

## 📱 Custom Configurations

### Add www Redirect

Di `vercel.json`, tambahkan:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.perpustakaan.tk"
        }
      ],
      "destination": "https://perpustakaan.tk/:path*",
      "permanent": true
    }
  ]
}
```

### Add Multiple Domains

Di Vercel:
- Settings → Domains → Add Domain
- Tambahkan domain lain (misal: `perpustakaan.ml`)
- Repeat setup DNS di Freenom

---

## 🎯 Production Best Practices

### 1. Environment Variables

**JANGAN:**
- ❌ Hard-code secrets di code
- ❌ Commit `.env` ke git
- ❌ Share credentials di chat/email

**DO:**
- ✅ Use environment variables
- ✅ Generate strong secrets
- ✅ Rotate secrets periodically

### 2. Monitoring

- Setup error tracking (Sentry, LogRocket)
- Monitor uptime (UptimeRobot, Pingdom)
- Check Vercel Analytics

### 3. Backup

**Data Backup:**
- Regular backup `data/*.json` files
- Download via Vercel CLI atau FTP
- Store in cloud storage (Google Drive, Dropbox)

**Code Backup:**
- Keep git repository updated
- Push to GitHub regularly
- Consider private backup repository

### 4. Security

- Enable Vercel Security Headers
- Use strong passwords for demo accounts
- Change default admin password in production
- Enable 2FA for Vercel account

---

## 💰 Costs

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Vercel** | ✅ 100GB bandwidth/month<br>✅ Serverless functions<br>✅ Automatic SSL | $20/month (Pro)<br>Unlimited projects |
| **Freenom** | ✅ Free domains (.tk, .ml, .ga, .cf, .gq)<br>✅ Renew every 12 months | N/A |
| **Cloudinary** | ✅ 25GB storage<br>✅ 25GB bandwidth/month | $89/month (Advanced) |
| **GitHub** | ✅ Unlimited public repos<br>✅ 500MB storage | $4/month (Pro) |

**Total Cost: $0/month** (with free tiers)

---

## 🔗 Useful Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Freenom**: [my.freenom.com](https://my.freenom.com)
- **Cloudinary**: [cloudinary.com/console](https://cloudinary.com/console)
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)
- **SSL Checker**: [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

## 📧 Support

Jika ada masalah:
1. Check Troubleshooting section
2. Check Vercel Documentation
3. Search Vercel Community
4. Contact Vercel Support (for deployment issues)

---

**Selamat! Aplikasi Perpustakaan Online Anda sekarang LIVE di internet! 🎉**

Access via: `https://perpustakaan.tk` (atau domain pilihan Anda)
