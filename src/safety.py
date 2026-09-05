#!/usr/bin/env python3
"""
Clarivo Deterministic Safety & Escalation Gate (Python)
Evaluates explicit distress phrases, legal threats, and repeated contact counts.
"""

import re
from typing import Dict, Any, Optional

LEGAL_KEYWORDS = [
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
]

REPEATED_CONTACT_PATTERNS = [
    r'called\s+(?:3|4|5|several|multiple)\s+times',
    r'contacted\s+(?:3|4|5|several|multiple)\s+times',
    r'complained\s+(?:3|4|5|several|multiple)\s+times',
    r'3rd\s+time\s+(?:calling|contacting|following\s+up)',
    r'4th\s+time\s+(?:calling|contacting|following\s+up)',
    r'already\s+contacted\s+support\s+(?:three|four|3|4)\s+times',
]

def check_safety_triggers(message: str, customer: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    lower = message.lower()

    # 1. Check legal keywords
    for kw in LEGAL_KEYWORDS:
        if kw in lower:
            return {
                "triggered": True,
                "reason": f'Explicit legal/regulatory threat detected ("{kw}")',
                "trigger_type": "LEGAL_THREAT",
                "priority": "P1_CRITICAL"
            }

    # 2. Check repeated contact regex
    for pattern in REPEATED_CONTACT_PATTERNS:
        if re.search(pattern, message, re.IGNORECASE):
            return {
                "triggered": True,
                "reason": "Customer reported multiple unresolved contacts without resolution",
                "trigger_type": "REPEATED_CONTACT",
                "priority": "P1_CRITICAL"
            }

    # 3. Check customer account ticket count
    if customer and customer.get("recent_tickets"):
        open_tickets = [t for t in customer["recent_tickets"] if t.get("status") in ("OPEN", "ESCALATED")]
        if len(open_tickets) >= 3:
            return {
                "triggered": True,
                "reason": f"Account has {len(open_tickets)} unresolved tickets in queue (SLA threshold exceeded)",
                "trigger_type": "REPEATED_CONTACT",
                "priority": "P1_CRITICAL"
            }

    return {
        "triggered": False,
        "reason": "",
        "trigger_type": None,
        "priority": "P3_MEDIUM"
    }
