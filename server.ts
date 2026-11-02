import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post('/api/generate-plot', async (req, res) => {
    try {
      const { title, genre, durationMinutes, characters } = req.body;
      const ai = getAiClient();
      if (!ai) {
        return res.json({ fallback: true });
      }

      const charList = Array.isArray(characters)
        ? characters.map((c: { name: string; role: string }) => `${c.name} (${c.role})`).join(', ')
        : 'Arka, Nadia, Reno';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Buatkan sinopsis premis cerita microdrama yang sangat memikat dan penuh konflik emosional (3-4 kalimat dalam Bahasa Indonesia) untuk judul "${title}" dengan genre "${genre}", durasi ${durationMinutes} menit, melibatkan karakter: ${charList}.`,
      });

      const plotText = (response.text ?? '').trim();
      if (!plotText) {
        return res.json({ fallback: true });
      }
      return res.json({ plot: plotText, fallback: false });
    } catch (error) {
      console.error('Gemini plot generation fallback:', error);
      return res.json({ fallback: true });
    }
  });

  app.post('/api/generate-storyboard', async (req, res) => {
    try {
      const { config, characters, totalScenes } = req.body;
      const ai = getAiClient();
      if (!ai) {
        return res.json({ fallback: true });
      }

      const count = Math.min(Number(totalScenes) || 12, 24);
      const charSummary = Array.isArray(characters)
        ? characters
            .map(
              (c: { name: string; role: string; appearance: string; outfit: string; voiceStyle: string }) =>
                `${c.name} (${c.role}): ${c.appearance} | Outfit: ${c.outfit} | Suara: ${c.voiceStyle}`
            )
            .join('\n')
        : '';

      const prompt = `Buatkan storyboard produksi microdrama berjudul "${config?.title}" (Genre: ${config?.genre}, Durasi: ${config?.durationMinutes} menit, Rasio: ${config?.ratio}, Gaya Visual: ${config?.style}, POV: ${config?.pov}).
Sinopsis: ${config?.plot}
Daftar Karakter:
${charSummary}

Susun ${count} frame adegan berurutan yang dramatis, memiliki hook kuat di 3 detik pertama, konflik memuncak, dan plot twist/cliffhanger. Pastikan unifiedPrompt menggabungkan secara utuh: Character Sheet Lock fisik & pakaian + Sudut Kamera + Setting Lokasi + Aksi + Dialog Bahasa Indonesia dalam satu kesatuan prompt.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                episode: { type: Type.INTEGER },
                phase: { type: Type.STRING },
                location: { type: Type.STRING },
                camera: { type: Type.STRING },
                speaker: { type: Type.STRING },
                voiceStyle: { type: Type.STRING },
                action: { type: Type.STRING },
                dialogue: { type: Type.STRING },
                unifiedPrompt: { type: Type.STRING },
              },
              required: [
                'sceneNumber',
                'episode',
                'phase',
                'location',
                'camera',
                'speaker',
                'voiceStyle',
                'action',
                'dialogue',
                'unifiedPrompt',
              ],
            },
          },
        },
      });

      const rawJson = (response.text ?? '[]').trim();
      const scenes = JSON.parse(rawJson);
      if (!Array.isArray(scenes) || scenes.length === 0) {
        return res.json({ fallback: true });
      }
      return res.json({ scenes, fallback: false });
    } catch (error) {
      console.error('Gemini storyboard generation fallback:', error);
      return res.json({ fallback: true });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Microdrama Studio AI running on http://localhost:${PORT}`);
  });
}

startServer();
