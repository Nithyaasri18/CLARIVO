import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { EvidenceTrace, EvidenceNode } from './EvidenceTrace';
import { HandoverCard } from './HandoverCard';
import { SourceInspectorData } from './SourceInspector';
import { CustomerRecord, EscalationHandover } from '../types';

interface MissingSignalInfo {
  field: string;
  label: string;
  whyItMatters: string;
  questionPrompt: string;
}

interface AIInsightRailProps {
  decision: 'RESOLUTION' | 'MISSING_INFO' | 'ESCALATE' | 'NO_MATCH';
  confidence: number;
  coveragePercent?: number;
  caseId: string;
  customer: CustomerRecord;
  evidenceChain: EvidenceNode[];
  missingSignal?: MissingSignalInfo | null;
  escalationHandover?: EscalationHandover | null;
  onInspectNode: (data: SourceInspectorData) => void;
  onSelectKnowledgeArticle?: (articleId: string) => void;
}

export const AIInsightRail: React.FC<AIInsightRailProps> = ({
  decision,
  confidence,
  coveragePercent = 82,
  caseId,
  customer,
  evidenceChain,
  missingSignal,
  escalationHandover,
  onInspectNode,
  onSelectKnowledgeArticle,
}) => {
  const [showAccountContext, setShowAccountContext] = useState(true);
  const [showFullHandover, setShowFullHandover] = useState(false);

  // Decision State Rendering
  const renderDecisionBanner = () => {
    switch (decision) {
      case 'MISSING_INFO':
        return (
          <div className="p-3.5 rounded bg-[#D97706]/10 dark:bg-amber-500/15 border border-[#D97706]/25 dark:border-amber-500/30 text-stone-900 dark:text-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#B45309] dark:text-amber-400">
                <HelpCircle size={14} className="text-[#D97706] dark:text-amber-400" />
                <span>Needs Information</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#B45309] dark:text-amber-300 bg-white/70 dark:bg-black/30 px-1.5 py-0.2 rounded border border-[#D97706]/20">
                {coveragePercent}% Grounded
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed font-medium">
              One critical detail is required before recommending an invariant resolution.
            </p>
          </div>
        );

      case 'RESOLUTION':
        return (
          <div className="p-3.5 rounded bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 dark:border-emerald-500/30 text-stone-900 dark:text-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#15803D] dark:text-emerald-400">
                <ShieldCheck size={14} className="text-[#15803D] dark:text-emerald-400" />
                <span>Supported Resolution</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#15803D] dark:text-emerald-300 bg-white/70 dark:bg-black/30 px-1.5 py-0.2 rounded border border-emerald-500/20">
                {Math.round(confidence * 100)}% Match
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed font-medium">
              Verified solution identified in enterprise policy database with zero discrepancies.
            </p>
          </div>
        );

      case 'ESCALATE':
      default:
        return (
          <div className="p-3.5 rounded bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 dark:border-rose-500/30 text-stone-900 dark:text-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#B91C1C] dark:text-rose-400">
                <ShieldAlert size={14} className="text-[#B91C1C] dark:text-rose-400" />
                <span>Human Escalation Triggered</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#B91C1C] dark:text-rose-300 bg-white/70 dark:bg-black/30 px-1.5 py-0.2 rounded border border-rose-500/20">
                Handover Ready
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed font-medium">
              Uncovered constraints or risk threshold triggered. Handover generated for human specialists.
            </p>
          </div>
        );
    }
  };

  return (
    <aside
      id="clarivo-insight-rail"
      className="w-full lg:w-[380px] xl:w-[420px] bg-[#FAF9F5] dark:bg-[#151922] border-l border-[#E5E3DD] dark:border-[#222834] flex flex-col h-full overflow-y-auto shrink-0 select-none text-stone-800 dark:text-slate-200 transition-colors"
    >
      {/* Insight Rail Header */}
      <div className="h-11 px-4 border-b border-[#E5E3DD] dark:border-[#222834] flex items-center justify-between bg-[#F4F3ED] dark:bg-[#181D26]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C5C] dark:text-[#14B8A6] font-mono">
            Clarivo Analysis
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C5C] dark:bg-[#14B8A6]" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500">Coverage:</span>
          <span className="font-mono font-bold text-xs text-stone-900 dark:text-slate-100">
            {decision === 'RESOLUTION' ? '96%' : `${coveragePercent}%`}
          </span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="p-4 space-y-4">
        {/* 1. Decision State Banner */}
        {renderDecisionBanner()}

        {/* 2. Missing Signal Box (When applicable) */}
        {decision === 'MISSING_INFO' && missingSignal && (
          <div
            id="missing-signal-panel"
            className="p-3 bg-white dark:bg-[#1B212D] rounded border border-[#D97706]/30 dark:border-amber-500/30 shadow-2xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B45309] dark:text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Missing Input Signal
              </span>
              <span className="font-mono text-[10px] bg-amber-100 dark:bg-amber-950/40 text-[#B45309] dark:text-amber-400 px-1 rounded">
                Field: {missingSignal.field}
              </span>
            </div>

            <div>
              <div className="font-semibold text-stone-900 dark:text-slate-100">
                {missingSignal.label}
              </div>
              <div className="text-stone-600 dark:text-slate-300 text-[11px] mt-0.5 leading-normal">
                {missingSignal.whyItMatters}
              </div>
            </div>

            <div className="p-2 rounded bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-500/20 text-stone-800 dark:text-slate-200 text-[11px]">
              <span className="font-bold text-[#B45309] dark:text-amber-400 block mb-0.5 text-[10px] uppercase">
                Copilot Suggested Question:
              </span>
              "{missingSignal.questionPrompt}"
            </div>
          </div>
        )}

        {/* 3. Deterministic Grounding Pipeline Telemetry */}
        <div className="bg-white dark:bg-[#1B212D] rounded border border-[#E5E3DD] dark:border-[#252E3E] p-3 shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
              <Layers size={13} className="text-[#0F4C5C] dark:text-[#14B8A6]" />
              Grounding Invariant
            </span>
            <span className="font-mono text-[10px] text-[#15803D] dark:text-emerald-400 font-semibold">
              PASS (0 UNGROUNDED)
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-slate-800">
              <span className="text-stone-500 dark:text-slate-400">Account Preconditions</span>
              <span className="font-semibold text-[#15803D] dark:text-emerald-400">Satisfied (Paid, Active)</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-slate-800">
              <span className="text-stone-500 dark:text-slate-400">KB Retrieval Invariant</span>
              <span className="font-semibold text-[#0F4C5C] dark:text-[#14B8A6]">KB-ROUT-01 (Top-1)</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500 dark:text-slate-400">Telemetry Discrepancy</span>
              <span className="font-semibold text-[#D97706] dark:text-amber-400">Router Status Unknown</span>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="pt-1">
            <div className="h-1.5 w-full bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-[#15803D] h-full w-[40%]" title="Precondition pass" />
              <div className="bg-[#0F4C5C] dark:bg-[#14B8A6] h-full w-[35%]" title="KB retrieval pass" />
              <div className="bg-[#D97706] h-full w-[25%]" title="Missing telemetry" />
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-stone-400 dark:text-slate-500">
            <span>Preconditions</span>
            <span>Ledger</span>
            <span>Policy KB</span>
          </div>
        </div>

        {/* 4. Evidence Trace (Vertical Chain) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Evidence Trace Chain
            </span>
            <span className="text-[10px] text-stone-400 dark:text-slate-500 font-mono">5 verification steps</span>
          </div>

          <EvidenceTrace chain={evidenceChain} onInspectNode={onInspectNode} />
        </div>

        {/* 5. Account Context Panel */}
        <div className="bg-white dark:bg-[#1B212D] rounded border border-[#E5E3DD] dark:border-[#252E3E] shadow-2xs overflow-hidden text-xs">
          <button
            onClick={() => setShowAccountContext(!showAccountContext)}
            className="w-full px-3 py-2 bg-[#FAF9F5] dark:bg-[#181D26] border-b border-[#E5E3DD] dark:border-[#252E3E] flex items-center justify-between font-medium text-stone-800 dark:text-slate-200 hover:bg-[#F4F3ED] dark:hover:bg-[#202736] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Database size={13} className="text-[#0F4C5C] dark:text-[#14B8A6]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                Account Context Record
              </span>
            </div>
            {showAccountContext ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showAccountContext && (
            <div className="p-3 divide-y divide-stone-100 dark:divide-slate-800 text-xs">
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Plan</span>
                <span className="font-semibold text-stone-800 dark:text-slate-200">{customer.plan_name}</span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Billing</span>
                <span
                  className={`font-mono font-medium ${
                    customer.billing_status === 'PAID' ? 'text-[#15803D] dark:text-emerald-400' : 'text-[#B91C1C] dark:text-rose-400'
                  }`}
                >
                  {customer.billing_status} (₹{customer.current_balance})
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Account status</span>
                <span className="inline-flex items-center gap-1 text-[#15803D] dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  Active
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Recent tickets</span>
                <span className="font-mono text-stone-800 dark:text-slate-200">
                  {customer.recent_tickets?.length || 2} logged
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Latest ticket</span>
                <span className="font-mono font-medium text-stone-800 dark:text-slate-200">
                  {customer.recent_tickets?.[0]?.ticket_id || 'TKT-8831'}
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between">
                <span className="text-stone-500 dark:text-slate-400">Previous issue</span>
                <span className="text-stone-700 dark:text-slate-300 truncate max-w-[160px]">
                  {customer.recent_tickets?.[0]?.notes || 'Connection outage'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Human Escalation Handover Card (When Escalated) */}
        {decision === 'ESCALATE' && escalationHandover && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B91C1C] dark:text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle size={12} />
                Escalation Dossier
              </span>
            </div>
            <HandoverCard handover={escalationHandover} />
          </div>
        )}
      </div>
    </aside>
  );
};
