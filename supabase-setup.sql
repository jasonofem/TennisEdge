-- TennisEdge Database Setup for Supabase
-- Run this in Supabase SQL Editor if Prisma push fails

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Bankroll table
CREATE TABLE IF NOT EXISTS "Bankroll" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "totalAmount" FLOAT DEFAULT 1000,
  "unitSize" FLOAT DEFAULT 100,
  "currentAmount" FLOAT DEFAULT 1000,
  "dailyRiskPercent" FLOAT DEFAULT 5,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS "Match" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "externalId" TEXT UNIQUE,
  "tournament" TEXT NOT NULL,
  "tournamentShort" TEXT,
  "surface" TEXT,
  "round" TEXT,
  "player1Name" TEXT NOT NULL,
  "player2Name" TEXT NOT NULL,
  "player1Odds" FLOAT,
  "player2Odds" FLOAT,
  "startTime" TIMESTAMP NOT NULL,
  "status" TEXT DEFAULT 'scheduled',
  "score" TEXT,
  "set1Player1" INT,
  "set1Player2" INT,
  "set2Player1" INT,
  "set2Player2" INT,
  "set3Player1" INT,
  "set3Player2" INT,
  "currentSet" INT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS "Prediction" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
  "underdog" TEXT NOT NULL,
  "bookmakerOdds" FLOAT NOT NULL,
  "impliedProb" FLOAT NOT NULL,
  "modelProb" FLOAT NOT NULL,
  "edgePercent" FLOAT NOT NULL,
  "confidence" TEXT NOT NULL,
  "suggestedUnits" INT NOT NULL,
  "reasoning" TEXT,
  "stakeAmount" FLOAT,
  "potentialWin" FLOAT,
  "actualResult" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Journal Entries table
CREATE TABLE IF NOT EXISTS "JournalEntry" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "matchId" TEXT REFERENCES "Match"(id) ON DELETE SET NULL,
  "predictionId" TEXT,
  "date" TIMESTAMP DEFAULT NOW(),
  "tournament" TEXT NOT NULL,
  "player1" TEXT NOT NULL,
  "player2" TEXT NOT NULL,
  "underdog" TEXT NOT NULL,
  "odds" FLOAT NOT NULL,
  "units" INT NOT NULL,
  "stakeAmount" FLOAT NOT NULL,
  "edgePercent" FLOAT NOT NULL,
  "confidence" TEXT NOT NULL,
  "result" TEXT,
  "profitLoss" FLOAT,
  "notes" TEXT,
  "settledAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT UNIQUE NOT NULL,
  "edgeThreshold" FLOAT DEFAULT 5,
  "maxDailyPicks" INT DEFAULT 3,
  "minConfidence" FLOAT DEFAULT 40,
  "autoSettlement" BOOLEAN DEFAULT TRUE,
  "notifications" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Analytics Cache table
CREATE TABLE IF NOT EXISTS "AnalyticsCache" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP DEFAULT NOW(),
  "totalBets" INT,
  "wonBets" INT,
  "lostBets" INT,
  "voidBets" INT,
  "totalUnits" FLOAT,
  "unitsWon" FLOAT,
  "unitsLost" FLOAT,
  "roi" FLOAT,
  "winRate" FLOAT,
  "avgOdds" FLOAT,
  "bestEdge" FLOAT,
  "currentStreak" INT,
  "longestWinStreak" INT,
  "longestLoseStreak" INT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Prediction_userId_createdAt_idx" ON "Prediction"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Prediction_createdAt_idx" ON "Prediction"("createdAt");
CREATE INDEX IF NOT EXISTS "JournalEntry_userId_date_idx" ON "JournalEntry"("userId", "date");
CREATE INDEX IF NOT EXISTS "JournalEntry_result_idx" ON "JournalEntry"("result");
CREATE INDEX IF NOT EXISTS "AnalyticsCache_userId_date_idx" ON "AnalyticsCache"("userId", "date");

-- Insert default user
INSERT INTO "User" (email, password, name)
VALUES ('trader@tennisedge.com', 'demo123', 'Tennis Trader')
ON CONFLICT (email) DO NOTHING;

-- Insert default bankroll
INSERT INTO "Bankroll" (userId, totalAmount, unitSize, currentAmount, dailyRiskPercent)
SELECT id, 100000, 2000, 98500, 5
FROM "User"
WHERE email = 'trader@tennisedge.com'
ON CONFLICT (userId) DO NOTHING;

-- Insert default settings
INSERT INTO "Settings" (userId, edgeThreshold, maxDailyPicks, minConfidence, autoSettlement, notifications)
SELECT id, 5, 3, 40, TRUE, TRUE
FROM "User"
WHERE email = 'trader@tennisedge.com'
ON CONFLICT (userId) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bankroll" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Prediction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsCache" ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for single user mode, allow all)
CREATE POLICY "Enable all for User" ON "User" FOR ALL USING (true);
CREATE POLICY "Enable all for Bankroll" ON "Bankroll" FOR ALL USING (true);
CREATE POLICY "Enable all for Prediction" ON "Prediction" FOR ALL USING (true);
CREATE POLICY "Enable all for JournalEntry" ON "JournalEntry" FOR ALL USING (true);
CREATE POLICY "Enable all for Settings" ON "Settings" FOR ALL USING (true);
CREATE POLICY "Enable all for AnalyticsCache" ON "AnalyticsCache" FOR ALL USING (true);

-- Public read access for Match (no auth required)
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for Match" ON "Match" FOR SELECT USING (true);

PRINT 'Database setup completed successfully!';