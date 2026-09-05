import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmployeeProfile } from './types';

export const DEFAULT_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'emp-1',
    employee_code: 'EMP-4091',
    name: 'Priya Sharma',
    email: 'priya.sharma@clarivo.telecom.in',
    phone: '+91 98451 22340',
    role: 'Tier 1 Support Specialist',
    department: 'Broadband Customer Ops',
    desk_location: 'Bengaluru BLR-Floor 4 - Pod C',
    status: 'ONLINE',
    avatar_initial: 'P',
    cases_today: 18,
    sla_compliance: 99.4,
    avg_handling_time_min: 3.2,
    joined_date: 'March 2024',
    bio: 'Specialist in GPON ONT diagnostics, optical fiber link verification, and customer billing reconciliation.',
    shift_hours: '08:00 - 17:00 IST (Morning Shift)',
    csat_score: 4.9,
    fcr_rate: 93.2,
  },
  {
    id: 'emp-2',
    employee_code: 'EMP-2104',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@clarivo.telecom.in',
    phone: '+91 98452 44910',
    role: 'Tier 2 NOC Engineer',
    department: 'NOC & Field Dispatch',
    desk_location: 'Hyderabad HYD-Tower A - Station 09',
    status: 'ONLINE',
    avatar_initial: 'R',
    cases_today: 12,
    sla_compliance: 98.8,
    avg_handling_time_min: 6.4,
    joined_date: 'January 2023',
    bio: 'Core network routing, OLT port provisioning, BGP routing anomalies, and field technician dispatch coordination.',
    shift_hours: '14:00 - 23:00 IST (Afternoon Shift)',
    csat_score: 4.8,
    fcr_rate: 89.5,
  },
  {
    id: 'emp-3',
    employee_code: 'EMP-1008',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@clarivo.telecom.in',
    phone: '+91 98453 88102',
    role: 'Team Lead / QA Supervisor',
    department: 'Executive Escalations & QA',
    desk_location: 'Mumbai HQ Desk 12 - Level 6',
    status: 'ONLINE',
    avatar_initial: 'A',
    cases_today: 26,
    sla_compliance: 99.9,
    avg_handling_time_min: 2.8,
    joined_date: 'August 2021',
    bio: 'Customer escalation review, SLA enforcement, compliance auditing, and operator coaching for Clarivo invariants.',
    shift_hours: '09:00 - 18:00 IST (General Shift)',
    csat_score: 5.0,
    fcr_rate: 96.7,
  },
  {
    id: 'emp-4',
    employee_code: 'EMP-5520',
    name: 'Vikram Malhotra',
    email: 'vikram.m@clarivo.telecom.in',
    phone: '+91 98454 11993',
    role: 'Billing Specialist',
    department: 'Finance & Billing Ops',
    desk_location: 'Delhi DL-Center 2 - Billing Bay 4',
    status: 'BREAK',
    avatar_initial: 'V',
    cases_today: 9,
    sla_compliance: 97.5,
    avg_handling_time_min: 4.1,
    joined_date: 'November 2024',
    bio: 'Invoice reconciliation, tariff plan discrepancies, GST credit adjustments, and disputed overdue waivers.',
    shift_hours: '10:00 - 19:00 IST (General Shift)',
    csat_score: 4.7,
    fcr_rate: 91.0,
  },
];

interface EmployeeContextType {
  currentEmployee: EmployeeProfile | null;
  employees: EmployeeProfile[];
  isLoggedIn: boolean;
  login: (employeeIdOrCode: string) => boolean;
  signup: (newEmployee: Omit<EmployeeProfile, 'id' | 'cases_today' | 'sla_compliance' | 'avg_handling_time_min' | 'joined_date'>) => EmployeeProfile;
  logout: () => void;
  updateStatus: (status: 'ONLINE' | 'BREAK' | 'OFFLINE') => void;
  switchEmployee: (employeeId: string) => void;
  updateProfile: (employeeId: string, updatedData: Partial<EmployeeProfile>) => void;
}

const EmployeeContext = createContext<EmployeeContextType>({
  currentEmployee: DEFAULT_EMPLOYEES[0],
  employees: DEFAULT_EMPLOYEES,
  isLoggedIn: true,
  login: () => false,
  signup: () => DEFAULT_EMPLOYEES[0],
  logout: () => {},
  updateStatus: () => {},
  switchEmployee: () => {},
  updateProfile: () => {},
});

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => {
    try {
      const saved = localStorage.getItem('clarivo-employees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_EMPLOYEES;
  });

  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(() => {
    try {
      const token = localStorage.getItem('clarivo-employee-token');
      const savedId = localStorage.getItem('clarivo-current-employee-id');
      if (token && savedId) return savedId;
    } catch {
      // fallback
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check backend session on load
  useEffect(() => {
    async function checkEmpSession() {
      const empToken = localStorage.getItem('clarivo-employee-token');
      if (empToken) {
        try {
          const res = await fetch('/api/auth/session', {
            headers: { Authorization: `Bearer ${empToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user && data.user.role === 'employee') {
              const matched = employees.find((e) => e.id === data.user.id || e.employee_code === data.user.employee_code);
              if (matched) setCurrentEmployeeId(matched.id);
            }
          }
        } catch (e) {
          console.error('Employee session restore error:', e);
        }
      }
      setIsLoading(false);
    }
    checkEmpSession();
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('clarivo-employees', JSON.stringify(employees));
    } catch (e) {
      console.warn('Could not save employees list:', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      if (currentEmployeeId) {
        localStorage.setItem('clarivo-current-employee-id', currentEmployeeId);
      } else {
        localStorage.removeItem('clarivo-current-employee-id');
      }
    } catch (e) {
      console.warn('Could not save current employee id:', e);
    }
  }, [currentEmployeeId]);

  const currentEmployee = employees.find((e) => e.id === currentEmployeeId) || null;

  const login = (employeeIdOrCode: string): boolean => {
    const query = employeeIdOrCode.trim().toLowerCase();
    const found = employees.find(
      (e) =>
        e.id.toLowerCase() === query ||
        e.employee_code.toLowerCase() === query ||
        e.email.toLowerCase() === query ||
        e.name.toLowerCase().includes(query)
    );

    if (found) {
      setCurrentEmployeeId(found.id);
      localStorage.setItem('clarivo-employee-token', `emp_local_${found.id}`);
      return true;
    }
    return false;
  };

  const signup = (
    newEmployeeData: Omit<EmployeeProfile, 'id' | 'cases_today' | 'sla_compliance' | 'avg_handling_time_min' | 'joined_date'>
  ): EmployeeProfile => {
    const id = `emp-${Date.now()}`;
    const initial = newEmployeeData.name.trim().charAt(0).toUpperCase() || 'E';
    const completeProfile: EmployeeProfile = {
      ...newEmployeeData,
      id,
      avatar_initial: initial,
      cases_today: 0,
      sla_compliance: 100.0,
      avg_handling_time_min: 0.0,
      joined_date: 'Just now',
    };

    setEmployees((prev) => [completeProfile, ...prev]);
    setCurrentEmployeeId(id);
    localStorage.setItem('clarivo-employee-token', `emp_local_${id}`);
    return completeProfile;
  };

  const logout = () => {
    const empToken = localStorage.getItem('clarivo-employee-token');
    if (empToken && !empToken.startsWith('emp_local_')) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${empToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('clarivo-employee-token');
    setCurrentEmployeeId(null);
  };

  const updateStatus = (status: 'ONLINE' | 'BREAK' | 'OFFLINE') => {
    if (!currentEmployeeId) return;
    setEmployees((prev) =>
      prev.map((e) => (e.id === currentEmployeeId ? { ...e, status } : e))
    );
  };

  const switchEmployee = (employeeId: string) => {
    if (employees.some((e) => e.id === employeeId)) {
      setCurrentEmployeeId(employeeId);
      localStorage.setItem('clarivo-employee-token', `emp_local_${employeeId}`);
    }
  };

  const updateProfile = (employeeId: string, updatedData: Partial<EmployeeProfile>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === employeeId) {
          const updated = { ...e, ...updatedData };
          if (updatedData.name && !updatedData.avatar_initial) {
            updated.avatar_initial = updatedData.name.trim().charAt(0).toUpperCase();
          }
          return updated;
        }
        return e;
      })
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        currentEmployee,
        employees,
        isLoggedIn: !!currentEmployee,
        login,
        signup,
        logout,
        updateStatus,
        switchEmployee,
        updateProfile,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => useContext(EmployeeContext);

