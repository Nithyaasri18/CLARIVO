import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function check() {
  const models = await ai.models.list();
  for await (const m of models) {
    if (m.name.includes('embed') || m.name.includes('flash')) {
      console.log(m.name, m.supportedActions);
    }
  }
}

check().catch(console.error);
