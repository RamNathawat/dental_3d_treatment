# 🏠 OREC Disclosure — Oklahoma RPCD Form Platform

A **Next.js 16** web application that lets Oklahoma real estate sellers complete the **Residential Property Condition Disclosure (RPCD)** form entirely online. The app generates a legally-compliant PDF, supports **multi-seller workflows** (Seller 1 fills → Seller 2 co-signs), and sends automated emails via Resend.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Multi-Step Wizard** | 7-step guided form with auto-save, validation, and a visual progress bar |
| **Multi-Seller Support** | Seller 1 fills the form; Seller 2 receives an invite email to review & co-sign in read-only mode |
| **PDF Generation** | Disclosure data is rendered onto the official Oklahoma RPCD template using `pdf-lib` |
| **E-Signatures** | Canvas-based signature capture (via `react-signature-canvas`) embedded into the final PDF |
| **Email Automation** | Invite emails (Seller 2 co-sign link) and completed PDF delivery via **Resend** |
| **Supabase Backend** | PostgreSQL database for disclosure records + secure shared-link token management |
| **Tailwind CSS v4** | Modern utility-first styling with Inter font via `next/font` |
| **Security Hardened** | CSP headers, HSTS, X-Frame-Options, and more — configured in `next.config.ts` |

---

## 📂 Folder Structure

```
orec-disclosure/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── disclosure/           #   → Save/load disclosure data
│   │   ├── disclosures/          #   → List disclosures
│   │   ├── send-invite/          #   → Send Seller 2 invite email
│   │   └── shared-links/[token]/ #   → Validate shared link tokens
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard page
│   ├── disclosure/               # Main disclosure wizard
│   │   ├── components/           #   → ProgressBar, Navigation, Tooltips, PDF Preview
│   │   ├── steps/                #   → Step1Property … Step7Signatures (11 step components)
│   │   └── page.tsx              #   → Wizard orchestrator
│   ├── disclosures/              # Disclosures listing page
│   ├── fill/                     # Shared-link entry (Seller 2 flow)
│   ├── layout.tsx                # Root layout (metadata, fonts, security)
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Home / landing redirect
│
├── src/
│   ├── forms/orec/               # Form schema & field definitions
│   └── lib/
│       ├── disclosure-engine/    # PDF generation engine
│       │   ├── assets/           #   → Base PDF template
│       │   ├── layout/           #   → Field coordinate maps
│       │   ├── render/           #   → PDF rendering logic
│       │   ├── schema/           #   → Data schemas
│       │   ├── utils/            #   → Payload builder, normalizer
│       │   └── validation/       #   → Field validation rules
│       └── pdf/                  # PDF utility helpers
│
├── lib/
│   ├── supabase/                 # Supabase client (browser + server)
│   └── wizard/                   # Wizard state & navigation helpers
│
├── supabase/
│   └── migrations/               # SQL migration files (version-controlled)
│
├── public/                       # Static assets (favicon, SVGs, robots.txt)
├── .env.local                    # Environment variables (see below)
├── next.config.ts                # Next.js config (security headers, image optimization)
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

---

## 🛠 Prerequisites

Before you begin, make sure you have:

- **Node.js** ≥ 18 (recommended: **v23.x** — tested with v23.11.0)
- **npm** ≥ 9 (comes with Node.js)
- A **Supabase** project (free tier works)
- A **Resend** account for email delivery

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root (or use the one included) with the following variables:

```env
# ─── Supabase ────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ─── Auth ────────────────────────────────────────────
NEXTAUTH_SECRET=any_random_secret_string

# ─── Email (Resend) ─────────────────────────────────
RESEND_API_KEY=re_your_resend_api_key

# ─── Site URL ────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **⚠️ Important:** The included `.env.local` contains live credentials. Keep this file secure and never commit it to a public repository.

#### Environment Variable Reference

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (found in Project Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key for client-side access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for server-side admin operations (⚠️ never expose to client) |
| `NEXTAUTH_SECRET` | Secret for signing session tokens |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) for sending emails |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the app — set to `http://localhost:3000` for local dev, or your production domain for deployment |

### 3. Run the Database Migration

If you're setting up a **new** Supabase project, run the migration SQL found in:

```
supabase/migrations/20260416_add_seller2_email_to_shared_links.sql
```

Execute this in your Supabase dashboard → **SQL Editor**.

> **Note:** The main database tables (`disclosures`, `shared_links`, etc.) should already exist if you're using the provided Supabase project. If setting up from scratch, you'll need to create these tables — contact the development team for the full schema.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deployment (Vercel)

This project is optimized for **Vercel** deployment:

1. Push the code to a GitHub/GitLab/Bitbucket repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add all environment variables from `.env.local` into **Settings → Environment Variables**
4. **Important:** Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g., `https://your-app.vercel.app`)
5. Deploy!

Alternatively, deploy from the CLI:

```bash
npx -y vercel --prod
```

---

## 📝 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server (run `build` first) |
| `npm run lint` | Run ESLint checks |

---

## 🏗 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | React framework (App Router) |
| [React](https://react.dev) | 19.2.3 | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [Supabase](https://supabase.com) | 2.x | PostgreSQL database + auth |
| [React Hook Form](https://react-hook-form.com) | 7.x | Form state management |
| [pdf-lib](https://pdf-lib.js.org) | 1.17 | PDF generation & manipulation |
| [Resend](https://resend.com) | 6.x | Transactional email delivery |
| [Framer Motion](https://motion.dev) | 12.x | Animations |
| [Yup](https://github.com/jquense/yup) / [Zod](https://zod.dev) | — | Schema validation |

---

## 🔒 Security Notes

- **CSP, HSTS, X-Frame-Options**, and other security headers are configured in `next.config.ts`
- The `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — it must never be exposed to the browser
- Shared links use secure random tokens for Seller 2 co-sign access
- `robots.txt` and metadata are configured to prevent search engine indexing

---

## 📧 Email Flow

1. **Seller 1** completes the disclosure form and submits
2. An **invite email** is automatically sent to Seller 2 via Resend with a secure link
3. **Seller 2** opens the link, reviews the pre-filled form (read-only), and adds their signature
4. The **final PDF** with both signatures is generated and can be downloaded

---

## 🤝 Support

For questions, issues, or access to the full database schema, contact the development team.

---

*Built with ❤️ for OurOK Realty*
