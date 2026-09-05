import React, { useState } from 'react';
import { CustomerRecord } from '../types';
import { Terminal, X, Send, User, ShieldCheck } from 'lucide-react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerRecord[];
  scenarios: any[];
  onRunSimulation: (customerId: string, message: string) => void;
  isLoading: boolean;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  customers,
  scenarios,
  onRunSimulation,
  isLoading,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.customer_id || 'C-1042');
  const [message, setMessage] = useState<string>(
    'My internet has been down since yesterday. I already restarted the router twice and I am still unable to connect.'
  );

  if (!isOpen) return null;

  const handlePreset = (sc: any) => {
    setSelectedCustomerId(sc.customer_id);
    setMessage(sc.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onRunSimulation(selectedCustomerId, message);
    onClose();
  };

  const selectedCustomer = customers.find((c) => c.customer_id === selectedCustomerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E3DD] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#0F4C5C] text-white">
              <Terminal size={15} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 font-mono">
                Clarivo Resolution Simulator
              </h3>
              <p className="text-[11px] text-stone-500">
                Execute any customer inquiry against live subscriber ledger and 25 telecom policies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Presets */}
        <div className="p-3.5 border-b border-[#E5E3DD] bg-[#F7F6F1] text-xs">
          <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500 block mb-1.5">
            Load Benchmark Case:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handlePreset(sc)}
                className="px-2.5 py-1 rounded bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium transition-colors text-[11px] font-mono shadow-2xs"
              >
                {sc.code}: {sc.name.split(':')[1] || sc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Target Subscriber Account
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#0F4C5C] font-mono"
            >
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.customer_id} — {c.name} ({c.plan_name} · {c.billing_status} · ₹{c.current_balance})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Customer Message / Inbound Telemetry
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-[#0F4C5C] font-sans leading-relaxed"
              placeholder="Enter inbound subscriber complaint or question..."
            />
          </div>

          <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DD] rounded flex items-center justify-between text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-[#0F4C5C]" />
              <span>Full 5-stage deterministic evaluation will run immediately</span>
            </div>
            <span className="font-mono text-stone-400">Track PS04</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded bg-[#0F4C5C] hover:bg-[#0D404E] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>{isLoading ? 'Running Pipeline...' : 'Run Simulation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
