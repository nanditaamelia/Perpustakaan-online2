# ⚡ Quick Deploy Guide - 5 Minutes Setup

Setup aplikasi Perpustakaan Online di Vercel dengan custom domain gratis dalam 5 menit!

---

## 🎯 Super Quick Deploy

### 1. GitHub (1 menit)
```bash
# Push code
git push origin main
```

### 2. Vercel (2 menit)
1. Login: [vercel.com](https://vercel.com) with GitHub
2. **Import Git Repository** → Select `perpustakaan-online`
3. **Deploy** (jangan ubah apapun)
4. ✅ Done! App live di `https://your-app.vercel.app`

### 3. Environment Variables (1 menit)
Di Vercel → Settings → Environment Variables → Add:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
SESSION_SECRET=<paste-hasil-openssl-1>
JWT_SECRET=<paste-hasil-openssl-2>
```

Generate secrets:
```bash
openssl rand -base64 32  # Copy for SESSION_SECRET
openssl rand -base64 32  # Copy for JWT_SECRET
```

### 4. Redeploy (30 detik)
Vercel → Deployments → ... → **Redeploy**

---

## 🌐 Add Custom Domain (Optional)

### Get Free Domain (1 menit)
1. [freenom.com](https://freenom.com) → Cari domain
2. Pilih `.tk` atau `.ml` (gratis)
3. Checkout → Sign up → Verify email

### Connect to Vercel (2 menit)
1. Vercel → Settings → Domains → **Add Domain**
2. Ketik: `yourdomain.tk` → Add
3. Copy nameservers yang ditampilkan:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

### Update DNS at Freenom (1 menit)
1. [my.freenom.com](https://my.freenom.com) → My Domains → Manage
2. Management Tools → **Nameservers**
3. Pilih **Use custom nameservers**
4. Paste nameservers dari Vercel
5. **Change Nameservers**

### Update Vercel Env (30 detik)
1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_API_URL` → `https://yourdomain.tk`
3. Redeploy

### Wait (5-60 menit)
- DNS propagation: 5 menit - 2 jam
- SSL auto-generated oleh Vercel
- Check: [dnschecker.org](https://dnschecker.org)

---

## ✅ That's It!

Your app is now live at:
- Vercel: `https://your-app.vercel.app`
- Custom: `https://yourdomain.tk`

**Total Time: 5-10 menit** (excluding DNS propagation)
**Total Cost: $0/month**

---

## 🔧 Optional: Cloudinary (Cloud Storage)

### Why?
- Vercel filesystem is read-only
- File uploads need cloud storage in production

### Setup (2 menit)
1. [cloudinary.com](https://cloudinary.com) → Sign Up Free
2. Dashboard → Copy credentials
3. Vercel → Settings → Environment Variables → Add:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Redeploy

---

## 🐛 Quick Troubleshooting

**Build Failed?**
→ Check Build Logs in Vercel

**Domain not working?**
→ Wait 30 minutes for DNS propagation
→ Check [dnschecker.org](https://dnschecker.org)

**Upload not working?**
→ Setup Cloudinary (see above)

**Need more help?**
→ Read [DEPLOYMENT.md](./DEPLOYMENT.md) (full guide)

---

**Happy Deploying! 🚀**
