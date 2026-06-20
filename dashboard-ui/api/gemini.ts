import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Securely retrieve the key from the server environment
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('Server missing GEMINI_API_KEY environment variable.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const googleEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    
    // Forward the exact body from the frontend straight to Gemini
    const response = await fetch(googleEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    // Relay the response back to the frontend with the same status code
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying Gemini API:', error);
    return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
}
