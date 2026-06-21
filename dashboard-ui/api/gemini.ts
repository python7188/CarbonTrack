import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GeminiPart { text: string }
interface GeminiContent { role: string; parts: GeminiPart[] }

// Simple in-memory rate limiting (per cold start)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS and Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://carbontrack-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting
  const ip = Array.isArray(req.headers['x-forwarded-for']) 
    ? req.headers['x-forwarded-for'][0] 
    : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown');
    
  const now = Date.now();
  const limitData = rateLimit.get(ip) || { count: 0, resetTime: now + WINDOW_MS };

  if (now > limitData.resetTime) {
    limitData.count = 1;
    limitData.resetTime = now + WINDOW_MS;
  } else {
    limitData.count++;
  }
  rateLimit.set(ip, limitData);

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - limitData.count).toString());

  if (limitData.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too Many Requests. Please try again later.' });
  }

  // Input Validation
  const { contents, systemInstruction, generationConfig } = req.body || {};
  
  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'Invalid payload: missing or empty contents array' });
  }

  // Clean the payload
  const safePayload: { contents: GeminiContent[]; systemInstruction?: { parts: GeminiPart[] }; generationConfig?: Record<string, unknown> } = {
    contents: contents.map((c: { role?: string; parts?: { text?: string }[] }) => ({
      role: c.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(c.parts) ? c.parts.map((p: { text?: string }) => ({ text: String(p.text || '').substring(0, 4000) })) : []
    }))
  };

  // Only allow systemInstruction if it strictly matches our expected format/content limits
  if (systemInstruction && Array.isArray(systemInstruction.parts)) {
    safePayload.systemInstruction = {
      parts: systemInstruction.parts.map((p: { text?: string }) => ({ text: String(p.text || '').substring(0, 4000) }))
    };
  }

  if (generationConfig) {
    safePayload.generationConfig = {
      temperature: Math.min(Math.max(Number(generationConfig.temperature) || 0.7, 0), 1),
      maxOutputTokens: Math.min(Number(generationConfig.maxOutputTokens) || 2048, 4096),
      responseMimeType: generationConfig.responseMimeType === 'application/json' ? 'application/json' : 'text/plain'
    };
  }

  // Retrieve API Key
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('Server missing GEMINI_API_KEY environment variable.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    
    const response = await fetch(googleEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safePayload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying Gemini API:', error);
    return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
}
