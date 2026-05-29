# Kuganda Tech Farmer Portal

A mobile-first web application that gives smallholder farmers in Uganda secure digital access to their agricultural loan status, harvest-based repayment schedule, and real-time alerts.

---

## Problem Statement

Smallholder farmers in Uganda who receive agricultural loans from agri-finance providers have no digital visibility into their loan status, repayment obligations, or upcoming deadlines. They rely on paper records, agents, and word of mouth — leading to missed payments, confusion, and financial stress. Low digital literacy and unreliable connectivity mean any solution must be dead simple and mobile-first.

## Solution

The Kuganda Tech Farmer Portal gives farmers a secure, mobile-first dashboard where they can:

- Log in securely with email and password
- View their active loan summary (total amount, balance remaining, next due date, % repaid)
- Track their harvest-based repayment schedule across farming seasons
- Receive real-time alerts and notifications without refreshing the page
- Sign out securely from any device

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, TypeScript |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Deployment | Vercel |
| Version Control | GitHub |

## Enhancements Implemented

- ✅ User Authentication — email/password login, protected routes, sign out
- ✅ Real-Time Features — live alert updates via Supabase Realtime (no page refresh needed)

## Live URL

[https://kuganda-farmer-portal-k4fp.vercel.app](https://kuganda-farmer-portal-k4fp.vercel.app)

## Setup Instructions

### Prerequisites
- Node.js 18+
- A Supabase account
- A Vercel account

### Local Development

1. Clone the repository:
```bash
   git clone https://github.com/Starphire88/kuganda-farmer-portal.git
   cd kuganda-farmer-portal
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env.local` file using `.env.example` as a template:
```bash
   cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server:
```bash
   npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
create table farmers (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  village text,
  district text,
  created_at timestamptz default now()
);

create table loans (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references farmers(id) on delete cascade,
  amount numeric not null,
  balance numeric not null,
  disbursed_at date not null,
  due_date date not null,
  status text default 'active',
  created_at timestamptz default now()
);

create table repayments (
  id uuid default gen_random_uuid() primary key,
  loan_id uuid references loans(id) on delete cascade,
  due_date date not null,
  amount_due numeric not null,
  amount_paid numeric default 0,
  status text default 'pending',
  harvest_season text,
  created_at timestamptz default now()
);

create table alerts (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references farmers(id) on delete cascade,
  message text not null,
  type text default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);
```

## Digital Inclusion Impact

This portal directly addresses the digital inclusion gap for smallholder farmers in Uganda by:

- Providing transparent loan visibility that removes dependence on intermediaries
- Using a mobile-first design that works on low-cost Android devices
- Keeping the UI simple enough for users with low digital literacy
- Delivering real-time alerts so farmers never miss a repayment deadline

Future enhancements could include offline PWA support, SMS notifications via Africa's Talking, Luganda language support, and M-Pesa payment integration.
