import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import categoryRoutes from '@/app/routes/category.routes.js';
import courseRoutes from '@/app/routes/course.routes.js';
import welcomeRoutes from '@/app/routes/welcome.routes.js';
import { auth } from '@/lib/auth.js';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const whitelist = [process.env.CLIENT_URL, 'http://localhost:5173'];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use('/api/courses', courseRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/', welcomeRoutes);

app.use('/', express.static('public'));

app.post('/generate-ai', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const prompt = req.body.prompt;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required as a string.' });
      return;
    }

    console.log('Received prompt:', prompt);

    const result = await gemini.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ output: result.text });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    res.status(500).json({ error: 'Error generating AI response.' });
  }
});

app.get('/generate-ai-stream', async (req, res) => {
  const prompt = req.query.prompt as string;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required as a query parameter.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await gemini.models.generateContentStream({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${text}\n\n`);
      }
    }

    res.write('event: done\ndata: end\n\n');
    res.end();
  } catch (err) {
    console.error('Error in AI stream:', err);
    res.write('event: error\ndata: Failed to generate\n\n');
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
