import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY found");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  const kbPath = path.resolve('data/kb_articles.json');
  const kbData = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  console.log(`Loaded ${kbData.length} articles`);

  const embeddings = {};

  for (const article of kbData) {
    const textToEmbed = `${article.title}. Category: ${article.category}. Keywords: ${article.keywords.join(', ')}. ${article.body}`;
    try {
      // Use gemini-embedding-001 as specified in prompt
      const res = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: textToEmbed,
      });
      const vector = res.embeddings?.[0]?.values;
      if (!vector) {
        throw new Error("No values in response embeddings");
      }
      embeddings[article.id] = {
        id: article.id,
        category: article.category,
        title: article.title,
        vector: vector,
        keywords: article.keywords,
      };
      console.log(`Embedded ${article.id}: ${article.title.substring(0, 30)}... (dims: ${vector.length})`);
    } catch (err) {
      console.error(`Failed embedding ${article.id}:`, err.message);
    }
  }

  const outPath = path.resolve('data/kb_embeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(embeddings, null, 2), 'utf-8');
  console.log(`Saved precomputed embeddings to ${outPath}`);
}

main().catch(console.error);
