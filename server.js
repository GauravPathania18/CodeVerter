import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_BODY_SIZE = process.env.MAX_BODY_SIZE || '1mb';
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 30000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const requestLog = new Map();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
}));
app.use(express.json({ limit: MAX_BODY_SIZE }));

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function rateLimitConvert(req, res, next) {
  const now = Date.now();
  const ip = getClientIp(req);
  const previous = requestLog.get(ip) || [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return next();
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function getProviderErrorStatus(error) {
  if (typeof error?.status === 'number') {
    return error.status;
  }

  const message = String(error?.message || '');
  const statusMatch = message.match(/\[(\d{3})\s/);
  if (statusMatch) {
    return Number(statusMatch[1]);
  }

  return null;
}

// Convert code endpoint
app.post('/api/convert', rateLimitConvert, async (req, res) => {
  try {
    const { sourceCode, sourceLanguage, targetLanguage } = req.body;

    if (!sourceCode?.trim()) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `Convert the following ${sourceLanguage} code to ${targetLanguage}. Only return the converted code without any explanation or markdown formatting:

${sourceCode}`;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT_MS);
    const responseText = result.response.text();

    res.json({ convertedCode: responseText });
  } catch (error) {
    console.error('Conversion error:', error);
    if (error.message === 'Request timed out') {
      return res.status(504).json({ error: 'Conversion timed out. Please try again.' });
    }

    const providerStatus = getProviderErrorStatus(error);
    if (providerStatus === 429) {
      return res.status(429).json({
        error: 'Gemini quota exceeded. Check usage limits, billing, or retry later.',
      });
    }

    if (providerStatus === 401 || providerStatus === 403) {
      return res.status(502).json({
        error: 'Gemini API key rejected. Verify GEMINI_API_KEY and project permissions.',
      });
    }

    return res.status(502).json({ error: 'Failed to convert code' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((error, req, res, next) => {
  if (error.message === 'CORS origin not allowed') {
    return res.status(403).json({ error: 'CORS origin not allowed' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large' });
  }

  return next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Gemini model: ${GEMINI_MODEL}`);
});
