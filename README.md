TRACK_ID=PS04<br>
VALIDATION_KEY=PS04
# Clarivo — Intelligent Support Resolution System

> **PS04 Challenge Solution**: Evidence-Grounded Customer Resolution Copilot for broadband, fiber, and telecom customer support operations.

**Tagline**: *Clarity before resolution.*  
**Secondary descriptor**: Evidence-Grounded Customer Resolution Copilot

Clarivo rejects the "hallucinating conversational chatbot" model in favor of an **editorial, deterministic resolution copilot**. It strictly separates probabilistic LLM classification from auditable business invariants, verifies every assertion against real customer accounts and knowledge base citations, exposes an auditable step-by-step evidence chain, identifies missing diagnostic signals ("What does the AI NOT know?"), and generates structured human handover briefs so customers never have to repeat themselves.

---

## 🏆 Core Capabilities & Evaluation Criteria

| Evaluation Criteria | Weight | Clarivo Implementation |
| :--- | :---: | :--- |
| **Grounded Reasoning & Accuracy** | **35%** | 5-stage deterministic pipeline. Every resolution requires verified citation + account parameter validation. Zero ungrounded speculation. |
| **Track Alignment & Business Viability** | **30%** | Built specifically for ISP/telecom support. Pre-configured with 25 standard operating procedures (ONT diagnostics, prorated billing, grace periods, VoIP). |
| **Explainability & Transparency** | **20%** | Visible 5-node **Evidence Chain** (`CUSTOMER` → `ACCOUNT` → `KNOWLEDGE` → `REASONING` → `RECOMMENDATION`) + interactive Source Inspector. |
| **Code Craftsmanship & Reliability** | **15%** | Full-stack dual-engine: Python 3 backend (`app.py`, `src/engine.py`) and TypeScript runtime (`server.ts`, `src/engine.ts`). 100% test pass on benchmark cases. |

---

## 🔬 Benchmark Scenarios (100% Passing)

Clarivo is verified against all 5 mandatory hackathon scenarios:

| Scenario Code | Query / Problem | Expected Behavior | Clarivo Result | Key Evidence / Action |
| :--- | :--- | :--- | :---: | :--- |
| **`ROUTINE_RESOLUTION`** (Case A) | Overdue subscriber inquiring why internet is down | `RESOLUTION` | **PASS (86%)** | Cited `KB-BILL-02`. Verified ₹499 balance and past grace period. Quick-pay portal restoration. |
| **`MISSING_INFORMATION`** (Case B) | Subscriber reports connection down, no LED status | `MISSING_INFO` | **PASS (68%)** | Refuses to guess optical cut vs router fault. Identifies missing `router_los_status` & asks targeted clarifying question. |
| **`EXPLICIT_ESCALATION`** (Case C) | Multiple failed visits + consumer court threat | `ESCALATE` | **PASS (99%)** | Safety Gate intercepts prior to LLM. Escalates to Executive Escalations (P1_CRITICAL). |
| **`UNCOVERED_CASE`** | Grandstream PBX SIP trunking on residential ONT | `ESCALATE` | **PASS (40%)** | Semantic similarity below 0.65 threshold. Routes to Enterprise Voice Desk with handover. |
| **`DATA_KB_CONFLICT`** | Billed ₹1,499 for a ₹999 plan | `ESCALATE` | **PASS (92%)** | Cites `KB-BILL-03`. Reconciles ledger vs catalog; flags ₹500 anomaly to Senior Billing Desk. |

---

## 📐 Architecture & Pipeline Flow

```
   [Customer Input]
          │
          ▼
   ┌────────────────────────────────────────┐
   │ 1. Deterministic Safety Gate           │ ── (Legal threats / 3+ contacts) ──► [Immediate P1 Escalation]
   └────────────────────────────────────────┘
          │ (Clear)
          ▼
   ┌────────────────────────────────────────┐
   │ 2. Intent Classification (Hybrid)      │ (Billing, Outage, Hardware, Cancellation, Out-of-Scope)
   └────────────────────────────────────────┘
          │
          ▼
   ┌────────────────────────────────────────┐
   │ 3. Account Data Enrichment             │ (Query real subscriber ledger: balance, plan, ONT telemetry)
   └────────────────────────────────────────┘
          │
          ▼
   ┌────────────────────────────────────────┐
   │ 4. Hybrid Retrieval & Semantic Ground  │ (Dense vector embeddings + lexical token overlap)
   └────────────────────────────────────────┘
          │ (Score < 0.65 threshold) ──► [Escalate: Uncovered KB]
          ▼
   ┌────────────────────────────────────────┐
   │ 5. Deterministic Rules & Validation    │ (Account invariants, pricing catalog checks, missing fields)
   └────────────────────────────────────────┘
          │
          ├─ Missing diagnostic field? ──────► [NEEDS INFORMATION: Targeted Clarification Question]
          ├─ Ledger / Catalog conflict? ─────► [ESCALATION REQUIRED: Billing Reconciliation Handover]
          │
          ▼
   ┌────────────────────────────────────────┐
   │ 6. Resolution Synthesis & Audit Log    │ (Ground answer in exact citation, formulate evidence nodes)
   └────────────────────────────────────────┘
```

---

## 🚀 Running the Project

### Quickstart (TypeScript / Full-Stack Node Dev Server)
```bash
npm run dev
# App runs at: http://localhost:3000
```

### Running with Python Backend
```bash
python3 app.py
```

### Running Automated Benchmark Suite
```bash
python3 scripts/test_scenarios.py
python3 scripts/test_all_scenarios_http.py
```

---

## 🛡️ License
Built for the Google AI Studio PS04 Hackathon Challenge. Distributed under the MIT License.
<hr>
DEMO VIDEO---
https://drive.google.com/file/d/1daxiSpVaDvOPKDhroMy6YjFc_EOXIjVE/view?usp=sharing
