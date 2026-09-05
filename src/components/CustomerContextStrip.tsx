import React, { useState } from 'react';
import {
  User,
  Wifi,
  Calendar,
  CreditCard,
  History,
  MapPin,
  ChevronDown,
  ChevronUp,
  Activity,
  HardDrive
} from 'lucide-react';
import { CustomerRecord } from '../types';

interface CustomerContextStripProps {
  customer: CustomerRecord;
  lastInteraction?: string;
}

export const CustomerContextStrip: React.FC<CustomerContextStripProps> = ({
  customer,
  lastInteraction = 'Yesterday · 18:42',
}) => {
  const [expanded, setExpanded] = useState(false);

  const isBillingOverdue = customer.billing_status === 'OVERDUE';
  const isPaid = customer.billing_status === 'PAID';

  return (
    <div
      id="customer-context-strip"
      className="bg-[#FAF9F5] dark:bg-[#151922] border-b border-[#E5E3DD] dark:border-[#222834] px-4 py-2 text-stone-800 dark:text-slate-200 transition-colors select-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs">
        {/* Customer identity */}
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <div className="w-6 h-6 rounded bg-[#18181B] dark:bg-slate-800 text-white flex items-center justify-center font-bold text-[11px] font-mono shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-slate-100 tracking-tight uppercase text-xs">
                {customer.name}
              </span>
              <span className="font-mono text-[11px] text-stone-500 dark:text-slate-400 bg-stone-200/60 dark:bg-slate-800 px-1 py-0.2 rounded">
                {customer.customer_id}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Plan & Status */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-slate-400 font-medium">Plan:</span>
          <span className="font-semibold text-stone-900 dark:text-slate-100">{customer.plan_name}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>

        {/* Monthly Rental & Ledger */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-slate-400 font-medium">Rental:</span>
          <span className="font-mono font-semibold text-stone-900 dark:text-slate-100">
            ₹{customer.monthly_rental}{' '}
            <span className="text-[10px] font-normal text-stone-500 dark:text-slate-400">/ mo</span>
          </span>
          {isBillingOverdue ? (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/25">
              ₹{customer.current_balance} OVERDUE
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              PAID
            </span>
          )}
        </div>

        {/* Ticket history count */}
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-slate-300">
          <History size={13} className="text-stone-400 dark:text-slate-500" />
          <span className="font-medium font-mono">
            {customer.recent_tickets?.length ?? 2} previous tickets
          </span>
        </div>

        {/* Last interaction */}
        <div className="flex items-center gap-1.5 text-stone-500 dark:text-slate-400 hidden lg:flex">
          <Calendar size={13} className="text-stone-400 dark:text-slate-500" />
          <span>Last interaction:</span>
          <span className="font-medium text-stone-700 dark:text-slate-200 font-mono text-[11px]">
            {lastInteraction}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white font-medium ml-auto transition-colors"
          title="Toggle customer details"
        >
          <span>{expanded ? 'Less' : 'Details'}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expanded diagnostic drawer */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-[#E5E3DD] dark:border-[#222834] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <HardDrive size={14} className="text-stone-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 dark:text-slate-500 font-medium uppercase">
                CPE Hardware
              </div>
              <div className="font-medium text-stone-800 dark:text-slate-200">
                {customer.router_model || 'GPON ONT Router'}
              </div>
              <div className="text-[10px] font-mono text-stone-500 dark:text-slate-400">
                Status: {customer.router_status}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-stone-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 dark:text-slate-500 font-medium uppercase">
                Premises
              </div>
              <div className="font-medium text-stone-800 dark:text-slate-200 truncate max-w-[200px]">
                {customer.address}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-slate-400">{customer.city}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Activity size={14} className="text-stone-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 dark:text-slate-500 font-medium uppercase">
                Contact
              </div>
              <div className="font-medium text-stone-800 dark:text-slate-200">{customer.phone}</div>
              <div className="text-[10px] text-stone-500 dark:text-slate-400">{customer.email}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <History size={14} className="text-stone-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 dark:text-slate-500 font-medium uppercase">
                Latest Ticket
              </div>
              <div className="font-mono font-medium text-stone-800 dark:text-slate-200">
                {customer.recent_tickets?.[0]?.ticket_id || 'TKT-8831'} ·{' '}
                {customer.recent_tickets?.[0]?.category || 'CONNECTIVITY'}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-slate-400 truncate max-w-[200px]">
                {customer.recent_tickets?.[0]?.notes || 'Outage resolved'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
