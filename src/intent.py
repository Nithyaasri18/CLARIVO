#!/usr/bin/env python3
"""
Clarivo Intent Classification Module (Python)
Uses Gemini API with structured JSON output, with a deterministic rule fallback.
"""

import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any

def classify_intent(message: str, api_key: str = None) -> Dict[str, Any]:
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
            payload = {
                "contents": [{"parts": [{"text": f"Customer Message: \"{message}\""}]}],
                "systemInstruction": {
                    "parts": [{
                        "text": "You are Clarivo's deterministic Intent Classifier. Classify into exactly one: "
                                "BILLING, CONNECTIVITY_OUTAGE, ROUTER_HARDWARE, PLAN_CHANGE, REFUND_DISPUTE, OUT_OF_SCOPE. "
                                "Return JSON with: intent, confidence (0.0-1.0), summary."
                    }]
                },
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.1
                }
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                if "intent" in parsed:
                    return {
                        "intent": parsed["intent"],
                        "confidence": float(parsed.get("confidence", 0.9)),
                        "summary": parsed.get("summary", message[:80]),
                        "entities": parsed.get("entities", {})
                    }
        except Exception as e:
            pass

    # Deterministic Fallback
    return deterministic_intent_fallback(message)

def deterministic_intent_fallback(message: str) -> Dict[str, Any]:
    msg = message.lower()
    if any(w in msg for w in ['bill', 'payment', 'due', 'overcharged', 'invoice', '₹', 'gst']):
        return {"intent": "BILLING", "confidence": 0.88, "summary": "Billing or invoice inquiry", "entities": {}}
    if any(w in msg for w in ['sip trunk', 'pbx', 'grandstream', 'voip bridge']):
        return {"intent": "OUT_OF_SCOPE", "confidence": 0.92, "summary": "Unsupported enterprise telephony inquiry", "entities": {}}
    if any(w in msg for w in ['los', 'pon', 'router', 'blinking', 'modem', '5ghz']):
        return {"intent": "ROUTER_HARDWARE", "confidence": 0.85, "summary": "Router optical hardware or indicator status", "entities": {}}
    if any(w in msg for w in ['internet', 'down', 'not working', 'slow', 'outage', 'connection', 'disconnect']):
        return {"intent": "CONNECTIVITY_OUTAGE", "confidence": 0.89, "summary": "Broadband connectivity disruption inquiry", "entities": {}}
    if any(w in msg for w in ['upgrade', 'downgrade', 'plan', 'ott', 'hotstar', 'safe custody']):
        return {"intent": "PLAN_CHANGE", "confidence": 0.85, "summary": "Plan modification or add-on request", "entities": {}}
    if any(w in msg for w in ['refund', 'deposit', 'chargeback', 'reimburse']):
        return {"intent": "REFUND_DISPUTE", "confidence": 0.87, "summary": "Refund or security deposit dispute", "entities": {}}
    return {"intent": "OUT_OF_SCOPE", "confidence": 0.50, "summary": message[:80], "entities": {}}
