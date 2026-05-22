# NewsFlash — Complete Setup Guide

## 🏗️ Project Structure
Single Next.js app — frontend + backend + admin panel all on ONE domain. No CORS issues.

```
newsflash/
├── app/
│   ├── page.tsx                  ← Homepage (public)
│   ├── article/[slug]/page.tsx   ← Article view (public)
│   ├── admin/
│   │   ├── page.tsx              ← Login page  →  /admin
│   │   ├── dashboard/page.tsx    ← Dashboard   →  /admin/dashboard
│   │   ├── articles/page.tsx     ← All articles→  /admin/articles
│   │   ├── articles/new/page.tsx ← New article →  /admin/articles/new
│   │   ├── articles/[id]/page.tsx← Edit article→  /admin/articles/:id
│   │   ├── ads/page.tsx          ← Ad manager  →  /admin/ads
│   │   └── settings/page.tsx     ← Settings    →  /admin/settings
│   └── api/
│       ├── articles/             ← GET list, POST create
│       ├── articles/[id]/        ← GET, PATCH, DELETE
│       ├── auth/login/           ← POST login
│       ├── auth/logout/          ← POST logout
│       ├── auth/change-password/ ← POST change password
│       ├── upload/               ← POST image upload
│       ├── ads/                  ← GET/PUT ad slots
│       └── seed/                 ← GET seed database (one-time)
├── components/admin/
│   ├── AdminShell.tsx            ← Sidebar layout
│   └── ArticleForm.tsx           ← Create/edit article form
├── lib/         db.ts, auth.ts, cloudinary.ts, seed.js
├── models/      Article.ts, Admin.ts, AdSlot.ts
└── middleware.ts                 ← Protects /admin/* routes
```

---

## 🚀 Deploy on Render (Single Service)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/newsflash.git
git push -u origin main
```

### Step 2 — Create Web Service on Render
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Name:** newsflash
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Step 3 — Add Environment Variables on Render
Go to your service → Environment → Add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/newsflash` |
| `JWT_SECRET` | any long random string (e.g. `xK9#mP2@qL5nR8vT3wY6`) |
| `SEED_SECRET` | any secret word (e.g. `setup2026`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | from cloudinary.com |
| `CLOUDINARY_API_KEY` | from cloudinary.com |
| `CLOUDINARY_API_SECRET` | from cloudinary.com |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-APP.onrender.com` |
| `NODE_ENV` | `production` |

### Step 4 — Get a Free MongoDB Database
1. Go to https://mongodb.com/atlas → Sign up free
2. Create a free cluster (M0)
3. Database Access → Add user with password
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Clusters → Connect → Drivers → copy the connection string
6. Replace `<password>` with your password, paste as `MONGODB_URI`

### Step 5 — Get Free Cloudinary (Image Uploads)
1. Go to https://cloudinary.com → Sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret

### Step 6 — Deploy & Seed Database
1. Click **Deploy** on Render, wait ~3 minutes
2. Once live, open your browser and visit:
   ```
   https://YOUR-APP.onrender.com/api/seed?key=setup2026
   ```
   (Replace `setup2026` with your SEED_SECRET value)
3. You'll see: `"Admin created: username=admin password=Admin@123"`

---

## 🔐 Accessing Your Admin Panel

After seeding, go to:
```
https://YOUR-APP.onrender.com/admin
```

**Login credentials:**
- Username: `admin`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change your password immediately after first login!
Go to Admin Panel → Settings → Change Password

---

## 📝 How to Publish Articles

1. Go to `/admin` and log in
2. Click **New Article** in the sidebar
3. Fill in: Title, Summary, Category, Article Body
4. Optionally add: Featured Image, Video URL, Key Highlights, Reference Links
5. Click **🚀 Publish** to make it live, or **Save Draft** to save privately
6. Article is immediately visible at `/article/your-title-slug`

---

## 💰 Setting Up Google AdSense

1. Sign up at https://adsense.google.com
2. Once approved, get your ad unit code
3. Go to Admin Panel → **Ad Management**
4. Toggle the slot ON, paste your AdSense code, click Save

---

## 🔧 Local Development

```bash
# 1. Copy env file
cp .env.local.example .env.local
# Fill in your MongoDB URI, JWT secret, Cloudinary keys

# 2. Install dependencies
npm install

# 3. Seed database (first time only)
npm run seed

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
# Admin panel: http://localhost:3000/admin
```
