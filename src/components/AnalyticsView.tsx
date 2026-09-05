import React from 'react';
import { BarChart3, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, Clock, FileCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div id="clarivo-analytics-view" className="flex-1 p-6 bg-white overflow-y-auto select-none text-stone-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#0F4C5C]" />
            <h1 className="text-base font-bold uppercase tracking-wider text-stone-900">
              Operations Telemetry & SLA Grounding
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time audit metrics for deterministic customer support resolution
          </p>
        </div>

        {/* 4 Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#E5E3DD]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Deterministic Invariant
            </div>
            <div className="text-xl font-bold font-mono text-[#15803D] mt-1">100.0%</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Zero ungrounded assertions</div>
          </div>

          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#E5E3DD]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Evidence Grounding
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">94.2%</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Average policy coverage</div>
          </div>

          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#E5E3DD]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              First-Contact Resolution
            </div>
            <div className="text-xl font-bold font-mono text-[#0F4C5C] mt-1">78.4%</div>
            <div className="text-[10px] text-stone-500 mt-0.5">+14% vs baseline tier-1</div>
          </div>

          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#E5E3DD]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Avg SLA Turnaround
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">3.2m</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Case creation to dispatch</div>
          </div>
        </div>

        {/* Decision Breakdown */}
        <div className="bg-[#FAF9F5] p-4 rounded border border-[#E5E3DD] space-y-3 text-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Decision Distribution by Pipeline Guardrail
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-stone-700">Supported Direct Resolutions</span>
                <span className="font-mono text-stone-900 font-semibold">62% (148 cases)</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#15803D]" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-stone-700">Needs Information (Single-Signal Prompt)</span>
                <span className="font-mono text-stone-900 font-semibold">23% (55 cases)</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#D97706]" style={{ width: '23%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-stone-700">Safe Human Escalations (Handover Generated)</span>
                <span className="font-mono text-stone-900 font-semibold">15% (36 cases)</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#B91C1C]" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Invariant Verification Log */}
        <div className="border border-stone-200 rounded p-4 space-y-2 text-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#0F4C5C]" />
            <span>Audit Invariants Enforced by Clarivo Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="p-2 rounded bg-stone-50 border border-stone-200">
              <span className="font-semibold text-stone-800">1. Refusal to Guess:</span> If customer hardware status is UNKNOWN, copilot refuses to recommend field dispatch without asking for router LOS status.
            </div>
            <div className="p-2 rounded bg-stone-50 border border-stone-200">
              <span className="font-semibold text-stone-800">2. Deterministic Safety Gate:</span> Explicit distress or legal complaints bypass vector retrieval and route to P1 Executive Escalations.
            </div>
            <div className="p-2 rounded bg-stone-50 border border-stone-200">
              <span className="font-semibold text-stone-800">3. Ledger Consistency:</span> Billing disputes trigger catalog price checks to detect discrepancies before generating agent drafts.
            </div>
            <div className="p-2 rounded bg-stone-50 border border-stone-200">
              <span className="font-semibold text-stone-800">4. Grounding Citations:</span> Every drafted sentence includes citation references matching verified knowledge articles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
