import React, { useState } from 'react';
import { Users, Search, CreditCard, HardDrive, MapPin, History, ChevronRight } from 'lucide-react';
import { CustomerRecord } from '../types';

interface CustomerLedgerViewProps {
  customers: CustomerRecord[];
  onSelectCustomerCase?: (customerId: string) => void;
}

export const CustomerLedgerView: React.FC<CustomerLedgerViewProps> = ({
  customers,
  onSelectCustomerCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(customers[0] || null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="clarivo-customers-view" className="flex-1 flex bg-white overflow-hidden select-none">
      {/* List */}
      <div className="w-80 sm:w-96 border-r border-[#E5E3DD] flex flex-col h-full bg-[#FAF9F5]">
        <div className="p-3.5 border-b border-[#E5E3DD] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Users size={14} className="text-[#0F4C5C]" />
              Subscriber Directory
            </span>
            <span className="font-mono text-[11px] text-stone-500 bg-stone-200/60 px-1.5 py-0.5 rounded">
              {customers.length} Accounts
            </span>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, ID, plan, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0F4C5C]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filtered.map((c) => {
            const isSelected = selectedCustomer?.customer_id === c.customer_id;
            return (
              <button
                key={c.customer_id}
                onClick={() => setSelectedCustomer(c)}
                className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                  isSelected ? 'bg-white border-l-3 border-[#0F4C5C] shadow-2xs' : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-stone-900">{c.name}</span>
                  <span className="font-mono text-[10px] text-stone-400">{c.customer_id}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>{c.plan_name}</span>
                  <span
                    className={`font-mono font-medium ${
                      c.billing_status === 'PAID' ? 'text-[#15803D]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {c.billing_status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 p-6 overflow-y-auto bg-white text-stone-800">
        {selectedCustomer ? (
          <div className="max-w-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-stone-400 uppercase">Subscriber Profile</span>
                <h2 className="text-xl font-bold text-stone-900 mt-0.5">{selectedCustomer.name}</h2>
              </div>
              <span className="font-mono text-sm px-2.5 py-1 bg-stone-100 text-stone-800 font-bold rounded">
                {selectedCustomer.customer_id}
              </span>
            </div>

            {/* Core Ledger Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] p-3.5 rounded border border-[#E5E3DD] text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400">Plan</div>
                <div className="font-semibold text-stone-900 mt-0.5">{selectedCustomer.plan_name}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400">Monthly Rental</div>
                <div className="font-mono font-semibold text-stone-900 mt-0.5">
                  ₹{selectedCustomer.monthly_rental} / month
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400">Billing Status</div>
                <div
                  className={`font-mono font-semibold mt-0.5 ${
                    selectedCustomer.billing_status === 'PAID' ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {selectedCustomer.billing_status} (Balance: ₹{selectedCustomer.current_balance})
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400">Last Payment</div>
                <div className="font-mono text-stone-700 mt-0.5">
                  {selectedCustomer.last_payment_date || '2026-08-25'}
                </div>
              </div>
            </div>

            {/* Hardware & Location */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <HardDrive size={14} className="text-[#0F4C5C]" />
                <span className="font-medium">CPE Hardware:</span>
                <span className="font-mono">{selectedCustomer.router_model}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 font-mono">
                  {selectedCustomer.router_status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <MapPin size={14} className="text-[#0F4C5C]" />
                <span className="font-medium">Address:</span>
                <span>
                  {selectedCustomer.address}, {selectedCustomer.city}
                </span>
              </div>
            </div>

            {/* Ticket History */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                <History size={13} />
                <span>Ticket Ledger ({selectedCustomer.recent_tickets?.length || 0})</span>
              </div>

              <div className="space-y-2">
                {selectedCustomer.recent_tickets?.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-stone-50 border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-stone-900">{t.ticket_id}</span>
                      <span className="text-stone-400">{t.created_at}</span>
                    </div>
                    <div className="text-stone-700">{t.notes}</div>
                    <div className="text-[10px] font-mono text-stone-400">Category: {t.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-stone-400 text-xs">Select a customer from the directory.</div>
        )}
      </div>
    </div>
  );
};
