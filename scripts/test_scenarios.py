#!/usr/bin/env python3
"""
Clarivo Scenario Verification Test Runner (Track PS04)
Tests all 5 benchmark scenarios end-to-end through the deterministic engine.
"""

import sys
import os
import json

# Ensure project root in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.db import init_db
from src.engine import run_resolution_pipeline

def test_all():
    init_db()
    with open("data/scenarios.json", "r", encoding="utf-8") as f:
        scenarios = json.load(f)

    print(f"=== RUNNING CLARIVO {len(scenarios)} BENCHMARK SCENARIO VERIFICATIONS ===")
    all_passed = True

    for sc in scenarios:
        print(f"\n▶ Testing {sc['code']}: {sc['name']}")
        print(f"  Customer: {sc['customer_id']} | Query: \"{sc['message']}\"")

        res = run_resolution_pipeline(sc["message"], sc["customer_id"])

        print(f"  Result Decision: {res['decision']} (Expected: {sc['expected_decision']})")
        print(f"  Confidence: {int(res['confidence']*100)}% | Intent: {res['intent']}")

        if res["decision"] != sc["expected_decision"]:
            print(f"  ❌ FAILED: Decision mismatch!")
            all_passed = False
        else:
            print(f"  ✅ PASSED: Correct branch decision!")

        if res.get("citation") and res["citation"].get("article_id"):
            print(f"  Citation: [{res['citation']['article_id']}] {res['citation']['title']}")

        if res.get("missing_fields"):
            print(f"  Missing Info Detected: {res['missing_fields'][0]['field']}")
            print(f"  Target Clarification: {res['missing_fields'][0]['suggested_question']}")

        if res.get("escalation"):
            esc = res["escalation"]
            print(f"  Escalation Handover: Dept={esc['recommended_department']} | Priority={esc['priority']}")
            print(f"  Starting Action: {esc['agent_starting_action'][:80]}...")

        print(f"  Evidence Steps: {len(res['evidence_chain'])} nodes in trace")

    print("\n" + "="*60)
    if all_passed:
        print("🎉 ALL 5 BENCHMARK SCENARIOS PASSED WITH EXACT PS04 TRACK ALIGNMENT!")
    else:
        print("⚠️ Some scenarios had discrepancies. Review above.")

if __name__ == "__main__":
    test_all()
