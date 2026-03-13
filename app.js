// app.js
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import i18n from "i18n";
import path from 'path';
import rateLimit from 'express-rate-limit';
import logger from "./src/utils/logger.js";
import errorHandler from "./src/middleware/errorHandler.js";

// Import routes
import v1Routes from "./src/routes/v1/index.js";
import v2Routes from "./src/routes/v2/index.js";

// Load environment variables
dotenv.config({ quiet: true });

const app = express();

//const PORT = Number.parseInt(process.env.PORT, 10) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const UPLOAD_PATH = process.env.UPLOAD_PATH || "uploads";

// Serve static files from configured upload base folder
app.use(`/${UPLOAD_PATH}`, express.static(path.join(process.cwd(), UPLOAD_PATH)));

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
  logWarnFn: (msg) => logger.warn({ msg }, "i18n warning"),
  logErrorFn: (msg) => logger.error({ msg }, "i18n error")
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
app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);

// 5. 404 Handler: Placed after all other routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 6. Global error handler: The final middleware
app.use(errorHandler);

// Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server is running at http://localhost:${PORT}`);
// });

export default app;
