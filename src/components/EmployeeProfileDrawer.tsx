import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  Clock,
  CheckCircle,
  LogOut,
  UserPlus,
  RefreshCw,
  Sun,
  Moon,
  Building,
  MapPin,
  Award,
  Activity,
  Layers
} from 'lucide-react';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';

interface EmployeeProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onNavigateToProfile?: () => void;
  onNotification?: (msg: string) => void;
}

export const EmployeeProfileDrawer: React.FC<EmployeeProfileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  onNavigateToProfile,
  onNotification,
}) => {
  const { currentEmployee, updateStatus, logout } = useEmployee();
  const { theme, toggleTheme, isDark } = useTheme();

  if (!isOpen || !currentEmployee) return null;

  const handleStatusChange = (status: 'ONLINE' | 'BREAK' | 'OFFLINE') => {
    updateStatus(status);
    if (onNotification) {
      onNotification(`Duty status updated to ${status}`);
    }
  };

  const handleLogout = () => {
    logout();
    if (onNotification) {
      onNotification('Signed out of operational desk');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs select-none">
      <div
        className={`w-full sm:w-[380px] h-full shadow-2xl flex flex-col justify-between border-l transition-all animate-fadeIn ${
          isDark
            ? 'bg-[#151922] border-[#262D3D] text-slate-100'
            : 'bg-white border-[#E5E3DD] text-stone-900'
        }`}
      >
        {/* Top Header */}
        <div>
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'bg-[#191F2B] border-[#262D3D]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded ${
                  isDark ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                }`}
              >
                <User size={15} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Operator Station Dossier
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-[#262D3D]'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Employee Badge Card */}
          <div className="p-5 border-b border-current/10 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-xl border-2 shadow-sm ${
                    isDark
                      ? 'bg-[#14B8A6]/20 border-[#14B8A6] text-[#14B8A6]'
                      : 'bg-[#0F4C5C] border-[#0F4C5C] text-white'
                  }`}
                >
                  {currentEmployee.avatar_initial}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                    currentEmployee.status === 'ONLINE'
                      ? 'bg-[#15803D]'
                      : currentEmployee.status === 'BREAK'
                      ? 'bg-[#D97706]'
                      : 'bg-stone-400'
                  }`}
                  title={`Status: ${currentEmployee.status}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold truncate leading-tight">
                    {currentEmployee.name}
                  </h3>
                </div>
                <div className="text-xs font-semibold text-[#0F4C5C] dark:text-[#14B8A6] mt-0.5 truncate">
                  {currentEmployee.role}
                </div>
                <div
                  className={`text-[11px] font-mono mt-0.5 truncate ${
                    isDark ? 'text-slate-400' : 'text-stone-500'
                  }`}
                >
                  {currentEmployee.employee_code} · {currentEmployee.department}
                </div>
              </div>
            </div>

            {/* Shift Duty Status Selector */}
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 font-mono ${
                  isDark ? 'text-slate-400' : 'text-stone-500'
                }`}
              >
                Shift Duty State
              </span>
              <div
                className={`grid grid-cols-3 gap-1.5 p-1 rounded border text-xs font-semibold ${
                  isDark ? 'bg-[#10131A] border-[#262D3D]' : 'bg-[#F4F3ED] border-[#E5E3DD]'
                }`}
              >
                <button
                  onClick={() => handleStatusChange('ONLINE')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-[11px] ${
                    currentEmployee.status === 'ONLINE'
                      ? isDark
                        ? 'bg-[#15803D] text-white shadow-xs font-bold'
                        : 'bg-[#15803D] text-white shadow-xs font-bold'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Online</span>
                </button>

                <button
                  onClick={() => handleStatusChange('BREAK')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-[11px] ${
                    currentEmployee.status === 'BREAK'
                      ? 'bg-[#D97706] text-white shadow-xs font-bold'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  <span>Break</span>
                </button>

                <button
                  onClick={() => handleStatusChange('OFFLINE')}
                  className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all text-[11px] ${
                    currentEmployee.status === 'OFFLINE'
                      ? 'bg-stone-500 text-white shadow-xs font-bold'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-stone-300" />
                  <span>Offline</span>
                </button>
              </div>
            </div>

            {/* Shift Performance Metrics */}
            <div
              className={`p-3 rounded border space-y-2 text-xs ${
                isDark ? 'bg-[#1A202D] border-[#2A3140]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-slate-400' : 'text-stone-500'
                  }`}
                >
                  Today's Operations
                </span>
                <span className="text-[10px] text-[#15803D] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck size={11} /> Grounded
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div>
                  <div className="text-lg font-bold font-mono">{currentEmployee.cases_today}</div>
                  <div
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                  >
                    Cases
                  </div>
                </div>

                <div>
                  <div className="text-lg font-bold font-mono text-[#15803D]">
                    {currentEmployee.sla_compliance}%
                  </div>
                  <div
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                  >
                    SLA Rating
                  </div>
                </div>

                <div>
                  <div className="text-lg font-bold font-mono">
                    {currentEmployee.avg_handling_time_min}m
                  </div>
                  <div
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                  >
                    Avg Turnaround
                  </div>
                </div>
              </div>
            </div>

            {/* Station Details */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>Work Station</span>
                <span className="font-medium font-mono">{currentEmployee.desk_location}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-current/10">
                <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>Work Email</span>
                <span className="font-mono text-[11px] truncate max-w-[200px]">
                  {currentEmployee.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-current/10">
                <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>Tenure</span>
                <span className="font-mono text-[11px]">{currentEmployee.joined_date}</span>
              </div>
            </div>
          </div>

          {/* Theme Quick Switcher in Profile */}
          <div className="p-4 border-b border-current/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={15} className="text-[#14B8A6]" /> : <Sun size={15} className="text-amber-500" />}
              <span className="font-medium">Theme Mode</span>
            </div>

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
                isDark
                  ? 'bg-[#1E2533] border-[#2A3140] text-slate-200 hover:bg-[#283244]'
                  : 'bg-[#F4F3ED] border-stone-300 text-stone-800 hover:bg-stone-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun size={13} className="text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-stone-600" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-[#262D3D] bg-[#12151D]' : 'border-[#E5E3DD] bg-[#FAF9F5]'}`}>
          {onNavigateToProfile && (
            <button
              onClick={() => {
                onClose();
                onNavigateToProfile();
              }}
              className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                isDark
                  ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                  : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
              }`}
            >
              <User size={13} />
              <span>Open & Edit Full Profile Page</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenAuthModal('login');
            }}
            className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              isDark
                ? 'bg-[#191F2B] border-[#2A3140] text-slate-200 hover:bg-[#252E3E]'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <RefreshCw size={13} />
            <span>Switch Profile / Login</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAuthModal('signup');
            }}
            className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              isDark
                ? 'bg-[#191F2B] border-[#2A3140] text-slate-200 hover:bg-[#252E3E]'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
            }`}
          >
            <UserPlus size={13} />
            <span>Register New Colleague</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
