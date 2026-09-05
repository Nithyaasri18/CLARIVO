import React, { useState } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  Lock,
  Mail,
  Building,
  MapPin,
  Shield,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';

interface EmployeeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccessNotification?: (msg: string) => void;
}

export const EmployeeAuthModal: React.FC<EmployeeAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccessNotification,
}) => {
  const { isDark } = useTheme();
  const { employees, currentEmployee, login, signup, switchEmployee } = useEmployee();

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('clarivo2026');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [employeeCode, setEmployeeCode] = useState(() => `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [role, setRole] = useState('Tier 1 Support Specialist');
  const [department, setDepartment] = useState('Broadband Customer Ops');
  const [deskLocation, setDeskLocation] = useState('Bengaluru BLR-Floor 4');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Employee Code or Email address');
      return;
    }

    const success = login(loginIdentifier);
    if (success) {
      if (onSuccessNotification) {
        onSuccessNotification(`Welcome back! Authenticated as ${loginIdentifier}`);
      }
      onClose();
    } else {
      setErrorMsg('Employee account not found. Try one of the demo profiles below or register.');
    }
  };

  const handleQuickSwitch = (empId: string, empName: string) => {
    switchEmployee(empId);
    if (onSuccessNotification) {
      onSuccessNotification(`Switched operator profile to ${empName}`);
    }
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name');
      return;
    }
    if (!workEmail.trim() || !workEmail.includes('@')) {
      setErrorMsg('Please provide a valid company email');
      return;
    }

    const created = signup({
      employee_code: employeeCode.trim().toUpperCase() || `EMP-${Date.now().toString().slice(-4)}`,
      name: fullName.trim(),
      email: workEmail.trim(),
      role,
      department,
      desk_location: deskLocation.trim(),
      status: 'ONLINE',
      avatar_initial: fullName.trim().charAt(0).toUpperCase(),
    });

    if (onSuccessNotification) {
      onSuccessNotification(`Account created! Welcome to Clarivo, ${created.name}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-xl rounded-lg shadow-2xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-[#151921] border-[#2A3140] text-slate-100'
            : 'bg-white border-[#E5E3DD] text-stone-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#191F2A] border-[#2A3140]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded ${
                isDark ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#0F4C5C] text-white'
              }`}
            >
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                Clarivo Enterprise Support Authentication
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Operational station access & role-based audit verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-[#2A3140]'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/60'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switchers: Sign In vs Sign Up */}
        <div
          className={`flex border-b text-xs font-semibold ${
            isDark ? 'border-[#2A3140] bg-[#12151D]' : 'border-[#E5E3DD] bg-[#F7F6F1]'
          }`}
        >
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              mode === 'login'
                ? isDark
                  ? 'border-[#14B8A6] text-[#14B8A6] bg-[#151921] font-bold'
                  : 'border-[#0F4C5C] text-[#0F4C5C] bg-white font-bold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserCheck size={14} />
            <span>Employee Sign In</span>
          </button>

          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              mode === 'signup'
                ? isDark
                  ? 'border-[#14B8A6] text-[#14B8A6] bg-[#151921] font-bold'
                  : 'border-[#0F4C5C] text-[#0F4C5C] bg-white font-bold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserPlus size={14} />
            <span>Register New Employee</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Content Body */}
        {mode === 'login' ? (
          <div className="p-5 space-y-4">
            {/* Quick-switch Profiles */}
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block mb-2 font-mono ${
                  isDark ? 'text-slate-400' : 'text-stone-500'
                }`}
              >
                Instant Profile Switch (Active Operators)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {employees.map((emp) => {
                  const isCurrent = currentEmployee?.id === emp.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => handleQuickSwitch(emp.id, emp.name)}
                      className={`p-2.5 rounded text-left border transition-all flex items-center gap-2.5 ${
                        isCurrent
                          ? isDark
                            ? 'bg-[#14B8A6]/10 border-[#14B8A6] text-[#14B8A6]'
                            : 'bg-[#0F4C5C]/5 border-[#0F4C5C] text-[#0F4C5C]'
                          : isDark
                          ? 'bg-[#1A202C] border-[#2A3140] hover:border-slate-500 text-slate-200'
                          : 'bg-[#FAF9F5] border-[#E5E3DD] hover:border-stone-400 text-stone-800'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isCurrent
                            ? isDark
                              ? 'bg-[#14B8A6] text-black'
                              : 'bg-[#0F4C5C] text-white'
                            : isDark
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {emp.avatar_initial}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold truncate">{emp.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono uppercase bg-current/10 px-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isDark ? 'text-slate-400' : 'text-stone-500'
                          }`}
                        >
                          {emp.role}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div
                className={`flex-grow border-t ${isDark ? 'border-[#2A3140]' : 'border-stone-200'}`}
              />
              <span
                className={`flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider font-mono ${
                  isDark ? 'text-slate-500' : 'text-stone-400'
                }`}
              >
                Or Enter Credentials
              </span>
              <div
                className={`flex-grow border-t ${isDark ? 'border-[#2A3140]' : 'border-stone-200'}`}
              />
            </div>

            {/* Custom login form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Employee Code or Work Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className={`absolute left-2.5 top-2.5 ${
                      isDark ? 'text-slate-500' : 'text-stone-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. EMP-4091 or priya.sharma@clarivo.telecom.in"
                    className={`w-full pl-8 pr-3 py-2 rounded text-xs border focus:outline-none transition-colors font-mono ${
                      isDark
                        ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                        : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Desk Access Token / Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className={`absolute left-2.5 top-2.5 ${
                      isDark ? 'text-slate-500' : 'text-stone-400'
                    }`}
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter station password"
                    className={`w-full pl-8 pr-3 py-2 rounded text-xs border focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                        : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm mt-2 ${
                  isDark
                    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black font-semibold'
                    : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
                }`}
              >
                <UserCheck size={14} />
                <span>Authorize & Enter Console</span>
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSignupSubmit} className="p-5 space-y-3.5 text-xs max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Full Employee Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Siddharth Sen"
                  className={`w-full px-3 py-2 rounded text-xs border focus:outline-none ${
                    isDark
                      ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Employee ID Code
                </label>
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className={`w-full px-3 py-2 rounded text-xs border focus:outline-none font-mono ${
                    isDark
                      ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-stone-700'
                }`}
              >
                Company Work Email
              </label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="siddharth.s@clarivo.telecom.in"
                className={`w-full px-3 py-2 rounded text-xs border focus:outline-none font-mono ${
                  isDark
                    ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                    : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded text-xs border focus:outline-none ${
                    isDark
                      ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                  }`}
                >
                  <option value="Tier 1 Support Specialist">Tier 1 Support Specialist</option>
                  <option value="Tier 2 NOC Engineer">Tier 2 NOC Engineer</option>
                  <option value="Team Lead / QA Supervisor">Team Lead / QA Supervisor</option>
                  <option value="Billing Specialist">Billing Specialist</option>
                </select>
              </div>

              <div>
                <label
                  className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                    isDark ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded text-xs border focus:outline-none ${
                    isDark
                      ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                  }`}
                >
                  <option value="Broadband Customer Ops">Broadband Customer Ops</option>
                  <option value="NOC & Field Dispatch">NOC & Field Dispatch</option>
                  <option value="Executive Escalations & QA">Executive Escalations & QA</option>
                  <option value="Finance & Billing Ops">Finance & Billing Ops</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block font-bold text-[11px] uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-stone-700'
                }`}
              >
                Assigned Desk / City Station
              </label>
              <input
                type="text"
                value={deskLocation}
                onChange={(e) => setDeskLocation(e.target.value)}
                placeholder="e.g. Bengaluru BLR-Floor 4 or Mumbai HQ Desk 08"
                className={`w-full px-3 py-2 rounded text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-[#12151D] border-[#2A3140] text-slate-100 focus:border-[#14B8A6]'
                    : 'bg-white border-stone-300 text-stone-900 focus:border-[#0F4C5C]'
                }`}
              />
            </div>

            <div className="pt-2 border-t border-current/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1.5 rounded text-xs font-medium ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-stone-600 hover:text-black'
                }`}
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  isDark
                    ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black font-semibold'
                    : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
                }`}
              >
                <UserPlus size={14} />
                <span>Register & Login Immediately</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
