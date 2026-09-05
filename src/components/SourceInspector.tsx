import React from 'react';
import { X, BookOpen, ExternalLink, CheckCircle, ShieldCheck, Tag } from 'lucide-react';
import { KBArticle } from '../types';

export interface SourceInspectorData {
  sourceId: string;
  title: string;
  category?: string;
  matchScore: number;
  relevantPassage: string;
  highlightSentence?: string;
  usedFor: string;
  whyItMatters?: string;
  fullBody?: string;
  appliesTo?: string[];
  requiredFields?: string[];
}

interface SourceInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  data: SourceInspectorData | null;
}

export const SourceInspector: React.FC<SourceInspectorProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Format relevant passage with highlighting
  const renderHighlightedPassage = () => {
    if (!data.highlightSentence || !data.relevantPassage.includes(data.highlightSentence)) {
      return (
        <blockquote className="border-l-2 border-[#0F4C5C] dark:border-[#14B8A6] pl-3 py-1 font-serif text-stone-800 dark:text-slate-200 text-[13.5px] leading-relaxed bg-[#FAF9F5] dark:bg-[#1A202C] rounded-r p-2">
          "{data.relevantPassage}"
        </blockquote>
      );
    }

    const parts = data.relevantPassage.split(data.highlightSentence);
    return (
      <blockquote className="border-l-2 border-[#0F4C5C] dark:border-[#14B8A6] pl-3 py-1 font-serif text-stone-800 dark:text-slate-200 text-[13.5px] leading-relaxed bg-[#FAF9F5] dark:bg-[#1A202C] rounded-r p-2">
        "{parts[0]}
        <mark className="bg-[#FEF08A] dark:bg-amber-400 text-stone-900 px-1 py-0.5 rounded font-medium">
          {data.highlightSentence}
        </mark>
        {parts[1]}"
      </blockquote>
    );
  };

  return (
    <div
      id="source-inspector-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        id="source-inspector-drawer"
        className="w-full max-w-lg bg-white dark:bg-[#151922] h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-[#262D3D] text-stone-800 dark:text-slate-200 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="h-14 px-5 border-b border-stone-200 dark:border-[#262D3D] flex items-center justify-between bg-[#FAF9F5] dark:bg-[#191F2B]">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#0F4C5C] dark:text-[#14B8A6]" />
            <span className="text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-slate-300">
              Source Inspector
            </span>
            <span className="font-mono text-xs px-1.5 py-0.5 bg-[#0F4C5C]/10 dark:bg-[#14B8A6]/20 text-[#0F4C5C] dark:text-[#14B8A6] font-semibold rounded">
              {data.sourceId}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 rounded transition-colors"
            title="Close inspector"
          >
            <X size={17} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Article Title & Match score */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                Grounding Source
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 dark:text-slate-400">Vector Match:</span>
                <span className="font-mono text-xs font-bold text-[#15803D] dark:text-emerald-400 bg-[#15803D]/10 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  {Math.round(data.matchScore * 100)}%
                </span>
              </div>
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 leading-snug">
              {data.title}
            </h3>
            {data.category && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-500 dark:text-slate-400">
                <Tag size={11} className="text-stone-400 dark:text-slate-500" />
                <span>Domain:</span>
                <span className="font-medium text-stone-700 dark:text-slate-300">{data.category}</span>
              </div>
            )}
          </div>

          <div className="h-px bg-stone-200 dark:bg-[#262D3D]" />

          {/* Usage Rationale */}
          <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] dark:bg-[#1A202D] p-3 rounded border border-stone-200/80 dark:border-[#2A3140] text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
                Used For
              </div>
              <div className="font-semibold text-[#0F4C5C] dark:text-[#14B8A6]">{data.usedFor}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-slate-500 mb-0.5">
                Verification Type
              </div>
              <div className="font-medium text-stone-700 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#15803D] dark:text-emerald-400" />
                Deterministic Grounding
              </div>
            </div>
          </div>

          {/* Relevant Passage with Highlighting */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Extracted Evidence Passage
              </span>
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-mono">Exact Match</span>
            </div>
            {renderHighlightedPassage()}
          </div>

          {/* Why it matters */}
          {data.whyItMatters && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 block mb-1">
                Operational Rationale
              </span>
              <p className="text-xs text-stone-600 dark:text-slate-300 bg-stone-50 dark:bg-[#1A202D] p-2.5 rounded border border-stone-200/60 dark:border-[#2A3140] leading-relaxed">
                {data.whyItMatters}
              </p>
            </div>
          )}

          {/* Full Article Preview */}
          {data.fullBody && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 block mb-1">
                Full Policy Body
              </span>
              <div className="p-3 bg-stone-50 dark:bg-[#1A202D] rounded border border-stone-200 dark:border-[#2A3140] text-xs text-stone-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans max-h-48 overflow-y-auto">
                {data.fullBody}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-[#262D3D] bg-[#FAF9F5] dark:bg-[#191F2B] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-slate-400">
            <ShieldCheck size={14} className="text-[#15803D] dark:text-emerald-400" />
            <span className="font-mono text-[11px]">Audit: Invariant Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-stone-900 dark:bg-[#14B8A6] text-white dark:text-black font-semibold hover:bg-stone-800 dark:hover:bg-[#0D9488] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
