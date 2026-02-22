// app.js
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import i18n from "i18n";
import path from 'path';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoute from './src/routes/auth.route.js';
import userRoute from './src/routes/user.route.js';
import accessRoute from "./src/routes/access.route.js";
import moduleRoute from "./src/routes/module.route.js";
import editorRoute from "./src/routes/editor.route.js";
import cmsRoute from "./src/routes/cms.route.js";
import chatRoute from "./src/routes/chat.route.js";
import categoryRoute from "./src/routes/category.route.js";

// Load environment variables
dotenv.config({ quiet: true });

const app = express();

//const PORT = Number.parseInt(process.env.PORT, 10) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 1. Core Security Middleware: Placed at the top for maximum coverage.
app.use(helmet());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));
app.use(cookieParser());

// 2. Request Processing Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. Localization Middleware: Placed after body parsing to ensure `req` is populated.
i18n.configure({
  locales: ["en"],
  directory: path.join(process.cwd(), "locales"),
  defaultLocale: "en",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: true,
  logWarnFn: (msg) => console.warn("i18n warn:", msg),
  logErrorFn: (msg) => console.error("i18n error:", msg)
});
app.use(i18n.init);

// 4. Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// API routes
app.use('/api/v1', authRoute);
app.use('/api/v1/user', userRoute);
app.use("/api/v1/access", accessRoute);
app.use("/api/v1/module", moduleRoute);
app.use("/api/v1/cms", cmsRoute);
app.use("/api/v1/editor", editorRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/category", categoryRoute);

// 5. 404 Handler: Placed after all other routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 6. Global error handler: The final middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server is running at http://localhost:${PORT}`);
// });

export default app;