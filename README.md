# Cyna - Enterprise Cybersecurity Platform 🛡️

Cyna is a modern, full-featured cybersecurity platform built to protect enterprises from evolving digital threats. Our platform combines advanced security services, intuitive dashboards, and powerful administration tools in one seamless solution.

## Features ✨

- **Comprehensive Security Services** 🔒

  - Threat detection and prevention
  - Vulnerability assessment
  - Security monitoring and alerts
  - Incident response management

- **User-Friendly Dashboard** 📊

  - Real-time security metrics
  - Customizable views and reports
  - Intuitive visualization of security posture
  - Actionable insights and recommendations

- **Powerful Admin Controls** 👩‍💼
  - User and role management
  - Security policy configuration
  - System-wide settings and preferences
  - Audit logs and compliance reporting

## 🚀 Tech Stack

### 🖥️ Frontend

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable components built with Radix UI and Tailwind
- **Sentry** - Error handling manager
- **PostHog** - Analytics
- **Zod** - TypeScript-first schema validation

### 🔧 Backend

- **Next.js** - React framework with server components
- **Hono** - Lightweight web framework
- **Prometheus** - Metrics
- **Sentry** - Error handling manager
- **Zod** - TypeScript-first schema validation
- **Stripe** - Payment processing
- **Resend** - Email API

### 💾 Database

- **PostgreSQL** - Relational database
- **Kysely** - Query Builder

### 🌐 Internationalization

- **next-i18next** - Internationalization framework

### 🧪 Testing

- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **Vitest** - Unit testing
- **Hono** - Testing lib inside the web framework

### 🔄 CI/CD

- **GitHub Actions** - Continuous integration and deployment

### 💻 Infrastructure

- **Terraform** - IaC tool

### 📝 Code Quality

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/a-little-byte/web.git
   cd web
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your configuration values.

4. Start the development server

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Commands 💻

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Check formatting
- `pnpm format:fix` - Fix formatting issues
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:unit` - Run unit tests

## Deployment 🌐

This application can be deploy with the provided docker image
