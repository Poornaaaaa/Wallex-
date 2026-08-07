# Wallex — Smart Expense Tracker & Financial Advisor

Wallex is a premium, client-side financial intelligence dashboard and ledger designed with a modern, glassmorphic visual language. It empowers users to track expenses, manage category budgets, configure secure data syncing with Supabase, and analyze financial data in real time—all with an interface tailored around the Indian Rupee (₹) currency system.

---

## 🚀 Live Demo & Key Highlights

- **Visual Brilliance:** Fully customized glassmorphic design featuring interactive background glow blur orbs and smooth CSS transitions.
- **Privacy & Security first:** Includes a lockable Administration Vault console protected by a passcode.
- **Hybrid Storage:** Seamlessly toggle between local client storage and real-time Supabase Cloud database syncing.
- **Zero-Build Architecture:** Built using UMD script modules and Babel Standalone compilation, allowing the app to run immediately in any browser environment without build tooling or package management.

---

## 💎 Features & Capabilities

### 1. Interactive Visual Analytics
- **SVG Expense Pie Chart:** A custom-rendered SVG pie chart illustrating expense proportions across active categories.
- **Micro-interactions:** Hovering over segments dynamically adjusts the segment thickness and updates the central tooltip display showing the category name, expense amount in INR, and its percentage of overall expenditure.
- **Dynamic Legend:** Interactive legend items highlight corresponding segments on hover.

### 2. Transaction Ledger (CRUD)
- **Unified Entry Form:** Quick input for transaction title, amount (₹), type (`income` vs `expense`), category, date, payment method, and custom tags.
- **INR Formatting:** Automatic parsing and formatting of transaction numbers using standard Indian currency notation.
- **Detailed History:** Scrollable list containing transactions with custom icons/tags for category representation.

### 3. Category Budgets & Limit Controls
- **Granular Thresholds:** Users can set spending limits for individual categories (e.g., Food & Dining, Shopping, Housing & Utilities).
- **Proportion Alerts:** Live indicator showing current spend versus maximum limit, triggering color alerts (amber/red) as category expenditures approach or exceed budget thresholds.

### 4. Lockable Security Vault
- **Passcode Protection:** Restricts access to developer tools, database settings, and data exports.
- **Audit Logs:** Real-time logging engine that captures and logs actions (such as vault unlocks, configuration modifications, and export attempts) with precise timestamps.
- **User Directory:** Interactive overview showcasing connected or registered users associated with the ledger profile.
- **Export & Backup:** One-click JSON data backups download the entire transaction and ledger state directly to the user's local machine.

### 5. Supabase Integration Engine
- **Cloud Database Configuration:** Configure Supabase API URL and Service Key safely inside the Security Vault.
- **Sync Toggling:** Enable/disable remote sync anytime. Connects to database tables like `transactions`, `budgets`, and `audit_logs` automatically.

### 6. Dynamic Visual Settings
- **Dual Themes:** Clean Dark Mode (`#07090e` base) and high-contrast Light Mode (`#f3f5fa` base) toggleable from the navigation bar.
- **Responsive Web Design:** Adapts smoothly across mobile devices, tablets, and wide-screen desktop displays.

---

## 🛠️ Technology Stack

- **Frontend Core:** HTML5, CSS3, ES6 JavaScript.
- **Rendering & State:** [React 18](https://react.dev/) (loaded via UMD CDNs).
- **Compilation:** [Babel Standalone v7](https://babeljs.io/) (for in-browser JSX parsing).
- **Database Backend:** [Supabase JS Client SDK v2](https://supabase.com/) (CDN integration).
- **Typography:**
  - *Serif Headers:* Playfair Display
  - *Sans-Serif UI:* Plus Jakarta Sans
  - *Monospace Ledger Details:* JetBrains Mono

---

## 📂 Project Directory Structure

```plaintext
myapp/
├── index.html   # Main application template, CDNs, and mounts React root
├── styles.css   # Custom CSS tokens, glassmorphism templates, and animations
├── app.js       # Core React components, dashboard state, and database sync
└── README.md    # Project documentation and features reference
```

---

## ⚙️ How to Get Started Locally

Since Wallex requires no Node.js compilation, you can run it with any basic static server or open it directly.

### Option A: Using a Simple Python Server (Recommended)
1. Open your terminal in the directory.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

### Option B: Using `npx` (Node.js)
1. Run:
   ```bash
   npx serve .
   ```
2. Navigate to the local address outputted in the command prompt.

### Option C: File System (Direct)
- Double-click the `index.html` file to open it in your browser. (Note: Some browsers restrict JavaScript modules on the `file://` protocol; option A or B is recommended for full feature capability).
