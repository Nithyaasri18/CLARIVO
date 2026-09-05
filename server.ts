import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { runResolutionPipeline } from './src/engine';
import { CustomerRecord } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to load JSON files safely
function loadData<T>(fileName: string, fallback: T): T {
  const filePath = path.join(process.cwd(), 'data', fileName);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`Error reading ${fileName}:`, e);
    }
  }
  return fallback;
}

function saveData<T>(fileName: string, data: T): void {
  const filePath = path.join(process.cwd(), 'data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Simple in-memory session store backed by simple token hashing/generation
interface AuthSession {
  token: string;
  user: {
    id: string;
    customer_id?: string;
    employee_code?: string;
    name: string;
    email: string;
    role: 'customer' | 'employee';
    title_or_plan?: string;
  };
  created_at: string;
}

const activeSessions: Map<string, AuthSession> = new Map();

// Helper for simple hash (in production use bcrypt / argon2)
function hashPassword(pwd: string): string {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// -------------------------------------------------------------
// Auth API Endpoints
// -------------------------------------------------------------

// Helper to get token from Auth header
function getSessionFromReq(req: express.Request): AuthSession | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return activeSessions.get(token) || null;
}

// Session Verification
app.get('/api/auth/session', (req, res) => {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ authenticated: false, message: 'No active session' });
  }
  res.json({ authenticated: true, user: session.user, token: session.token });
});

// Customer Signup
app.post('/api/auth/customer/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const customers = loadData<any[]>('customers.json', []);
  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate
  const existingCust = customers.find(
    (c) => c.email && c.email.trim().toLowerCase() === normalizedEmail
  );
  if (existingCust && existingCust.password_hash) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const customerId = existingCust ? existingCust.customer_id : `C-${Date.now().toString().slice(-4)}`;
  const password_hash = hashPassword(password);

  let newCustomerRecord: any;
  if (existingCust) {
    existingCust.password_hash = password_hash;
    existingCust.name = name;
    if (phone) existingCust.phone = phone;
    newCustomerRecord = existingCust;
  } else {
    newCustomerRecord = {
      customer_id: customerId,
      name,
      phone: phone || '+91 98000 00000',
      email: normalizedEmail,
      plan_id: 'FIBER-799',
      plan_name: 'Fiber Basic 100Mbps',
      monthly_rental: 799,
      billing_status: 'PAID',
      current_balance: 0.0,
      last_payment_date: new Date().toISOString().slice(0, 10),
      router_model: 'Nokia G-2425G-A GPON ONT',
      router_status: 'ONLINE',
      tenure_months: 1,
      address: 'Registered Online Customer',
      city: 'Bengaluru',
      recent_tickets: [],
      password_hash,
    };
    customers.unshift(newCustomerRecord);
  }

  saveData('customers.json', customers);

  const token = `cust_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const userPayload = {
    id: customerId,
    customer_id: customerId,
    name: newCustomerRecord.name,
    email: newCustomerRecord.email,
    role: 'customer' as const,
    title_or_plan: newCustomerRecord.plan_name,
  };

  const session: AuthSession = {
    token,
    user: userPayload,
    created_at: new Date().toISOString(),
  };
  activeSessions.set(token, session);

  res.json({ success: true, token, user: userPayload });
});

// Customer Login
app.post('/api/auth/customer/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const customers = loadData<any[]>('customers.json', []);
  const normalizedEmail = email.trim().toLowerCase();
  const customer = customers.find((c) => c.email && c.email.trim().toLowerCase() === normalizedEmail);

  if (!customer) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Validate password (if customer record has password_hash check match; if legacy seed without password, create password)
  const pwdHash = hashPassword(password);
  if (customer.password_hash && customer.password_hash !== pwdHash) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  } else if (!customer.password_hash) {
    // Save initial password for legacy demo accounts
    customer.password_hash = pwdHash;
    saveData('customers.json', customers);
  }

  const token = `cust_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const userPayload = {
    id: customer.customer_id,
    customer_id: customer.customer_id,
    name: customer.name,
    email: customer.email,
    role: 'customer' as const,
    title_or_plan: customer.plan_name,
  };

  const session: AuthSession = {
    token,
    user: userPayload,
    created_at: new Date().toISOString(),
  };
  activeSessions.set(token, session);

  res.json({ success: true, token, user: userPayload });
});

// Employee Login
app.post('/api/auth/employee/login', (req, res) => {
  const { employeeIdOrEmail, password } = req.body;
  if (!employeeIdOrEmail || !password) {
    return res.status(400).json({ error: 'Employee ID/Email and password are required' });
  }

  const query = employeeIdOrEmail.trim().toLowerCase();
  // Default Seed Employees
  const defaultEmployees = [
    {
      id: 'emp-1',
      employee_code: 'EMP-4091',
      name: 'Priya Sharma',
      email: 'priya.sharma@clarivo.telecom.in',
      role: 'Tier 1 Support Specialist',
    },
    {
      id: 'emp-2',
      employee_code: 'EMP-2104',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@clarivo.telecom.in',
      role: 'Tier 2 NOC Engineer',
    },
    {
      id: 'emp-3',
      employee_code: 'EMP-1008',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@clarivo.telecom.in',
      role: 'Team Lead / QA Supervisor',
    },
    {
      id: 'emp-4',
      employee_code: 'EMP-5520',
      name: 'Vikram Malhotra',
      email: 'vikram.m@clarivo.telecom.in',
      role: 'Billing Specialist',
    },
  ];

  const foundEmp = defaultEmployees.find(
    (e) =>
      e.id.toLowerCase() === query ||
      e.employee_code.toLowerCase() === query ||
      e.email.toLowerCase() === query ||
      e.name.toLowerCase().includes(query)
  );

  if (!foundEmp) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = `emp_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const userPayload = {
    id: foundEmp.id,
    employee_code: foundEmp.employee_code,
    name: foundEmp.name,
    email: foundEmp.email,
    role: 'employee' as const,
    title_or_plan: foundEmp.role,
  };

  const session: AuthSession = {
    token,
    user: userPayload,
    created_at: new Date().toISOString(),
  };
  activeSessions.set(token, session);

  res.json({ success: true, token, user: userPayload });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Clarivo Copilot', port: PORT });
});

// Cases list
app.get('/api/cases', (req, res) => {
  const cases = loadData<any[]>('cases.json', []);
  res.json(cases);
});

// Single case details + pipeline output
app.get('/api/cases/:id', async (req, res) => {
  const caseId = req.params.id;
  const cases = loadData<any[]>('cases.json', []);
  const currentCase = cases.find((c) => c.case_id === caseId);

  if (!currentCase) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const customers = loadData<CustomerRecord[]>('customers.json', []);
  const customer = customers.find((c) => c.customer_id === currentCase.customer_id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const pipeline = await runResolutionPipeline({
    caseId,
    message: currentCase.initial_message,
    customer,
  });

  res.json({
    case: currentCase,
    customer,
    pipeline,
  });
});

// Case action (approve, clarify, escalate)
app.post('/api/cases/:id/action', (req, res) => {
  const caseId = req.params.id;
  const { action, notes } = req.body;
  const cases = loadData<any[]>('cases.json', []);
  const idx = cases.findIndex((c) => c.case_id === caseId);

  if (idx === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }

  let newStatus = cases[idx].status;
  if (action === 'APPROVE') newStatus = 'RESOLVED';
  else if (action === 'SEND_CLARIFICATION') newStatus = 'AWAITING_INFO';
  else if (action === 'CONFIRM_ESCALATION') newStatus = 'ESCALATED';

  cases[idx].status = newStatus;
  cases[idx].updated_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
  saveData('cases.json', cases);

  res.json({ case_id: caseId, status: newStatus, action, notes });
});

// Run live simulation on customer query
app.post('/api/simulate', async (req, res) => {
  const { customer_id, message, case_id } = req.body;
  if (!customer_id || !message) {
    return res.status(400).json({ error: 'customer_id and message are required' });
  }

  const customers = loadData<CustomerRecord[]>('customers.json', []);
  const customer = customers.find((c) => c.customer_id === customer_id);
  if (!customer) {
    return res.status(404).json({ error: `Customer ${customer_id} not found` });
  }

  try {
    const pipeline = await runResolutionPipeline({
      caseId: case_id,
      message,
      customer,
    });

    // Update or insert into cases.json
    const cases = loadData<any[]>('cases.json', []);
    const existingIdx = cases.findIndex((c) => c.case_id === pipeline.case_id);
    const caseRecord = {
      case_id: pipeline.case_id,
      customer_id: customer.customer_id,
      customer_name: customer.name,
      issue_title: message.slice(0, 75),
      initial_message: message,
      status:
        pipeline.decision === 'RESOLUTION'
          ? 'RESOLVED_DRAFT'
          : pipeline.decision === 'MISSING_INFO'
          ? 'AWAITING_INFO'
          : 'ESCALATED',
      intent: pipeline.intent,
      confidence: pipeline.confidence,
      decision: pipeline.decision,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    if (existingIdx >= 0) {
      cases[existingIdx] = { ...cases[existingIdx], ...caseRecord };
    } else {
      cases.unshift(caseRecord);
    }
    saveData('cases.json', cases);

    res.json(pipeline);
  } catch (err: any) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: err.message || 'Simulation failed' });
  }
});

// Customers list
app.get('/api/customers', (req, res) => {
  const customers = loadData<CustomerRecord[]>('customers.json', []);
  res.json(customers);
});

// Single customer
app.get('/api/customer/:id', (req, res) => {
  const customers = loadData<CustomerRecord[]>('customers.json', []);
  const customer = customers.find((c) => c.customer_id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// Knowledge Base articles
app.get('/api/kb', (req, res) => {
  const articles = loadData<any[]>('kb_articles.json', []);
  const { category, search } = req.query;
  let filtered = articles;
  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.body.toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s) ||
        a.keywords?.some((k: string) => k.toLowerCase().includes(s))
    );
  }
  res.json(filtered);
});

// Benchmark scenarios
app.get('/api/scenarios', (req, res) => {
  const scenarios = loadData<any[]>('scenarios.json', []);
  res.json(scenarios);
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Clarivo server running on http://0.0.0.0:${PORT}`);
  });
}

start();
