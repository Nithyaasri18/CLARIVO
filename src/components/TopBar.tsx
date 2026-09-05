import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Terminal,
  Sun,
  Moon,
  PanelLeft,
  User,
  LogIn
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useEmployee } from '../EmployeeContext';

interface TopBarProps {
  caseId: string;
  customerName: string;
  status: 'IN_PROGRESS' | 'RESOLVED_DRAFT' | 'AWAITING_INFO' | 'ESCALATED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  onSelectScenario: (scenarioId: string) => void;
  currentScenarioId?: string;
  onOpenSimulator?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onOpenProfile?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  caseId,
  customerName,
  status,
  priority,
  onSelectScenario,
  currentScenarioId = 'scenario-b',
  onOpenSimulator,
  onToggleSidebar,
  isSidebarCollapsed = false,
  onOpenProfile,
  onOpenAuthModal,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentEmployee, isLoggedIn } = useEmployee();
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  // Status mapping
  const getStatusBadge = () => {
    switch (status) {
      case 'RESOLVED_DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Resolved (Draft)
          </span>
        );
      case 'AWAITING_INFO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Needs Information
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Escalated
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
            isDark
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-stone-100 text-stone-700 border-stone-300'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            In Progress
          </span>
        );
    }
  };

  const getPriorityBadge = () => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
            P1 CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono tracking-tight">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className={`text-[11px] font-medium font-mono tracking-tight ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
            MEDIUM
          </span>
        );
      default:
        return (
          <span className={`text-[11px] font-medium font-mono tracking-tight ${isDark ? 'text-slate-500' : 'text-stone-500'}`}>
            LOW
          </span>
        );
    }
  };

  const demoScenarios = [
    { id: 'scenario-b', code: 'CASE B', label: 'Missing Information (Router LOS)', desc: 'Arun Kumar · Needs router signal' },
    { id: 'scenario-a', code: 'CASE A', label: 'Clean Resolution (Billing Invariant)', desc: 'Meena R · Auto-restores in 15m' },
    { id: 'scenario-c', code: 'CASE C', label: 'Complex Escalation (Repeated Contacts + Legal)', desc: 'Rahul S · P1 Handover' },
    { id: 'scenario-d', code: 'CASE D', label: 'Uncovered Case (SIP PBX on ONT)', desc: 'Uncovered KB · Specialized Desk' },
    { id: 'scenario-e', code: 'CASE E', label: 'Data/Catalog Conflict (Plan Overcharge)', desc: 'Reconciliation Handover' },
  ];

  return (
    <header
      id="clarivo-top-bar"
      className={`h-14 px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 border-b transition-colors ${
        isDark
          ? 'bg-[#151922] border-[#222834] text-slate-100'
          : 'bg-white border-[#E5E3DD] text-stone-900'
      }`}
    >
      {/* Left: Sidebar Toggle, Case ID, Status, Priority, Customer */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-[#1E2533]'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle navigation sidebar"
          >
            <PanelLeft size={16} />
          </button>
        )}

        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-stone-400'}`}>
            Case
          </span>
          <span className="font-mono font-bold text-xs sm:text-sm tracking-tight">
            #{caseId}
          </span>
        </div>

        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />

        {getStatusBadge()}

        <div className={`h-4 w-px hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />

        <div className="hidden sm:flex items-center gap-1.5">
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-stone-400'}`}>
            Priority:
          </span>
          {getPriorityBadge()}
        </div>

        <div className={`h-4 w-px hidden md:block ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />

        <div className="hidden md:flex items-center gap-1.5">
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-stone-400'}`}>
            Customer:
          </span>
          <span className="text-xs font-semibold truncate max-w-[130px]">
            {customerName}
          </span>
        </div>
      </div>

      {/* Right: Demo Scenario Switcher, AI Indicator, Theme Toggle & Employee Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Demo Switcher */}
        <div className="relative">
          <button
            id="scenario-switcher-button"
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
              isDark
                ? 'bg-[#1C222E] hover:bg-[#252E3E] border-[#2A3140] text-slate-200'
                : 'bg-[#F4F3ED] hover:bg-[#EAE8DF] border-[#DDD9CE] text-stone-700'
            }`}
            title="Switch demo scenarios"
          >
            <SlidersHorizontal size={13} className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'} />
            <span className="hidden lg:inline font-mono text-[11px]">Demo:</span>
            <span className="font-medium">
              {demoScenarios.find((s) => s.id === currentScenarioId)?.code || 'Scenarios'}
            </span>
            <ChevronDown size={12} className={isDark ? 'text-slate-400' : 'text-stone-400'} />
          </button>

          {showScenarioMenu && (
            <div
              className={`absolute right-0 mt-1.5 w-80 rounded border shadow-xl py-1.5 z-50 text-left ${
                isDark
                  ? 'bg-[#181D26] border-[#2A3140] text-slate-100'
                  : 'bg-white border-stone-200 text-stone-900'
              }`}
              onMouseLeave={() => setShowScenarioMenu(false)}
            >
              <div
                className={`px-3 py-1 border-b flex items-center justify-between ${
                  isDark ? 'border-[#2A3140]' : 'border-stone-100'
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-stone-500'
                  }`}
                >
                  Select Benchmark Scenario
                </span>
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    isDark
                      ? 'text-[#14B8A6] bg-[#14B8A6]/10'
                      : 'text-[#0F4C5C] bg-[#0F4C5C]/10'
                  }`}
                >
                  PS04 Track
                </span>
              </div>
              <div className="py-1">
                {demoScenarios.map((sc) => {
                  const isSelected = currentScenarioId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectScenario(sc.id);
                        setShowScenarioMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex flex-col gap-0.5 transition-colors ${
                        isSelected
                          ? isDark
                            ? 'bg-[#14B8A6]/10 border-l-2 border-[#14B8A6]'
                            : 'bg-[#0F4C5C]/5 border-l-2 border-[#0F4C5C]'
                          : isDark
                          ? 'hover:bg-[#202734]'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold font-mono">
                          {sc.code} · {sc.label}
                        </span>
                        {isSelected && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDark ? 'bg-[#14B8A6]' : 'bg-[#0F4C5C]'
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-[11px] ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        {sc.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {onOpenSimulator && (
                <div
                  className={`pt-1 border-t px-2 pb-1 ${
                    isDark ? 'border-[#2A3140]' : 'border-stone-100'
                  }`}
                >
                  <button
                    onClick={() => {
                      onOpenSimulator();
                      setShowScenarioMenu(false);
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                      isDark
                        ? 'bg-[#202734] hover:bg-[#2A3345] text-slate-200'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    <Terminal
                      size={12}
                      className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'}
                    />
                    <span>Open Custom Query Simulator</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Copilot Status Indicator */}
        <div
          id="clarivo-copilot-indicator"
          className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium select-none border ${
            isDark
              ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
              : 'bg-[#0F4C5C]/5 border-[#0F4C5C]/20 text-[#0F4C5C]'
          }`}
          title="Clarivo Evidence Engine is active and evaluating constraints"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${
                isDark ? 'bg-[#14B8A6]' : 'bg-[#0F4C5C]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isDark ? 'bg-[#14B8A6]' : 'bg-[#0F4C5C]'
              }`}
            />
          </span>
          <span className="hidden md:inline font-semibold">AI Copilot Active</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="topbar-theme-toggle"
          onClick={toggleTheme}
          className={`p-1.5 rounded transition-colors ${
            isDark
              ? 'text-amber-400 hover:text-amber-300 hover:bg-[#1E2533]'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle dark/light theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Search & Bell */}
        <div className={`flex items-center gap-0.5 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
          <button
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:text-white hover:bg-[#1E2533]' : 'hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="Search tickets and knowledge"
          >
            <Search size={15} />
          </button>
          <button
            className={`p-1.5 rounded transition-colors relative ${
              isDark ? 'hover:text-white hover:bg-[#1E2533]' : 'hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="System notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          </button>
        </div>

        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-stone-200'}`} />

        {/* Topbar Employee Profile Button */}
        {isLoggedIn && currentEmployee ? (
          <button
            id="topbar-profile-trigger"
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors border ${
              isDark
                ? 'bg-[#1C222E] border-[#2A3140] hover:bg-[#252E3E] text-slate-200'
                : 'bg-[#F4F3ED] border-[#DDD9CE] hover:bg-[#EAE8DF] text-stone-800'
            }`}
            title={`${currentEmployee.name} (${currentEmployee.role}) - Open Profile`}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                  isDark
                    ? 'bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/40'
                    : 'bg-[#0F4C5C]/15 text-[#0F4C5C] border border-[#0F4C5C]/30'
                }`}
              >
                {currentEmployee.avatar_initial}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white ${
                  currentEmployee.status === 'ONLINE'
                    ? 'bg-[#15803D]'
                    : currentEmployee.status === 'BREAK'
                    ? 'bg-[#D97706]'
                    : 'bg-stone-400'
                }`}
              />
            </div>
            <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
              {currentEmployee.name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors border ${
              isDark
                ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
            }`}
            title="Sign in as an employee"
          >
            <LogIn size={13} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
