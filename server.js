import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Convert code endpoint
app.post('/api/convert', async (req, res) => {
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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ convertedCode: responseText });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert code',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
