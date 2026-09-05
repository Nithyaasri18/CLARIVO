/**
 * Clarivo Local Vector Retriever (Track PS04)
 * TypeScript implementation matching src/retriever.py
 */

import fs from 'fs';
import path from 'path';

export interface KBArticle {
  id: string;
  category: string;
  title: string;
  body: string;
  applies_to: string[];
  required_fields: string[];
  keywords: string[];
}

export interface RetrievalResult {
  id: string;
  title: string;
  category: string;
  body: string;
  applies_to: string[];
  required_fields: string[];
  cosine_similarity: number;
  keyword_score: number;
  score: number;
  passes_threshold: boolean;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const EMBEDDINGS_FILE = path.join(DATA_DIR, 'kb_embeddings.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'kb_articles.json');
export const SIMILARITY_THRESHOLD = 0.65;

let indexCache: Record<string, any> | null = null;
let articlesCache: Record<string, KBArticle> | null = null;

export function loadKBData(): { index: Record<string, any>; articles: Record<string, KBArticle> } {
  if (!indexCache) {
    if (fs.existsSync(EMBEDDINGS_FILE)) {
      indexCache = JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, 'utf-8'));
    } else {
      indexCache = {};
    }
  }

  if (!articlesCache) {
    if (fs.existsSync(ARTICLES_FILE)) {
      const list: KBArticle[] = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
      articlesCache = {};
      for (const a of list) {
        articlesCache[a.id] = a;
      }
    } else {
      articlesCache = {};
    }
  }

  return { index: indexCache!, articles: articlesCache! };
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

export function calculateKeywordScore(query: string, keywords: string[], title: string): number {
  const q = query.toLowerCase();
  const queryTokens = new Set(
    q
      .split(/\s+/)
      .map((w) => w.replace(/[?,.!]/g, ''))
      .filter((w) => w.length > 2)
  );

  let matches = 0.0;
  for (const kw of keywords || []) {
    const kwLower = kw.toLowerCase();
    if (q.includes(kwLower)) {
      matches += 3.0;
    } else {
      const kwTokens = kwLower.split(/\s+/);
      for (const t of kwTokens) {
        if (queryTokens.has(t)) {
          matches += 1.0;
        }
      }
    }
  }

  const titleWords = title.toLowerCase().split(/\s+/);
  for (const w of titleWords) {
    const clean = w.replace(/[?,.!]/g, '');
    if (clean.length > 3 && queryTokens.has(clean)) {
      matches += 1.0;
    }
  }

  if (matches >= 3.0) {
    return Math.min(0.96, 0.78 + matches * 0.03);
  } else if (matches >= 1.5) {
    return Math.min(0.85, 0.72 + matches * 0.04);
  } else if (matches > 0) {
    return Math.min(0.68, 0.4 + matches * 0.1);
  }
  return 0.1;
}

export function retrieveKB(
  queryText: string,
  queryVector?: number[] | null,
  topK = 3,
  categoryFilter?: string
): RetrievalResult[] {
  const { index, articles } = loadKBData();
  const results: RetrievalResult[] = [];

  for (const [id, item] of Object.entries(index)) {
    if (categoryFilter && item.category !== categoryFilter) {
      continue;
    }

    const fullArticle = articles[id] || {
      id,
      category: item.category,
      title: item.title,
      body: '',
      applies_to: [],
      required_fields: [],
      keywords: item.keywords || [],
    };

    const kwScore = calculateKeywordScore(queryText, item.keywords || [], item.title || '');
    let denseSim = 0;
    let combinedScore = kwScore;

    if (queryVector && item.vector && Array.isArray(item.vector)) {
      denseSim = cosineSimilarity(queryVector, item.vector);
      combinedScore = 0.75 * denseSim + 0.25 * kwScore;
    }

    results.push({
      id,
      title: item.title,
      category: item.category,
      body: fullArticle.body,
      applies_to: fullArticle.applies_to,
      required_fields: fullArticle.required_fields,
      cosine_similarity: Number(denseSim.toFixed(4)),
      keyword_score: Number(kwScore.toFixed(4)),
      score: Number(combinedScore.toFixed(4)),
      passes_threshold: combinedScore >= SIMILARITY_THRESHOLD,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
