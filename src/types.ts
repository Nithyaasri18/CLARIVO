/**
 * Clarivo Core Data Types (Track PS04)
 * Strongly typed schemas for customer accounts, KB articles,
 * evidence traces, escalation handovers, and audit logs.
 */

export type CaseStatus = 'RESOLVED_DRAFT' | 'AWAITING_INFO' | 'ESCALATED' | 'IN_PROGRESS';
export type DecisionType = 'RESOLUTION' | 'MISSING_INFO' | 'ESCALATE' | 'NO_MATCH';
export type IntentType =
  | 'BILLING'
  | 'CONNECTIVITY_OUTAGE'
  | 'ROUTER_HARDWARE'
  | 'PLAN_CHANGE'
  | 'REFUND_DISPUTE'
  | 'OUT_OF_SCOPE';

export interface CustomerRecord {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  plan_id: string;
  plan_name: string;
  monthly_rental: number;
  billing_status: 'PAID' | 'OVERDUE' | 'DISPUTED' | string;
  current_balance: number;
  last_payment_date: string;
  router_model: string;
  router_status: 'ONLINE' | 'OFFLINE' | 'UNKNOWN' | string;
  tenure_months: number;
  address: string;
  city: string;
  recent_tickets: TicketRecord[];
}

export interface TicketRecord {
  ticket_id: string;
  customer_id?: string;
  category: string;
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED' | string;
  created_at: string;
  notes: string;
}

export interface KBArticle {
  id: string;
  category: string;
  title: string;
  body: string;
  applies_to?: string[];
  required_fields?: string[];
  keywords?: string[];
}

export interface EvidenceNode {
  step: 'QUESTION' | 'DATA' | 'KNOWLEDGE' | 'REASONING' | 'ANSWER';
  label: string;
  detail: string;
  source: string;
  status: 'SUPPORTED' | 'MISSING' | 'CONFLICT' | 'TRIGGERED' | 'UNSUPPORTED';
}

export interface EscalationHandover {
  reason?: string;
  trigger_reason?: string;
  trigger_type?: string;
  customer_issue?: string;
  established_facts?: string[];
  already_tried?: string[];
  missing_information?: string[];
  recommended_department?: string;
  target_department?: string;
  agent_starting_action?: string;
  suggested_action?: string;
  priority?: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | string;
  audit_hash?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  stage: 'INTENT' | 'ACCOUNT_LOOKUP' | 'RETRIEVAL' | 'VALIDATION' | 'DECISION' | 'SYNTHESIS' | string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FLAGGED' | string;
  latency_ms?: number;
}

export interface PipelineOutput {
  case_id: string;
  customer_id: string;
  customer: CustomerRecord;
  intent: IntentType;
  intent_confidence: number;
  decision: DecisionType;
  confidence: number;
  confidence_breakdown?: {
    kb_similarity?: number;
    account_field_completeness?: number;
    precondition_match?: number;
    overall?: number;
    formula_explanation?: string;
  };
  draft_response: string;
  citation: {
    article_id: string | null;
    title: string | null;
    category: string | null;
    excerpt: string | null;
  } | null;
  evidence_chain: EvidenceNode[];
  missing_fields: Array<{
    field: string;
    why_needed: string;
    suggested_question: string;
  }>;
  escalation: EscalationHandover | null;
  audit_trail: AuditLogEntry[];
}

export interface CaseSummary {
  case_id: string;
  customer_id: string;
  customer_name: string;
  issue_title: string;
  initial_message: string;
  status: CaseStatus;
  intent: IntentType;
  confidence: number;
  decision: DecisionType;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  created_at: string;
  updated_at: string;
}

export type CaseRecord = CaseSummary;

export type ThemeMode = 'light' | 'dark';

export interface CustomerAuthRecord {
  id: string;
  customer_id: string;
  email: string;
  name: string;
  phone?: string;
  password_hash: string;
  created_at: string;
}

export interface UserAuthSession {
  user: {
    id: string;
    customer_id?: string;
    employee_code?: string;
    name: string;
    email: string;
    role: 'customer' | 'employee';
    title_or_plan?: string;
  };
  token: string;
}

export interface EmployeeProfile {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  desk_location: string;
  status: 'ONLINE' | 'BREAK' | 'OFFLINE';
  avatar_initial: string;
  cases_today: number;
  sla_compliance: number;
  avg_handling_time_min: number;
  joined_date: string;
  bio?: string;
  shift_hours?: string;
  csat_score?: number;
  fcr_rate?: number;
}

