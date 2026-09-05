/**
 * Clarivo Escalation Handover Generator (Track PS04)
 * Generates concise, structured human handover briefs to ensure
 * customer issues are escalated without requiring them to repeat themselves.
 */

import { CustomerRecord, EscalationHandover } from './types';

export function generateEscalationHandover(params: {
  customer: CustomerRecord;
  message: string;
  reason: string;
  triggerType: 'LEGAL_THREAT' | 'REPEATED_CONTACT' | 'UNCOVERED_KB' | 'DATA_CONFLICT' | 'MANUAL' | 'CRITICAL_OUTAGE';
  missingInfo?: string[];
  alreadyTried?: string[];
  priority?: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM';
}): EscalationHandover {
  const { customer, message, reason, triggerType } = params;

  // Established facts directly from customer record
  const establishedFacts: string[] = [
    `Customer ID: ${customer.customer_id} (${customer.name})`,
    `Active Plan: ${customer.plan_name} (₹${customer.monthly_rental}/mo)`,
    `Billing Status: ${customer.billing_status} (Outstanding Balance: ₹${customer.current_balance})`,
    `Tenure: ${customer.tenure_months} months | Router: ${customer.router_model} (${customer.router_status})`,
  ];

  if (customer.recent_tickets && customer.recent_tickets.length > 0) {
    const ticketSummaries = customer.recent_tickets
      .slice(0, 3)
      .map((t) => `${t.ticket_id} (${t.status}) - ${t.notes.slice(0, 45)}...`);
    establishedFacts.push(`Previous Tickets: ${ticketSummaries.join('; ')}`);
  }

  // Determine what has already been tried based on message and tickets
  const alreadyTried: string[] = params.alreadyTried || [];
  const msgLower = message.toLowerCase();
  if (msgLower.includes('restart') || msgLower.includes('reboot') || msgLower.includes('turned off')) {
    alreadyTried.push('Customer power cycled ONT / router');
  }
  if (msgLower.includes('cable') || msgLower.includes('wire') || msgLower.includes('reconnected')) {
    alreadyTried.push('Customer re-seated physical optical patch cord');
  }
  if (customer.recent_tickets && customer.recent_tickets.length > 0) {
    alreadyTried.push(`Previous phone follow-ups logged on tickets (${customer.recent_tickets.map((t) => t.ticket_id).join(', ')})`);
  }
  if (alreadyTried.length === 0) {
    alreadyTried.push('First-line automated diagnostic checks completed');
  }

  // Missing information
  const missingInfo: string[] = params.missingInfo || [];
  if (customer.router_status === 'UNKNOWN' && !missingInfo.some((m) => m.includes('router'))) {
    missingInfo.push('ONT physical LED telemetry status (LOS/PON lights unconfirmed)');
  }

  // Recommended Department & First Action mapping
  let recommendedDept = 'Tier-2 Technical Support Team';
  let agentStartingAction = 'Review ticket history and initiate line test to local splitter.';
  let priority = params.priority || 'P2_HIGH';

  switch (triggerType) {
    case 'LEGAL_THREAT':
      recommendedDept = 'Executive Escalations & Legal Care Team';
      agentStartingAction = `Contact ${customer.name} immediately via priority callback at ${customer.phone}. Acknowledge delays and confirm lead technician assignment.`;
      priority = 'P1_CRITICAL';
      break;

    case 'REPEATED_CONTACT':
      recommendedDept = 'Network Operations & Critical Incidents Desk';
      agentStartingAction = `Cross-check recent open tickets (${customer.recent_tickets.map((t) => t.ticket_id).join(', ')}) with OLT physical port logs. Schedule guaranteed same-day field technician visit.`;
      priority = 'P1_CRITICAL';
      break;

    case 'UNCOVERED_KB':
      recommendedDept = 'Enterprise Voice & Custom Solutions Desk';
      agentStartingAction = 'Clarify that residential ONT firmware does not expose bridged SIP trunks; recommend Enterprise Leased Line tier if PBX bridging is mandatory.';
      priority = 'P3_MEDIUM';
      break;

    case 'DATA_CONFLICT':
      recommendedDept = 'Senior Billing Reconciliation Desk';
      agentStartingAction = `Review invoice billing cycle vs plan catalog rate (Catalog: ₹${customer.monthly_rental} vs Invoice: ₹${customer.current_balance}). Verify if unauthorized add-on or erroneous charge was generated and issue credit note.`;
      priority = 'P2_HIGH';
      break;
  }

  return {
    reason,
    trigger_type: triggerType,
    customer_issue: message,
    established_facts: establishedFacts,
    already_tried: Array.from(new Set(alreadyTried)),
    missing_information: missingInfo.length > 0 ? missingInfo : ['None — case is ready for human agent intervention.'],
    recommended_department: recommendedDept,
    agent_starting_action: agentStartingAction,
    priority,
  };
}
