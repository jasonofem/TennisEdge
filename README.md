# TennisEdge - Tennis Betting Intelligence Platform

> **Precision. Discipline. Edge.**

A professional tennis betting intelligence platform with futuristic cyberpunk aesthetics, real-time data integration, and disciplined bankroll management.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account (free)

### Step 1: Download/Clone the Project

Since you're saving this as `TennisEdge`, here's how to set it up:

```bash
# Navigate to your desktop
cd ~/Desktop

# If you have the zip, extract it
# If cloning from GitHub:
git clone https://github.com/jasonofem/TennisEdge.git
cd TennisEdge
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate Prisma Client

```bash
npm run db:generate
```

### Step 4: Push Database Schema to Supabase

```bash
npm run db:push
```

### Step 5: Seed the Database (Optional)

```bash
npm run db:seed
```

### Step 6: Run Locally (Optional)

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📦 Deploy to Vercel

### Option 1: Push to GitHub and Connect to Vercel

```bash
# Initialize git
git init
git add .
git commit -m "Initial TennisEdge commit"

# Create repo on GitHub first, then:
git remote add origin https://github.com/jasonofem/TennisEdge.git
git branch -M main
git push -u origin main
```

Then on Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://postgres:71KsGzCIVvt90vz2@db.mqkdxtlgdvkxpzefponn.supabase.co:5432/postgres`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://mqkdxtlgdvkxpzefponn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMwMTQsImV4cCI6MjA5NDkwOTAxNH0.GkR9KG-amLt-IZ3dwKA1Eur43ZhdqF-PoKUSRLIko0E`
   - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMzMzAxNCwiZXhwIjoyMDk0OTA5MDE0fQ.vdMVrHxvoNyIfI_5iOeIcuEmRDNmtmHr8WznHK3LczQ`
   - `ODDS_API_KEY`: `ee4f52e1b0c8ac9c766431712d594f87`
   - `TENNIS_API_KEY`: `a3fa245ffa1f3e6e0f65cebe1e79b28d48e1607cf377578941e3d141e127d4ce`
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🗄️ Database Setup (Supabase)

Your Supabase project is already configured at:
- **Project URL**: https://mqkdxtlgdvkxpzefponn.supabase.co
- **Connection**: postgresql://postgres:71KsGzCIVvt90vz2@db.mqkdxtlgdvkxpzefponn.supabase.co:5432/postgres

### Tables Created by Prisma:
- `User` - User accounts
- `Bankroll` - Bankroll settings per user
- `Match` - Tennis match data
- `Prediction` - Daily underdog predictions
- `JournalEntry` - Betting history
- `Settings` - User preferences
- `AnalyticsCache` - Cached analytics data

### Managing Database via Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project `mqkdxtlgdvkxpzefponn`
3. Navigate to Table Editor to view/edit data
4. Use SQL Editor for direct queries

---

## 🎯 Features

### Dashboard
- Real-time daily predictions (max 3)
- Live match tracking with scores
- Confidence-based unit sizing
- Edge percentage calculation
- Glowing status indicators

### Analytics
- Cumulative profit charts
- Bankroll growth tracking
- Win rate by confidence level
- ROI and streak analytics
- Monthly performance comparison

### Bankroll Management
- Total bankroll configuration
- Unit size calculator
- Daily risk percentage slider
- Profit/loss tracking
- Staking guide by confidence

### Betting Journal
- Searchable history
- Filter by status
- Export to CSV
- Detailed bet notes
- Pagination

### Admin Panel
- System lock controls
- Prediction overrides
- Bankroll adjustments
- Edge threshold controls
- Audit log

---

## 💰 Currency

The platform uses **Nigerian Naira (₦)** for all monetary values. To change to another currency, update `/src/lib/utils.ts`:

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Change to "NGN" for Naira
    // ...
  }).format(amount);
}
```

---

## 🔧 API Integration

### Odds API (The Odds API)
- Used for real-time bookmaker odds
- Free tier: Limited requests
- API Key: `ee4f52e1b0c8ac9c766431712d594f87`

### Tennis API (API-Tennis)
- Used for match data, scores, player stats
- Free tier: Limited requests
- API Key: `a3fa245ffa1f3e6e0f65cebe1e79b28d48e1607cf377578941e3d141e127d4ce`
- ⚠️ Note: This API is available until 2026-06-04 (free plan expires)

### Fallback System
If APIs are unavailable, the system uses simulated data to demonstrate functionality.

---

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (near black)
- **Primary Accent (Cyan)**: `#00f0ff`
- **Success (Green)**: `#00ff88`
- **Secondary (Purple)**: `#a855f7`
- **Warning (Orange)**: `#ff6b35`
- **Danger (Red)**: `#ff3366`

### Typography
- **Headings**: Inter (700-900 weight)
- **Body**: Inter (400-500 weight)
- **Monospace**: JetBrains Mono (for numbers/data)

### Effects
- Glassmorphism cards
- Neon glow borders
- Floating particles
- Matrix-style loading
- Smooth animations

---

## 📁 Project Structure

```
tennis-edge/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth pages
│   │   ├── (dashboard)/   # Protected pages
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── ui/            # Base UI components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── charts/        # Chart components
│   │   └── landing/       # Landing page components
│   ├── lib/
│   │   ├── api/           # API integration
│   │   ├── supabase/      # Supabase client
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript types
├── .env                   # Environment variables
└── package.json
```

---

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env` file to Git
2. **Service Role Key**: Only use server-side, never expose to client
3. **Password Hashing**: In production, use bcrypt or similar
4. **API Keys**: Rotate periodically

---

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: Prisma Client initialization error
```
Solution: Verify `DATABASE_URL` in environment variables

### API Errors
```
Error: Failed to fetch predictions
```
Solution: Check API keys and rate limits

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

---

## 📞 Support

For issues or questions, check:
1. Project documentation
2. GitHub issues
3. Supabase dashboard for database issues

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**