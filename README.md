# PropTrade Tracker

> A full-stack prop trading journal and analytics platform — track your trades, manage funded accounts, and analyze your performance across multiple prop firm challenges.
>
> [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
> [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
> [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
> [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Live-4169E1?logo=postgresql)](https://www.postgresql.org)
>
> ---
>
> ## Overview
>
> PropTrade Tracker is a comprehensive trading journal built specifically for prop firm traders. It combines a polished React frontend with a live PostgreSQL backend to give you a single dashboard for managing accounts, logging trades, monitoring risk metrics, and visualizing your trading analytics.
>
> ---
>
> ## Features
>
> - **Multi-Account Management** — Track multiple prop firm accounts in one place
> - - **Trade Journal** — Log, tag, and review every trade with detailed metadata
>   - - **Analytics Dashboard** — Visualize PnL curves, win rates, and drawdown metrics with Recharts
>     - - **Risk Monitor** — Real-time risk tracking against prop firm drawdown rules
>       - - **Overview Dashboard** — High-level summary of all active funded accounts
>         - - **Authentication** — Secure user auth with session management
>           - - **Settings** — Customizable user preferences and account configuration
>             - - **CSV Import** — Import trade history via PapaParse
>               - - **Responsive UI** — Built with Tailwind CSS, Radix UI, and shadcn/ui components
>                 - - **Animations** — Smooth page transitions powered by Framer Motion
>                  
>                   - ---
>
> ## Tech Stack
>
> | Layer | Technology |
> |-------|-----------|
> | **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
> | **UI Components** | Radix UI, shadcn/ui, Framer Motion, Lucide React |
> | **State & Data** | TanStack Query v5, React Hook Form, Zod |
> | **Charts** | Recharts |
> | **Backend** | Node.js, Express, PostgreSQL |
> | **Testing** | Vitest, Testing Library, Playwright |
> | **Tooling** | ESLint, TypeScript ESLint, Bun |
>
> ---
>
> ## Project Structure
>
> ```
> proptrade-tracker/
> ├── src/
> │   ├── components/         # Reusable UI components (shadcn/ui based)
> │   ├── context/            # React context providers
> │   ├── data/               # Static data and mock fixtures
> │   ├── hooks/              # Custom React hooks
> │   ├── lib/                # Utility functions and API clients
> │   └── pages/
> │       ├── AccountsPage.tsx    # Funded account management
> │       ├── AnalyticsPage.tsx   # Performance analytics
> │       ├── AuthPage.tsx        # Login / Registration
> │       ├── JournalPage.tsx     # Trade journal
> │       ├── LandingPage.tsx     # Public landing page
> │       ├── OverviewPage.tsx    # Dashboard overview
> │       ├── RiskPage.tsx        # Risk management
> │       └── SettingsPage.tsx    # User settings
> ├── server/                 # Express + PostgreSQL backend
> ├── public/                 # Static assets
> ├── tailwind.config.ts
> ├── vite.config.ts
> └── package.json
> ```
>
> ---
>
> ## Getting Started
>
> ### Prerequisites
>
> - Node.js >= 18 (or Bun)
> - - PostgreSQL database
>  
>   - ### Installation
>  
>   - 1. **Clone the repository**
>    
>     2. ```bash
>        git clone https://github.com/toutoumerch-lab/proptrade-tracker.git
>        cd proptrade-tracker
>        ```
>
> 2. **Install dependencies**
>
> 3. ```bash
>    npm install
>    # or
>    bun install
>    ```
>
> 3. **Configure environment variables**
>
> 4. Create a `.env` file in the project root:
>
> 5. ```env
>    VITE_API_URL=http://localhost:3001
>    DATABASE_URL=postgresql://user:password@localhost:5432/proptrade
>    ```
>
> 4. **Start the development server**
>
> 5. ```bash
>    npm run dev
>    ```
>
> The app will be available at `http://localhost:5173`.
>
> ---
>
> ## Available Scripts
>
> | Command | Description |
> |---------|-------------|
> | `npm run dev` | Start the Vite development server |
> | `npm run build` | Build for production |
> | `npm run preview` | Preview the production build |
> | `npm run test` | Run unit tests with Vitest |
> | `npm run lint` | Lint source files with ESLint |
>
> ---
>
> ## Pages & Routing
>
> | Route | Page | Description |
> |-------|------|-------------|
> | `/` | Landing | Public marketing page |
> | `/auth` | Auth | Login and registration |
> | `/overview` | Overview | Funded account summary |
> | `/journal` | Journal | Trade log and entry form |
> | `/analytics` | Analytics | Charts and performance stats |
> | `/risk` | Risk | Drawdown and risk metrics |
> | `/accounts` | Accounts | Account management |
> | `/settings` | Settings | User preferences |
>
> ---
>
> ## License
>
> This project is licensed under the [MIT License](LICENSE).
>
> ---
>
> ## Author
>
> **toutoumerch-lab** — built to help prop traders stay disciplined and data-driven.
