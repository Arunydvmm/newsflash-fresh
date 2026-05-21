# NewsFlash — Complete Setup Guide

## What was fixed
- ✅ Articles now saved in MongoDB (visible on ALL devices)
- ✅ Images uploaded to Cloudinary (permanent URLs)
- ✅ Refresh no longer redirects to home (vercel.json fix)
- ✅ Full mobile + desktop responsive design

---

## Step 1 — MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com and sign up free
2. Create a **Free Cluster** (M0 tier)
3. Click **Connect → Drivers → Node.js**
4. Copy the connection string (looks like):
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`
5. Add `/newsflash` at the end:
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/newsflash`
6. Under **Network Access**, click **Add IP Address → Allow Access From Anywhere**

---

## Step 2 — Cloudinary (Free Image Hosting)

1. Go to https://cloudinary.com and sign up free
2. Go to **Dashboard**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

Free tier gives you **25GB storage + 25GB bandwidth/month** — plenty for a news site.

---

## Step 3 — Deploy Backend (Render.com — Free)

1. Go to https://render.com and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
5. Under **Environment Variables**, add ALL of these:

```
MONGODB_URI       = mongodb+srv://...your Atlas URL...
JWT_SECRET        = any-long-random-string-here
ADMIN_USERNAME    = admin
ADMIN_PASSWORD    = YourSecurePassword123
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY    = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

6. Click **Deploy** — Render gives you a URL like:
   `https://newsflash-core.onrender.com`

---

## Step 4 — Connect Frontend to Backend

1. Go to your live Vercel site
2. Click **⚙ Admin** → log in
3. Go to **Settings → API Configuration**
4. Paste your Render URL: `https://newsflash-core.onrender.com`
5. Click **Save API URL**

That's it! Articles you add now appear on ALL devices instantly.

---

## Step 5 — Fix Vercel Routing (refresh issue)

The `vercel.json` file in this package fixes the refresh problem.
Make sure it's in the ROOT of your repo (same level as package.json).

Content should be:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## File Structure
```
newsflash/
├── backend/
│   └── server.js          ← Express API
├── public/
│   ├── index.html         ← Main frontend
│   ├── css/
│   │   └── style.css      ← All styles
│   └── js/
│       └── app.js         ← All frontend logic
├── package.json           ← Updated dependencies
├── vercel.json            ← Fixes refresh routing
├── .env.example           ← Copy to .env and fill in
└── SETUP.md               ← This file
```

---

## Admin Panel Usage

1. Click **⚙ Admin** on the site
2. Login with your ADMIN_USERNAME / ADMIN_PASSWORD
3. **New Article**:
   - Fill headline, category, body
   - Upload image directly from computer
   - Set status to **Published** to make it live
4. All published articles appear instantly on all devices

---

## Troubleshooting

**Articles not loading?**
→ Check Admin → Settings → API URL is set correctly
→ Check Render logs for errors
→ Make sure MongoDB IP whitelist allows all (0.0.0.0/0)

**Image upload failing?**
→ Verify Cloudinary credentials in Render environment variables

**Login not working?**
→ Check ADMIN_USERNAME and ADMIN_PASSWORD in Render env vars

**Refresh still redirecting?**
→ Make sure vercel.json is in the repo root and redeployed
