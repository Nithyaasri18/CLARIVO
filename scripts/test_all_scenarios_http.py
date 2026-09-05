#!/usr/bin/env python3
"""
Verify all 5 benchmark scenarios directly against the live HTTP API on port 3000
"""

import urllib.request
import json

opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

with open("data/scenarios.json", "r", encoding="utf-8") as f:
    scenarios = json.load(f)

print(f"=== TESTING {len(scenarios)} BENCHMARK SCENARIOS AGAINST LIVE SERVER HTTP API ===")
all_pass = True

for sc in scenarios:
    req = urllib.request.Request(
        "http://localhost:3000/api/simulate",
        data=json.dumps({"customer_id": sc["customer_id"], "message": sc["message"]}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        decision = res["decision"]
        confidence = res["confidence"]
        expected = sc["expected_decision"]

        status_mark = "✅" if decision == expected else "❌"
        if decision != expected:
            all_pass = False

        print(f"\n{status_mark} {sc['code']}:")
        print(f"   Query: \"{sc['message'][:60]}...\"")
        print(f"   Decision: {decision} (Expected: {expected}) | Conf: {int(confidence*100)}%")
        if res.get("citation"):
            print(f"   Citation: [{res['citation']['article_id']}] {res['citation']['title']}")
        if res.get("missing_fields"):
            print(f"   Missing Info: {res['missing_fields'][0]['field']}")
        if res.get("escalation"):
            print(f"   Escalation: Dept={res['escalation']['recommended_department']} | Priority={res['escalation']['priority']}")

print("\n" + "="*60)
if all_pass:
    print("🎉 ALL 5 BENCHMARK SCENARIOS PASSED WITH PERFECT SCORES!")
else:
    print("⚠️ Some scenarios failed.")
