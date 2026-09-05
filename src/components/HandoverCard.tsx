import React, { useState } from 'react';
import {
  Copy,
  Check,
  UserCheck,
  AlertTriangle,
  Send,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { EscalationHandover } from '../types';

interface HandoverCardProps {
  caseId?: string;
  customerName?: string;
  handover: EscalationHandover | null;
  customerIssue?: string;
  establishedFacts?: string[];
  actionsAlreadyTaken?: string[];
  unresolvedPoints?: string[];
  whyEscalated?: string;
  nextBestAction?: string;
  onAssign?: (team: string) => void;
}

export const HandoverCard: React.FC<HandoverCardProps> = ({
  caseId = 'CLV-1044',
  customerName = 'Rahul S',
  handover,
  customerIssue = 'Internet unavailable for 3 days. Unresolved optical loss.',
  establishedFacts = ['Active Fiber 799 plan.', 'Payment successful (₹0 overdue).', 'Previous ticket TKT-8831 exists.'],
  actionsAlreadyTaken = ['Customer rebooted ONT router twice.', 'Subscriber verified power cable output.'],
  unresolvedPoints = ['Regional OLT node status unknown.', 'Optical splitter attenuation unverified.'],
  whyEscalated = 'No matching supported resolution in current verified knowledge base.',
  nextBestAction = 'Verify regional outage status and inspect ticket TKT-8831 before technician dispatch.',
  onAssign,
}) => {
  const [copied, setCopied] = useState(false);
  const [assignedTeam, setAssignedTeam] = useState<string | null>(null);

  const team = handover?.target_department || 'Network Operations Desk';
  const priority = handover?.priority || 'P1_CRITICAL';

  const fullHandoverText = `CLARIVO OPERATIONAL BRIEF
CASE: #${caseId}
CUSTOMER: ${customerName}
TARGET DESK: ${team}
PRIORITY: ${priority}

CUSTOMER ISSUE:
${customerIssue}

ESTABLISHED FACTS:
${establishedFacts.map((f) => `• ${f}`).join('\n')}

ACTIONS ALREADY TAKEN:
${actionsAlreadyTaken.map((a) => `• ${a}`).join('\n')}

UNRESOLVED:
${unresolvedPoints.map((u) => `• ${u}`).join('\n')}

WHY ESCALATED:
${whyEscalated}

NEXT BEST ACTION:
${nextBestAction}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullHandoverText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAssign = () => {
    setAssignedTeam(team);
    if (onAssign) onAssign(team);
  };

  return (
    <div
      id="clarivo-handover-document"
      className="bg-[#FAF9F5] dark:bg-[#1B212D] border border-[#E5E3DD] dark:border-[#2A3345] rounded p-4 text-stone-800 dark:text-slate-200 shadow-2xs font-sans text-xs space-y-3 select-none transition-colors"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DD] dark:border-[#2A3345]">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[#B91C1C] dark:text-rose-400" />
          <span className="font-bold uppercase tracking-wider text-[11px] text-stone-900 dark:text-slate-100">
            Internal Handover Brief
          </span>
          <span className="font-mono text-[10px] text-stone-500 dark:text-slate-400">#{caseId}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B91C1C]/10 dark:bg-rose-950/40 text-[#B91C1C] dark:text-rose-400 font-semibold border border-[#B91C1C]/20">
          {priority}
        </span>
      </div>

      {/* Customer Issue */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
          Customer Issue
        </div>
        <p className="font-semibold text-stone-900 dark:text-slate-100 leading-snug">{customerIssue}</p>
      </div>

      {/* Established Facts */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
          Established Facts
        </div>
        <ul className="space-y-0.5 text-stone-700 dark:text-slate-300">
          {establishedFacts.map((fact, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-stone-400 dark:text-slate-500">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions Already Taken */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
          Actions Already Taken
        </div>
        <ul className="space-y-0.5 text-stone-700 dark:text-slate-300">
          {actionsAlreadyTaken.map((act, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-stone-400 dark:text-slate-500">•</span>
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Unresolved */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
          Unresolved
        </div>
        <ul className="space-y-0.5 text-stone-700 dark:text-slate-300">
          {unresolvedPoints.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#D97706] dark:text-amber-400">•</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why Escalated */}
      <div className="bg-stone-100 dark:bg-[#151922] p-2.5 rounded border border-stone-200 dark:border-[#252E3E]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
          <ShieldAlert size={11} className="text-[#B91C1C] dark:text-rose-400" />
          Why Escalated
        </div>
        <p className="text-stone-800 dark:text-slate-200 leading-relaxed font-medium">{whyEscalated}</p>
      </div>

      {/* Next Best Action */}
      <div className="bg-[#0F4C5C]/5 dark:bg-[#14B8A6]/10 p-2.5 rounded border border-[#0F4C5C]/20 dark:border-[#14B8A6]/25">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C5C] dark:text-[#14B8A6] mb-0.5">
          Next Best Action
        </div>
        <p className="text-stone-800 dark:text-slate-200 font-medium leading-relaxed">{nextBestAction}</p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2 border-t border-[#E5E3DD] dark:border-[#2A3345]">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-white dark:bg-[#151922] hover:bg-stone-50 dark:hover:bg-[#1F2634] border border-stone-300 dark:border-[#2A3345] text-stone-700 dark:text-slate-300 font-medium text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#15803D] dark:text-emerald-400" />
              <span className="text-[#15803D] dark:text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} className="text-stone-500 dark:text-slate-400" />
              <span>Copy Handover</span>
            </>
          )}
        </button>

        <button
          onClick={handleAssign}
          disabled={!!assignedTeam}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-semibold transition-colors ${
            assignedTeam
              ? 'bg-[#15803D] text-white'
              : 'bg-[#0F4C5C] hover:bg-[#0D404E] dark:bg-[#14B8A6] dark:hover:bg-[#0D9488] text-white dark:text-black'
          }`}
        >
          {assignedTeam ? (
            <>
              <UserCheck size={13} />
              <span>Assigned: {assignedTeam}</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Assign Desk</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
