import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { CaseRecord } from '../types';

interface CaseQueueViewProps {
  cases: CaseRecord[];
  onSelectCase: (caseId: string) => void;
  activeCaseId?: string;
  onRefresh?: () => void;
}

export const CaseQueueView: React.FC<CaseQueueViewProps> = ({
  cases,
  onSelectCase,
  activeCaseId,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'NEEDS_INFO' | 'RESOLVED' | 'ESCALATED'>('ALL');

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issue_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterState === 'NEEDS_INFO') {
      return c.decision === 'MISSING_INFO' || c.status === 'AWAITING_INFO';
    }
    if (filterState === 'RESOLVED') {
      return c.decision === 'RESOLUTION' || c.status === 'RESOLVED_DRAFT';
    }
    if (filterState === 'ESCALATED') {
      return c.decision === 'ESCALATE' || c.status === 'ESCALATED';
    }

    return true;
  });

  const getStatusBadge = (c: CaseRecord) => {
    if (c.decision === 'MISSING_INFO' || c.status === 'AWAITING_INFO') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#D97706]/10 text-[#B45309] border border-[#D97706]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          Needs Information
        </span>
      );
    }
    if (c.decision === 'RESOLUTION' || c.status === 'RESOLVED_DRAFT') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#B91C1C]/10 text-[#B91C1C] border border-[#B91C1C]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
        Escalation
      </span>
    );
  };

  const getPriorityBadge = (c: CaseRecord) => {
    const priority = c.priority || (c.decision === 'ESCALATE' ? 'CRITICAL' : c.decision === 'MISSING_INFO' ? 'HIGH' : 'MEDIUM');
    if (priority === 'CRITICAL') {
      return <span className="font-mono text-xs font-semibold text-[#B91C1C]">Critical</span>;
    }
    if (priority === 'HIGH') {
      return <span className="font-mono text-xs font-semibold text-[#B45309]">High</span>;
    }
    return <span className="font-mono text-xs font-medium text-stone-600">Medium</span>;
  };

  const getAiCoverageBadge = (c: CaseRecord) => {
    if (c.decision === 'RESOLUTION') {
      return <span className="font-mono text-xs font-bold text-[#15803D]">96%</span>;
    }
    if (c.decision === 'MISSING_INFO') {
      return <span className="font-mono text-xs font-bold text-[#B45309]">82%</span>;
    }
    return <span className="font-mono text-xs text-stone-400">—</span>;
  };

  return (
    <div id="clarivo-case-queue-view" className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Inbox Header */}
      <div className="p-4 border-b border-[#E5E3DD] bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            Support Operations Inbox
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Active broadband & mobile customer queue grounded by Clarivo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search case, customer, issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0F4C5C] w-60"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-stone-200/60 p-0.5 rounded border border-stone-300/60 text-xs">
            {(['ALL', 'NEEDS_INFO', 'RESOLVED', 'ESCALATED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterState(filter)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterState === filter
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {filter === 'ALL' ? 'All Cases' : filter === 'NEEDS_INFO' ? 'Needs Info' : filter === 'RESOLVED' ? 'Resolved' : 'Escalated'}
              </button>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded transition-colors"
              title="Refresh queue"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Case Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[#FAF9F5] border-b border-[#E5E3DD] sticky top-0 z-10 text-[10px] uppercase font-bold text-stone-500 tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Case</th>
              <th className="py-2.5 px-4">Customer</th>
              <th className="py-2.5 px-4">Issue Description</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Priority</th>
              <th className="py-2.5 px-4">AI State</th>
              <th className="py-2.5 px-4">Coverage</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filteredCases.map((c) => {
              const isSelected = c.case_id === activeCaseId;
              return (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className={`hover:bg-[#FAF9F5] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#0F4C5C]/5 font-medium' : ''
                  }`}
                >
                  {/* Case ID */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    #{c.case_id}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900">{c.customer_name}</div>
                    <div className="text-[10px] font-mono text-stone-400">{c.customer_id}</div>
                  </td>

                  {/* Issue */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate text-stone-800" title={c.issue_title}>
                      {c.issue_title}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">{getStatusBadge(c)}</td>

                  {/* Priority */}
                  <td className="py-3 px-4">{getPriorityBadge(c)}</td>

                  {/* AI State */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-stone-800">
                      {c.decision === 'MISSING_INFO' ? 'Needs Signal' : c.decision === 'RESOLUTION' ? 'Supported' : 'Escalation'}
                    </span>
                  </td>

                  {/* Coverage */}
                  <td className="py-3 px-4">{getAiCoverageBadge(c)}</td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.case_id);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4C5C] hover:underline"
                    >
                      Open Case
                      <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCases.length === 0 && (
          <div className="p-8 text-center text-stone-400 text-xs">
            No support cases found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};
