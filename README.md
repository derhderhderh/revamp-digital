# Revamp Digital

Production-oriented Next.js 16 App Router website and client/admin platform for a premium website revamp agency.

## Stack

- Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- Firebase Auth, Firestore, Storage, Admin SDK
- Resend email workflows
- Google Gemini AI analysis, quote generation, chatbot, suggestions
- Vercel-ready API routes, metadata, sitemap, robots, protected dashboards

## Setup

1. `corepack pnpm install --frozen-lockfile`
2. Copy `.env.example` to `.env.local` and fill in Firebase, Resend, Gemini, and admin values.
3. `corepack pnpm run dev`

## Firebase

Deploy `firestore.rules` and `storage.rules` from the Firebase console or CLI. The app expects one admin email, set in `NEXT_PUBLIC_ADMIN_EMAIL` and `ADMIN_EMAIL`.

## Notes

The app is functional with real integrations when environment variables are present. In local development without API keys, AI and email routes return safe fallback responses so the interface remains testable.
