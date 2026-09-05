import React, { useState } from 'react';
import {
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
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  Briefcase,
  Layers,
  Phone
} from 'lucide-react';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';
import { BrandLogo } from './BrandLogo';

interface EmployeeAuthPageProps {
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
  onCancel?: () => void;
  onNotification?: (msg: string) => void;
  onNavigateToCustomerAuth?: () => void;
}

export const EmployeeAuthPage: React.FC<EmployeeAuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onCancel,
  onNotification,
  onNavigateToCustomerAuth,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { employees, currentEmployee, login, signup, switchEmployee } = useEmployee();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('EMP-4091');
  const [loginPassword, setLoginPassword] = useState('clarivo2026');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('+91 98450 ');
  const [employeeCode, setEmployeeCode] = useState(() => `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [role, setRole] = useState('Tier 1 Support Specialist');
  const [department, setDepartment] = useState('Broadband Customer Ops');
  const [deskLocation, setDeskLocation] = useState('Bengaluru BLR-Floor 4');
  const [shiftHours, setShiftHours] = useState('09:00 - 18:00 IST (General Shift)');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Employee Code or Email address');
      return;
    }

    const success = login(loginIdentifier);
    if (success) {
      if (onNotification) {
        onNotification(`Authenticated successfully as ${loginIdentifier}`);
      }
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg('Employee account not found. Try one of the quick profiles below or register.');
    }
  };

  const handleQuickSwitch = (empId: string, empName: string) => {
    switchEmployee(empId);
    if (onNotification) {
      onNotification(`Logged in as ${empName}`);
    }
    if (onSuccess) onSuccess();
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
      phone: phone.trim(),
      role,
      department,
      desk_location: deskLocation.trim(),
      shift_hours: shiftHours.trim(),
      status: 'ONLINE',
    });

    if (onNotification) {
      onNotification(`Employee profile created! Welcome, ${created.name}`);
    }
    if (onSuccess) onSuccess();
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

  return (
    <div
      id="employee-auth-page"
      className={`min-h-screen w-full flex flex-col justify-between transition-colors overflow-y-auto ${
        isDark ? 'bg-[#0E121B] text-slate-100' : 'bg-[#FAF9F5] text-stone-900'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`h-14 px-4 sm:px-6 flex items-center justify-between border-b ${
          isDark ? 'bg-[#151922] border-[#222834]' : 'bg-white border-[#E5E3DD]'
        }`}
      >
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-semibold ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-[#1E2533]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Return to Workspace"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Workspace</span>
            </button>
          )}
          <BrandLogo collapsed={false} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded transition-colors flex items-center gap-1.5 text-xs font-medium border ${
              isDark
                ? 'bg-[#1C222E] border-[#2A3140] text-amber-400 hover:bg-[#252E3E]'
                : 'bg-[#FAF9F5] border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
            title="Toggle theme"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span className="hidden sm:inline">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div
          className={`w-full max-w-2xl rounded-lg border shadow-lg overflow-hidden transition-colors ${
            isDark ? 'bg-[#151922] border-[#262D3D]' : 'bg-white border-[#E5E3DD]'
          }`}
        >
          {/* Header Strip */}
          <div
            className={`px-6 py-5 border-b text-center ${
              isDark ? 'bg-[#181D26] border-[#262D3D]' : 'bg-[#FAF9F5] border-[#E5E3DD]'
            }`}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0F4C5C]/15 dark:bg-[#14B8A6]/20 text-[#0F4C5C] dark:text-[#14B8A6] mb-2 font-mono font-bold text-base">
              CLV
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              Clarivo Telecom Operator Portal
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Evidence-Grounded Customer Resolution Copilot · Operational Security & Invariant Audit
            </p>

            {/* Mode Tabs */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-all border ${
                  mode === 'login'
                    ? isDark
                      ? 'bg-[#14B8A6] text-black border-[#14B8A6] shadow-xs'
                      : 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xs'
                    : isDark
                    ? 'bg-[#10131A] text-slate-300 border-[#262D3D] hover:bg-[#1E2533]'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                Operator Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-all border ${
                  mode === 'signup'
                    ? isDark
                      ? 'bg-[#14B8A6] text-black border-[#14B8A6] shadow-xs'
                      : 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xs'
                    : isDark
                    ? 'bg-[#10131A] text-slate-300 border-[#262D3D] hover:bg-[#1E2533]'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                Register New Employee
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'login' ? (
              /* LOGIN TAB */
              <div className="space-y-5">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-stone-700'
                      }`}
                    >
                      Employee Code or Official Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <UserCheck size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. EMP-4091 or priya.sharma@clarivo.telecom.in"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        className={`text-xs font-medium ${
                          isDark ? 'text-slate-300' : 'text-stone-700'
                        }`}
                      >
                        Station Password / Token
                      </label>
                      <span
                        className={`text-[10px] font-mono ${
                          isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}
                      >
                        Default: clarivo2026
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Lock size={14} />
                      </div>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                            : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                        : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
                    }`}
                  >
                    <span>Authenticate & Open Operator Station</span>
                    <ArrowRight size={13} />
                  </button>
                </form>

                {/* Quick 1-Click Employee Switcher */}
                <div className="pt-3 border-t border-current/10">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider font-mono ${
                        isDark ? 'text-slate-400' : 'text-stone-500'
                      }`}
                    >
                      Quick 1-Click Telecom Operator Login
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      Instant Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => handleQuickSwitch(emp.id, emp.name)}
                        className={`p-2.5 rounded border text-left flex items-center gap-2.5 transition-all ${
                          isDark
                            ? 'bg-[#10131A] border-[#222834] hover:border-[#14B8A6] hover:bg-[#161B24]'
                            : 'bg-[#FAF9F5] border-[#E5E3DD] hover:border-[#0F4C5C] hover:bg-[#F4F3ED]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isDark
                              ? 'bg-[#14B8A6]/20 text-[#14B8A6]'
                              : 'bg-[#0F4C5C]/15 text-[#0F4C5C]'
                          }`}
                        >
                          {emp.avatar_initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate leading-tight">
                            {emp.name}
                          </div>
                          <div
                            className={`text-[10px] truncate leading-tight mt-0.5 ${
                              isDark ? 'text-slate-400' : 'text-stone-500'
                            }`}
                          >
                            {emp.role} · {emp.employee_code}
                          </div>
                        </div>
                        <ArrowRight size={12} className="text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* SIGNUP TAB */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-stone-700'
                      }`}
                    >
                      Legal Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sumanth Varma"
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
                      Official Company Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="e.g. sumanth.v@clarivo.telecom.in"
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
                      Direct Phone / Extension
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      Employee Code / Badge
                    </label>
                    <input
                      type="text"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded border font-mono uppercase transition-colors outline-none focus:ring-1 ${
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
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
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
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
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
                      Station Desk Location
                    </label>
                    <input
                      type="text"
                      value={deskLocation}
                      onChange={(e) => setDeskLocation(e.target.value)}
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
                      Shift Schedule
                    </label>
                    <input
                      type="text"
                      value={shiftHours}
                      onChange={(e) => setShiftHours(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors outline-none focus:ring-1 ${
                        isDark
                          ? 'bg-[#10131A] border-[#2A3140] focus:ring-[#14B8A6] text-slate-100'
                          : 'bg-white border-stone-300 focus:ring-[#0F4C5C] text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-[#14B8A6] hover:bg-[#0D9488] text-black'
                        : 'bg-[#0F4C5C] hover:bg-[#0D404E] text-white'
                    }`}
                  >
                    <UserPlus size={14} />
                    <span>Register Colleague & Launch Desk</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Note */}
          <div
            className={`px-6 py-3 border-t text-center text-[11px] ${
              isDark ? 'bg-[#11141B] border-[#262D3D] text-slate-400' : 'bg-[#FAF9F5] border-[#E5E3DD] text-stone-500'
            }`}
          >
            Clarivo deterministic engine enforces evidence-grounded invariants for all registered operators.
          </div>
        </div>
      </main>

      {/* Footer info & Cross-Portal Navigation */}
      <footer
        className={`py-4 px-6 text-center text-xs border-t flex flex-col sm:flex-row items-center justify-between gap-2 ${
          isDark ? 'border-[#222834] text-slate-500' : 'border-[#E5E3DD] text-stone-500'
        }`}
      >
        <span>Track PS04: Evidence-Grounded Customer Resolution Copilot</span>
        {onNavigateToCustomerAuth && (
          <button
            type="button"
            onClick={onNavigateToCustomerAuth}
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            ← Switch to Customer Login / Support Portal
          </button>
        )}
      </footer>
    </div>
  );
};

