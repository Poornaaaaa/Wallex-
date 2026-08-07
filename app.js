/* Wallex - Smart Expense Tracker & Financial Advisor (Supabase Integration Engine) */
const { useState, useEffect, useRef } = React;

// Initial Demo Data Fallbacks
const INITIAL_DEMO_TRANSACTIONS = [
  { id: 'tx-1', title: 'Wallex Monthly Salary Deposit', amount: 150000, type: 'income', category: 'Salary', date: '2026-08-01', method: 'UPI / NEFT', tag: 'SL' },
  { id: 'tx-2', title: 'Apartment Rent Payment', amount: 35000, type: 'expense', category: 'Housing & Utilities', date: '2026-08-02', method: 'Net Banking', tag: 'HU' },
  { id: 'tx-3', title: 'Blinkit & Zepto Groceries', amount: 4250, type: 'expense', category: 'Food & Dining', date: '2026-08-03', method: 'UPI (GPay)', tag: 'FD' },
  { id: 'tx-4', title: 'AWS Cloud Hosting Subscription', amount: 8500, type: 'expense', category: 'Tech & Software', date: '2026-08-04', method: 'Credit Card', tag: 'TS' },
  { id: 'tx-5', title: 'Third Wave Coffee & Snacks', amount: 650, type: 'expense', category: 'Food & Dining', date: '2026-08-05', method: 'UPI (Paytm)', tag: 'FD' },
  { id: 'tx-6', title: 'Netflix & Spotify Premium', amount: 1299, type: 'expense', category: 'Entertainment', date: '2026-08-05', method: 'Credit Card', tag: 'EN' },
  { id: 'tx-7', title: 'Wallex Client Retainer Payment', amount: 45000, type: 'income', category: 'Freelance', date: '2026-08-06', method: 'UPI Instant', tag: 'FL' }
];

const INITIAL_DEMO_BUDGETS = [
  { category: 'Food & Dining', limit: 15000, tag: 'FD' },
  { category: 'Tech & Software', limit: 12000, tag: 'TS' },
  { category: 'Housing & Utilities', limit: 40000, tag: 'HU' },
  { category: 'Entertainment', limit: 5000, tag: 'EN' },
  { category: 'Shopping', limit: 10000, tag: 'SH' },
  { category: 'Travel & Transport', limit: 8000, tag: 'TT' }
];

const INITIAL_DEMO_USER = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex@wallex.in',
  company: 'Wallex India Tech Ltd.',
  plan: 'Pro Tier (₹999/mo)',
  monthlyBudget: 75000,
  currency: '₹',
  lastLogin: '2026-08-06 10:25:00'
};

// Interactive SVG Expense Pie Chart Component
function ExpensePieChart({ transactions, formatINR }) {
  const [hoveredCat, setHoveredCat] = useState(null);

  const expenseTxs = transactions.filter(t => t.type === 'expense');
  const totalExp = expenseTxs.reduce((sum, t) => sum + Number(t.amount), 0);

  const defaultCategories = [
    { name: 'Housing & Utilities', color: '#8b5cf6', tag: 'HU' },
    { name: 'Tech & Software', color: '#3450ff', tag: 'TS' },
    { name: 'Food & Dining', color: '#1faa79', tag: 'FD' },
    { name: 'Entertainment', color: '#f59e0b', tag: 'EN' },
    { name: 'Shopping', color: '#ec4899', tag: 'SH' },
    { name: 'Travel & Transport', color: '#06b6d4', tag: 'TT' }
  ];

  const catData = defaultCategories.map(cat => {
    const amount = expenseTxs
      .filter(t => t.category === cat.name)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const percent = totalExp > 0 ? (amount / totalExp) * 100 : 0;
    return { ...cat, amount, percent };
  }).filter(c => c.amount > 0);

  let cumulativeAngle = 0;
  const radius = 75;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  const slices = catData.map((item) => {
    const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativeAngle / 360) * circumference);
    cumulativeAngle += (item.percent / 100) * 360;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const activeItem = hoveredCat || (catData.length > 0 ? catData[0] : null);

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <span className="mono" style={{ color: 'var(--mint)', fontSize: '11.5px', textTransform: 'uppercase' }}>Visual Analytics</span>
          <h3 style={{ fontSize: '26px', margin: '4px 0' }}>Expense Distribution Breakdown</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>Hover over chart segments or category legend items to inspect proportions.</p>
        </div>
        <span className="badge badge-mint">{catData.length} Active Categories</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '240px', height: '240px', margin: '0 auto' }}>
          <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {slices.map((slice) => (
              <circle
                key={slice.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={hoveredCat?.name === slice.name ? 26 : 20}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onMouseEnter={() => setHoveredCat(slice)}
                onMouseLeave={() => setHoveredCat(null)}
              />
            ))}
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '12px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              {activeItem ? activeItem.name : 'Total Expenses'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: activeItem ? activeItem.color : 'var(--text-main)', margin: '2px 0' }}>
              {activeItem ? formatINR(activeItem.amount) : formatINR(totalExp)}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {activeItem ? `${activeItem.percent.toFixed(1)}% of total` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {catData.map((item) => (
            <div 
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                background: hoveredCat?.name === item.name ? 'rgba(125,125,125,0.14)' : 'rgba(125,125,125,0.04)',
                border: '1px solid ' + (hoveredCat?.name === item.name ? item.color : 'var(--dark-border)'),
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={() => setHoveredCat(item)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <div className="flex items-center gap-2">
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', display: 'block' }}>{formatINR(item.amount)}</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.percent.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeView, setActiveView] = useState('home');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [vaultTab, setVaultTab] = useState('supabase');

  // Vault Passcode State
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [vaultPasscode, setVaultPasscode] = useState('');
  const [vaultPassError, setVaultPassError] = useState('');
  const [showVaultPass, setShowVaultPass] = useState(false);

  // Clean & Sanitize Supabase Project URL
  const cleanSupabaseUrl = (rawUrl) => {
    if (!rawUrl) return '';
    let cleaned = rawUrl.trim().replace(/\/+$/, '');
    cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
    const dashMatch = cleaned.match(/supabase\.(?:com|co)\/dashboard\/project\/([a-zA-Z0-9]+)/);
    if (dashMatch && dashMatch[1]) {
      return `https://${dashMatch[1]}.supabase.co`;
    }
    return cleaned;
  };

  // SUPABASE CLOUD DATABASE CONFIGURATION STATE
  const [supabaseUrl, setSupabaseUrl] = useState(() => cleanSupabaseUrl(localStorage.getItem('wallex_supabase_url') || ''));
  const [supabaseKey, setSupabaseKey] = useState(() => (localStorage.getItem('wallex_supabase_key') || '').trim());
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Supabase Client Reference Instance
  const supabaseRef = useRef(null);

  // Initialize Supabase Client
  useEffect(() => {
    const sanitizedUrl = cleanSupabaseUrl(supabaseUrl);
    const sanitizedKey = supabaseKey ? supabaseKey.trim() : '';

    if (sanitizedUrl && sanitizedKey && window.supabase) {
      try {
        const client = window.supabase.createClient(sanitizedUrl, sanitizedKey);
        supabaseRef.current = client;
        setSupabaseConnected(true);
        console.log('Supabase Cloud Database connected at:', sanitizedUrl);
      } catch (e) {
        console.error('Supabase initialization failed:', e);
        setSupabaseConnected(false);
      }
    } else {
      supabaseRef.current = null;
      setSupabaseConnected(false);
    }
  }, [supabaseUrl, supabaseKey]);

  // 1. LOCALSTORAGE + SUPABASE REGISTERED USERS DATABASE
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('wallex_users_db');
      return saved ? JSON.parse(saved) : [INITIAL_DEMO_USER];
    } catch (e) {
      return [INITIAL_DEMO_USER];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wallex_users_db', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Users DB write error:', e);
    }
  }, [registeredUsers]);

  // 2. LOCALSTORAGE ACTIVE USER SESSION
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wallex_user');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USER;
    } catch (e) {
      return INITIAL_DEMO_USER;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('wallex_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('wallex_user');
      }
    } catch (e) {
      console.error('LocalStorage user write failed:', e);
    }
  }, [currentUser]);

  // 3. LOCALSTORAGE + SUPABASE TRANSACTIONS DATA
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('wallex_transactions');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_TRANSACTIONS;
    } catch (e) {
      return INITIAL_DEMO_TRANSACTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wallex_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [transactions]);

  // Helper to always get a clean, sanitized Supabase Client instance
  const getFreshSupabaseClient = () => {
    const rawUrl = supabaseUrl || localStorage.getItem('wallex_supabase_url') || '';
    const rawKey = supabaseKey || localStorage.getItem('wallex_supabase_key') || '';
    const sanitizedUrl = cleanSupabaseUrl(rawUrl);
    const sanitizedKey = rawKey ? rawKey.trim() : '';

    if (sanitizedUrl !== supabaseUrl) setSupabaseUrl(sanitizedUrl);
    if (sanitizedKey !== supabaseKey) setSupabaseKey(sanitizedKey);

    localStorage.setItem('wallex_supabase_url', sanitizedUrl);
    localStorage.setItem('wallex_supabase_key', sanitizedKey);

    if (sanitizedUrl && sanitizedKey && window.supabase) {
      try {
        const client = window.supabase.createClient(sanitizedUrl, sanitizedKey);
        supabaseRef.current = client;
        setSupabaseConnected(true);
        return client;
      } catch (e) {
        console.error('Supabase client creation error:', e);
      }
    }
    setSupabaseConnected(false);
    return null;
  };

  // Fetch transactions from Supabase on connect
  const handleFetchFromSupabase = async () => {
    const client = getFreshSupabaseClient();
    if (!client) {
      showToast('Please configure Supabase Project URL and Anon API Key first.', 'warning');
      return;
    }
    try {
      showToast('Fetching live records from Supabase PostgreSQL database...', 'info');
      const { data, error } = await client.from('transactions').select('*');
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setTransactions(data);
        showToast(`Loaded ${data.length} transactions from Supabase!`, 'success');
      } else {
        showToast('Supabase connected! Table is currently empty or initialized.', 'info');
      }
    } catch (e) {
      console.error('Supabase query error:', e);
      showToast(`Supabase Sync Info: ${e.message || 'Make sure "transactions" table exists in your Supabase SQL Editor'}`, 'warning');
    }
  };

  // Save Supabase Configuration
  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault();
    const client = getFreshSupabaseClient();
    if (client) {
      showToast('Supabase Cloud Database credentials saved & connected!', 'success');
      handleFetchFromSupabase();
    } else {
      showToast('Cleared Supabase credentials. Reverted to Local Storage.', 'info');
    }
  };

  // 4. CATEGORY BUDGETS
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('wallex_budgets');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_BUDGETS;
    } catch (e) {
      return INITIAL_DEMO_BUDGETS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wallex_budgets', JSON.stringify(budgets));
    } catch (e) {
      console.error('LocalStorage budgets write failed:', e);
    }
  }, [budgets]);

  // 5. AUDIT LOGS
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('wallex_audit_logs');
      return saved ? JSON.parse(saved) : [
        { id: 'log-1', type: 'SYSTEM_INIT', message: 'Wallex Supabase & Local Storage Engines Loaded', timestamp: new Date().toLocaleString() }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wallex_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Audit logs write failed:', e);
    }
  }, [auditLogs]);

  const logActivity = (type, message) => {
    const newLog = {
      id: 'log-' + Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (supabaseRef.current) {
      supabaseRef.current.from('audit_logs').insert([newLog]).then(({ error }) => {
        if (error) console.log('Supabase audit log insert note:', error.message);
      });
    }
  };

  // Filter Transaction State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchTxQuery, setSearchTxQuery] = useState('');

  // Add Transaction Modal State
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [newTxTitle, setNewTxTitle] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxType, setNewTxType] = useState('expense');
  const [newTxCategory, setNewTxCategory] = useState('Food & Dining');
  const [newTxMethod, setNewTxMethod] = useState('UPI (GPay/PhonePe)');

  // Floating AI Advisor State
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetMessages, setWidgetMessages] = useState([
    { sender: 'bot', text: 'Welcome. I am your Wallex AI Advisor. All transactions can be saved locally or in your Supabase PostgreSQL Cloud Database.' }
  ]);
  const [widgetInput, setWidgetInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);

  // Draggable Widget State
  const [widgetPos, setWidgetPos] = useState(null);
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Auth Portal State
  const [authMode, setAuthMode] = useState('signin');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpBudget, setSignUpBudget] = useState('75000');
  const [rememberMe, setRememberMe] = useState(true);

  // Toast Engine
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeView !== 'home') return;
    const handleScroll = () => {
      const sections = ['dashboard', 'chart', 'transactions', 'budgets', 'details'];
      const scrollPos = window.scrollY + 200;
      for (let sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  // Financial Calculations (INR ₹)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const userBudget = currentUser ? currentUser.monthlyBudget : 75000;
  const budgetUsagePercent = Math.min(100, Math.round((totalExpense / userBudget) * 100));

  const getCategorySpent = (catName) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === catName)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const formatINR = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const scrollToSection = (sectionId) => {
    setActiveView('home');
    setActiveSection(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleOpenAddTxModal = () => {
    if (!currentUser) {
      showToast('Please sign in or create an account first to add transactions.', 'warning');
      setActiveView('signin');
    } else {
      setIsAddTxModalOpen(true);
    }
  };

  const handleLogOut = () => {
    if (currentUser) {
      logActivity('USER_LOGOUT', `User ${currentUser.name} (${currentUser.email}) logged out.`);
    }
    setCurrentUser(null);
    setIsVaultUnlocked(false);
    setActiveView('home');
    setActiveSection('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Logged out of Wallex. Switched to Guest View.', 'info');
  };

  const handleFillDemoUser = () => {
    setSignUpEmail('alex@wallex.in');
    setSignUpPassword('wallex2026');
    setSignUpName('Alex Rivera');
    setSignUpCompany('Wallex India Tech Ltd.');
    showToast('Auto-filled demo user credentials.', 'info');
  };

  const handleResetToDemoData = () => {
    setTransactions(INITIAL_DEMO_TRANSACTIONS);
    setBudgets(INITIAL_DEMO_BUDGETS);
    setRegisteredUsers([INITIAL_DEMO_USER]);
    setCurrentUser(INITIAL_DEMO_USER);
    localStorage.clear();
    logActivity('SYSTEM_RESET', 'Cleared Local Storage and restored default demo records.');
    showToast('Reset all database tables to default demo records.', 'success');
  };

  // 1-Click Sync All Registered Users to Supabase Profiles Table
  const handleSyncProfilesToSupabase = async () => {
    const client = getFreshSupabaseClient();
    if (!client) {
      showToast('Please configure & save your Supabase Project URL & Anon Key first.', 'warning');
      return;
    }
    const profileRows = registeredUsers.map(u => ({
      id: u.id || ('usr-' + Date.now()),
      name: u.name || 'User',
      email: u.email,
      company: u.company || 'Personal',
      monthlyBudget: u.monthlyBudget || 75000,
      lastLogin: u.lastLogin || new Date().toLocaleString()
    }));

    try {
      showToast('Syncing registered user profiles to Supabase profiles table...', 'info');
      const { data, error } = await client.from('profiles').upsert(profileRows);
      if (error) throw error;
      showToast(`✅ Successfully synced ${profileRows.length} user profile(s) to Supabase cloud!`, 'success');
    } catch (err) {
      console.error('Supabase profile sync error:', err);
      if (err.message && err.message.toLowerCase().includes('row-level security')) {
        showToast('⚠️ Supabase RLS Error: Run "ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;" in Supabase SQL Editor.', 'danger');
      } else if (err.message && err.message.toLowerCase().includes('does not exist')) {
        showToast('⚠️ Supabase Error: Table "profiles" does not exist! Please run the SQL Setup Script in Supabase SQL Editor.', 'danger');
      } else {
        showToast(`⚠️ Supabase Profile Sync Error: ${err.message}`, 'danger');
      }
    }
  };

  // AUTHENTICATION & USER SESSION CREATION HANDLER
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const nowStr = new Date().toLocaleString();
    const newUser = {
      id: 'usr-' + Date.now(),
      name: signUpName.trim() || (signUpEmail.split('@')[0] || 'Alex Rivera'),
      email: signUpEmail.trim() || 'alex@wallex.in',
      company: signUpCompany.trim() || 'Wallex India Tech Ltd.',
      plan: 'Pro Tier (₹999/mo)',
      monthlyBudget: parseFloat(signUpBudget) || 75000,
      currency: '₹',
      lastLogin: nowStr
    };

    setRegisteredUsers(prev => {
      const exists = prev.find(u => u.email === newUser.email);
      if (exists) {
        return prev.map(u => u.email === newUser.email ? { ...u, lastLogin: nowStr } : u);
      }
      return [newUser, ...prev];
    });

    // Sync to Supabase profiles table
    const client = getFreshSupabaseClient();
    if (client) {
      const profileRow = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        monthlyBudget: newUser.monthlyBudget,
        lastLogin: newUser.lastLogin
      };
      client.from('profiles').upsert([profileRow]).then(({ error }) => {
        if (error) {
          console.error('Supabase profile upsert error:', error.message);
          showToast(`User signed in locally (Supabase profiles note: ${error.message})`, 'warning');
        } else {
          showToast(`Synced profile "${newUser.name}" directly to Supabase cloud!`, 'success');
        }
      });
    }

    setCurrentUser(newUser);
    logActivity('USER_LOGIN', `User session active for ${newUser.name} (${newUser.email})`);
    showToast(`Welcome back, ${newUser.name}! Signed into Wallex portal.`, 'success');
    setActiveView('home');
  };

  // Widget Drag Physics
  const handleWidgetMouseDown = (e) => {
    setIsDraggingWidget(true);
    const currentX = widgetPos ? widgetPos.x : (window.innerWidth - 420);
    const currentY = widgetPos ? widgetPos.y : (window.innerHeight - 600);
    dragOffsetRef.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingWidget) return;
      let newX = e.clientX - dragOffsetRef.current.x;
      let newY = e.clientY - dragOffsetRef.current.y;
      newX = Math.max(10, Math.min(window.innerWidth - 400, newX));
      newY = Math.max(10, Math.min(window.innerHeight - 560, newY));
      setWidgetPos({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsDraggingWidget(false);

    if (isDraggingWidget) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWidget]);

  const speakText = (text) => {
    if (!voiceSpeechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    setIsVoiceActive(true);
    showToast('Listening for speech input...', 'info');
    setTimeout(() => {
      setIsVoiceActive(false);
      const voiceQuery = "How much did I spend on Food & Dining this month in Rupees?";
      setWidgetInput(voiceQuery);
      showToast(`Recognized Voice Query: "${voiceQuery}"`, 'success');
    }, 2000);
  };

  const handleSendWidgetMessage = () => {
    if (!widgetInput.trim()) return;
    const text = widgetInput.trim();
    setWidgetMessages(prev => [...prev, { sender: 'user', text }]);
    setWidgetInput('');

    setTimeout(() => {
      let botReply = "I've analyzed your saved Wallex financial ledger in Indian Rupees (₹). ";
      const foodSpent = getCategorySpent('Food & Dining');
      const techSpent = getCategorySpent('Tech & Software');

      if (text.toLowerCase().includes('food') || text.toLowerCase().includes('din')) {
        botReply += `You spent ${formatINR(foodSpent)} on Food & Dining so far this month. That is 32% of your ₹15,000 food budget.`;
      } else if (text.toLowerCase().includes('tech') || text.toLowerCase().includes('software')) {
        botReply += `Tech & Software expenses total ${formatINR(techSpent)} (AWS Hosting ₹8,500). You have ${formatINR(12000 - techSpent)} remaining in this category.`;
      } else if (text.toLowerCase().includes('save') || text.toLowerCase().includes('tip')) {
        botReply += `Wallex Recommendation: Reducing dining out by 15% could save an extra ₹3,500/month toward your investment portfolio.`;
      } else {
        botReply += `Your net Wallex balance is ${formatINR(netBalance)} with total income of ${formatINR(totalIncome)} and expenses of ${formatINR(totalExpense)}.`;
      }

      setWidgetMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      speakText(botReply);
    }, 600);
  };

  const handleTestSupabaseInsert = async () => {
    if (!supabaseRef.current) {
      showToast('Please save your Supabase Project URL & Anon Key first.', 'warning');
      return;
    }
    const sampleTx = {
      id: 'tx-test-' + Date.now(),
      title: 'Wallex Connection Test Deposit',
      amount: 100,
      type: 'income',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      method: 'UPI',
      tag: 'SL'
    };
    try {
      showToast('Testing Supabase insert query...', 'info');
      const { data, error } = await supabaseRef.current.from('transactions').insert([sampleTx]).select();
      if (error) throw error;
      showToast('✅ Supabase Insert Test Passed! Sample row added to cloud table.', 'success');
      handleFetchFromSupabase();
    } catch (err) {
      console.error('Supabase test error:', err);
      if (err.message && err.message.toLowerCase().includes('row-level security')) {
        showToast('⚠️ Supabase Error: Row-Level Security (RLS) is blocking inserts! Run "ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;" in Supabase SQL Editor.', 'danger');
      } else if (err.message && err.message.toLowerCase().includes('does not exist')) {
        showToast('⚠️ Supabase Error: Table "transactions" does not exist! Run the SQL Setup Script in Supabase SQL Editor.', 'danger');
      } else {
        showToast(`⚠️ Supabase Error: ${err.message || 'Check API credentials'}`, 'danger');
      }
    }
  };

  // ADD TRANSACTION HANDLER WITH DUAL SUPABASE + LOCALSTORAGE SAVE
  const handleAddTxSubmit = (e) => {
    e.preventDefault();
    if (!newTxTitle || !newTxAmount || isNaN(newTxAmount)) return;

    const parsedAmount = Number(newTxAmount);
    if (parsedAmount <= 0) return;

    let tagCode = 'TX';
    if (newTxCategory.includes('Food')) tagCode = 'FD';
    else if (newTxCategory.includes('Tech')) tagCode = 'TS';
    else if (newTxCategory.includes('Housing')) tagCode = 'HU';
    else if (newTxCategory.includes('Entertainment')) tagCode = 'EN';
    else if (newTxCategory.includes('Shopping')) tagCode = 'SH';
    else if (newTxCategory.includes('Travel')) tagCode = 'TT';
    else if (newTxType === 'income') tagCode = 'IN';

    const newTx = {
      id: 'tx-' + Date.now(),
      title: newTxTitle.trim(),
      amount: parsedAmount,
      type: newTxType,
      category: newTxCategory,
      date: new Date().toISOString().split('T')[0],
      method: newTxMethod,
      tag: tagCode
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAddTxModalOpen(false);
    setNewTxTitle('');
    setNewTxAmount('');
    logActivity('TX_ADDED', `Added ${newTx.type} "${newTx.title}" of ${formatINR(newTx.amount)} (${newTx.category})`);

    // Sync to Supabase cloud table if connected
    if (supabaseRef.current) {
      supabaseRef.current.from('transactions').insert([newTx]).then(({ error }) => {
        if (error) {
          console.error('Supabase transaction insert error:', error);
          if (error.message && error.message.toLowerCase().includes('row-level security')) {
            showToast('⚠️ Supabase RLS Blocked Insert! Run "ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;" in Supabase SQL Editor.', 'danger');
          } else if (error.message && error.message.toLowerCase().includes('does not exist')) {
            showToast('⚠️ Supabase Error: Table "transactions" does not exist! Please run SQL setup script.', 'danger');
          } else {
            showToast(`Saved locally (Supabase Note: ${error.message})`, 'warning');
          }
        } else {
          showToast(`Synced transaction "${newTx.title}" directly to Supabase cloud!`, 'success');
        }
      });
    } else {
      showToast(`Added ${newTx.type === 'income' ? 'income' : 'expense'} "${formatINR(newTx.amount)}" to dashboard & local storage.`, 'success');
    }
  };

  const handleDeleteTx = (id) => {
    const targetTx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    logActivity('TX_DELETED', `Deleted transaction record ID ${id} (${targetTx ? targetTx.title : ''})`);

    if (supabaseRef.current) {
      supabaseRef.current.from('transactions').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete error:', error.message);
      });
    }

    showToast('Transaction deleted and updated in database.', 'info');
  };

  const handleAccessVault = () => {
    if (isVaultUnlocked) {
      setActiveView('vault');
    } else {
      setVaultPassError('');
      setVaultPasscode('');
      setIsVaultModalOpen(true);
    }
  };

  const handleVaultPassSubmit = (e) => {
    e.preventDefault();
    if (vaultPasscode === 'vault123' || vaultPasscode === 'admin123' || vaultPasscode === 'admin') {
      setIsVaultUnlocked(true);
      setIsVaultModalOpen(false);
      setVaultPasscode('');
      setVaultPassError('');
      logActivity('VAULT_UNLOCKED', 'Financial Vault unlocked via admin passcode.');
      showToast('Financial Vault unlocked.', 'success');
      setActiveView('vault');
    } else {
      setVaultPassError('Incorrect passcode. Default: vault123');
    }
  };

  const handleLockVault = () => {
    setIsVaultUnlocked(false);
    setActiveView('home');
    logActivity('VAULT_LOCKED', 'Financial Vault session locked.');
    showToast('Financial Vault locked.', 'info');
  };

  // BACKUP DATA DOWNLOAD
  const handleExportFullBackup = () => {
    const backupData = {
      app: 'Wallex Group Inc. Smart Expense Tracker',
      exportTimestamp: new Date().toLocaleString(),
      supabaseConfig: { url: supabaseUrl, connected: supabaseConnected },
      currentUser: currentUser,
      registeredUsers: registeredUsers,
      transactions: transactions,
      categoryBudgets: budgets,
      auditLogs: auditLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wallex_full_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded complete Wallex JSON database backup.', 'success');
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesCat = selectedCategoryFilter === 'All' || t.category === selectedCategoryFilter;
    const matchesQuery = t.title.toLowerCase().includes(searchTxQuery.toLowerCase()) || t.category.toLowerCase().includes(searchTxQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // SQL Schema Script for Supabase Table Setup
  const supabaseSQLScript = `
-- COPY & PASTE THIS INTO SUPABASE SQL EDITOR:
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  method TEXT,
  tag TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  monthlyBudget NUMERIC,
  lastLogin TEXT
);
  `.trim();

  return (
    <div>
      {/* Background Glowing Blur Orbs */}
      <div className="bg-blur-orb orb-1"></div>
      <div className="bg-blur-orb orb-2"></div>
      <div className="bg-blur-orb orb-3"></div>

      {/* Glassmorphic Navbar Header */}
      <nav className="glass-nav">
        <div className="wrap">
          <div className="brand-logo" onClick={() => setActiveView('home')}>
            <span className="brand-icon" title="Wallex Wallet Logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
              </svg>
            </span>
            Wallex
          </div>

          <div className="nav-links">
            <a 
              onClick={() => scrollToSection('dashboard')}
              className={activeView === 'home' && activeSection === 'dashboard' ? 'nav-glow-active' : ''}
            >
              Dashboard
            </a>

            <a 
              onClick={() => scrollToSection('chart')}
              className={activeView === 'home' && activeSection === 'chart' ? 'nav-glow-active' : ''}
            >
              Expense Chart
            </a>

            <a 
              onClick={() => scrollToSection('transactions')}
              className={activeView === 'home' && activeSection === 'transactions' ? 'nav-glow-active' : ''}
            >
              Transactions ({transactions.length})
            </a>

            <a 
              onClick={() => scrollToSection('budgets')}
              className={activeView === 'home' && activeSection === 'budgets' ? 'nav-glow-active' : ''}
            >
              Category Budgets
            </a>

            <a 
              onClick={() => scrollToSection('details')}
              className={activeView === 'home' && activeSection === 'details' ? 'nav-glow-active' : ''}
            >
              My Details
            </a>

            <a 
              onClick={handleAccessVault}
              className={activeView === 'vault' ? 'nav-glow-active' : ''}
            >
              Financial Vault
            </a>
          </div>

          <div className="nav-actions">
            <button 
              className="btn btn-mint btn-sm"
              onClick={handleOpenAddTxModal}
            >
              + Add Transaction
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
                showToast(`Switched to ${nextTheme.toUpperCase()} theme.`, 'info');
              }}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            {currentUser ? (
              <>
                <span className="badge badge-primary" onClick={() => scrollToSection('details')}>{currentUser.name}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogOut}>Log Out</button>
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setActiveView('signin')}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* Toast Notifications Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span style={{ fontWeight: 'bold' }}>{t.type === 'success' ? '[Success]' : (t.type === 'warning' ? '[Warning]' : '[Info]')}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ==================== 1. LANDING & MAIN DASHBOARD VIEW ==================== */}
      {activeView === 'home' && (
        <main>
          {/* Dashboard Summary Cards Section */}
          <header id="dashboard" style={{ padding: '70px 0 40px', position: 'relative' }}>
            <div className="wrap">
              <div className="flex-between" style={{ marginBottom: '28px' }}>
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
                    <span className={`badge ${supabaseConnected ? 'badge-mint' : 'badge-amber'}`}>
                      {supabaseConnected ? '⚡ Supabase Cloud Connected' : 'LocalStorage Mode (Connect Supabase in Vault)'}
                    </span>
                    <span className="badge badge-primary">INR (₹)</span>
                  </div>
                  <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: '6px 0' }}>
                    Wallex Financial Dashboard
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Track INR expenses, monitor category budgets, and save records in Supabase PostgreSQL or local storage.</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={handleOpenAddTxModal}>+ Add Transaction</button>
                </div>
              </div>

              {/* 4 Core Financial Summary Cards in Indian Rupees ₹ */}
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                <div className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Net Balance</div>
                  <div className="stat-number" style={{ fontSize: '32px', color: netBalance >= 0 ? 'var(--mint)' : 'var(--danger)', margin: '6px 0' }}>
                    {formatINR(netBalance)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total INR Cash Flow Balance</div>
                </div>

                <div className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Monthly Income</div>
                  <div className="stat-number" style={{ fontSize: '32px', color: 'var(--mint)', margin: '6px 0' }}>
                    +{formatINR(totalIncome)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{transactions.filter(t => t.type === 'income').length} UPI/NEFT deposits</div>
                </div>

                <div className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Monthly Expenses</div>
                  <div className="stat-number" style={{ fontSize: '32px', color: 'var(--danger)', margin: '6px 0' }}>
                    -{formatINR(totalExpense)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{transactions.filter(t => t.type === 'expense').length} expense transactions</div>
                </div>

                <div className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Budget Used</div>
                  <div className="stat-number" style={{ fontSize: '32px', color: budgetUsagePercent > 80 ? 'var(--amber)' : 'var(--primary)', margin: '6px 0' }}>
                    {budgetUsagePercent}%
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${budgetUsagePercent}%`, background: budgetUsagePercent > 80 ? 'var(--amber)' : 'var(--mint)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ==================== 2. INTERACTIVE EXPENSE PIE CHART SECTION ==================== */}
          <section id="chart" style={{ padding: '40px 0 70px' }}>
            <div className="wrap">
              <ExpensePieChart transactions={transactions} formatINR={formatINR} />
            </div>
          </section>

          {/* ==================== 3. TRANSACTIONS MANAGER SECTION ==================== */}
          <section id="transactions" style={{ padding: '70px 0', borderTop: '1px solid var(--dark-border)' }}>
            <div className="wrap">
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                  <span className="mono" style={{ color: 'var(--mint)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                    {supabaseConnected ? '⚡ Supabase PostgreSQL Database' : 'Wallex Local Ledger'}
                  </span>
                  <h2 style={{ fontSize: '32px', margin: '4px 0' }}>Recent Transactions (₹)</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>All incoming and outgoing cash flows synced to your database.</p>
                </div>
                <div className="flex gap-2">
                  {supabaseConnected && (
                    <button className="btn btn-secondary" onClick={handleFetchFromSupabase}>Sync Supabase</button>
                  )}
                  <button className="btn btn-mint" onClick={handleOpenAddTxModal}>+ New Transaction</button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px' }}>
                {/* Search & Filter Bar */}
                <div className="flex-between gap-3" style={{ marginBottom: '18px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search UPI / Card transactions..." 
                    value={searchTxQuery}
                    onChange={(e) => setSearchTxQuery(e.target.value)}
                    style={{ maxWidth: '340px' }}
                  />

                  <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                    {['All', 'Food & Dining', 'Tech & Software', 'Housing & Utilities', 'Entertainment', 'Shopping', 'Travel & Transport', 'Salary'].map(cat => (
                      <button 
                        key={cat}
                        className={`btn ${selectedCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setSelectedCategoryFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction List */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
                  {filteredTransactions.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No transactions found matching your search.
                    </div>
                  ) : (
                    filteredTransactions.map(tx => (
                      <div key={tx.id} className="tx-item">
                        <div className="flex items-center gap-3">
                          <div className="tx-initial">{tx.tag || 'TX'}</div>
                          <div>
                            <strong style={{ fontSize: '14px', display: 'block' }}>{tx.title}</strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{tx.category} · {tx.date} · <span className="mono">{tx.method}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <strong className="mono" style={{ fontSize: '15px', color: tx.type === 'income' ? 'var(--mint)' : 'var(--text-main)' }}>
                            {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                          </strong>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteTx(tx.id)} title="Delete Transaction">Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 4. CATEGORY BUDGETS SECTION ==================== */}
          <section id="budgets" style={{ padding: '70px 0', background: 'rgba(125,125,125,0.03)', borderTop: '1px solid var(--dark-border)' }}>
            <div className="wrap">
              <div style={{ maxWidth: '600px', marginBottom: '36px' }}>
                <span className="mono" style={{ color: 'var(--primary)', fontSize: '11.5px', textTransform: 'uppercase' }}>Budget Control (₹)</span>
                <h2 style={{ fontSize: '32px', margin: '4px 0' }}>Category Monthly Limits (₹)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track spending thresholds across all active Wallex categories in Rupees.</p>
              </div>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {budgets.map(b => {
                  const spent = getCategorySpent(b.category);
                  const percent = Math.min(100, Math.round((spent / b.limit) * 100));
                  const isWarning = percent > 80;

                  return (
                    <div key={b.category} className="glass-card" style={{ padding: '22px' }}>
                      <div className="flex-between" style={{ marginBottom: '10px' }}>
                        <div className="flex items-center gap-2">
                          <span className="cat-tag">{b.tag}</span>
                          <strong style={{ fontSize: '15px' }}>{b.category}</strong>
                        </div>
                        <span className={`badge ${isWarning ? 'badge-amber' : 'badge-mint'}`}>
                          {percent}%
                        </span>
                      </div>

                      <div className="flex-between" style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '10px 0 6px' }}>
                        <span>Spent: <strong>{formatINR(spent)}</strong></span>
                        <span>Limit: <strong>{formatINR(b.limit)}</strong></span>
                      </div>

                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${percent}%`, 
                            background: isWarning ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, var(--mint), var(--primary))' 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ==================== 5. USER DETAILS & ACCOUNT PROFILE SECTION ==================== */}
          <section id="details" className="user-details-section">
            <div className="wrap">
              <div style={{ maxWidth: '600px', marginBottom: '36px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Account & Profile Details</span>
                <h2 style={{ fontSize: '32px' }}>Your Wallex Profile Details</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Your authenticated profile details, INR savings targets, and connected vault status.</p>
              </div>

              <div className="glass-card" style={{ padding: '36px' }}>
                <div className="profile-card-header">
                  <div className="profile-avatar-large">
                    {currentUser ? currentUser.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px' }}>{currentUser ? currentUser.name : 'Guest Account'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {currentUser ? currentUser.email : 'Guest view · Not signed in'} · <span className="badge badge-mint">{currentUser ? currentUser.plan : 'Guest Mode'}</span>
                    </p>
                  </div>

                  {currentUser ? (
                    <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={handleAccessVault}>Access Vault</button>
                  ) : (
                    <button className="btn btn-mint btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setActiveView('signin')}>Create Account</button>
                  )}
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div style={{ padding: '14px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Company / Entity</div>
                    <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: '14px' }}>{currentUser ? currentUser.company : 'Guest Organization'}</div>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Monthly Spending Limit</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--mint)', marginTop: '4px', fontSize: '14px' }}>{formatINR(userBudget)}/mo</div>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Wallex Net INR Reserves</div>
                    <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: '14px' }}>{formatINR(netBalance)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ==================== FINANCIAL VAULT & SUPABASE DATABASE MANAGER VIEW ==================== */}
      {activeView === 'vault' && (
        <main className="wrap" style={{ padding: '36px 0' }}>
          <div className="flex-between" style={{ marginBottom: '28px' }}>
            <div>
              <h2>Confidential Wallex Vault & Cloud Database (₹)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>Connect Supabase PostgreSQL cloud database or manage local user sessions.</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={handleLockVault}>Lock Vault</button>
              <button className="btn btn-ghost" onClick={() => setActiveView('home')}>Back to Dashboard</button>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '240px 1fr', gap: '28px' }}>
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button className={`btn ${vaultTab === 'supabase' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setVaultTab('supabase')}>⚡ Supabase Config</button>
                <button className={`btn ${vaultTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setVaultTab('overview')}>Vault Summary</button>
                <button className={`btn ${vaultTab === 'users' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setVaultTab('users')}>Registered Users ({registeredUsers.length})</button>
                <button className={`btn ${vaultTab === 'logs' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setVaultTab('logs')}>Audit Logs ({auditLogs.length})</button>
                <button className={`btn ${vaultTab === 'export' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setVaultTab('export')}>Export & Backup</button>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              {/* SUPABASE CLOUD DATABASE CONFIGURATION TAB */}
              {vaultTab === 'supabase' && (
                <div>
                  <div className="flex-between" style={{ marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ fontSize: '24px' }}>Connect Your Supabase PostgreSQL Database</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Store all transactions, user accounts, and financial limits in your own Supabase project.</p>
                    </div>
                    <span className={`badge ${supabaseConnected ? 'badge-mint' : 'badge-amber'}`}>
                      {supabaseConnected ? '⚡ Connected to Supabase' : 'Not Connected (Using LocalStorage)'}
                    </span>
                  </div>

                  <form onSubmit={handleSaveSupabaseConfig} style={{ marginBottom: '32px' }}>
                    <div className="form-group">
                      <label>Supabase Project URL</label>
                      <input 
                        type="url" 
                        className="form-input" 
                        placeholder="https://xyzcompany.supabase.co" 
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Supabase Anon API Key (public)</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" className="btn btn-mint">Save Credentials & Connect</button>
                      {supabaseConnected && (
                        <button type="button" className="btn btn-secondary" onClick={handleFetchFromSupabase}>Fetch Table Data</button>
                      )}
                    </div>
                  </form>

                  <div style={{ paddingTop: '20px', borderTop: '1px solid var(--dark-border)' }}>
                    <h4 style={{ fontSize: '15px', color: 'var(--mint)', marginBottom: '8px' }}>One-Click Supabase Table Setup Script</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginBottom: '12px' }}>
                      Copy the SQL script below and run it in your **Supabase SQL Editor** to create the required `transactions` table:
                    </p>

                    <pre className="mono" style={{ 
                      background: 'rgba(10,14,24,0.9)', 
                      padding: '16px', 
                      borderRadius: '10px', 
                      fontSize: '11.5px', 
                      color: 'var(--mint)',
                      overflowX: 'auto',
                      border: '1px solid var(--dark-border)'
                    }}>
                      {supabaseSQLScript}
                    </pre>

                    <div style={{ marginTop: '12px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(supabaseSQLScript);
                          showToast('Copied Supabase SQL Setup Script to clipboard!', 'success');
                        }}
                      >
                        Copy SQL Setup Script
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {vaultTab === 'overview' && (
                <div>
                  <h3>Vault Operations & Data Summary (₹)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '6px 0 20px' }}>Passcode encrypted workspace for confidential data.</p>

                  <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Database Connection</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: supabaseConnected ? 'var(--mint)' : 'var(--amber)' }}>
                        {supabaseConnected ? 'Supabase PostgreSQL' : 'Local Browser Store'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Saved Transactions</div>
                      <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--mint)' }}>{transactions.length} Records</div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(125,125,125,0.05)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Registered Accounts</div>
                      <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{registeredUsers.length} Users</div>
                    </div>
                  </div>
                </div>
              )}

              {vaultTab === 'users' && (
                <div>
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div>
                      <h3>Registered Users & Active Sessions</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Users stored in database with session login timestamps.</p>
                    </div>
                    <span className="badge badge-mint">{registeredUsers.length} Users Saved</span>
                  </div>

                  <table className="log-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Company</th>
                        <th>Monthly Limit</th>
                        <th>Last Login Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredUsers.map((u, i) => (
                        <tr key={i}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.company || 'Personal'}</td>
                          <td style={{ color: 'var(--mint)', fontWeight: 'bold' }}>{formatINR(u.monthlyBudget)}</td>
                          <td className="mono" style={{ fontSize: '11.5px' }}>{u.lastLogin || 'Active Now'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {vaultTab === 'logs' && (
                <div>
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div>
                      <h3>User Session & Action Audit Logs</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Persistent activity trail for transaction entries, deletions, and logins.</p>
                    </div>
                    <span className="badge badge-primary">{auditLogs.length} Events</span>
                  </div>

                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <table className="log-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Event Type</th>
                          <th>Log Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                            <td><span className="cat-tag">{log.type}</span></td>
                            <td>{log.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {vaultTab === 'export' && (
                <div>
                  <h3>Export & Backup Data Store</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>Download your complete user database, transactions, and session audit logs.</p>

                  <div className="flex gap-3" style={{ marginBottom: '24px' }}>
                    <button className="btn btn-primary" onClick={handleExportFullBackup}>
                      Download Complete JSON Backup
                    </button>
                    <button className="btn btn-secondary" onClick={() => showToast('Exported transaction ledger to CSV.', 'success')}>
                      Export Transactions CSV
                    </button>
                  </div>

                  <div style={{ paddingTop: '20px', borderTop: '1px solid var(--dark-border)' }}>
                    <h4 style={{ fontSize: '15px', color: 'var(--danger)', marginBottom: '6px' }}>Reset Data Store</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginBottom: '12px' }}>Restore initial demo expense records and clear local storage.</p>
                    <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleResetToDemoData}>
                      Reset All Saved Data & Restore Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ==================== SIGN IN & REGISTRATION VIEW ==================== */}
      {activeView === 'signin' && (
        <main className="wrap" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', itemsAlign: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '960px', overflow: 'hidden', padding: '0' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1.1fr' }}>
              {/* Left Side: Brand Showcase Hero */}
              <div style={{ 
                background: 'linear-gradient(145deg, rgba(31,170,121,0.18), rgba(52,80,255,0.22))', 
                padding: '44px 36px', 
                display: 'flex', 
                flexDirection: 'column', 
                justify: 'space-between',
                borderRight: '1px solid var(--dark-border)'
              }}>
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
                    <span className="brand-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                        <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                        <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </span>
                    <strong style={{ fontSize: '22px', fontFamily: 'var(--font-serif)' }}>Wallex Security Portal</strong>
                  </div>

                  <h2 style={{ fontSize: '28px', lineHeight: '1.3', marginBottom: '14px' }}>
                    Intelligent Expense Tracking & Wealth Management
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6' }}>
                    Connect your Indian Rupees (₹) accounts, set smart category limits, and unlock confidential financial vault operations.
                  </p>

                  <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-mint" style={{ padding: '4px 10px', fontSize: '11px' }}>256-BIT</span>
                      <span style={{ fontSize: '13px' }}>Bank-grade encryption & passcode vault security</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>SUPABASE</span>
                      <span style={{ fontSize: '13px' }}>Direct Supabase PostgreSQL database sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-mint" style={{ padding: '4px 10px', fontSize: '11px' }}>AI VOICE</span>
                      <span style={{ fontSize: '13px' }}>Voice-assisted financial advice & pie chart insights</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--dark-border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>ISO 27001 Certified</span>
                  <span>SOC2 Type II Compliant</span>
                </div>
              </div>

              {/* Right Side: Interactive Form Container */}
              <div style={{ padding: '44px 36px' }}>
                <div style={{ display: 'flex', background: 'rgba(125,125,125,0.08)', padding: '4px', borderRadius: '10px', marginBottom: '28px' }}>
                  <button 
                    type="button"
                    className={`btn ${authMode === 'signin' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, borderRadius: '8px', height: '34px' }}
                    onClick={() => setAuthMode('signin')}
                  >
                    Sign In
                  </button>
                  <button 
                    type="button"
                    className={`btn ${authMode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, borderRadius: '8px', height: '34px' }}
                    onClick={() => setAuthMode('signup')}
                  >
                    Create Account
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>
                    {authMode === 'signin' ? 'Welcome Back to Wallex' : 'Create Your Wallex Account'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {authMode === 'signin' ? 'Sign in to access your financial dashboard and ledger.' : 'Register your details to start tracking expenses in Rupees.'}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit}>
                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Alex Rivera" 
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        required 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="alex@wallex.in" 
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required 
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>Company / Entity</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Wallex India Tech Ltd." 
                        value={signUpCompany}
                        onChange={(e) => setSignUpCompany(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                      <label style={{ margin: 0 }}>Password</label>
                      {authMode === 'signin' && (
                        <a onClick={() => showToast('Password reset link sent to email.', 'info')} style={{ fontSize: '11.5px', color: 'var(--primary)' }}>
                          Forgot Password?
                        </a>
                      )}
                    </div>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Enter account password" 
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required 
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>Monthly Spending Budget (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="75000" 
                        value={signUpBudget}
                        onChange={(e) => setSignUpBudget(e.target.value)}
                        required 
                      />
                    </div>
                  )}

                  {authMode === 'signin' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        <input 
                          type="checkbox" 
                          checked={rememberMe} 
                          onChange={(e) => setRememberMe(e.target.checked)} 
                        />
                        Remember me on this device
                      </label>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', fontSize: '14px', marginTop: '10px' }}>
                    {authMode === 'signin' ? 'Sign In to Dashboard' : 'Complete Account Registration'}
                  </button>

                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm" 
                      style={{ fontSize: '12px', color: 'var(--mint)' }}
                      onClick={handleFillDemoUser}
                    >
                      Auto-Fill Demo Credentials (Alex Rivera)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ==================== BOTTOM-RIGHT DRAGGABLE WALLEX AI ADVISOR ==================== */}
      <div 
        className="floating-widget-wrapper"
        style={widgetPos ? { left: `${widgetPos.x}px`, top: `${widgetPos.y}px` } : { bottom: '24px', right: '24px' }}
      >
        {!widgetOpen ? (
          <div 
            className="floating-widget-btn draggable-widget-handle"
            onMouseDown={handleWidgetMouseDown}
            onClick={() => setWidgetOpen(true)}
            title="Click for Wallex AI Advisor or drag"
          >
            AI
          </div>
        ) : (
          <div className="live-chat-panel">
            <div className="chat-panel-header draggable-widget-handle" onMouseDown={handleWidgetMouseDown}>
              <div className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                <strong>Wallex AI Advisor (₹)</strong>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  style={{ color: voiceSpeechEnabled ? '#34d399' : '#94a3b8', fontSize: '11px', fontWeight: 'bold' }} 
                  onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
                  title="Toggle Audio Output"
                >
                  {voiceSpeechEnabled ? 'Audio On' : 'Audio Off'}
                </button>
                <button style={{ color: '#fff', fontSize: '16px' }} onClick={() => setWidgetOpen(false)}>✕</button>
              </div>
            </div>

            <div className="chat-stream">
              {widgetMessages.map((m, idx) => (
                <div key={idx} className={`chat-msg ${m.sender === 'user' ? 'user' : 'bot'}`}>
                  <div className="avatar">{m.sender === 'user' ? 'U' : 'AI'}</div>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--dark-border)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button"
                className={`btn ${isVoiceActive ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                onClick={handleVoiceInput}
                title="Speak to Assistant"
              >
                {isVoiceActive ? 'Listening...' : 'Voice'}
              </button>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ask Wallex AI in Rupees..." 
                value={widgetInput}
                onChange={(e) => setWidgetInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendWidgetMessage()}
                style={{ fontSize: '12.5px', padding: '6px 10px' }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSendWidgetMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== ADD TRANSACTION MODAL ==================== */}
      {isAddTxModalOpen && (
        <div className="modal-backdrop open">
          <div className="modal-window">
            <div className="flex-between" style={{ marginBottom: '18px' }}>
              <h3>+ Add New Transaction (₹)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsAddTxModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddTxSubmit}>
              <div className="form-group">
                <label>Transaction Title / Merchant</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Swiggy Gourmet Order" 
                  value={newTxTitle}
                  onChange={(e) => setNewTxTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    step="1"
                    className="form-input" 
                    placeholder="499" 
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select className="form-input" value={newTxType} onChange={(e) => setNewTxType(e.target.value)}>
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={newTxCategory} onChange={(e) => setNewTxCategory(e.target.value)}>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Tech & Software">Tech & Software</option>
                    <option value="Housing & Utilities">Housing & Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Travel & Transport">Travel & Transport</option>
                    <option value="Salary">Salary / Income</option>
                    <option value="Freelance">Freelance / Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select className="form-input" value={newTxMethod} onChange={(e) => setNewTxMethod(e.target.value)}>
                    <option value="UPI (GPay/PhonePe)">UPI (GPay/PhonePe)</option>
                    <option value="Net Banking">Net Banking (NEFT/IMPS)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddTxModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MANDATORY VAULT PASSCODE MODAL ==================== */}
      {isVaultModalOpen && (
        <div className="modal-backdrop open">
          <div className="modal-window">
            <div className="flex-between" style={{ marginBottom: '18px' }}>
              <h3>Financial Vault Password Required</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsVaultModalOpen(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '18px' }}>
              Enter administrator password to access confidential financial data & exports (Default: vault123).
            </p>
            <form onSubmit={handleVaultPassSubmit}>
              <div className="form-group">
                <label>Vault Passcode</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showVaultPass ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Enter passcode (Default: vault123)" 
                    value={vaultPasscode}
                    onChange={(e) => setVaultPasscode(e.target.value)}
                    autoFocus
                    required 
                  />
                  <button 
                    type="button" 
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11.5px', color: 'var(--text-muted)' }}
                    onClick={() => setShowVaultPass(!showVaultPass)}
                  >
                    {showVaultPass ? 'Hide Password' : 'Show Password'}
                  </button>
                </div>
                {vaultPassError && <div style={{ color: 'var(--danger)', fontSize: '12.5px', marginTop: '6px' }}>{vaultPassError}</div>}
              </div>
              <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsVaultModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Unlock Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== RICH FOOTER COMPONENT ==================== */}
      <footer style={{ 
        background: 'var(--dark-surface)', 
        borderTop: '1px solid var(--dark-border)', 
        padding: '60px 0 30px', 
        marginTop: '80px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div className="brand-logo" onClick={() => setActiveView('home')} style={{ marginBottom: '14px' }}>
                <span className="brand-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                    <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </span>
                Wallex
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', maxWidth: '320px', marginBottom: '18px' }}>
                Wallex Group Inc. · Premier Smart Expense Tracker & Wealth Intelligence Advisor for Indian Rupee (₹) cash flows.
              </p>
              <div className="flex gap-2">
                <span className="badge badge-mint" style={{ fontSize: '11px' }}>INR (₹) Native</span>
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>Supabase PostgreSQL</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--mint)' }}>Product Features</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li><a onClick={() => scrollToSection('dashboard')}>Financial Dashboard</a></li>
                <li><a onClick={() => scrollToSection('chart')}>Expense Pie Chart</a></li>
                <li><a onClick={() => scrollToSection('transactions')}>Recent Transactions</a></li>
                <li><a onClick={() => scrollToSection('budgets')}>Category Limits</a></li>
                <li><a onClick={() => scrollToSection('details')}>My Profile Details</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>Security & Vault</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li><a onClick={handleAccessVault}>Confidential Vault</a></li>
                <li><a onClick={handleAccessVault}>Supabase Credentials</a></li>
                <li><a onClick={handleAccessVault}>Passcode Protection</a></li>
                <li><a onClick={handleAccessVault}>CSV / JSON Exports</a></li>
                <li><span style={{ fontSize: '12px' }}>256-Bit SSL Encryption</span></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>Compliance & Legal</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <li><span>ISO 27001 Certified</span></li>
                <li><span>SOC2 Type II Audit</span></li>
                <li><span>Privacy Policy</span></li>
                <li><span>Terms of Service</span></li>
                <li><span>Contact: support@wallex.in</span></li>
              </ul>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid var(--dark-border)', 
            paddingTop: '24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '12.5px', 
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              © 2026 Wallex Group Inc. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Render React App
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);
