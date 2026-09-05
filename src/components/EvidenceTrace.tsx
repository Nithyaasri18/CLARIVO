import React from 'react';
import {
  MessageSquare,
  Database,
  BookOpen,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import { SourceInspectorData } from './SourceInspector';

export interface EvidenceNode {
  step: 'QUESTION' | 'DATA' | 'KNOWLEDGE' | 'REASONING' | 'ANSWER';
  label: string;
  detail: string;
  source: string;
  status: 'SUPPORTED' | 'MISSING' | 'CONFLICT' | 'UNSUPPORTED';
  fullArticle?: {
    id: string;
    title: string;
    body: string;
    score?: number;
    category?: string;
  };
}

interface EvidenceTraceProps {
  chain: EvidenceNode[];
  onInspectNode: (data: SourceInspectorData) => void;
}

export const EvidenceTrace: React.FC<EvidenceTraceProps> = ({ chain, onInspectNode }) => {
  const getStepIcon = (step: EvidenceNode['step']) => {
    switch (step) {
      case 'QUESTION':
        return <MessageSquare size={13} className="text-stone-600 dark:text-slate-400" />;
      case 'DATA':
        return <Database size={13} className="text-[#0F4C5C] dark:text-[#14B8A6]" />;
      case 'KNOWLEDGE':
        return <BookOpen size={13} className="text-[#0F4C5C] dark:text-[#14B8A6]" />;
      case 'REASONING':
        return <GitCommit size={13} className="text-stone-600 dark:text-slate-400" />;
      case 'ANSWER':
        return <CheckCircle2 size={13} className="text-[#15803D] dark:text-emerald-400" />;
      default:
        return <GitCommit size={13} className="text-stone-500 dark:text-slate-400" />;
    }
  };

  const getStatusIndicator = (status: EvidenceNode['status']) => {
    switch (status) {
      case 'SUPPORTED':
        return <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" title="Verified Supported" />;
      case 'MISSING':
        return <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" title="Missing Signal" />;
      case 'CONFLICT':
      case 'UNSUPPORTED':
        return <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" title="Conflict / Unsupported" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-slate-600" />;
    }
  };

  return (
    <div id="evidence-trace-chain" className="relative pl-3 select-none">
      {/* Vertical connecting spine line */}
      <div className="absolute left-[18px] top-3 bottom-5 w-[1.5px] bg-[#E5E3DD] dark:bg-[#252E3E]" />

      <div className="space-y-3">
        {chain.map((node, index) => {
          const isKnowledge = node.step === 'KNOWLEDGE';
          const isData = node.step === 'DATA';

          return (
            <div key={index} className="relative flex items-start gap-2.5 group">
              {/* Connector node bullet */}
              <div
                className="relative z-10 w-6 h-6 rounded-full bg-white dark:bg-[#1B212D] border border-[#DDD9CE] dark:border-[#2A3345] shadow-xs flex items-center justify-center shrink-0 transition-colors group-hover:border-[#0F4C5C] dark:group-hover:border-[#14B8A6] group-hover:bg-[#FAF9F5] dark:group-hover:bg-[#202738]"
              >
                {getStepIcon(node.step)}
              </div>

              {/* Node Content Card */}
              <button
                type="button"
                onClick={() => {
                  const inspectorData: SourceInspectorData = {
                    sourceId: node.source || `TRACE-0${index + 1}`,
                    title: node.label,
                    category: isKnowledge ? 'TELECOM POLICY' : isData ? 'SUBSCRIBER LEDGER' : 'SYSTEM TRACE',
                    matchScore: isKnowledge ? (node.fullArticle?.score || 0.94) : 1.0,
                    relevantPassage: node.detail,
                    highlightSentence: isKnowledge ? node.detail.substring(0, 75) : undefined,
                    usedFor: node.step === 'ANSWER' ? 'Final Recommended Draft' : node.step === 'KNOWLEDGE' ? 'Grounding & Invariant Check' : 'Context Verification',
                    whyItMatters: `Step ${index + 1} of 5 in Clarivo's deterministic resolution reasoning chain.`,
                    fullBody: node.fullArticle?.body || node.detail,
                  };
                  onInspectNode(inspectorData);
                }}
                className="flex-1 text-left p-2 rounded bg-white dark:bg-[#1B212D] hover:bg-[#FAF9F5] dark:hover:bg-[#212836] border border-[#E5E3DD] dark:border-[#252E3E] group-hover:border-stone-300 dark:group-hover:border-slate-500 shadow-2xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 font-mono">
                      {node.step}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-800 dark:text-slate-200">
                      {node.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIndicator(node.status)}
                    <ExternalLink size={10} className="text-stone-300 dark:text-slate-600 group-hover:text-stone-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-slate-300 font-sans line-clamp-2 leading-relaxed">
                  {node.detail}
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400 dark:text-slate-500 font-mono">
                  <span className="truncate max-w-[140px]">src: {node.source}</span>
                  <span className="text-[9px] uppercase tracking-wide group-hover:text-[#0F4C5C] dark:group-hover:text-[#14B8A6] font-semibold">
                    Inspect ↗
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
