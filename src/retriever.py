#!/usr/bin/env python3
"""
Clarivo Local Vector Retriever (Track PS04)
Performs local similarity search over precomputed gemini-embedding-001 vectors.
Combines dense vector similarity with deterministic keyword validation.
"""

import os
import json
import math
from typing import List, Dict, Any, Tuple, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
EMBEDDINGS_FILE = os.path.join(DATA_DIR, "kb_embeddings.json")
ARTICLES_FILE = os.path.join(DATA_DIR, "kb_articles.json")

# Similarity threshold: queries scoring below this are considered uncovered
SIMILARITY_THRESHOLD = 0.65

_INDEX_CACHE: Optional[Dict[str, Any]] = None

def load_kb_index() -> Dict[str, Any]:
    global _INDEX_CACHE
    if _INDEX_CACHE is not None:
        return _INDEX_CACHE

    if not os.path.exists(EMBEDDINGS_FILE):
        raise FileNotFoundError(f"Embedding cache not found at {EMBEDDINGS_FILE}")

    with open(EMBEDDINGS_FILE, "r", encoding="utf-8") as f:
        _INDEX_CACHE = json.load(f)
    return _INDEX_CACHE

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def keyword_score(query: str, article_keywords: List[str], title: str, body: str) -> float:
    query_lower = query.lower()
    query_tokens = set([w.strip("?,.!") for w in query_lower.split() if len(w) > 2])

    matches = 0.0
    for kw in article_keywords:
        kw_lower = kw.lower()
        if kw_lower in query_lower:
            matches += 3.0
        else:
            # Check token overlap
            kw_tokens = set(kw_lower.split())
            overlap = query_tokens.intersection(kw_tokens)
            if overlap:
                matches += 1.0 * len(overlap)

    for word in title.lower().split():
        clean_word = word.strip("?,.!")
        if len(clean_word) > 3 and clean_word in query_tokens:
            matches += 1.0

    # Calibrated score: if there are strong keyword matches (matches >= 2.0), score is in 0.75-0.95 range
    if matches >= 3.0:
        return min(0.96, 0.78 + (matches * 0.03))
    elif matches >= 1.5:
        return min(0.85, 0.72 + (matches * 0.04))
    elif matches > 0:
        return min(0.68, 0.40 + (matches * 0.10))
    return 0.10

def retrieve_kb(
    query_text: str,
    query_vector: Optional[List[float]] = None,
    top_k: int = 3,
    category_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieves the top-k relevant KB articles.
    If query_vector is provided, calculates hybrid (dense cosine + lexical).
    Otherwise calculates lexical match.
    """
    index = load_kb_index()
    # Also load full article bodies
    with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
        articles_data = {a["id"]: a for a in json.load(f)}

    results = []
    for art_id, item in index.items():
        if category_filter and item.get("category") != category_filter:
            continue

        full_art = articles_data.get(art_id, {})
        kw_score = keyword_score(
            query_text,
            item.get("keywords", []),
            item.get("title", ""),
            full_art.get("body", "")
        )

        if query_vector and item.get("vector"):
            dense_sim = cosine_similarity(query_vector, item["vector"])
            # Hybrid fusion
            combined_score = (0.75 * dense_sim) + (0.25 * kw_score)
        else:
            dense_sim = 0.0
            combined_score = kw_score

        results.append({
            "id": art_id,
            "title": item.get("title"),
            "category": item.get("category"),
            "body": full_art.get("body", ""),
            "applies_to": full_art.get("applies_to", []),
            "required_fields": full_art.get("required_fields", []),
            "cosine_similarity": round(dense_sim, 4),
            "keyword_score": round(kw_score, 4),
            "score": round(combined_score, 4),
            "passes_threshold": combined_score >= SIMILARITY_THRESHOLD
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]

if __name__ == "__main__":
    test_query = "Why is my internet down today? Did I miss a payment?"
    print(f"Testing lexical retrieval for: '{test_query}'")
    hits = retrieve_kb(test_query, top_k=2)
    for h in hits:
        print(f"[{h['id']}] {h['title']} (Score: {h['score']}, Threshold: {h['passes_threshold']})")
