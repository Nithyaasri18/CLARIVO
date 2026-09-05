import React, { useState } from 'react';
import { CustomerRecord } from '../types';
import { User, CreditCard, Wifi, History, Search, Phone, Mail, MapPin } from 'lucide-react';

interface CustomerAccountsModalProps {
  customers: CustomerRecord[];
  onSelectCustomerForSimulation?: (customerId: string) => void;
}

export const CustomerAccountsModal: React.FC<CustomerAccountsModalProps> = ({
  customers,
  onSelectCustomerForSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(customers[0]?.customer_id || null);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.customer_id.toLowerCase().includes(q) ||
      c.plan_name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const activeCustomer = customers.find((c) => c.customer_id === activeCustomerId) || filteredCustomers[0];

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-stone-800" />
            <h2 className="font-bold text-stone-900 text-base">Subscriber Accounts & Ledgers</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-stone-200 text-stone-800">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            Real subscriber telemetry, ledger balances, and SLA ticket records.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-stone-600 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name, ID, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 placeholder:text-stone-600"
          />
        </div>
      </div>

      {/* Body: Master / Detail */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] divide-y md:divide-y-0 md:divide-x divide-stone-200">
        {/* Left: Customer List */}
        <div className="md:col-span-5 max-h-[600px] overflow-y-auto divide-y divide-stone-100">
          {filteredCustomers.map((c) => {
            const isSelected = activeCustomer?.customer_id === c.customer_id;
            return (
              <div
                key={c.customer_id}
                onClick={() => setActiveCustomerId(c.customer_id)}
                className={`p-3.5 cursor-pointer transition-colors border-l-3 ${
                  isSelected
                    ? 'bg-stone-50 border-l-stone-900'
                    : 'hover:bg-stone-50/50 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-stone-900">{c.customer_id}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      c.billing_status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.billing_status === 'OVERDUE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.billing_status}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-stone-900">{c.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-stone-600 mt-1">
                  <span>{c.plan_name} (₹{c.monthly_rental}/mo)</span>
                  <span className="font-mono text-stone-700">Link: {c.router_status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Customer Profile */}
        <div className="md:col-span-7 p-6 max-h-[600px] overflow-y-auto bg-stone-50/30">
          {activeCustomer ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                      {activeCustomer.customer_id}
                    </span>
                    <span className="text-xs text-stone-600">{activeCustomer.city}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{activeCustomer.name}</h3>
                  <div className="flex items-center space-x-3 text-xs text-stone-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{activeCustomer.phone}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{activeCustomer.email}</span>
                    </span>
                  </div>
                </div>

                {onSelectCustomerForSimulation && (
                  <button
                    onClick={() => onSelectCustomerForSimulation(activeCustomer.customer_id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                  >
                    Test Query as this Customer
                  </button>
                )}
              </div>

              {/* Account Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block">Plan & Rental</span>
                  <span className="font-semibold text-stone-900 block mt-0.5">{activeCustomer.plan_name}</span>
                  <span className="text-stone-600">₹{activeCustomer.monthly_rental} / month</span>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block">Current Balance</span>
                  <span className="font-bold text-stone-900 block mt-0.5 text-sm">
                    ₹{activeCustomer.current_balance}
                  </span>
                  <span className="text-stone-600">Status: {activeCustomer.billing_status}</span>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block">Hardware ONT / Router</span>
                  <span className="font-semibold text-stone-900 block mt-0.5">{activeCustomer.router_model}</span>
                  <div className="flex items-center space-x-1 text-stone-600 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeCustomer.router_status === 'ONLINE'
                          ? 'bg-emerald-500'
                          : activeCustomer.router_status === 'OFFLINE'
                          ? 'bg-rose-500'
                          : 'bg-amber-500 animate-pulse'
                      }`}
                    />
                    <span>Link Telemetry: {activeCustomer.router_status}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block">Installation Address</span>
                  <span className="text-stone-800 block mt-0.5 leading-relaxed">{activeCustomer.address}</span>
                  <span className="text-stone-600 text-[11px]">Tenure: {activeCustomer.tenure_months} months</span>
                </div>
              </div>

              {/* Ticket History */}
              <div className="bg-white border border-stone-200 rounded-lg p-4">
                <span className="text-[11px] uppercase font-bold text-stone-600 block mb-2.5 flex items-center space-x-1.5">
                  <History className="w-3.5 h-3.5 text-stone-600" />
                  <span>Support Ticket History ({activeCustomer.recent_tickets?.length || 0})</span>
                </span>

                {activeCustomer.recent_tickets && activeCustomer.recent_tickets.length > 0 ? (
                  <div className="space-y-2">
                    {activeCustomer.recent_tickets.map((t) => (
                      <div key={t.ticket_id} className="p-2.5 rounded bg-stone-50 border border-stone-100 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-stone-900">{t.ticket_id}</span>
                            <span className="font-medium text-stone-600 uppercase text-[10px] px-1.5 py-0.2 rounded bg-stone-200">
                              {t.category}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              t.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'OPEN'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <p className="text-stone-700 text-[11px] mt-0.5">{t.notes}</p>
                        <span className="text-[10px] text-stone-600 mt-1 block">Logged: {t.created_at}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-600 italic">No previous support tickets logged for this account.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-600">Select a customer account to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
