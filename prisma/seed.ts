import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: "trader@tennisedge.com" },
    update: {},
    create: {
      email: "trader@tennisedge.com",
      password: "demo123", // In production, use proper hashing
      name: "Tennis Trader",
    },
  });

  console.log("Created user:", user.email);

  // Create default bankroll
  const bankroll = await prisma.bankroll.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      totalAmount: 100000,
      unitSize: 2000,
      currentAmount: 98500,
      dailyRiskPercent: 5,
    },
  });

  console.log("Created bankroll:", bankroll.totalAmount);

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      edgeThreshold: 5,
      maxDailyPicks: 3,
      minConfidence: 40,
      autoSettlement: true,
      notifications: true,
    },
  });

  console.log("Created settings:", settings.edgeThreshold);

  // Create sample matches
  const matches = [
    {
      tournament: "ATP Masters 1000 Rome",
      tournamentShort: "Rome Masters",
      surface: "Clay",
      round: "Quarterfinal",
      player1Name: "Carlos Alcaraz",
      player2Name: "Jannik Sinner",
      startTime: new Date(Date.now() + 3600000 * 6),
      status: "scheduled",
    },
    {
      tournament: "ATP 500 Dubai",
      tournamentShort: "Dubai 500",
      surface: "Hard",
      round: "Semifinal",
      player1Name: "Daniil Medvedev",
      player2Name: "Alexander Zverev",
      startTime: new Date(Date.now() + 3600000 * 12),
      status: "scheduled",
    },
    {
      tournament: "WTA 1000 Madrid",
      tournamentShort: "Madrid 1000",
      surface: "Clay",
      round: "Quarterfinal",
      player1Name: "Iga Swiatek",
      player2Name: "Aryna Sabalenka",
      startTime: new Date(Date.now() + 3600000 * 18),
      status: "scheduled",
    },
    {
      tournament: "ATP 250 Lyon",
      tournamentShort: "Lyon 250",
      surface: "Clay",
      round: "Final",
      player1Name: "Stefanos Tsitsipas",
      player2Name: "Holger Rune",
      startTime: new Date(Date.now() - 3600000 * 2),
      status: "live",
      score: "3-2, 1-1",
    },
    {
      tournament: "WTA 500 Stuttgart",
      tournamentShort: "Stuttgart 500",
      surface: "Clay",
      round: "Semifinal",
      player1Name: "Elena Rybakina",
      player2Name: "Coco Gauff",
      startTime: new Date(Date.now() - 3600000 * 5),
      status: "completed",
      score: "6-4 6-3",
    },
  ];

  for (const match of matches) {
    await prisma.match.create({
      data: match,
    });
  }

  console.log("Created", matches.length, "sample matches");

  // Create sample journal entries
  const journalEntries = [
    {
      userId: user.id,
      tournament: "ATP Masters Miami",
      player1: "Jannik Sinner",
      player2: "Carlos Alcaraz",
      underdog: "Carlos Alcaraz",
      odds: 2.85,
      units: 2,
      stakeAmount: 4000,
      edgePercent: 12.5,
      confidence: "HIGH",
      result: "won",
      profitLoss: 7400,
      notes: "Strong clay court performance",
      date: new Date(Date.now() - 86400000),
    },
    {
      userId: user.id,
      tournament: "ATP 500 Dubai",
      player1: "Alexander Zverev",
      player2: "Daniil Medvedev",
      underdog: "Daniil Medvedev",
      odds: 2.45,
      units: 2,
      stakeAmount: 4000,
      edgePercent: 8.3,
      confidence: "MEDIUM",
      result: "lost",
      profitLoss: -4000,
      notes: "Match didn't go as expected",
      date: new Date(Date.now() - 86400000 * 2),
    },
    {
      userId: user.id,
      tournament: "WTA 1000 Indian Wells",
      player1: "Iga Swiatek",
      player2: "Aryna Sabalenka",
      underdog: "Aryna Sabalenka",
      odds: 3.20,
      units: 1,
      stakeAmount: 2000,
      edgePercent: 6.8,
      confidence: "LOW",
      result: "won",
      profitLoss: 4400,
      notes: "Tiebreak victory",
      date: new Date(Date.now() - 86400000 * 3),
    },
  ];

  for (const entry of journalEntries) {
    await prisma.journalEntry.create({
      data: entry,
    });
  }

  console.log("Created", journalEntries.length, "journal entries");

  // Create analytics cache
  await prisma.analyticsCache.create({
    data: {
      userId: user.id,
      date: new Date(),
      totalBets: 156,
      wonBets: 112,
      lostBets: 38,
      voidBets: 6,
      totalUnits: 312,
      unitsWon: 89,
      unitsLost: 45,
      roi: 44.2,
      winRate: 71.8,
      avgOdds: 2.65,
      bestEdge: 18.5,
      currentStreak: 3,
      longestWinStreak: 7,
      longestLoseStreak: 2,
    },
  });

  console.log("Created analytics cache");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });