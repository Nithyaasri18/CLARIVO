import React, { useState } from 'react';
import { CaseSummary, DecisionType } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Search, Filter, Clock } from 'lucide-react';

interface CaseQueueProps {
  cases: CaseSummary[];
  selectedCaseId: string | null;
  onSelectCase: (caseId: string) => void;
  isLoading: boolean;
}

export const CaseQueue: React.FC<CaseQueueProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  isLoading,
}) => {
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filterDecision === 'ALL' || c.decision === filterDecision;
    const matchesSearch =
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issue_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDecisionBadge = (decision: DecisionType, confidence: number) => {
    switch (decision) {
      case 'RESOLUTION':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolution ({Math.round(confidence * 100)}%)</span>
          </span>
        );
      case 'MISSING_INFO':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Missing Info ({Math.round(confidence * 100)}%)</span>
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Escalate ({Math.round(confidence * 100)}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-stone-200 bg-stone-50/60">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-stone-900 text-sm">Active Case Queue</h2>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-stone-200 text-stone-700">
              {filteredCases.length}
            </span>
          </div>
          <span className="text-[11px] text-stone-600">Deterministic Triage</span>
        </div>

        {/* Search input */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-stone-600 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, case #, or query..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-600"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center space-x-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-stone-600 shrink-0 mr-1" />
          {(['ALL', 'RESOLUTION', 'MISSING_INFO', 'ESCALATE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterDecision(filter)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterDecision === filter
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {filter === 'ALL' ? 'All Cases' : filter === 'MISSING_INFO' ? 'Missing Info' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="divide-y divide-stone-100 overflow-y-auto max-h-[calc(100vh-250px)]">
        {isLoading && (
          <div className="p-8 text-center text-xs text-stone-600">
            <div className="animate-spin w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full mx-auto mb-2" />
            Evaluating case pipeline...
          </div>
        )}

        {!isLoading && filteredCases.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-600">
            No customer cases match the current filter.
          </div>
        )}

        {!isLoading &&
          filteredCases.map((c) => {
            const isSelected = selectedCaseId === c.case_id;
            return (
              <div
                key={c.case_id}
                onClick={() => onSelectCase(c.case_id)}
                className={`p-3.5 transition-all cursor-pointer border-l-3 ${
                  isSelected
                    ? 'bg-stone-50/90 border-l-stone-900 shadow-xs'
                    : 'hover:bg-stone-50/50 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-900 text-xs">{c.customer_name}</span>
                      <span className="font-mono text-[10px] text-stone-600">({c.customer_id})</span>
                    </div>
                    <span className="font-mono text-[10px] text-stone-600 block">{c.case_id}</span>
                  </div>
                  {getDecisionBadge(c.decision, c.confidence)}
                </div>

                <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed mb-2">
                  "{c.initial_message}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1 border-t border-stone-100/80">
                  <span className="px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600 text-[10px] font-medium uppercase tracking-wider">
                    {c.intent.replace('_', ' ')}
                  </span>
                  <span className="flex items-center space-x-1 text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>{c.created_at.slice(11, 16)}</span>
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
