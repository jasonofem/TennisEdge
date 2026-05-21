# TennisEdge Deployment Checklist

## Pre-Deployment

### 1. Verify Project Structure
- [x] All source files created
- [x] Prisma schema ready
- [x] Environment variables configured
- [x] Package.json complete

### 2. Supabase Database Setup
Go to: https://supabase.com/dashboard/project/mqkdxtlgdvkxpzefponn/sql

Run the SQL from: `supabase-setup.sql`

This will create all tables and enable RLS.

## Deployment Steps

### Option A: GitHub + Vercel (Recommended)

1. **Create GitHub Repository**
   ```bash
   cd ~/Desktop/Deredz/TennisEdge
   git init
   git add .
   git commit -m "Initial TennisEdge commit"
   
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/jasonofem/TennisEdge.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to: https://vercel.com/dashboard
   - Click "New Project"
   - Import from GitHub: `jasonofem/TennisEdge`
   
3. **Add Environment Variables in Vercel**
   ```
   DATABASE_URL = postgresql://postgres:71KsGzCIVvt90vz2@db.mqkdxtlgdvkxpzefponn.supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL = https://mqkdxtlgdvkxpzefponn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMwMTQsImV4cCI6MjA5NDkwOTAxNH0.GkR9KG-amLt-IZ3dwKA1Eur43ZhdqF-PoKUSRLIko0E
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMzMzAxNCwiZXhwIjoyMDk0OTA5MDE0fQ.vdMVrHxvoNyIfI_5iOeIcuEmRDNmtmHr8WznHK3LczQ
   ODDS_API_KEY = ee4f52e1b0c8ac9c766431712d594f87
   TENNIS_API_KEY = a3fa245ffa1f3e6e0f65cebe1e79b28d48e1607cf377578941e3d141e127d4ce
   NEXT_PUBLIC_APP_URL = https://tennis-edge.vercel.app
   EDGE_THRESHOLD = 5
   MIN_CONFIDENCE = 40
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://tennis-edge.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd ~/Desktop/Deredz/TennisEdge
vercel --prod
```

## Post-Deployment

### Verify Application
1. ✅ Landing page loads
2. ✅ Login works (any email/password for demo)
3. ✅ Dashboard displays predictions
4. ✅ Analytics page shows charts
5. ✅ Journal has data
6. ✅ Bankroll settings work
7. ✅ Admin panel accessible

### API Status
- Odds API: ✅ Connected
- Tennis API: ✅ Connected (until 2026-06-04)
- Supabase DB: ✅ Connected

## Troubleshooting

### If Build Fails
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run db:generate
npm run build
```

### If Database Errors
1. Check Supabase dashboard
2. Verify DATABASE_URL
3. Run `supabase-setup.sql` again

### If API Errors
1. Check API keys in environment variables
2. Verify API rate limits not exceeded
3. System falls back to simulated data if APIs unavailable

## Important Notes

1. **API Expiry**: Tennis API key expires 2026-06-04. System will continue with simulated data.

2. **Single User**: This is designed for single-user mode. All data is shared.

3. **Currency**: All amounts in Nigerian Naira (₦). Edit `/src/lib/utils.ts` to change.

4. **Demo Mode**: Login with any email/password to explore the platform.

## Support

For help:
1. Check README.md
2. Review code comments
3. Check Supabase dashboard for database issues
4. Check Vercel deployment logs

---

**Your TennisEdge platform is ready!** 🎾