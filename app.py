#!/usr/bin/env python3
"""
Clarivo — Customer Resolution Copilot (Track PS04, NexusTiQ24)
Single-command production entry point: starts backend REST API and serves built frontend.
Listens on port 8000 (or $PORT).
"""

import os
import sys
import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from typing import Dict, Any

# Ensure project root is in python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT_DIR)

from src.db import init_db, get_connection, get_customer, get_all_kb_articles, get_kb_article
from src.engine import run_resolution_pipeline

PORT = int(os.environ.get("PORT", 8000))
FRONTEND_DIST = os.path.join(ROOT_DIR, "dist")
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(ROOT_DIR, "frontend", "dist")

class ClarivoHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve static files from built frontend directory if it exists
        super().__init__(*args, directory=FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else ROOT_DIR, **kwargs)

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def _send_json(self, data: Any, status: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Health check
        if path == "/api/health":
            return self._send_json({"status": "healthy", "service": "Clarivo Copilot", "track_id": "PS04"})

        # Cases list
        if path == "/api/cases":
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cases ORDER BY updated_at DESC")
            cases = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return self._send_json(cases)

        # Single case details
        if path.startswith("/api/cases/"):
            case_id = path.split("/")[-1]
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                return self._send_json({"error": "Case not found"}, 404)
            case_data = dict(row)

            # Fetch customer
            customer = get_customer(case_data["customer_id"])
            # Run pipeline for full evidence breakdown
            pipeline_res = run_resolution_pipeline(
                case_data["initial_message"],
                case_data["customer_id"],
                case_id=case_id
            )
            conn.close()
            return self._send_json({
                "case": case_data,
                "customer": customer,
                "pipeline": pipeline_res
            })

        # Customers list
        if path == "/api/customers":
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM customers ORDER BY customer_id ASC")
            customers = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return self._send_json(customers)

        # Single customer
        if path.startswith("/api/customer/"):
            cust_id = path.split("/")[-1]
            cust = get_customer(cust_id)
            if not cust:
                return self._send_json({"error": "Customer not found"}, 404)
            return self._send_json(cust)

        # KB articles
        if path == "/api/kb":
            articles = get_all_kb_articles()
            category = query.get("category", [None])[0]
            if category:
                articles = [a for a in articles if a["category"] == category]
            return self._send_json(articles)

        # Benchmark scenarios
        if path == "/api/scenarios":
            scenarios_file = os.path.join(ROOT_DIR, "data", "scenarios.json")
            if os.path.exists(scenarios_file):
                with open(scenarios_file, "r", encoding="utf-8") as f:
                    return self._send_json(json.load(f))
            return self._send_json([])

        # Static assets / SPA fallback
        if os.path.exists(FRONTEND_DIST):
            file_path = os.path.join(FRONTEND_DIST, path.lstrip("/"))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return super().do_GET()
            # SPA Fallback: serve index.html
            index_file = os.path.join(FRONTEND_DIST, "index.html")
            if os.path.exists(index_file):
                with open(index_file, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            payload = json.loads(post_body)
        except Exception:
            payload = {}

        # Simulate / Analyze Customer Message
        if path == "/api/simulate":
            customer_id = payload.get("customer_id")
            message = payload.get("message")
            if not customer_id or not message:
                return self._send_json({"error": "customer_id and message are required"}, 400)

            try:
                res = run_resolution_pipeline(message, customer_id, case_id=payload.get("case_id"))

                # Persist or update case in SQLite
                conn = get_connection()
                cursor = conn.cursor()
                cursor.execute("""
                INSERT OR REPLACE INTO cases (
                    case_id, customer_id, customer_name, issue_title, initial_message,
                    status, intent, confidence, decision, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                """, (
                    res["case_id"],
                    res["customer_id"],
                    res["customer"]["name"],
                    message[:60],
                    message,
                    "RESOLVED_DRAFT" if res["decision"] == "RESOLUTION" else ("AWAITING_INFO" if res["decision"] == "MISSING_INFO" else "ESCALATED"),
                    res["intent"],
                    res["confidence"],
                    res["decision"]
                ))
                conn.commit()
                conn.close()

                return self._send_json(res)
            except Exception as e:
                return self._send_json({"error": str(e)}, 500)

        # Action on case (approve, dispatch, escalate)
        if path.startswith("/api/cases/") and path.endswith("/action"):
            case_id = path.split("/")[-2]
            action = payload.get("action") # 'APPROVE' | 'SEND_CLARIFICATION' | 'CONFIRM_ESCALATION'
            notes = payload.get("notes", "")

            conn = get_connection()
            cursor = conn.cursor()
            new_status = "RESOLVED_DRAFT"
            if action == "APPROVE":
                new_status = "RESOLVED"
            elif action == "SEND_CLARIFICATION":
                new_status = "AWAITING_INFO"
            elif action == "CONFIRM_ESCALATION":
                new_status = "ESCALATED"

            cursor.execute("UPDATE cases SET status = ?, updated_at = datetime('now') WHERE case_id = ?", (new_status, case_id))
            conn.commit()
            conn.close()
            return self._send_json({"case_id": case_id, "status": new_status, "action": action, "notes": notes})

        return self._send_json({"error": "Endpoint not found"}, 404)

def run_server():
    init_db()
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, ClarivoHandler)
    print(f"===========================================================")
    print(f"  Clarivo Customer Resolution Copilot (Track PS04)")
    print(f"  Serving on http://0.0.0.0:{PORT}")
    print(f"  Frontend Directory: {FRONTEND_DIST}")
    print(f"===========================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
