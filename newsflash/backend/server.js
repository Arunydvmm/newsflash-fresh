require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ── Cloudinary config ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'newsflash', allowed_formats: ['jpg','jpeg','png','webp','gif'] },
});
const upload = multer({ storage });

// ── MongoDB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schemas ───────────────────────────────────────────────────────
const articleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  summary:     String,
  body:        { type: String, required: true },
  category:    { type: String, default: 'India' },
  status:      { type: String, enum: ['draft','published'], default: 'draft' },
  author:      { type: String, default: 'NewsFlash Desk' },
  authorInitials: String,
  featuredImage: String,   // Cloudinary URL
  imageCaption: String,
  tags:        [String],
  highlights:  [String],
  videoUrl:    String,
  videoTitle:  String,
  sources:     [{ label: String, url: String }],
  emoji:       String,
  views:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', articleSchema);

const settingsSchema = new mongoose.Schema({
  key:   { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
});
const Settings = mongoose.model('Settings', settingsSchema);

// ── Auth middleware ───────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Routes ────────────────────────────────────────────────────────

// Admin login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = password === process.env.ADMIN_PASSWORD;
  if (!validUser || !validPass)
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Upload image
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: req.file.path });
});

// Get all published articles (public)
app.get('/api/articles', async (req, res) => {
  const { category, status, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  else filter.status = 'published';
  const articles = await Article.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('-body');
  const total = await Article.countDocuments(filter);
  res.json({ articles, total, page: Number(page) });
});

// Get all articles for admin
app.get('/api/admin/articles', authMiddleware, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 }).select('-body');
  res.json(articles);
});

// Get single article
app.get('/api/articles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  article.views += 1;
  await article.save();
  res.json(article);
});

// Create article
app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    const article = new Article({ ...req.body, updatedAt: new Date() });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update article
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete article
app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Stats
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  const total     = await Article.countDocuments();
  const published = await Article.countDocuments({ status: 'published' });
  const drafts    = await Article.countDocuments({ status: 'draft' });
  const views     = await Article.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
  res.json({ total, published, drafts, views: views[0]?.total || 0 });
});

// Settings
app.get('/api/settings', async (req, res) => {
  const settings = await Settings.find();
  const obj = {};
  settings.forEach(s => obj[s.key] = s.value);
  res.json(obj);
});

app.post('/api/settings', authMiddleware, async (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    await Settings.findOneAndUpdate({ key }, { value }, { upsert: true });
  }
  res.json({ success: true });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
