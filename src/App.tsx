import React, { useState, useEffect } from 'react';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CustomerContextStrip } from './components/CustomerContextStrip';
import { ConversationWorkspace } from './components/ConversationWorkspace';
import { AIInsightRail } from './components/AIInsightRail';
import { SourceInspector, SourceInspectorData } from './components/SourceInspector';
import { CaseQueueView } from './components/CaseQueueView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CustomerLedgerView } from './components/CustomerLedgerView';
import { AnalyticsView } from './components/AnalyticsView';
import { SimulatorModal } from './components/SimulatorModal';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { EmployeeAuthPage } from './components/EmployeeAuthPage';
import { EmployeeAuthModal } from './components/EmployeeAuthModal';
import { EmployeeProfileDrawer } from './components/EmployeeProfileDrawer';
import { CustomerAuthPage } from './components/CustomerAuthPage';
import { CustomerDashboardView } from './components/CustomerDashboardView';
import { useEmployee } from './EmployeeContext';
import { useCustomer } from './CustomerContext';
import { useTheme } from './ThemeContext';
import { CaseRecord, CustomerRecord, KBArticle, PipelineOutput, EvidenceNode } from './types';

export default function App() {
  const { currentEmployee, isLoggedIn: isEmployeeLoggedIn, logout: employeeLogout } = useEmployee();
  const { customer, isAuthenticated: isCustomerAuthenticated, isLoading: isCustomerLoading, logout: customerLogout } = useCustomer();
  const { isDark, toggleTheme } = useTheme();

  // Simple Router based on window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const [activeTab, setActiveTab] = useState<NavItemKey>('active-case');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>('CLV-1042');
  const [currentCase, setCurrentCase] = useState<CaseRecord | null>(null);
  const [customerRecord, setCustomerRecord] = useState<CustomerRecord | null>(null);
  const [pipelineData, setPipelineData] = useState<PipelineOutput | null>(null);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('scenario-b');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [sourceInspectorData, setSourceInspectorData] = useState<SourceInspectorData | null>(null);
  const [isSourceInspectorOpen, setIsSourceInspectorOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Profile Drawer state
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);


  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // 1. Initial Data Fetch
  useEffect(() => {
    async function initData() {
      try {
        const [casesRes, custRes, kbRes, scRes] = await Promise.all([
          fetch('/api/cases').then((r) => r.json()).catch(() => []),
          fetch('/api/customers').then((r) => r.json()).catch(() => []),
          fetch('/api/kb').then((r) => r.json()).catch(() => []),
          fetch('/api/scenarios').then((r) => r.json()).catch(() => []),
        ]);

        const loadedCases: CaseRecord[] = casesRes || [];
        setCases(loadedCases);
        setCustomers(custRes || []);
        setKbArticles(kbRes || []);
        setScenarios(scRes || []);

        // Prefer CLV-1042 if available
        const targetId = loadedCases.some((c) => c.case_id === 'CLV-1042')
          ? 'CLV-1042'
          : loadedCases[0]?.case_id || 'CLV-1042';

        setSelectedCaseId(targetId);
        await loadCaseDetail(targetId, loadedCases, custRes || []);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    initData();
  }, []);

  // 2. Load Single Case Detail + Pipeline
  const loadCaseDetail = async (
    caseId: string,
    existingCases?: CaseRecord[],
    existingCustomers?: CustomerRecord[]
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentCase(data.case);
        setCustomerRecord(data.customer);
        setPipelineData(data.pipeline);

        // Update scenario id if matching
        if (caseId === 'CLV-1042') setCurrentScenarioId('scenario-b');
        else if (caseId === 'CLV-1043') setCurrentScenarioId('scenario-a');
        else if (caseId === 'CLV-1044') setCurrentScenarioId('scenario-c');
      } else {
        // Fallback to local synthesis if backend is busy
        const casesList = existingCases || cases;
        const custsList = existingCustomers || customers;
        const cRecord = casesList.find((c) => c.case_id === caseId) || casesList[0];
        if (cRecord) {
          setCurrentCase(cRecord);
          const cust = custsList.find((cu) => cu.customer_id === cRecord.customer_id) || custsList[0];
          setCustomer(cust);
        }
      }
    } catch (err) {
      console.error('Error loading case detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('active-case');
    loadCaseDetail(caseId);
  };

  // 3. Handle Scenario Switcher (CASE A, CASE B, CASE C, etc.)
  const handleSelectScenario = async (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    setActiveTab('active-case');

    if (scenarioId === 'scenario-b') {
      setSelectedCaseId('CLV-1042');
      await loadCaseDetail('CLV-1042');
      showNotification('Loaded Case B: Missing Information (Router LOS)');
      return;
    }

    if (scenarioId === 'scenario-a') {
      setSelectedCaseId('CLV-1043');
      await loadCaseDetail('CLV-1043');
      showNotification('Loaded Case A: Clean Routine Resolution (Billing)');
      return;
    }

    if (scenarioId === 'scenario-c') {
      setSelectedCaseId('CLV-1044');
      await loadCaseDetail('CLV-1044');
      showNotification('Loaded Case C: Complex Escalation (Repeated Contacts + Legal)');
      return;
    }

    // Benchmark D or E
    const scCode = scenarioId === 'scenario-d' ? 'UNCOVERED_CASE' : 'DATA_KB_CONFLICT';
    const benchmark = scenarios.find((s) => s.code === scCode);
    if (benchmark) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: benchmark.customer_id,
            message: benchmark.message,
            case_id: `CASE-${benchmark.code.slice(0, 4)}-${Date.now().toString().slice(-4)}`,
          }),
        });
        const data: PipelineOutput = await res.json();
        setPipelineData(data);
        setCurrentCase({
          case_id: data.case_id,
          customer_id: data.customer_id,
          customer_name: data.customer.name,
          issue_title: benchmark.message.substring(0, 75),
          initial_message: benchmark.message,
          status: data.decision === 'RESOLUTION' ? 'RESOLVED_DRAFT' : data.decision === 'MISSING_INFO' ? 'AWAITING_INFO' : 'ESCALATED',
          intent: data.intent,
          confidence: data.confidence,
          decision: data.decision,
          priority: data.escalation?.priority as any || 'HIGH',
          created_at: 'Just now',
          updated_at: 'Just now',
        });
        setCustomerRecord(data.customer);
        setSelectedCaseId(data.case_id);
        showNotification(`Loaded Benchmark: ${benchmark.name}`);
      } catch (err) {
        console.error('Error simulating benchmark:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 4. Handle Custom Simulation
  const handleRunSimulation = async (customerId: string, message: string) => {
    setActiveTab('active-case');
    setIsLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          message,
          case_id: `CLV-${Date.now().toString().slice(-4)}`,
        }),
      });
      const data: PipelineOutput = await res.json();
      setPipelineData(data);
      setCurrentCase({
        case_id: data.case_id,
        customer_id: data.customer_id,
        customer_name: data.customer.name,
        issue_title: message.substring(0, 75),
        initial_message: message,
        status: data.decision === 'RESOLUTION' ? 'RESOLVED_DRAFT' : data.decision === 'MISSING_INFO' ? 'AWAITING_INFO' : 'ESCALATED',
        intent: data.intent,
        confidence: data.confidence,
        decision: data.decision,
        priority: data.escalation?.priority as any || 'HIGH',
        created_at: 'Just now',
        updated_at: 'Just now',
      });
      setCustomer(data.customer);
      setSelectedCaseId(data.case_id);
      showNotification('Executed inquiry through Clarivo deterministic pipeline');
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Inspect Evidence Node
  const handleInspectNode = (inspectorData: SourceInspectorData) => {
    // If it's a knowledge source, enrich with full article data
    const matchedArticle = kbArticles.find((art) => art.id === inspectorData.sourceId);
    if (matchedArticle) {
      setSourceInspectorData({
        ...inspectorData,
        fullBody: matchedArticle.body,
        category: matchedArticle.category,
        appliesTo: matchedArticle.applies_to,
        requiredFields: matchedArticle.required_fields,
      });
    } else {
      setSourceInspectorData(inspectorData);
    }
    setIsSourceInspectorOpen(true);
  };

  // Fallback customer and evidence if not loaded yet
  const activeCustomer: CustomerRecord = customer || {
    customer_id: 'C-1042',
    name: 'Arun Kumar',
    phone: '+91 98450 12345',
    email: 'arun.kumar@enterprise.in',
    plan_id: 'FIBER-799',
    plan_name: 'Fiber 799',
    monthly_rental: 799,
    billing_status: 'PAID',
    current_balance: 0.0,
    last_payment_date: '2026-08-25',
    router_model: 'Nokia G-2425G-A GPON ONT',
    router_status: 'UNKNOWN',
    tenure_months: 14,
    address: '42, Indira Nagar 100ft Road, Bengaluru',
    city: 'Bengaluru',
    recent_tickets: [
      {
        ticket_id: 'TKT-8831',
        category: 'CONNECTIVITY',
        status: 'RESOLVED',
        created_at: '2026-08-10 18:42',
        notes: 'Connection outage resolved after remote line card re-sync.',
      },
    ],
  };

  const activeInitialMessage =
    currentCase?.initial_message ||
    'My internet has been down since yesterday. I already restarted the router twice and I am still unable to connect.';

  const activeAiDraft =
    pipelineData?.draft_response ||
    `We've confirmed that your Fiber 799 plan is active with zero overdue charges. Before we proceed with network-side troubleshooting, could you confirm whether the "LOS" indicator light on the front panel of your Nokia router is solid Red, Blinking, or Off?`;

  const activeDecision = pipelineData?.decision || (currentCase?.decision as any) || 'MISSING_INFO';
  const activeConfidence = pipelineData?.confidence || currentCase?.confidence || 0.82;

  // Build evidence trace chain
  const activeEvidenceChain: EvidenceNode[] = pipelineData?.evidence_chain?.length
    ? pipelineData.evidence_chain
    : [
        {
          step: 'QUESTION',
          label: 'Customer Statement',
          detail: `"${activeInitialMessage}"`,
          source: 'Inbound Message',
          status: 'SUPPORTED',
        },
        {
          step: 'DATA',
          label: 'Account Ledger',
          detail: `C-1042 · Plan: Fiber 799 · Status: Paid (₹0 overdue) · CPE: Nokia ONT`,
          source: 'Account C-1042',
          status: 'SUPPORTED',
        },
        {
          step: 'KNOWLEDGE',
          label: 'KB-ROUT-01 Diagnostics',
          detail: 'Optical LOS Indicator Status: Check router LOS indicator before proceeding with network-side troubleshooting.',
          source: 'KB-ROUT-01',
          status: 'SUPPORTED',
        },
        {
          step: 'REASONING',
          label: 'Missing Signal Detected',
          detail: 'Account telemetry shows router_status = UNKNOWN. Cannot differentiate local fiber cable break from node outage.',
          source: 'Rule Engine',
          status: 'MISSING',
        },
        {
          step: 'ANSWER',
          label: 'Targeted Clarification',
          detail: 'Prompt customer to verify optical LOS indicator before dispatching field engineer.',
          source: 'Copilot Draft',
          status: 'SUPPORTED',
        },
      ];

  const missingSignal =
    pipelineData?.missing_fields?.[0]
      ? {
          field: pipelineData.missing_fields[0].field,
          label: 'Router LOS Status',
          whyItMatters: pipelineData.missing_fields[0].why_needed,
          questionPrompt: pipelineData.missing_fields[0].suggested_question,
        }
      : activeDecision === 'MISSING_INFO'
      ? {
          field: 'router_los_status',
          label: 'Router LOS Status',
          whyItMatters: 'Required to distinguish a local router issue from a possible network-side outage.',
          questionPrompt: 'Could you confirm whether the LOS indicator on your router is red, blinking, or off?',
        }
      : null;

  const escalationsCount = cases.filter(
    (c) => c.status === 'ESCALATED' || c.decision === 'ESCALATE'
  ).length;

  // Cross portal protection checks
  useEffect(() => {
    // If on customer auth page (/login or /signup) while customer is authenticated -> redirect to /dashboard
    if (isCustomerAuthenticated && (currentPath === '/login' || currentPath === '/signup')) {
      navigate('/dashboard');
    }
    // If on employee login (/employee/login) while employee is authenticated -> redirect to /employee/dashboard
    if (isEmployeeLoggedIn && currentPath === '/employee/login') {
      navigate('/employee/dashboard');
    }
    // Cross-portal protection: If Customer tries to access employee route -> redirect to /dashboard
    if (currentPath.startsWith('/employee') && isCustomerAuthenticated && !isEmployeeLoggedIn) {
      if (currentPath !== '/employee/login') {
        navigate('/dashboard');
      }
    }
    // Cross-portal protection: If Employee tries to access customer dashboard directly -> redirect to /employee/dashboard
    if (currentPath === '/dashboard' && isEmployeeLoggedIn && !isCustomerAuthenticated) {
      navigate('/employee/dashboard');
    }
  }, [currentPath, isCustomerAuthenticated, isEmployeeLoggedIn]);

  // Route 1: Customer Auth Pages (/login or /signup)
  if (currentPath === '/login' || currentPath === '/signup') {
    return (
      <CustomerAuthPage
        initialMode={currentPath === '/signup' ? 'signup' : 'login'}
        onNavigateToEmployeeLogin={() => navigate('/employee/login')}
        onSuccess={() => navigate('/dashboard')}
      />
    );
  }

  // Route 2: Standalone Employee Login Page (/employee/login)
  if (currentPath === '/employee/login') {
    return (
      <EmployeeAuthPage
        onSuccess={() => navigate('/employee/dashboard')}
        onNavigateToCustomerAuth={() => navigate('/login')}
      />
    );
  }

  // Route 3: Customer Portal (/dashboard or /queries)
  if (currentPath === '/dashboard' || currentPath === '/queries' || (!currentPath.startsWith('/employee') && isCustomerAuthenticated)) {
    if (isCustomerLoading) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#FAF9F5] text-stone-700 text-xs">
          Checking your session...
        </div>
      );
    }

    if (!isCustomerAuthenticated) {
      return (
        <CustomerAuthPage
          initialMode="login"
          onNavigateToEmployeeLogin={() => navigate('/employee/login')}
          onSuccess={() => navigate('/dashboard')}
        />
      );
    }

    // Filter customer's own cases for data isolation
    const customerOwnCases = cases.filter(
      (c) => c.customer_id === customer?.customer_id || c.customer_name === customer?.name
    );

    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-900 font-sans antialiased">
        <Sidebar
          role="customer"
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          inboxCount={customerOwnCases.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <CustomerDashboardView
            customerCases={customerOwnCases}
            onAskNewQuery={(msg) => handleRunSimulation(customer?.customer_id || 'C-1042', msg)}
            onSelectCase={(cid) => {
              handleSelectCase(cid);
              setActiveTab('active-case');
            }}
            onLogout={() => {
              customerLogout();
              navigate('/login');
            }}
          />
        </div>
      </div>
    );
  }

  // Default Employee Protection Check for Employee Portal (/employee/* or fallback root for support reps)
  if (!isEmployeeLoggedIn && currentPath.startsWith('/employee')) {
    return (
      <EmployeeAuthPage
        onSuccess={() => navigate('/employee/dashboard')}
        onNavigateToCustomerAuth={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] text-stone-900 font-sans antialiased">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        role="employee"
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        escalationsCount={escalationsCount}
        inboxCount={cases.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <TopBar
          caseId={currentCase?.case_id || selectedCaseId}
          customerName={activeCustomer.name}
          status={currentCase?.status || 'AWAITING_INFO'}
          priority={currentCase?.priority || (activeDecision === 'ESCALATE' ? 'CRITICAL' : 'HIGH')}
          currentScenarioId={currentScenarioId}
          onSelectScenario={handleSelectScenario}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* View Routing */}
        {activeTab === 'active-case' && (
          <div className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
            {/* Customer Context Strip */}
            <CustomerContextStrip
              customer={activeCustomer}
              lastInteraction="Yesterday · 18:42"
            />

            {/* Continuous Center + Right Panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Center Panel: Customer Conversation & AI Draft */}
              <ConversationWorkspace
                caseId={currentCase?.case_id || selectedCaseId}
                customer={activeCustomer}
                initialMessage={activeInitialMessage}
                aiDraftText={activeAiDraft}
                groundingCitation={pipelineData?.citation?.article_id || 'KB-ROUT-01'}
                decisionState={activeDecision}
                onSendMessage={(msg) => {
                  showNotification('Response sent to customer');
                }}
              />

              {/* Right Panel: Clarivo AI Insight Rail */}
              <AIInsightRail
                decision={activeDecision}
                confidence={activeConfidence}
                coveragePercent={Math.round(activeConfidence * 100)}
                caseId={currentCase?.case_id || selectedCaseId}
                customer={activeCustomer}
                evidenceChain={activeEvidenceChain}
                missingSignal={missingSignal}
                escalationHandover={pipelineData?.escalation}
                onInspectNode={handleInspectNode}
              />
            </div>
          </div>
        )}

        {/* Inbox / Case Queue View */}
        {activeTab === 'inbox' && (
          <CaseQueueView
            cases={cases}
            activeCaseId={selectedCaseId}
            onSelectCase={handleSelectCase}
            onRefresh={async () => {
              const res = await fetch('/api/cases').then((r) => r.json());
              setCases(res || []);
              showNotification('Refreshed case queue');
            }}
          />
        )}

        {/* Escalations View (Filtered to Escalations) */}
        {activeTab === 'escalations' && (
          <CaseQueueView
            cases={cases.filter((c) => c.status === 'ESCALATED' || c.decision === 'ESCALATE')}
            activeCaseId={selectedCaseId}
            onSelectCase={handleSelectCase}
          />
        )}

        {/* Knowledge Base Catalog View */}
        {activeTab === 'knowledge' && (
          <KnowledgeBaseView
            articles={kbArticles}
            onSelectArticle={(art) => {
              handleInspectNode({
                sourceId: art.id,
                title: art.title,
                category: art.category,
                matchScore: 0.95,
                relevantPassage: art.body,
                highlightSentence: art.body.substring(0, 60),
                usedFor: 'Grounding Verification',
                fullBody: art.body,
                appliesTo: art.applies_to,
                requiredFields: art.required_fields,
              });
            }}
          />
        )}

        {/* Customer Ledger View */}
        {activeTab === 'customers' && (
          <CustomerLedgerView
            customers={customers}
            onSelectCustomerCase={(cid) => {
              const matchedCase = cases.find((c) => c.customer_id === cid);
              if (matchedCase) {
                handleSelectCase(matchedCase.case_id);
              }
            }}
          />
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && <AnalyticsView />}

        {/* Operator Profile View */}
        {activeTab === 'profile' && <EmployeeProfileView />}
      </div>

      {/* 3. Source Inspector Slide-in Drawer */}
      <SourceInspector
        isOpen={isSourceInspectorOpen}
        onClose={() => setIsSourceInspectorOpen(false)}
        data={sourceInspectorData}
      />

      {/* 4. Interactive Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        customers={customers}
        scenarios={scenarios}
        onRunSimulation={handleRunSimulation}
        isLoading={isLoading}
      />

      {/* 5. Employee Profile Drawer */}
      {currentEmployee && (
        <EmployeeProfileDrawer
          isOpen={isProfileDrawerOpen}
          onClose={() => setIsProfileDrawerOpen(false)}
        />
      )}

      {/* 6. Minimalist Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-stone-900 text-white text-xs px-3.5 py-2 rounded shadow-lg flex items-center gap-2 border border-stone-800 animate-fadeIn select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}

