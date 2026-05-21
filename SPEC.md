# TennisEdge - Specification Document

## Concept & Vision

TennisEdge is a professional tennis betting intelligence platform designed for disciplined value betting. The aesthetic is a futuristic hacker-style sports analytics terminal - think Bloomberg Terminal meets Cyberpunk. Every element communicates precision, data-driven decision making, and professional-grade analysis. This is not a gambling tips site; it's a trading intelligence platform for serious bettors.

## Design Language

### Aesthetic Direction
Cyberpunk trading terminal meets sports analytics. Dark, sophisticated, with strategic neon accents that glow like circuit boards. The interface feels like piloting a spacecraft designed for tennis trading.

### Color Palette
- **Primary Background**: `#0a0a0a` (near black)
- **Secondary Background**: `#111111` (card backgrounds)
- **Surface**: `#1a1a1a` (elevated surfaces)
- **Primary Accent (Cyan)**: `#00f0ff` (main highlights)
- **Secondary Accent (Green)**: `#00ff88` (success/profit)
- **Tertiary Accent (Purple)**: `#a855f7` (secondary elements)
- **Warning (Orange)**: `#ff6b35` (alerts)
- **Danger (Red)**: `#ff3366` (loss/warnings)
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#9ca3af`
- **Text Muted**: `#6b7280`

### Typography
- **Headings**: Inter (weight 700-900)
- **Body**: Inter (weight 400-500)
- **Monospace/Data**: JetBrains Mono (for numbers, stats, terminal elements)
- **Fallbacks**: system-ui, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Border radius: 8px (cards), 12px (buttons), 4px (inputs), full (badges)
- Card padding: 24px
- Page max-width: 1440px

### Motion Philosophy
- Page transitions: 300ms ease-out
- Hover states: 150ms ease
- Loading animations: pulse with glow
- Data updates: 200ms fade
- Stagger animations: 100ms between items
- Glowing effects: subtle pulse (2s infinite)

### Visual Assets
- Icons: Lucide React (consistent line weight)
- Charts: Recharts with custom dark theme
- Decorative: CSS gradients, SVG tennis court outlines, particle effects
- Glasmorphism: backdrop-blur with semi-transparent backgrounds

## Layout & Structure

### Page Architecture
1. **Landing**: Full-screen hero with animated background, feature grid, stats preview, CTA sections
2. **Dashboard**: Protected route with sidebar navigation, prediction cards grid, live status indicators
3. **Analytics**: Full-width charts, metric cards, date range selectors
4. **Journal**: Data table with filters, search, pagination
5. **Bankroll**: Control panel with input forms, visualization cards
6. **Settings**: Configuration forms, thresholds, preferences
7. **Admin**: Hidden panel for data management

### Responsive Strategy
- Mobile: Single column, bottom navigation, collapsed sidebar
- Tablet: 2-column grid, visible sidebar
- Desktop: Full layout with 3-column prediction grid

### Navigation
- Sidebar: Fixed left, collapsible on mobile
- Top bar: User profile, notifications, live indicator
- Breadcrumbs: For nested pages

## Features & Interactions

### 1. Landing Page
- **Hero Section**: Full viewport, animated gradient background with floating particles, neon text glow, terminal typing effect for tagline
- **Stats Preview**: Live counters showing platform performance metrics
- **Feature Showcase**: Icon cards with hover glow effects
- **CTA Section**: Gradient buttons with pulse animation
- **Footer**: Minimal links, copyright

### 2. Dashboard
- **Daily Predictions Panel**: Max 3 cards showing underdog opportunities
- **Prediction Card Details**:
  - Tournament name, player names (underdog highlighted in green)
  - Market: "Underdog To Win A Set"
  - Bookmaker odds, implied probability, model probability
  - Edge percentage (glowing green if positive)
  - Confidence badge (LOW/MEDIUM/HIGH)
  - Suggested units (1/2/3 based on confidence)
  - Reasoning section (expandable)
  - Match time countdown
  - Live score when active
- **Empty State**: "NO QUALIFYING EDGE TODAY" with terminal styling
- **Status Indicators**: Glowing dots for live/completed

### 3. Confidence Scoring
Tiers determine unit sizing:
- **LOW (40-60%)**: 1 unit
- **MEDIUM (60-75%)**: 2 units
- **HIGH (75%+)**; 3 units

Calculation factors:
- Surface advantage (clay/hard/grass)
- Recent form (last 10 matches)
- Serve hold percentage
- Fatigue indicators
- Tiebreak frequency
- Head-to-head history
- Favorite inconsistency patterns
- Odds value edge

Visual representation:
- Glowing badge with tier color
- Progress bar (0-100%)
- Animated pulse on high confidence

### 4. Bankroll Management
- **Input Fields**: Total bankroll (₦), unit size (₦)
- **Auto-calculations**:
  - Suggested stake per confidence level
  - Total exposure percentage
  - Bankroll growth/loss tracker
  - Daily risk percentage
  - Units won/lost counter
- **Visualization**: Growth chart, pie chart for exposure
- **Neon sliders** for quick adjustments

### 5. Betting Journal
- **Auto-logged entries** from predictions
- **Table columns**: Date, Match, Odds, Units, Confidence, Edge%, Result, P/L, Status, Notes
- **Statuses**: live, won, lost, void, abandoned
- **Glowing status badges** with appropriate colors
- **Filters**: Date range, status, result, confidence level
- **Search**: By player name, tournament
- **Pagination**: 20 per page
- **Export**: CSV download

### 6. Analytics Dashboard
Charts and metrics:
- **Cumulative Profit Chart**: Line chart with gradient fill
- **Bankroll Growth**: Area chart over time
- **ROI Tracker**: Percentage display with trend indicator
- **Win Rate**: Donut chart by confidence level
- **Odds Distribution**: Histogram
- **Streak Tracker**: Win/loss sequence visualization
- **Metric Cards**: Animated counters, glow effects

### 7. Live Match Tracking
- **Real-time updates** from API
- **Live scores**: Current set scores, game scores
- **Auto-settlement**: Result updates when match ends
- **Status pulse**: Glowing animation on active matches

### 8. Admin Panel
- **Prediction editor**: Override model predictions
- **Manual result entry**: Force settlement
- **Bankroll adjustment**: Add/subtract funds
- **Threshold controls**: Edge minimum, confidence weights
- **System controls**: Force "No Bet Today"

### 9. API Integration
- **Odds API**: Real-time odds from multiple bookmakers
- **API-Tennis**: Match data, scores, player stats
- **Caching layer**: 5-minute cache for API responses
- **Scheduled updates**: Cron jobs for daily predictions

## Component Inventory

### Core Components
1. **GlassCard**: backdrop-blur, neon border on hover, subtle glow
2. **NeonButton**: Gradient background, glow on hover, scale on click
3. **PredictionCard**: All prediction details, live status, confidence badge
4. **MetricCard**: Animated counter, label, trend indicator
5. **GlowingBadge**: Status indicator with pulse animation
6. **TerminalText**: Typing effect for messages
7. **LoadingScreen**: Matrix-style loading animation
8. **EmptyState**: Futuristic message display
9. **DataTable**: Sortable, filterable, with glow effects
10. **Sidebar**: Collapsible, with active state indicators

### States for Interactive Components
- **Default**: Base styling
- **Hover**: Glow effect, slight scale
- **Active**: Pressed state, inverted colors
- **Disabled**: Reduced opacity, no interactions
- **Loading**: Pulse animation, skeleton
- **Error**: Red glow, error message

## Technical Approach

### Framework & Architecture
- Next.js 14 App Router
- TypeScript for type safety
- Server Actions for mutations
- API Routes for external integrations

### Database
- Supabase PostgreSQL
- Prisma ORM for type-safe queries
- Row Level Security for user isolation (single user mode)

### API Integration
- Odds API (provided key): For bookmaker odds
- API-Tennis (provided key): For match data and live scores
- Fallback: Mock data for testing when APIs unavailable

### Authentication
- Supabase Auth (simplified for single user)
- Email/password login
- Protected routes via middleware

### State Management
- React Context for global state
- Server Components for initial data
- Client Components for interactivity

### Deployment
- Vercel for hosting
- Environment variables for secrets
- PostgreSQL connection via Prisma

## Database Schema

### Tables
1. **matches**: Tennis match data
2. **predictions**: Daily underdog predictions
3. **bankroll**: User bankroll settings
4. **journal_entries**: Betting history
5. **analytics_cache**: Cached analytics data
6. **settings**: User preferences

## File Structure
```
tennis-edge/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── charts/
│   │   └── landing/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── api/
│   │   └── utils/
│   ├── hooks/
│   └── types/
├── public/
├── tailwind.config.ts
└── package.json
```

## Quality Checklist
- [ ] All buttons functional
- [ ] Forms validate input
- [ ] Loading states work
- [ ] Empty states display correctly
- [ ] Charts render with real data
- [ ] Live updates function
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Production build succeeds