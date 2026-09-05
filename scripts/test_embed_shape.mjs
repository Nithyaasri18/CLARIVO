import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function test() {
  const res = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: 'Hello world',
  });
  console.log("Response keys:", Object.keys(res));
  console.log("Response structure:", JSON.stringify(res).substring(0, 300));
}

test().catch(console.error);
