import React, { useState } from 'react';
import {
  Send,
  Edit3,
  XCircle,
  CheckCircle,
  Clock,
  ShieldCheck,
  CornerDownRight,
  User,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { CustomerRecord } from '../types';
import { useEmployee } from '../EmployeeContext';
import { useTheme } from '../ThemeContext';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAiGrounded?: boolean;
  groundingSource?: string;
}

interface ConversationWorkspaceProps {
  caseId: string;
  customer: CustomerRecord;
  initialMessage: string;
  aiDraftText: string;
  groundingCitation?: string;
  onSendMessage: (text: string) => void;
  decisionState: 'RESOLUTION' | 'MISSING_INFO' | 'ESCALATE' | 'NO_MATCH';
}

export const ConversationWorkspace: React.FC<ConversationWorkspaceProps> = ({
  caseId,
  customer,
  initialMessage,
  aiDraftText,
  groundingCitation = 'KB-ROUT-01',
  onSendMessage,
  decisionState,
}) => {
  const { currentEmployee } = useEmployee();
  const { isDark } = useTheme();

  const agentName = currentEmployee?.name || 'Support Agent';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'customer',
      senderName: customer.name,
      text: initialMessage,
      timestamp: '18:42',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(aiDraftText);
  const [rejected, setRejected] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  // Sync draftContent if aiDraftText changes
  React.useEffect(() => {
    setDraftContent(aiDraftText);
    setRejected(false);
    setHasSent(false);
    setMessages([
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: customer.name,
        text: initialMessage,
        timestamp: '18:42',
      },
    ]);
  }, [aiDraftText, initialMessage, customer.name]);

  const handleSendDraft = () => {
    if (!draftContent.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: agentName,
      text: draftContent,
      timestamp: 'Just now',
      isAiGrounded: true,
      groundingSource: groundingCitation,
    };

    setMessages((prev) => [...prev, newMsg]);
    setHasSent(true);
    setIsEditing(false);
    onSendMessage(draftContent);
  };

  const handleReject = () => {
    setRejected(true);
    setIsEditing(false);
  };

  return (
    <div
      id="conversation-workspace"
      className="flex-1 flex flex-col bg-white dark:bg-[#141821] border-r border-[#E5E3DD] dark:border-[#222834] overflow-hidden transition-colors"
    >
      {/* Workspace Header */}
      <div className="h-11 px-4 border-b border-[#E5E3DD] dark:border-[#222834] flex items-center justify-between bg-[#FAF9F5] dark:bg-[#181D26] select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-slate-200">
            Customer Conversation
          </span>
          <span className="text-[10px] text-stone-400 dark:text-slate-500 font-mono">
            Channel: Web Portal
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-slate-400">
          <Clock size={12} className="text-stone-400 dark:text-slate-500" />
          <span>Case SLA: 24m remaining</span>
        </div>
      </div>

      {/* Message Timeline Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {/* Audit timestamp divider */}
        <div className="flex items-center justify-center my-1 select-none">
          <span className="text-[10px] font-mono text-stone-400 dark:text-slate-500 bg-stone-100 dark:bg-[#1B212D] px-2 py-0.5 rounded">
            Yesterday · 18:42 IST · Inbound Session Started
          </span>
        </div>

        {/* Conversation messages */}
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 select-none">
                <span className="text-[11px] font-semibold text-stone-800 dark:text-slate-200">
                  {msg.senderName}
                </span>
                <span className="text-[10px] font-mono text-stone-400 dark:text-slate-500">
                  {msg.timestamp}
                </span>
                {msg.isAiGrounded && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0F4C5C]/10 dark:bg-[#14B8A6]/20 text-[#0F4C5C] dark:text-[#14B8A6] font-semibold flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Grounded: {msg.groundingSource}
                  </span>
                )}
              </div>

              <div
                className={`max-w-xl p-3.5 rounded text-[13px] leading-relaxed select-text ${
                  isCustomer
                    ? 'bg-[#FAF9F5] dark:bg-[#1A202C] border border-[#E5E3DD] dark:border-[#2A3345] text-stone-900 dark:text-slate-100 shadow-2xs'
                    : 'bg-[#0F4C5C] dark:bg-[#0D9488] text-white shadow-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Status notice if sent */}
        {hasSent && (
          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 select-none">
            <CheckCircle size={14} className="shrink-0" />
            <span>Response transmitted to subscriber. Awaiting customer acknowledgement.</span>
          </div>
        )}

        {/* Rejected state */}
        {rejected && !hasSent && (
          <div className="p-2.5 rounded bg-stone-100 dark:bg-[#1B212D] border border-stone-200 dark:border-[#2A3345] text-stone-600 dark:text-slate-300 text-xs flex items-center justify-between select-none">
            <span className="flex items-center gap-1.5">
              <XCircle size={13} className="text-stone-400 dark:text-slate-500" />
              AI suggestion rejected by human agent. Custom manual response mode enabled.
            </span>
            <button
              onClick={() => {
                setRejected(false);
                setIsEditing(true);
              }}
              className="text-[#0F4C5C] dark:text-[#14B8A6] font-semibold hover:underline"
            >
              Restore Draft
            </button>
          </div>
        )}
      </div>

      {/* AI Draft Suggestion Box (Waiting for human review) */}
      {!hasSent && !rejected && (
        <div
          id="ai-draft-container"
          className="border-t border-[#E5E3DD] dark:border-[#222834] bg-[#FAF9F5] dark:bg-[#161B24] p-4 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C5C] dark:text-[#14B8A6] flex items-center gap-1 bg-[#0F4C5C]/10 dark:bg-[#14B8A6]/15 px-2 py-0.5 rounded font-mono">
                <ShieldCheck size={12} />
                AI Draft Suggestion
              </span>
              <span className="text-[11px] text-stone-500 dark:text-slate-400 hidden sm:inline">
                Awaiting human agent sign-off
              </span>
            </div>

            {groundingCitation && (
              <span className="text-[10px] font-mono text-stone-500 dark:text-slate-400 bg-white dark:bg-[#1C222E] border border-stone-200 dark:border-[#2A3140] px-1.5 py-0.5 rounded">
                Ref: {groundingCitation}
              </span>
            )}
          </div>

          {/* Draft text or Editor */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={3}
                className="w-full text-xs text-stone-900 dark:text-slate-100 bg-white dark:bg-[#1C222E] border border-[#0F4C5C] dark:border-[#14B8A6] rounded p-2.5 focus:outline-none font-sans leading-relaxed shadow-xs"
                placeholder="Edit the response to the customer..."
              />
              <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-slate-500">
                <span>Direct agent editing mode</span>
                <button
                  onClick={() => {
                    setDraftContent(aiDraftText);
                    setIsEditing(false);
                  }}
                  className="text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-white underline"
                >
                  Reset to original
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white dark:bg-[#1C222E] border border-[#DDD9CE] dark:border-[#2A3140] rounded shadow-2xs text-[13px] text-stone-800 dark:text-slate-200 leading-relaxed font-sans">
              {draftContent}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  isEditing
                    ? 'bg-stone-200 dark:bg-slate-700 text-stone-900 dark:text-white font-semibold'
                    : 'bg-white dark:bg-[#1C222E] hover:bg-stone-100 dark:hover:bg-[#252E3E] border border-stone-300 dark:border-[#2A3140] text-stone-700 dark:text-slate-300'
                }`}
              >
                <Edit3 size={13} />
                <span>{isEditing ? 'Preview' : 'Edit response'}</span>
              </button>

              <button
                onClick={handleReject}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-[#1C222E] hover:bg-stone-100 dark:hover:bg-[#252E3E] border border-stone-300 dark:border-[#2A3140] text-stone-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors"
                title="Reject AI suggestion"
              >
                <XCircle size={13} />
                <span>Reject</span>
              </button>
            </div>

            <button
              onClick={handleSendDraft}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0F4C5C] hover:bg-[#0D404E] dark:bg-[#14B8A6] dark:hover:bg-[#0D9488] text-white dark:text-black font-semibold text-xs shadow-xs transition-colors"
            >
              <Send size={13} />
              <span>Send to Customer</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual reply box if draft was sent or rejected */}
      {(hasSent || rejected) && (
        <div className="border-t border-[#E5E3DD] dark:border-[#222834] bg-white dark:bg-[#161B24] p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message to subscriber or notes for team..."
              className="flex-1 text-xs border border-stone-200 dark:border-[#2A3140] rounded px-3 py-2 text-stone-800 dark:text-slate-100 bg-white dark:bg-[#1C222E] focus:outline-none focus:border-[#0F4C5C] dark:focus:border-[#14B8A6]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `msg-${Date.now()}`,
                      sender: 'agent',
                      senderName: agentName,
                      text: e.currentTarget.value,
                      timestamp: 'Just now',
                    },
                  ]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button className="px-3 py-2 rounded bg-stone-900 dark:bg-[#14B8A6] text-white dark:text-black font-semibold text-xs hover:bg-stone-800 dark:hover:bg-[#0D9488] transition-colors flex items-center gap-1">
              <Send size={12} />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
