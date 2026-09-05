import React, { useState } from 'react';
import { MessageSquare, PlusCircle, CheckCircle2, Clock, Shield, AlertTriangle, ArrowRight, User, HardDrive, CreditCard, LogOut, Send } from 'lucide-react';
import { useCustomer } from '../CustomerContext';
import { CaseRecord } from '../types';

interface CustomerDashboardViewProps {
  customerCases: CaseRecord[];
  onAskNewQuery: (message: string) => void;
  onSelectCase: (caseId: string) => void;
  onLogout: () => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  customerCases,
  onAskNewQuery,
  onSelectCase,
  onLogout,
}) => {
  const { customer } = useCustomer();
  const [newQueryText, setNewQueryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'queries' | 'ask' | 'profile'>('queries');

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQueryText.trim()) return;
    setIsSubmitting(true);
    onAskNewQuery(newQueryText);
    setNewQueryText('');
    setIsSubmitting(false);
    setActiveTab('queries');
  };

  const pendingCount = customerCases.filter((c) => c.status === 'AWAITING_INFO' || c.status === 'IN_PROGRESS').length;
  const resolvedCount = customerCases.filter((c) => c.status === 'RESOLVED' || c.status === 'RESOLVED_DRAFT').length;
  const escalatedCount = customerCases.filter((c) => c.status === 'ESCALATED').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9F5] text-stone-900 overflow-y-auto">
      {/* Top Banner */}
      <header className="bg-white border-b border-stone-200 px-8 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold tracking-wide uppercase">
              Customer Account
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-mono">ID: {customer?.customer_id || 'C-1042'}</span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 mt-1">
            Welcome, {customer?.name || 'Customer'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Plan: <span className="font-medium text-stone-700">{customer?.plan_name || 'Fiber 799 Basic'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ask')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask New Query</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-stone-100 border-b border-stone-200 px-8 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('queries')}
          className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'queries'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          My Queries ({customerCases.length})
        </button>
        <button
          onClick={() => setActiveTab('ask')}
          className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'ask'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Ask a Question
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Account & Services
        </button>
      </div>

      {/* Content Area */}
      <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Resolved Queries</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">In Specialist Review</p>
              <p className="text-2xl font-bold text-stone-700 mt-1">{escalatedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-100 text-stone-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Queries List */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900">Your Support Tickets & Conversations</h2>
              <span className="text-xs text-stone-400">Total: {customerCases.length}</span>
            </div>

            {customerCases.length === 0 ? (
              <div className="p-12 text-center text-stone-500">
                <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-700">No support queries found.</p>
                <p className="text-xs text-stone-400 mt-1">Have an issue? Click "Ask New Query" above to start.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {customerCases.map((c) => (
                  <div
                    key={c.case_id}
                    onClick={() => onSelectCase(c.case_id)}
                    className="p-5 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">{c.case_id}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500">{c.intent || 'SUPPORT_QUERY'}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-stone-800 line-clamp-1">{c.issue_title}</h3>
                      <p className="text-xs text-stone-500 line-clamp-1">{c.initial_message}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          c.status === 'RESOLVED' || c.status === 'RESOLVED_DRAFT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'ESCALATED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ask New Query */}
        {activeTab === 'ask' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Submit a Support Request</h2>
            <p className="text-xs text-stone-500 mb-4">
              Describe your issue or question. Clarivo's support system will instantly check line telemetry and KB guidance.
            </p>

            <form onSubmit={handleSubmitQuery} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="e.g. My internet dropped out around 2pm. Red light is blinking on the Nokia router panel..."
                  value={newQueryText}
                  onChange={(e) => setNewQueryText(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('queries')}
                  className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQueryText.trim()}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Account Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                <User className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-semibold text-stone-900">Personal Information</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400">Name:</span>{' '}
                  <span className="font-semibold text-stone-800">{customer?.name || 'Arun Kumar'}</span>
                </div>
                <div>
                  <span className="text-stone-400">Email:</span>{' '}
                  <span className="font-semibold text-stone-800">{customer?.email || 'arun.kumar@enterprise.in'}</span>
                </div>
                <div>
                  <span className="text-stone-400">Customer ID:</span>{' '}
                  <span className="font-mono text-stone-800">{customer?.customer_id || 'C-1042'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                <HardDrive className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-semibold text-stone-900">Subscription & Modem</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400">Plan:</span>{' '}
                  <span className="font-semibold text-stone-800">{customer?.plan_name || 'Fiber 799'}</span>
                </div>
                <div>
                  <span className="text-stone-400">Modem Hardware:</span>{' '}
                  <span className="font-mono text-stone-800">Nokia G-2425G-A GPON ONT</span>
                </div>
                <div>
                  <span className="text-stone-400">Billing Status:</span>{' '}
                  <span className="font-semibold text-emerald-700">PAID (₹0.00 Overdue)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
