/**
 * Clarivo Intent Classification Module
 * Uses Gemini with structured JSON output, paired with a deterministic rule fallback.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { IntentType } from './types';

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  summary: string;
  entities: Record<string, any>;
}

const INTENT_SYSTEM_PROMPT = `
You are Clarivo's deterministic Intent Classifier for a telecom/broadband support desk.
Your job is to classify the customer's message into EXACTLY ONE of these categories:
- BILLING: Invoices, payment failures, due dates, proration, overdue suspensions, duplicate deductions, GST.
- CONNECTIVITY_OUTAGE: No internet, red LOS light, area fiber cut, slow speeds, packet loss, DNS issues.
- ROUTER_HARDWARE: Router power light, PON light, physical damage, Wi-Fi 2.4 vs 5GHz setup, restart procedure.
- PLAN_CHANGE: Upgrades, downgrades, OTT bundle activation, safe custody / vacation pause.
- REFUND_DISPUTE: Security deposit return, unauthorized charges, pro-rata outage credits, bank chargebacks.
- OUT_OF_SCOPE: Enterprise VoIP/SIP setups, cellular tower requests, unrelated questions.

Output strictly valid JSON conforming to the schema. Do not include markdown codeblocks or conversational text.
`;

export async function classifyIntent(
  message: string,
  apiKey?: string
): Promise<IntentResult> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

  if (effectiveKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Customer Message: "${message}"`,
        config: {
          systemInstruction: INTENT_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: {
                type: Type.STRING,
                enum: [
                  'BILLING',
                  'CONNECTIVITY_OUTAGE',
                  'ROUTER_HARDWARE',
                  'PLAN_CHANGE',
                  'REFUND_DISPUTE',
                  'OUT_OF_SCOPE',
                ],
              },
              confidence: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              entities: {
                type: Type.OBJECT,
                properties: {
                  mentioned_amount: { type: Type.NUMBER },
                  mentioned_plan: { type: Type.STRING },
                  mentioned_timeframe: { type: Type.STRING },
                },
              },
            },
            required: ['intent', 'confidence', 'summary'],
          },
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.intent) {
        return {
          intent: parsed.intent as IntentType,
          confidence: Math.min(1.0, Math.max(0.1, parsed.confidence || 0.9)),
          summary: parsed.summary || message.slice(0, 80),
          entities: parsed.entities || {},
        };
      }
    } catch (err: any) {
      console.warn('Gemini intent classification fallback to rules:', err.message);
    }
  }

  // Deterministic Fallback Rule Classifier
  return deterministicIntentFallback(message);
}

export function deterministicIntentFallback(message: string): IntentResult {
  const msg = message.toLowerCase();

  if (msg.includes('bill') || msg.includes('payment') || msg.includes('due') || msg.includes('overcharged') || msg.includes('invoice') || msg.includes('₹') || msg.includes('gst')) {
    return {
      intent: 'BILLING',
      confidence: 0.88,
      summary: 'Billing or invoice inquiry',
      entities: {},
    };
  }

  if (msg.includes('sip trunk') || msg.includes('pbx') || msg.includes('grandstream') || msg.includes('voip bridge')) {
    return {
      intent: 'OUT_OF_SCOPE',
      confidence: 0.92,
      summary: 'Unsupported enterprise telephony inquiry',
      entities: {},
    };
  }

  if (msg.includes('los') || msg.includes('pon') || msg.includes('router') || msg.includes('blinking') || msg.includes('modem') || msg.includes('5ghz')) {
    return {
      intent: 'ROUTER_HARDWARE',
      confidence: 0.85,
      summary: 'Router optical hardware or indicator status',
      entities: {},
    };
  }

  if (msg.includes('internet') || msg.includes('down') || msg.includes('not working') || msg.includes('slow') || msg.includes('outage') || msg.includes('connection') || msg.includes('disconnect')) {
    return {
      intent: 'CONNECTIVITY_OUTAGE',
      confidence: 0.89,
      summary: 'Broadband connectivity disruption inquiry',
      entities: {},
    };
  }

  if (msg.includes('upgrade') || msg.includes('downgrade') || msg.includes('plan') || msg.includes('ott') || msg.includes('hotstar') || msg.includes('safe custody')) {
    return {
      intent: 'PLAN_CHANGE',
      confidence: 0.85,
      summary: 'Plan modification or add-on request',
      entities: {},
    };
  }

  if (msg.includes('refund') || msg.includes('deposit') || msg.includes('chargeback') || msg.includes('reimburse')) {
    return {
      intent: 'REFUND_DISPUTE',
      confidence: 0.87,
      summary: 'Refund or security deposit dispute',
      entities: {},
    };
  }

  return {
    intent: 'OUT_OF_SCOPE',
    confidence: 0.5,
    summary: message.slice(0, 80),
    entities: {},
  };
}
