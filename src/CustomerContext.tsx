import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerUser {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  phone?: string;
  plan_name?: string;
  role: 'customer';
}

interface CustomerContextType {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  checkSession: async () => {},
});

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('clarivo-customer-token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    const savedToken = localStorage.getItem('clarivo-customer-token');
    if (!savedToken) {
      setCustomer(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user && data.user.role === 'customer') {
          setCustomer(data.user);
          setToken(savedToken);
        } else {
          localStorage.removeItem('clarivo-customer-token');
          setCustomer(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('clarivo-customer-token');
        setCustomer(null);
        setToken(null);
      }
    } catch (e) {
      console.error('Customer session check error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('clarivo-customer-token', data.token);
        setToken(data.token);
        setCustomer(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; phone?: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        localStorage.setItem('clarivo-customer-token', resData.token);
        setToken(resData.token);
        setCustomer(resData.user);
        return { success: true };
      } else {
        return { success: false, error: resData.error || 'Signup failed' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('clarivo-customer-token');
    setToken(null);
    setCustomer(null);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        token,
        login,
        signup,
        logout,
        checkSession,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
