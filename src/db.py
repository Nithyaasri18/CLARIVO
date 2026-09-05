#!/usr/bin/env python3
"""
Clarivo Database Manager (Track PS04)
Initializes and manages the local SQLite database for customer accounts,
knowledge base articles, support tickets, and audit trails.
"""

import os
import json
import sqlite3
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "resolveiq.db")
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def get_connection(db_path: str = DB_PATH) -> sqlite3.Connection:
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path: str = DB_PATH) -> None:
    conn = get_connection(db_path)
    cursor = conn.cursor()

    # 1. Customers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        monthly_rental INTEGER NOT NULL,
        billing_status TEXT NOT NULL,
        current_balance REAL NOT NULL,
        last_payment_date TEXT NOT NULL,
        router_model TEXT NOT NULL,
        router_status TEXT NOT NULL,
        tenure_months INTEGER NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL
    );
    """)

    # 2. Tickets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
        ticket_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        notes TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    );
    """)

    # 3. KB Articles Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS kb_articles (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        applies_to TEXT NOT NULL, -- JSON array
        required_fields TEXT NOT NULL, -- JSON array
        keywords TEXT NOT NULL -- JSON array
    );
    """)

    # 4. Cases / Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        case_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        issue_title TEXT NOT NULL,
        initial_message TEXT NOT NULL,
        status TEXT NOT NULL, -- 'RESOLVED_DRAFT' | 'AWAITING_INFO' | 'ESCALATED' | 'IN_PROGRESS'
        intent TEXT,
        confidence REAL,
        decision TEXT, -- 'RESOLUTION' | 'MISSING_INFO' | 'ESCALATE'
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    );
    """)

    # 5. Case Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS case_messages (
        message_id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        sender TEXT NOT NULL, -- 'customer' | 'ai' | 'agent'
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        structured_payload TEXT, -- JSON representation of decision/evidence/handover
        FOREIGN KEY (case_id) REFERENCES cases (case_id)
    );
    """)

    # 6. Audit Trail Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT,
        timestamp TEXT NOT NULL,
        stage TEXT NOT NULL, -- 'INTENT' | 'ACCOUNT_LOOKUP' | 'RETRIEVAL' | 'VALIDATION' | 'DECISION' | 'ESCALATION'
        details TEXT NOT NULL,
        status TEXT NOT NULL -- 'SUCCESS' | 'WARNING' | 'FLAGGED'
    );
    """)

    conn.commit()

    # Seed initial datasets if empty
    seed_data(conn)
    conn.close()

def seed_data(conn: sqlite3.Connection) -> None:
    cursor = conn.cursor()

    # Check if customers seeded
    cursor.execute("SELECT COUNT(*) FROM customers")
    if cursor.fetchone()[0] == 0:
        customers_file = os.path.join(DATA_DIR, "customers.json")
        if os.path.exists(customers_file):
            with open(customers_file, "r", encoding="utf-8") as f:
                customers = json.load(f)
            for c in customers:
                cursor.execute("""
                INSERT INTO customers (
                    customer_id, name, phone, email, plan_id, plan_name, monthly_rental,
                    billing_status, current_balance, last_payment_date, router_model,
                    router_status, tenure_months, address, city
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    c["customer_id"], c["name"], c["phone"], c["email"], c["plan_id"],
                    c["plan_name"], c["monthly_rental"], c["billing_status"],
                    c["current_balance"], c["last_payment_date"], c["router_model"],
                    c["router_status"], c["tenure_months"], c["address"], c["city"]
                ))
                # Insert recent tickets
                for t in c.get("recent_tickets", []):
                    cursor.execute("""
                    INSERT OR IGNORE INTO tickets (
                        ticket_id, customer_id, category, status, created_at, notes
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        t["ticket_id"], c["customer_id"], t["category"], t["status"],
                        t["created_at"], t["notes"]
                    ))

    # Check if kb_articles seeded
    cursor.execute("SELECT COUNT(*) FROM kb_articles")
    if cursor.fetchone()[0] == 0:
        kb_file = os.path.join(DATA_DIR, "kb_articles.json")
        if os.path.exists(kb_file):
            with open(kb_file, "r", encoding="utf-8") as f:
                articles = json.load(f)
            for a in articles:
                cursor.execute("""
                INSERT INTO kb_articles (
                    id, category, title, body, applies_to, required_fields, keywords
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    a["id"], a["category"], a["title"], a["body"],
                    json.dumps(a["applies_to"]), json.dumps(a["required_fields"]),
                    json.dumps(a["keywords"])
                ))

    # Seed default benchmark demo cases
    cursor.execute("SELECT COUNT(*) FROM cases")
    if cursor.fetchone()[0] == 0:
        demo_cases = [
            ("CASE-1044", "C1044", "Ananya Iyer", "Internet suspended - overdue bill query",
             "Why is my internet down today? Did I miss a payment?",
             "RESOLVED_DRAFT", "BILLING", 0.94, "RESOLUTION", "2026-09-05 08:10:00", "2026-09-05 08:10:02"),
            ("CASE-1042", "C1042", "Priya Sharma", "Internet outage - router status unconfirmed",
             "My internet stopped working yesterday afternoon. Nothing loads on my phone or laptop.",
             "AWAITING_INFO", "CONNECTIVITY_OUTAGE", 0.68, "MISSING_INFO", "2026-09-05 08:12:00", "2026-09-05 08:12:02"),
            ("CASE-1045", "C1045", "Vikram Malhotra", "Unresolved 3-day outage + legal escalation notice",
             "I've already called support 3 times and nobody showed up. If my line isn't restored today, I am filing a formal legal complaint with the consumer court.",
             "ESCALATED", "CONNECTIVITY_OUTAGE", 0.99, "ESCALATE", "2026-09-05 08:14:00", "2026-09-05 08:14:01"),
            ("CASE-1046", "C1046", "Sneha Patel", "Unsupported PBX SIP trunking inquiry",
             "How do I configure custom SIP trunking credentials on my ONT for an external Grandstream IP-PBX system?",
             "ESCALATED", "OUT_OF_SCOPE", 0.40, "ESCALATE", "2026-09-05 08:16:00", "2026-09-05 08:16:01"),
            ("CASE-1047", "C1047", "Amit Kulkarni", "Billing dispute ₹1,499 vs plan ₹999",
             "You billed me ₹1,499 this month, but my plan is only ₹999. Why am I being overcharged?",
             "ESCALATED", "BILLING", 0.92, "ESCALATE", "2026-09-05 08:18:00", "2026-09-05 08:18:02")
        ]
        for case in demo_cases:
            cursor.execute("""
            INSERT INTO cases (
                case_id, customer_id, customer_name, issue_title, initial_message,
                status, intent, confidence, decision, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, case)

    conn.commit()

def get_customer(customer_id: str, db_path: str = DB_PATH) -> Optional[Dict[str, Any]]:
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    customer = dict(row)
    # Fetch recent tickets
    cursor.execute("SELECT * FROM tickets WHERE customer_id = ? ORDER BY created_at DESC", (customer_id,))
    customer["recent_tickets"] = [dict(t) for t in cursor.fetchall()]
    conn.close()
    return customer

def get_kb_article(article_id: str, db_path: str = DB_PATH) -> Optional[Dict[str, Any]]:
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM kb_articles WHERE id = ?", (article_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    article = dict(row)
    article["applies_to"] = json.loads(article["applies_to"])
    article["required_fields"] = json.loads(article["required_fields"])
    article["keywords"] = json.loads(article["keywords"])
    return article

def get_all_kb_articles(db_path: str = DB_PATH) -> List[Dict[str, Any]]:
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM kb_articles ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    articles = []
    for r in rows:
        a = dict(r)
        a["applies_to"] = json.loads(a["applies_to"])
        a["required_fields"] = json.loads(a["required_fields"])
        a["keywords"] = json.loads(a["keywords"])
        articles.append(a)
    return articles

if __name__ == "__main__":
    init_db()
    print("Clarivo SQLite database initialized and seeded successfully.")
