import React, { useState } from 'react';
import { PipelineOutput, CaseSummary } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  User,
  Wifi,
  CreditCard,
  History,
  Send,
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CaseDetailProps {
  currentCase: CaseSummary | null;
  pipelineData: PipelineOutput | null;
  isLoading: boolean;
  onApplyAction: (action: 'APPROVE' | 'SEND_CLARIFICATION' | 'CONFIRM_ESCALATION') => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({
  currentCase,
  pipelineData,
  isLoading,
  onApplyAction,
}) => {
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-12 text-center shadow-xs">
        <div className="animate-spin w-8 h-8 border-3 border-stone-800 border-t-transparent rounded-full mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-stone-900">Executing Grounded Pipeline...</h3>
        <p className="text-xs text-stone-600 mt-1">
          Evaluating safety triggers, retrieving knowledge vectors, and verifying ledger facts.
        </p>
      </div>
    );
  }

  if (!pipelineData || !currentCase) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-12 text-center shadow-xs text-stone-600">
        <FileText className="w-10 h-10 mx-auto text-stone-300 mb-3" />
        <h3 className="text-sm font-semibold text-stone-900">No Case Selected</h3>
        <p className="text-xs text-stone-600 mt-1">
          Select an active case from the queue on the left or run a benchmark scenario from the top banner.
        </p>
      </div>
    );
  }

  const { customer, decision, confidence, confidence_breakdown, evidence_chain, citation, escalation, missing_fields, audit_trail, draft_response } = pipelineData;

  const handleCopy = () => {
    navigator.clipboard.writeText(draft_response);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP DECISION BANNER */}
      <div
        className={`border rounded-xl p-4 shadow-xs transition-all ${
          decision === 'RESOLUTION'
            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            : decision === 'MISSING_INFO'
            ? 'bg-amber-50/70 border-amber-300 text-amber-950'
            : 'bg-rose-50/70 border-rose-300 text-rose-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                decision === 'RESOLUTION'
                  ? 'bg-emerald-600 text-white'
                  : decision === 'MISSING_INFO'
                  ? 'bg-amber-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {decision === 'RESOLUTION' && <CheckCircle2 className="w-5 h-5" />}
              {decision === 'MISSING_INFO' && <AlertCircle className="w-5 h-5" />}
              {decision === 'ESCALATE' && <AlertTriangle className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-bold opacity-75">
                  Pipeline Triage Decision
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                  {currentCase.case_id}
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight mt-0.5">
                {decision === 'RESOLUTION' && 'Automated Resolution Approved (Evidence Verified)'}
                {decision === 'MISSING_INFO' && 'Missing Essential Information (Refusing to Guess)'}
                {decision === 'ESCALATE' && 'Priority Escalation to Human Specialist Desk'}
              </h2>
              <p className="text-xs opacity-85 mt-0.5 max-w-2xl">
                {decision === 'RESOLUTION' &&
                  'All required ledger fields and policy preconditions match with verified citation. Ready for agent dispatch.'}
                {decision === 'MISSING_INFO' &&
                  'A critical diagnostic parameter is unknown. The copilot has generated a targeted clarifying question.'}
                {decision === 'ESCALATE' &&
                  (escalation?.reason || 'Deterministically escalated per support SLA invariants.')}
              </p>
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="bg-white/90 backdrop-blur-xs border border-current/20 rounded-lg p-2.5 shrink-0 min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700">Deterministic Confidence</span>
              <span className="font-mono font-bold text-sm text-stone-900">
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  confidence >= 0.85
                    ? 'bg-emerald-600'
                    : confidence >= 0.65
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.round(confidence * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-600 mt-1 line-clamp-1">
              {confidence_breakdown?.formula_explanation || 'Evidence weight calculation'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. CUSTOMER CONTEXT & ACCOUNT CARD */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-stone-600" />
            <h3 className="font-semibold text-xs text-stone-900 uppercase tracking-wider">
              Verified Customer Ledger ({customer.customer_id})
            </h3>
          </div>
          <span className="text-xs text-stone-600">
            Tenure: <strong className="text-stone-800">{customer.tenure_months} months</strong> • {customer.city}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-stone-600 uppercase font-medium block">Active Broadband Plan</span>
            <span className="font-semibold text-stone-900 text-sm block mt-0.5">{customer.plan_name}</span>
            <span className="text-[11px] text-stone-600">₹{customer.monthly_rental} / month</span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-stone-600 uppercase font-medium block">Billing Ledger</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  customer.billing_status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : customer.billing_status === 'OVERDUE'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {customer.billing_status}
              </span>
              <span className="font-bold text-stone-900">₹{customer.current_balance}</span>
            </div>
            <span className="text-[11px] text-stone-600">Last paid: {customer.last_payment_date}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-stone-600 uppercase font-medium block">Premises Hardware</span>
            <span className="font-semibold text-stone-900 block mt-0.5">{customer.router_model}</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  customer.router_status === 'ONLINE'
                    ? 'bg-emerald-500'
                    : customer.router_status === 'OFFLINE'
                    ? 'bg-rose-500'
                    : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="font-mono text-[11px] text-stone-700">Link: {customer.router_status}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-stone-600 uppercase font-medium block">Recent Ticket History</span>
            <span className="font-semibold text-stone-900 text-sm block mt-0.5">
              {customer.recent_tickets.length} total logged
            </span>
            <span className="text-[11px] text-stone-600">
              {customer.recent_tickets.filter((t) => t.status === 'OPEN').length} currently open
            </span>
          </div>
        </div>

        {/* Prior Tickets Warning if repeated */}
        {customer.recent_tickets.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center space-x-2 text-[11px] text-stone-600">
            <History className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="font-medium text-stone-700">Latest Ticket:</span>
            <span className="font-mono">{customer.recent_tickets[0].ticket_id}</span>
            <span>—</span>
            <span className="truncate italic">"{customer.recent_tickets[0].notes}"</span>
          </div>
        )}
      </div>

      {/* 3. "WHAT DOES THE AI NOT KNOW?" PANEL (CRITICAL FOR MISSING_INFO) */}
      {decision === 'MISSING_INFO' && missing_fields.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-amber-950">
                  What does the AI NOT know? (Information Gap Identified)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Zero Guessing Policy
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                The resolution copilot refuses to guess diagnostic etiology when physical telemetry is unconfirmed.
              </p>

              <div className="mt-3 bg-white/90 border border-amber-200 rounded-lg p-3 space-y-2">
                {missing_fields.map((mf, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                        Missing: {mf.field}
                      </span>
                      <span className="text-stone-600 font-medium">Why it matters: {mf.why_needed}</span>
                    </div>
                    <div className="mt-2 pl-3 border-l-2 border-amber-500 bg-amber-50/50 py-1.5 px-2 rounded-r">
                      <span className="text-[11px] font-semibold text-amber-950 uppercase tracking-wider block">
                        Target Clarifying Question to Customer:
                      </span>
                      <p className="text-xs text-stone-900 font-medium mt-0.5">"{mf.suggested_question}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SMART HUMAN ESCALATION HANDOVER BRIEF (CRITICAL FOR ESCALATE) */}
      {decision === 'ESCALATE' && escalation && (
        <div className="bg-rose-50/80 border border-rose-300 rounded-xl p-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-rose-950">
                    Smart Human Handover Brief (Customer Never Repeats Themselves)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                    {escalation.priority}
                  </span>
                </div>
                <span className="text-xs font-semibold text-rose-900">
                  Target: {escalation.recommended_department}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Established Facts */}
                <div className="bg-white/90 border border-rose-200 rounded-lg p-3">
                  <span className="font-bold text-stone-900 text-[11px] uppercase tracking-wider flex items-center space-x-1 mb-1.5 text-rose-950">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Established Facts (Verified)</span>
                  </span>
                  <ul className="space-y-1 text-stone-700 list-disc pl-4 text-[11px]">
                    {escalation.established_facts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>

                {/* What Was Already Tried */}
                <div className="bg-white/90 border border-rose-200 rounded-lg p-3">
                  <span className="font-bold text-stone-900 text-[11px] uppercase tracking-wider flex items-center space-x-1 mb-1.5 text-rose-950">
                    <History className="w-3.5 h-3.5 text-stone-600" />
                    <span>Already Tried (Do Not Re-Ask)</span>
                  </span>
                  <ul className="space-y-1 text-stone-700 list-disc pl-4 text-[11px]">
                    {escalation.already_tried.map((tried, idx) => (
                      <li key={idx}>{tried}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agent Starting Action */}
              <div className="mt-3 bg-rose-100/70 border border-rose-300/80 rounded-lg p-2.5 text-xs">
                <span className="font-bold text-rose-950 text-[11px] uppercase tracking-wider block">
                  Recommended Agent Starting Action:
                </span>
                <p className="text-rose-950 font-medium mt-0.5">{escalation.agent_starting_action}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EVIDENCE CHAIN (VISIBLE REASONING GRAPH) */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-stone-700" />
            <h3 className="font-semibold text-xs text-stone-900 uppercase tracking-wider">
              Evidence Chain (Auditable Step-by-Step Reasoning Trace)
            </h3>
          </div>
          <span className="text-[11px] text-stone-600">5-Stage Deterministic Flow</span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {evidence_chain.map((node, idx) => {
            const statusConfig = {
              SUPPORTED: {
                border: 'border-emerald-300 bg-emerald-50/40 text-emerald-950',
                dot: 'bg-emerald-600 ring-4 ring-emerald-100',
                badge: 'bg-emerald-100 text-emerald-800',
              },
              MISSING: {
                border: 'border-amber-300 bg-amber-50/40 text-amber-950',
                dot: 'bg-amber-500 ring-4 ring-amber-100',
                badge: 'bg-amber-100 text-amber-800',
              },
              CONFLICT: {
                border: 'border-rose-300 bg-rose-50/40 text-rose-950',
                dot: 'bg-rose-600 ring-4 ring-rose-100',
                badge: 'bg-rose-100 text-rose-800',
              },
              TRIGGERED: {
                border: 'border-rose-300 bg-rose-50/40 text-rose-950',
                dot: 'bg-rose-600 ring-4 ring-rose-100',
                badge: 'bg-rose-100 text-rose-800',
              },
            }[node.status];

            return (
              <div key={idx} className="relative group">
                <span
                  className={`absolute -left-[1.65rem] top-1.5 w-2.5 h-2.5 rounded-full ${statusConfig.dot}`}
                />
                <div className={`p-3 rounded-lg border text-xs ${statusConfig.border}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-stone-600 font-mono">
                        Stage {idx + 1}: {node.step}
                      </span>
                      <span className="font-semibold text-stone-900">{node.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-stone-600">Source: {node.source}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${statusConfig.badge}`}>
                        {node.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-stone-800 leading-relaxed font-sans mt-0.5">{node.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. COPILOT DRAFT RESPONSE & CITATION */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-xs text-stone-900 uppercase tracking-wider">
              Copilot Grounded Response Draft (Citations Verified)
            </h3>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
          >
            {copiedDraft ? 'Copied to Clipboard!' : 'Copy Draft'}
          </button>
        </div>

        {/* Official Citation Badge */}
        {citation && citation.article_id && (
          <div className="mb-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex items-start space-x-2.5 text-xs">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {citation.article_id}
                </span>
                <span className="font-semibold text-stone-900">{citation.title}</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-600 px-1.5 py-0.5 rounded bg-stone-200/70 font-medium">
                  {citation.category}
                </span>
              </div>
              <p className="text-stone-600 text-[11px] mt-1 italic">"{citation.excerpt}"</p>
            </div>
          </div>
        )}

        {/* Draft text */}
        <div className="p-3.5 rounded-lg bg-stone-50/90 border border-stone-200/80 text-xs leading-relaxed text-stone-900 whitespace-pre-wrap font-sans">
          {draft_response}
        </div>

        {/* Agent Action Controls */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-stone-600">Review and apply resolution action:</span>

          <div className="flex items-center space-x-2">
            {decision === 'RESOLUTION' && (
              <button
                onClick={() => onApplyAction('APPROVE')}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Send to Customer</span>
              </button>
            )}

            {decision === 'MISSING_INFO' && (
              <button
                onClick={() => onApplyAction('SEND_CLARIFICATION')}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Clarification Request</span>
              </button>
            )}

            {decision === 'ESCALATE' && (
              <button
                onClick={() => onApplyAction('CONFIRM_ESCALATION')}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Confirm Escalation & Route</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7. COLLAPSIBLE REAL-TIME AUDIT TRAIL */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <button
          onClick={() => setShowAuditTrail(!showAuditTrail)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-stone-800 bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-stone-600" />
            <span>Execution Audit Trail & Event Logs ({audit_trail.length} events)</span>
          </div>
          {showAuditTrail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAuditTrail && (
          <div className="p-3.5 divide-y divide-stone-100 text-xs font-mono max-h-60 overflow-y-auto">
            {audit_trail.map((entry, idx) => (
              <div key={idx} className="py-1.5 flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <span className="text-[10px] text-stone-600">{entry.timestamp.slice(11, 19)}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      entry.status === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : entry.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {entry.stage}
                  </span>
                  <span className="text-stone-700">{entry.details}</span>
                </div>
                {entry.latency_ms !== undefined && (
                  <span className="text-[10px] text-stone-600 shrink-0 ml-2">{entry.latency_ms}ms</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
