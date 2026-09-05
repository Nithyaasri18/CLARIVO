import React from 'react';
import {
  Inbox,
  LayoutDashboard,
  AlertTriangle,
  Users,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  User,
  LogIn,
  Sliders
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';

export type NavItemKey =
  | 'active-case'
  | 'inbox'
  | 'escalations'
  | 'customers'
  | 'knowledge'
  | 'analytics'
  | 'profile'
  | 'auth';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  role?: 'customer' | 'employee';
  escalationsCount?: number;
  inboxCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenProfile?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role = 'employee',
  escalationsCount = 3,
  inboxCount = 8,
  isCollapsed = false,
  onToggleCollapse,
  onOpenProfile,
  onOpenAuthModal,
}) => {
  const { currentEmployee, isLoggedIn } = useEmployee();
  const { theme, toggleTheme, isDark } = useTheme();

  const employeeNavItems: { key: NavItemKey; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      key: 'active-case',
      label: 'Active Case',
      icon: <LayoutDashboard size={17} strokeWidth={2} />,
    },
    {
      key: 'inbox',
      label: 'Inbox',
      icon: <Inbox size={17} strokeWidth={2} />,
      badge: inboxCount,
      badgeColor: isDark ? 'bg-slate-700 text-slate-200' : 'bg-stone-200 text-stone-700',
    },
    {
      key: 'escalations',
      label: 'Escalations',
      icon: <AlertTriangle size={17} strokeWidth={2} />,
      badge: escalationsCount,
      badgeColor: 'bg-rose-500/15 text-rose-500 font-semibold',
    },
    {
      key: 'customers',
      label: 'Customers',
      icon: <Users size={17} strokeWidth={2} />,
    },
    {
      key: 'knowledge',
      label: 'Knowledge',
      icon: <BookOpen size={17} strokeWidth={2} />,
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={17} strokeWidth={2} />,
    },
    {
      key: 'profile',
      label: 'Operator Profile',
      icon: <User size={17} strokeWidth={2} />,
    },
  ];

  const customerNavItems: { key: NavItemKey; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      key: 'active-case',
      label: 'Dashboard',
      icon: <LayoutDashboard size={17} strokeWidth={2} />,
    },
    {
      key: 'inbox',
      label: 'My Queries',
      icon: <Inbox size={17} strokeWidth={2} />,
      badge: inboxCount,
      badgeColor: isDark ? 'bg-slate-700 text-slate-200' : 'bg-stone-200 text-stone-700',
    },
    {
      key: 'knowledge',
      label: 'Help Center (KB)',
      icon: <BookOpen size={17} strokeWidth={2} />,
    },
    {
      key: 'profile',
      label: 'My Profile',
      icon: <User size={17} strokeWidth={2} />,
    },
  ];

  const navItems = role === 'customer' ? customerNavItems : employeeNavItems;


  return (
    <aside
      id="clarivo-sidebar"
      className={`h-screen flex flex-col justify-between transition-all duration-200 z-30 shrink-0 select-none border-r ${
        isDark
          ? 'bg-[#11141B] border-[#222834] text-slate-200'
          : 'bg-[#F4F3ED] border-[#E5E3DD] text-stone-800'
      } ${isCollapsed ? 'w-[64px]' : 'w-[224px]'}`}
    >
      {/* Top Section: Logo and Navigation */}
      <div className="flex flex-col">
        {/* Brand Header with toggle button in BOTH collapsed & expanded states */}
        <div
          className={`h-14 px-3 flex items-center justify-between border-b ${
            isDark ? 'border-[#222834]' : 'border-[#E5E3DD]'
          }`}
        >
          {!isCollapsed ? (
            <>
              <BrandLogo collapsed={false} size="sm" />
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className={`p-1.5 rounded transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-[#1C222E]'
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/60'
                  }`}
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-1">
              <button
                onClick={onToggleCollapse}
                className={`p-1.5 rounded transition-colors w-full flex items-center justify-center ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-[#1C222E]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <div className="w-7 h-7 rounded bg-[#0F4C5C] text-white font-bold flex items-center justify-center font-mono text-xs shadow-xs">
                  C
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-item-${item.key}`}
                onClick={() => onSelectTab(item.key)}
                title={item.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all text-left ${
                  isActive
                    ? isDark
                      ? 'bg-[#14B8A6] text-black font-bold shadow-xs'
                      : 'bg-[#0F4C5C] text-white font-semibold shadow-xs'
                    : isDark
                    ? 'text-slate-300 hover:bg-[#1A202B] hover:text-white'
                    : 'text-stone-700 hover:bg-[#EAE8DF] hover:text-stone-900'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span
                  className={`shrink-0 ${
                    isActive
                      ? isDark
                        ? 'text-black'
                        : 'text-white'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-stone-500'
                  }`}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? isDark
                          ? 'bg-black/20 text-black'
                          : 'bg-white/20 text-white'
                        : item.badgeColor || (isDark ? 'bg-slate-700 text-slate-200' : 'bg-stone-200 text-stone-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Sidebar Controls, Guardrails, and Employee Profile */}
      <div
        className={`p-2 border-t space-y-2 ${
          isDark ? 'border-[#222834]' : 'border-[#E5E3DD]'
        }`}
      >
        {/* Guardrails Invariant Indicator */}
        {!isCollapsed ? (
          <div
            className={`rounded px-2.5 py-1.5 flex items-center gap-2 border ${
              isDark
                ? 'bg-[#161B24] border-[#222834] text-slate-300'
                : 'bg-[#EBE9E1] border-[#DDD9CE] text-stone-800'
            }`}
          >
            <ShieldCheck
              size={14}
              className={`shrink-0 ${isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'}`}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold leading-tight">
                Deterministic Guardrails
              </span>
              <span
                className={`text-[9px] leading-tight ${
                  isDark ? 'text-slate-400' : 'text-stone-500'
                }`}
              >
                Zero-hallucination invariant
              </span>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center p-1"
            title="Deterministic Guardrails Active (Zero-hallucination invariant)"
          >
            <ShieldCheck
              size={16}
              className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'}
            />
          </div>
        )}

        {/* Sidebar Expansion / Theme Toggle Options Row */}
        <div
          className={`flex items-center gap-1.5 pt-1 ${
            isCollapsed ? 'flex-col' : 'justify-between'
          }`}
        >
          {/* Explicit Sidebar Collapse/Expand Toggle Option */}
          {onToggleCollapse && (
            <button
              id="sidebar-toggle-button"
              onClick={onToggleCollapse}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                isDark
                  ? 'hover:bg-[#1A202B] text-slate-400 hover:text-slate-100'
                  : 'hover:bg-[#EAE8DF] text-stone-600 hover:text-stone-900'
              } ${isCollapsed ? 'w-full justify-center' : 'flex-1'}`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={14} />
              ) : (
                <>
                  <PanelLeftClose size={14} />
                  <span className="truncate">Collapse view</span>
                </>
              )}
            </button>
          )}

          {/* Theme Quick Toggle Option */}
          <button
            id="sidebar-theme-toggle"
            onClick={toggleTheme}
            className={`p-1.5 rounded transition-colors flex items-center justify-center ${
              isDark
                ? 'hover:bg-[#1A202B] text-amber-400 hover:text-amber-300'
                : 'hover:bg-[#EAE8DF] text-stone-600 hover:text-stone-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Employee Profile Pill / Login Trigger */}
        {isLoggedIn && currentEmployee ? (
          <div
            id="agent-profile-pill"
            onClick={onOpenProfile}
            className={`flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer transition-colors border ${
              isDark
                ? 'border-[#222834] bg-[#161B24] hover:bg-[#1C222E]'
                : 'border-[#DDD9CE] bg-white hover:bg-[#FAF9F5]'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={`${currentEmployee.name} · ${currentEmployee.role} (${currentEmployee.status}) - Click for Profile`}
          >
            <div className="relative shrink-0">
              <div
                className={`w-7 h-7 rounded-full font-semibold text-xs flex items-center justify-center font-mono border ${
                  isDark
                    ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40 text-[#14B8A6]'
                    : 'bg-[#0F4C5C]/15 border-[#0F4C5C]/30 text-[#0F4C5C]'
                }`}
              >
                {currentEmployee.avatar_initial}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ${
                  isDark ? 'ring-[#161B24]' : 'ring-white'
                } ${
                  currentEmployee.status === 'ONLINE'
                    ? 'bg-[#15803D]'
                    : currentEmployee.status === 'BREAK'
                    ? 'bg-[#D97706]'
                    : 'bg-stone-400'
                }`}
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate leading-tight">
                    {currentEmployee.name}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1 rounded uppercase tracking-wider ${
                      currentEmployee.status === 'ONLINE'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : currentEmployee.status === 'BREAK'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-stone-500/10 text-stone-400'
                    }`}
                  >
                    {currentEmployee.status}
                  </span>
                </div>
                <span
                  className={`text-[10px] truncate leading-tight mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-stone-500'
                  }`}
                >
                  {currentEmployee.role}
                </span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            className={`w-full py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
              isDark
                ? 'bg-[#161B24] border-[#222834] text-[#14B8A6] hover:bg-[#1C222E]'
                : 'bg-white border-[#DDD9CE] text-[#0F4C5C] hover:bg-[#FAF9F5]'
            }`}
            title="Log in with employee credentials"
          >
            <LogIn size={13} />
            {!isCollapsed && <span>Employee Sign In</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
