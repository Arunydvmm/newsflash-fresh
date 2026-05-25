# NewsFlash V6 — India's Premium News Platform

A production-ready, full-stack news platform combining breaking news, IPL live scores, Sarkari Naukri portal, cricket analytics, and enterprise admin management.

---

## 🚀 Live URL
**https://newsflash-v6.onrender.com**

---

## ✅ Features Built

### Public Portals
- **Homepage** — Breaking news, hero article, featured grid, trending sidebar, live ticker
- **Article Pages** — Full SEO, JSON-LD schema, key highlights, video embed, share buttons, related articles
- **Cricket Live** — Real-time scores via CricketData.org, 30s auto-refresh, scorecard, match detail
- **Sarkari Naukri** — Government jobs portal with category/state filters, job detail pages, apply links

### Admin Panel (`/admin`)
- **Dashboard** — Stats, pending review queue, top articles, quick actions
- **Articles** — Full CRUD, search/filter, quick publish/unpublish, status management
- **Pending Review** — Approve/reject employee-submitted articles
- **Sarkari Jobs** — Post/edit/delete government jobs with all fields
- **Employees** — Create team members, assign roles, set permissions, suspend/delete
- **Contact Inbox** — Read messages, reply via email, delete
- **Ad Management** — Toggle ad slots, paste AdSense scripts
- **Analytics** — Article stats, category breakdown, views chart, top articles
- **Cricket** — Live match overview, API status
- **Settings** — Change admin password

### Staff Portal (`/staff`)
- Separate login for employees
- Write articles (submitted for review, not published directly)
- Edit own articles
- View article status

### Backend
- JWT authentication (admin + employee, separate cookies)
- Role-based permissions system
- Contact form with real Gmail SMTP email delivery + auto-reply
- Cloudinary image upload
- Cricket API proxy with 30s in-memory cache
- Keep-alive ping every 10 minutes (prevents Render free tier sleep)
- Auto-expire Sarkari jobs past last date
- Full sitemap including articles + jobs

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + HTTP-only cookies |
| Images | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Cricket | CricketData.org API |
| Styling | Tailwind CSS + inline styles |
| Deployment | Render.com |

---

## ⚙️ Environment Variables

Copy `.env.local.example` to `.env.local` for local dev.
Add all variables in **Render Dashboard → Environment**.

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-32-char-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CRICKETDATA_API_KEY=...
GMAIL_USER=65arunyadav65@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
NEXT_PUBLIC_SITE_URL=https://newsflash-v6.onrender.com
SEED_SECRET=your-seed-secret
NODE_ENV=production
```

### Gmail App Password Setup
1. Enable 2FA on Gmail: myaccount.google.com/security
2. Go to: myaccount.google.com/apppasswords
3. Generate App Password for "Mail"
4. Use the 16-char password as `GMAIL_APP_PASSWORD`

---

## 🚀 Deployment on Render

### 1. Push to GitHub
```bash
git add .
git commit -m "NewsFlash V6 — Full platform"
git push origin main
```

### 2. Create Render Web Service
- Go to render.com → New → Web Service
- Connect your GitHub repo
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Node Version:** 20

### 3. Add Environment Variables
In Render Dashboard → Environment, add all variables from `.env.local.example`

### 4. Deploy & Seed Database
After first deploy, visit:
```
https://newsflash-v6.onrender.com/api/seed?key=YOUR_SEED_SECRET
```
This creates:
- SuperAdmin account: `username=admin, password=Admin@123`
- Default ad slots

**⚠️ Change the admin password immediately at `/admin/settings`**

---

## 📁 Project Structure

```
newsflash-v6/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout + keep-alive
│   ├── article/[slug]/page.tsx     # Article detail
│   ├── cricket/                    # Cricket portal
│   ├── sarkari/                    # Sarkari Naukri portal
│   ├── admin/                      # Super Admin panel
│   ├── staff/                      # Employee portal
│   ├── api/                        # All API routes
│   ├── models/                     # Mongoose models
│   ├── lib/                        # DB, auth, cloudinary utils
│   └── components/                 # Shared components
├── middleware.ts                   # JWT route protection
├── tailwind.config.js
├── next.config.js
└── .env.local.example
```

---

## 👤 Default Accounts

After seeding:

| Portal | URL | Username | Password |
|---|---|---|---|
| Super Admin | `/admin` | `admin` | `Admin@123` |
| Staff Portal | `/staff` | (create via admin) | (set via admin) |

---

## 🔑 Key URLs

| URL | Description |
|---|---|
| `/` | Homepage |
| `/cricket` | Cricket live scores |
| `/sarkari` | Government jobs |
| `/admin` | Super Admin login |
| `/staff` | Employee login |
| `/api/ping` | Keep-alive endpoint |
| `/api/seed?key=SECRET` | One-time DB setup |
| `/sitemap.xml` | XML sitemap |
| `/robots.txt` | Robots file |

---

## 📧 Contact
65arunyadav65@gmail.com
