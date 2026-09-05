/**
 * Clarivo Deterministic Safety & Escalation Gate
 * Evaluates explicit distress phrases, legal threats, and repeated contact counts.
 */

import { CustomerRecord } from './types';

export interface SafetyCheckResult {
  triggered: boolean;
  reason: string;
  trigger_type: 'LEGAL_THREAT' | 'REPEATED_CONTACT' | 'CRITICAL_OUTAGE' | null;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM';
}

const LEGAL_KEYWORDS = [
  'legal complaint',
  'legal action',
  'consumer court',
  'lawyer',
  'sue',
  'suing',
  'police complaint',
  'fir',
  'trai complaint',
  'national consumer helpline',
  'tribunal',
  'fraud case',
];

const REPEATED_CONTACT_PATTERNS = [
  /called\s+(?:3|4|5|several|multiple)\s+times/i,
  /contacted\s+(?:3|4|5|several|multiple)\s+times/i,
  /complained\s+(?:3|4|5|several|multiple)\s+times/i,
  /3rd\s+time\s+(?:calling|contacting|following\s+up)/i,
  /4th\s+time\s+(?:calling|contacting|following\s+up)/i,
  /already\s+contacted\s+support\s+(?:three|four|3|4)\s+times/i,
];

export function checkSafetyTriggers(message: string, customer?: CustomerRecord | null): SafetyCheckResult {
  const lower = message.toLowerCase();

  // 1. Legal & Regulatory Threats
  for (const kw of LEGAL_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        triggered: true,
        reason: `Explicit legal/regulatory threat detected ("${kw}")`,
        trigger_type: 'LEGAL_THREAT',
        priority: 'P1_CRITICAL',
      };
    }
  }

  // 2. Text-indicated Repeated Contacts
  for (const pattern of REPEATED_CONTACT_PATTERNS) {
    if (pattern.test(message)) {
      return {
        triggered: true,
        reason: 'Customer reported multiple unresolved contacts without resolution',
        trigger_type: 'REPEATED_CONTACT',
        priority: 'P1_CRITICAL',
      };
    }
  }

  // 3. Account-level Repeated Open Tickets
  if (customer && customer.recent_tickets) {
    const openTickets = customer.recent_tickets.filter((t) => t.status === 'OPEN' || t.status === 'ESCALATED');
    if (openTickets.length >= 3) {
      return {
        triggered: true,
        reason: `Account has ${openTickets.length} unresolved tickets in queue (SLA threshold exceeded)`,
        trigger_type: 'REPEATED_CONTACT',
        priority: 'P1_CRITICAL',
      };
    }
  }

  return {
    triggered: false,
    reason: '',
    trigger_type: null,
    priority: 'P3_MEDIUM',
  };
}
