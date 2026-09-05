import React from 'react';
import { ShieldCheck, Database, BookOpen, PlayCircle, Activity, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'cases' | 'kb' | 'customers' | 'simulator';
  setActiveTab: (tab: 'cases' | 'kb' | 'customers' | 'simulator') => void;
  onOpenSimulator: () => void;
  onSelectScenarioPreset: (code: string) => void;
  scenarios: any[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onSelectScenarioPreset,
  scenarios,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-stone-900 font-display">ResolveIQ</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                  Track PS04
                </span>
                <span className="text-xs text-stone-600 hidden sm:inline">
                  Evidence-Grounded Resolution Copilot
                </span>
              </div>
              <p className="text-xs text-stone-600">Deterministic Guardrails • Zero-Hallucination Retrieval • Smart Escalation</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'cases'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Copilot Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('kb')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'kb'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base (25)</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'customers'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Accounts (12)</span>
            </button>

            <button
              onClick={onOpenSimulator}
              className="ml-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Test Simulator</span>
            </button>
          </nav>
        </div>

        {/* Benchmark Scenario Quick-Switcher Ribbon */}
        <div className="py-2.5 border-t border-stone-100 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center space-x-2 text-stone-600 shrink-0 mr-3">
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">Benchmark Test Cases:</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5">
            {scenarios.map((sc) => {
              const badgeColors: Record<string, string> = {
                RESOLUTION: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
                MISSING_INFO: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
                ESCALATE: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
              };
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenarioPreset(sc.code)}
                  title={sc.message}
                  className={`px-2.5 py-1 rounded-md border text-left font-medium transition-all shrink-0 cursor-pointer ${
                    badgeColors[sc.expected_decision] || 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="font-mono font-bold mr-1">{sc.code.replace('ROUTINE_', '').replace('EXPLICIT_', '').replace('_CASE', '')}:</span>
                  <span>{sc.name.split(':')[1]?.trim() || sc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
