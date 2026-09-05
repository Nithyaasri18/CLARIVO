import React, { useState } from 'react';
import {
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
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Edit3,
  Save,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Headphones,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';
import { EmployeeProfile, CaseSummary } from '../types';

interface EmployeeProfileViewProps {
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onSelectCase?: (caseId: string) => void;
  onNotification?: (msg: string) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  onOpenAuthModal,
  onSelectCase,
  onNotification,
}) => {
  const {
    currentEmployee,
    employees,
    updateStatus,
    updateProfile,
    switchEmployee,
    logout,
  } = useEmployee();
  const { isDark, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: currentEmployee?.name || '',
    email: currentEmployee?.email || '',
    phone: currentEmployee?.phone || '+91 98450 00000',
    role: currentEmployee?.role || 'Tier 1 Support Specialist',
    department: currentEmployee?.department || 'Broadband Customer Ops',
    desk_location: currentEmployee?.desk_location || 'Bengaluru BLR-Floor 4',
    shift_hours: currentEmployee?.shift_hours || '09:00 - 18:00 IST (General Shift)',
    bio:
      currentEmployee?.bio ||
      'Broadband Customer Resolution Specialist specializing in GPON ONT diagnostics, optical fiber link verification, and customer billing reconciliation.',
  });

  // Sync form data if currentEmployee changes
  React.useEffect(() => {
    if (currentEmployee) {
      setFormData({
        name: currentEmployee.name,
        email: currentEmployee.email,
        phone: currentEmployee.phone || '+91 98450 00000',
        role: currentEmployee.role,
        department: currentEmployee.department,
        desk_location: currentEmployee.desk_location,
        shift_hours: currentEmployee.shift_hours || '09:00 - 18:00 IST (General Shift)',
        bio:
          currentEmployee.bio ||
          'Broadband Customer Resolution Specialist specializing in GPON ONT diagnostics, optical fiber link verification, and customer billing reconciliation.',
      });
    }
  }, [currentEmployee]);

  if (!currentEmployee) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center p-6 ${
          isDark ? 'bg-[#0E121B] text-slate-100' : 'bg-[#FAF9F5] text-stone-900'
        }`}
      >
        <div
          className={`max-w-md w-full p-8 rounded-lg border text-center space-y-4 shadow-sm ${
            isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
          }`}
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <User size={28} />
          </div>
          <h2 className="text-lg font-bold">No Employee Session Active</h2>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            You are currently signed out of the operator station. Sign in to view and manage your profile, cases, and shift metrics.
          </p>
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            className={`w-full py-2.5 px-4 rounded text-xs font-bold transition-all shadow-xs ${
              isDark
                ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
            }`}
          >
            Sign In to Operator Station
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (onNotification) onNotification('Please provide a valid employee name');
      return;
    }

    updateProfile(currentEmployee.id, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      department: formData.department,
      desk_location: formData.desk_location.trim(),
      shift_hours: formData.shift_hours.trim(),
      bio: formData.bio.trim(),
      avatar_initial: formData.name.trim().charAt(0).toUpperCase(),
    });

    setIsEditing(false);
    if (onNotification) {
      onNotification('Operator dossier successfully updated and saved');
    }
  };

  const handleStatusChange = (status: 'ONLINE' | 'BREAK' | 'OFFLINE') => {
    updateStatus(status);
    if (onNotification) {
      onNotification(`Duty status updated to ${status}`);
    }
  };

  const roleOptions = [
    'Tier 1 Support Specialist',
    'Tier 2 NOC Engineer',
    'Team Lead / QA Supervisor',
    'Billing Specialist',
    'Optical Fiber Field Dispatcher',
    'Executive Escalations Lead',
  ];

  const departmentOptions = [
    'Broadband Customer Ops',
    'NOC & Field Dispatch',
    'Executive Escalations & QA',
    'Finance & Billing Ops',
    'Optical Fiber Network Engineering',
  ];

  const recentOperatorCases = [
    {
      id: 'CASE-B-LOS',
      customer: 'Arun Kumar',
      plan: 'Fiber 799',
      intent: 'CONNECTIVITY_OUTAGE',
      result: 'Clarification Prompt Issued (Router LOS Verification)',
      time: '18 mins ago',
      slaStatus: 'MET',
    },
    {
      id: 'CASE-A-BILL',
      customer: 'Meena R',
      plan: 'Gigabit Pro 1499',
      intent: 'BILLING_PAYMENT',
      result: 'Automatic Restoration Invariant Grounded (15m window)',
      time: '1 hour ago',
      slaStatus: 'MET',
    },
    {
      id: 'CASE-C-ESC',
      customer: 'Rahul S',
      plan: 'Broadband Basic 499',
      intent: 'REPEAT_CONTACT',
      result: 'Deterministic Handover to Field Dispatch Level 2',
      time: '3 hours ago',
      slaStatus: 'MET',
    },
  ];

  return (
    <div
      id="employee-profile-page"
      className={`flex-1 overflow-y-auto ${
        isDark ? 'bg-[#0E121B] text-slate-100' : 'bg-[#FAF9F5] text-stone-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Header Banner & Profile Overview */}
        <div
          className={`rounded-lg border overflow-hidden shadow-xs transition-colors ${
            isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
          }`}
        >
          {/* Top Banner Accent */}
          <div
            className={`h-24 sm:h-28 relative flex items-end px-6 pb-3 ${
              isDark
                ? 'bg-gradient-to-r from-[#11232c] via-[#152e37] to-[#121c2c]'
                : 'bg-gradient-to-r from-[#0F4C5C]/15 via-[#14B8A6]/10 to-[#EAE8DF]'
            }`}
          >
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isDark
                    ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
                    : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C]'
                }`}
              >
                Operator Desk ID · {currentEmployee.employee_code}
              </span>
            </div>
          </div>

          {/* Profile Core Bar */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
              {/* Avatar + Main Info */}
              <div className="flex items-end gap-4">
                <div className="relative shrink-0">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center font-mono font-bold text-3xl border-4 shadow-md ${
                      isDark
                        ? 'bg-[#14B8A6]/20 border-[#151922] text-[#14B8A6]'
                        : 'bg-[#0F4C5C] border-white text-white'
                    }`}
                  >
                    {currentEmployee.avatar_initial}
                  </div>
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ${
                      isDark ? 'ring-[#151922]' : 'ring-white'
                    } ${
                      currentEmployee.status === 'ONLINE'
                        ? 'bg-[#15803D]'
                        : currentEmployee.status === 'BREAK'
                        ? 'bg-[#D97706]'
                        : 'bg-stone-400'
                    }`}
                    title={`Duty: ${currentEmployee.status}`}
                  />
                </div>

                <div className="pt-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {currentEmployee.name}
                    </h1>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isDark ? 'bg-[#1E2533] text-slate-300' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {currentEmployee.role}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-2 ${
                      isDark ? 'text-slate-400' : 'text-stone-500'
                    }`}
                  >
                    <span>{currentEmployee.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin size={12} />
                      {currentEmployee.desk_location}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border shadow-xs ${
                    isEditing
                      ? isDark
                        ? 'bg-[#1E2533] border-[#2A3140] text-slate-200'
                        : 'bg-stone-200 border-stone-300 text-stone-800'
                      : isDark
                      ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40 text-[#14B8A6] hover:bg-[#14B8A6]/30'
                      : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C] hover:bg-[#0F4C5C]/20'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={13} />
                      <span>Cancel Editing</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={13} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border shadow-xs ${
                    isDark
                      ? 'bg-[#1C222E] border-[#2A3140] text-amber-400 hover:bg-[#252E3E]'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                  title="Toggle Light / Dark theme"
                >
                  {isDark ? <Sun size={13} /> : <Moon size={13} />}
                  <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border shadow-xs ${
                    isDark
                      ? 'bg-[#1C222E] border-[#2A3140] text-slate-300 hover:bg-[#252E3E]'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                  title="Switch operator session"
                >
                  <RefreshCw size={13} />
                  <span>Switch Operator</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    if (onNotification) onNotification('Logged out of operator station');
                    if (onOpenAuthModal) onOpenAuthModal('login');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 shadow-xs"
                  title="Sign out of station"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Shift Duty Status Controls */}
            <div
              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Duty Status:
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    currentEmployee.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : currentEmployee.status === 'BREAK'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-stone-500/10 text-stone-400 border border-stone-500/20'
                  }`}
                >
                  {currentEmployee.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange('ONLINE')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentEmployee.status === 'ONLINE'
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : isDark
                      ? 'bg-[#1C222E] text-slate-300 hover:bg-[#252E3E]'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Active On-Desk</span>
                </button>

                <button
                  onClick={() => handleStatusChange('BREAK')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentEmployee.status === 'BREAK'
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : isDark
                      ? 'bg-[#1C222E] text-slate-300 hover:bg-[#252E3E]'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Meal / Break</span>
                </button>

                <button
                  onClick={() => handleStatusChange('OFFLINE')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentEmployee.status === 'OFFLINE'
                      ? 'bg-stone-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-[#1C222E] text-slate-300 hover:bg-[#252E3E]'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span>Shift Ended</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Operational KPIs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              Cases Today
            </div>
            <div className="text-2xl font-bold font-mono text-[#0F4C5C] dark:text-[#14B8A6]">
              {currentEmployee.cases_today}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              ↑ 12% vs team avg
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              SLA Adherence
            </div>
            <div className="text-2xl font-bold font-mono text-[#15803D]">
              {currentEmployee.sla_compliance}%
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Grounded Invariant
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              Avg Turnaround
            </div>
            <div className="text-2xl font-bold font-mono">
              {currentEmployee.avg_handling_time_min}m
            </div>
            <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Benchmark: &lt; 5.0m
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              CSAT Rating
            </div>
            <div className="text-2xl font-bold font-mono text-amber-500">
              {currentEmployee.csat_score || 4.9} / 5
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              ★ Top Quartile
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              FCR Rate
            </div>
            <div className="text-2xl font-bold font-mono">
              {currentEmployee.fcr_rate || 93.2}%
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              First-contact resolve
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border shadow-xs text-center space-y-1 ${
              isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
            }`}
          >
            <div
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              Grounding Audit
            </div>
            <div className="text-2xl font-bold font-mono text-[#15803D]">
              100%
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Zero-Hallucination
            </div>
          </div>
        </div>

        {/* 3. Main Grid: Dossier / Edit Form + Sidebar Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Profile Details / Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dossier Card or Edit Form */}
            <div
              className={`rounded-lg border p-6 shadow-xs transition-colors ${
                isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded ${
                      isDark ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                    }`}
                  >
                    <User size={16} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                    {isEditing ? 'Edit Operator Credentials' : 'Employee Dossier & Configuration'}
                  </h2>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                      isDark
                        ? 'text-[#14B8A6] hover:bg-[#14B8A6]/10'
                        : 'text-[#0F4C5C] hover:bg-[#0F4C5C]/10'
                    }`}
                  >
                    <Edit3 size={13} />
                    <span>Edit Information</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Official Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        VoIP Ext / Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Operational Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      >
                        {departmentOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Desk Station / Location
                      </label>
                      <input
                        type="text"
                        value={formData.desk_location}
                        onChange={(e) => setFormData({ ...formData, desk_location: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-stone-700'
                      }`}
                    >
                      Shift Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.shift_hours}
                      onChange={(e) => setFormData({ ...formData, shift_hours: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                        isDark
                          ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                          : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-stone-700'
                      }`}
                    >
                      Professional Bio & Telecommunications Specialization
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 resize-none ${
                        isDark
                          ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                          : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded text-xs font-semibold border transition-colors ${
                        isDark
                          ? 'bg-[#1C222E] border-[#2A3140] text-slate-300 hover:bg-[#252E3E]'
                          : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-all shadow-xs ${
                        isDark
                          ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                          : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
                      }`}
                    >
                      <Save size={13} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-Only Dossier View */
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`p-3 rounded border ${
                        isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        Employee Identification
                      </span>
                      <div className="font-mono font-bold text-sm mt-0.5">
                        {currentEmployee.employee_code}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Active Authorization Level 3
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded border ${
                        isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        Operational Role & Department
                      </span>
                      <div className="font-semibold text-sm mt-0.5">{currentEmployee.role}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        {currentEmployee.department}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded border ${
                        isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        Official Communications
                      </span>
                      <div className="font-mono text-xs mt-0.5 flex items-center gap-1.5">
                        <Mail size={12} className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'} />
                        {currentEmployee.email}
                      </div>
                      <div
                        className={`font-mono text-xs mt-1 flex items-center gap-1.5 ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        <Phone size={12} />
                        {currentEmployee.phone || '+91 98451 22340'}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded border ${
                        isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        Work Station & Tenure
                      </span>
                      <div className="font-semibold text-xs mt-0.5 flex items-center gap-1.5">
                        <Building
                          size={12}
                          className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'}
                        />
                        {currentEmployee.desk_location}
                      </div>
                      <div
                        className={`text-[11px] mt-1 flex items-center gap-1.5 ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        <Calendar size={12} />
                        Joined {currentEmployee.joined_date}
                      </div>
                    </div>
                  </div>

                  {/* Bio & Specialization */}
                  <div
                    className={`p-3.5 rounded border ${
                      isDark ? 'bg-[#10131A] border-[#222834]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider block mb-1 font-mono ${
                        isDark ? 'text-slate-400' : 'text-stone-500'
                      }`}
                    >
                      Specialization & Operational Scope
                    </span>
                    <p
                      className={`leading-relaxed text-xs ${
                        isDark ? 'text-slate-300' : 'text-stone-700'
                      }`}
                    >
                      {currentEmployee.bio ||
                        'Specialist in GPON ONT diagnostics, optical fiber link verification, and customer billing reconciliation.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
                            : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C]'
                        }`}
                      >
                        GPON ONT Diagnostics
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
                            : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C]'
                        }`}
                      >
                        TR-069 Protocol
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
                            : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C]'
                        }`}
                      >
                        Tariff Invariant Auditing
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]'
                            : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/30 text-[#0F4C5C]'
                        }`}
                      >
                        Field Handover Routing
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Cases Handled Card */}
            <div
              className={`rounded-lg border p-6 shadow-xs transition-colors ${
                isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded ${
                      isDark ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                    }`}
                  >
                    <Headphones size={16} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                    Recent Handled Cases by {currentEmployee.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  100% SLA Maintained
                </span>
              </div>

              <div className="space-y-2.5">
                {recentOperatorCases.map((rc) => (
                  <div
                    key={rc.id}
                    className={`p-3 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                      isDark
                        ? 'bg-[#10131A] border-[#222834] hover:border-[#2A3140]'
                        : 'bg-[#FAF9F5] border-[#E5E3DD] hover:border-stone-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs">{rc.id}</span>
                        <span className="text-xs font-semibold">{rc.customer}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {rc.plan}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 truncate ${
                          isDark ? 'text-slate-300' : 'text-stone-600'
                        }`}
                      >
                        {rc.result}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-mono ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        {rc.time}
                      </span>
                      {onSelectCase && (
                        <button
                          onClick={() => onSelectCase(rc.id)}
                          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                            isDark
                              ? 'bg-[#1C222E] hover:bg-[#252E3E] text-[#14B8A6]'
                              : 'bg-white hover:bg-stone-100 text-[#0F4C5C] border border-stone-200'
                          }`}
                        >
                          <span>Review</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Team Colleagues & Quick Switcher */}
          <div className="space-y-6">
            {/* Department Roster / Colleague Switcher */}
            <div
              className={`rounded-lg border p-5 shadow-xs transition-colors ${
                isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded ${
                      isDark ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                    }`}
                  >
                    <Briefcase size={15} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                    Colleague Roster
                  </h3>
                </div>
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                  className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    isDark ? 'text-[#14B8A6] hover:underline' : 'text-[#0F4C5C] hover:underline'
                  }`}
                  title="Add new colleague"
                >
                  <UserPlus size={12} />
                  <span>Register</span>
                </button>
              </div>

              <p
                className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
              >
                Switch between team operator profiles for cross-functional simulation:
              </p>

              <div className="space-y-2">
                {employees.map((emp) => {
                  const isCurrent = emp.id === currentEmployee.id;
                  return (
                    <div
                      key={emp.id}
                      className={`p-2.5 rounded border flex items-center justify-between gap-2.5 transition-all ${
                        isCurrent
                          ? isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6]/40'
                            : 'bg-[#0F4C5C]/10 border-[#0F4C5C]/40'
                          : isDark
                          ? 'bg-[#10131A] border-[#222834] hover:border-[#2A3140]'
                          : 'bg-[#FAF9F5] border-[#E5E3DD] hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs border ${
                              isCurrent
                                ? isDark
                                  ? 'bg-[#14B8A6] text-black border-[#14B8A6]'
                                  : 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                                : isDark
                                ? 'bg-slate-800 text-slate-200 border-slate-700'
                                : 'bg-stone-200 text-stone-700 border-stone-300'
                            }`}
                          >
                            {emp.avatar_initial}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white ${
                              emp.status === 'ONLINE'
                                ? 'bg-[#15803D]'
                                : emp.status === 'BREAK'
                                ? 'bg-[#D97706]'
                                : 'bg-stone-400'
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-tight">
                            {emp.name}
                          </div>
                          <div
                            className={`text-[10px] truncate leading-tight ${
                              isDark ? 'text-slate-400' : 'text-stone-500'
                            }`}
                          >
                            {emp.role}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isDark
                                ? 'bg-[#14B8A6]/20 text-[#14B8A6]'
                                : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                            }`}
                          >
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              switchEmployee(emp.id);
                              if (onNotification) {
                                onNotification(`Switched active operator to ${emp.name}`);
                              }
                            }}
                            className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors border ${
                              isDark
                                ? 'bg-[#1C222E] hover:bg-[#252E3E] border-[#2A3140] text-slate-200'
                                : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
                            }`}
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Preferences Card */}
            <div
              className={`rounded-lg border p-5 shadow-xs transition-colors ${
                isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className={isDark ? 'text-[#14B8A6]' : 'text-[#0F4C5C]'} />
                <span>Station Preferences</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-current/10">
                  <div>
                    <div className="font-semibold">Display Theme</div>
                    <div
                      className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                    >
                      {isDark ? 'Dark Slate Mode' : 'Editorial Light Mode'}
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded transition-colors border ${
                      isDark
                        ? 'bg-[#1C222E] border-[#2A3140] text-amber-400 hover:bg-[#252E3E]'
                        : 'bg-[#FAF9F5] border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                    title="Toggle Theme"
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-current/10">
                  <div>
                    <div className="font-semibold">Invariant Enforcement</div>
                    <div
                      className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                    >
                      Strict Deterministic Mode
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    ALWAYS ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <div className="font-semibold">Audit Logging</div>
                    <div
                      className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                    >
                      Track PS04 Compliant
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                    ENABLED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
