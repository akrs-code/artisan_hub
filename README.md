# Artisan Hub

Welcome to the **Artisan Hub** repository! This is a monorepo containing both the frontend and backend applications for the Artisan Hub platform.

---

## 📁 Repository Structure

The project is structured into two main directories: `frontend` and `backend`.

```text
artisan_hub/
├── .github/
│   └── workflows/
│       └── ci.yml               # Unified CI/CD Pipeline (Frontend & Backend)
├── backend/                     # Node.js + Express + Mongoose Backend
│   ├── config/                  # Configuration files (e.g., Database connection)
│   ├── middleware/              # Global Express middlewares
│   ├── modules/                 # Domain-driven feature modules (Modular Structure)
│   │   ├── auth/                # Auth logic (routes, controller, model, etc.)
│   │   ├── payments/            # Payment logic (Stripe, Paymongo integration)
│   │   └── users/               # Users logic (Example module with DB routes)
│   ├── utils/                   # Shared backend utility helper functions
│   ├── .env.example             # Example environment variables template
│   ├── .gitignore               # Backend git ignores
│   ├── server.js                # App entry point
│   ├── package.json
│   └── package-lock.json
└── frontend/                    # React + Vite + TailwindCSS Frontend
    ├── public/                  # Public assets static directory
    ├── src/
    │   ├── assets/              # Component-specific local assets (images, SVGs)
    │   ├── components/          # Reusable UI components
    │   ├── context/             # React Context Providers for global state
    │   ├── hooks/               # Custom React hooks
    │   ├── layouts/             # Page layouts (Navbar, Sidebar, Footer wrappers)
    │   ├── pages/               # Routed pages/views
    │   ├── utils/               # Shared frontend utility helper functions
    │   ├── App.jsx              # Main App entry routes wrapper
    │   ├── index.css            # Global CSS styles & Tailwind configuration
    │   └── main.jsx             # React DOM injection point
    ├── .env.example             # Example environment variables template
    ├── .gitignore               # Frontend git ignores
    ├── vite.config.js           # Vite configuration
    ├── package.json
    └── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher is recommended.
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas URI.

---

### 💻 Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app should now be running on `http://localhost:5173` (or the port specified in terminal).*

---

### ⚙️ Backend Setup (Node/Express)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Duplicate `.env.example` and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the values inside `.env` with your actual MongoDB URI, port numbers, JWT secrets, Stripe keys, etc. (Note: `.env` is ignored by Git and should never be committed).
4. Start the server in development mode (with `nodemon` auto-reload):
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000` (or your configured `PORT`).*

---

## 🌿 Git & Workflow Guidelines

To maintain a clean history and streamline collaboration, please follow these guidelines:

### 🌟 Branch Naming Conventions
Always create branches from `dev` (or `main` when working directly on hotfixes) using the following prefixes:

- **Features**: `feature/your-feature-name` (e.g. `feature/user-authentication`)
- **Bug Fixes**: `bugfix/issue-description` (e.g. `bugfix/avatar-crash-on-click`)
- **Hotfixes (Urgent Prod Fixes)**: `hotfix/urgent-bug-name` (e.g. `hotfix/stripe-webhook-failing`)
- **Documentation**: `docs/what-changed` (e.g. `docs/update-readme`)
- **Refactoring**: `refactor/code-area` (e.g. `refactor/payment-routes`)

---

### 💬 Commit Message Naming Conventions
We adhere to **Semantic Commits** to keep our logs readable. Format your messages like this:

`type: description`

#### Common Types:
- **`feat`**: A new feature (e.g., `feat: integrate stripe payment intent API`)
- **`fix`**: A bug fix (e.g., `fix: resolve jwt expiration crash on middleware`)
- **`docs`**: Documentation changes only (e.g., `docs: add setup instructions to readme`)
- **`style`**: Changes that do not affect the meaning of the code (formatting, white-space, missing semi-colons, etc.)
- **`refactor`**: A code change that neither fixes a bug nor adds a feature
- **`perf`**: A code change that improves performance
- **`test`**: Adding missing tests or correcting existing tests
- **`chore`**: Changes to the build process, auxiliary tools, or library dependencies (e.g., `chore: add gitkeep to empty folders`)

---

## 🛠️ CI/CD Pipeline

The project uses **GitHub Actions** (`Portfolio CI`) for quality assurance.
Every time you **push** code to `main`, `dev`, or `feature/**` branches, or open a **pull request** to `main` or `dev`, the pipeline will automatically run:
- **Frontend Checks**: Validates that the app compiles (`npm run build`) and passes linting (`npm run lint`).
- **Backend Checks**: Performs a syntax scan on the backend (`node --check server.js`) to prevent compile-time crashes from being merged.

Please resolve any linting/compilation issues locally *before* pushing to remote branches.
