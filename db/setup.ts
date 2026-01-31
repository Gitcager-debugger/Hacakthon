import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mindflow.app' },
    update: {},
    create: {
      email: 'demo@mindflow.app',
      name: 'Demo User',
      hashedPassword: await bcrypt.hash('demo123', 10),
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create sample check-ins for the last 7 days
  const today = new Date();

  const checkInData: Array<{
    userId: string;
    mood: number;
    energyLevel: number;
    sleepHours: number;
    socialBattery: string;
    journalNote: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    // Generate realistic mood data (slightly improving trend)
    const baseMood = 3.5 + (i * 0.15); // Improving trend
    const mood = Math.min(5, Math.max(1, Math.round(baseMood + (Math.random() - 0.5))));
    const energy = Math.min(5, Math.max(1, Math.round(3 + (Math.random() - 0.5) * 2)));
    const sleep = 6 + Math.random() * 2.5;

    checkInData.push({
      userId: demoUser.id,
      mood,
      energyLevel: energy,
      sleepHours: parseFloat(sleep.toFixed(1)),
      socialBattery: ['full', 'half', 'empty'][Math.floor(Math.random() * 3)],
      journalNote: i % 3 === 0 ? 'Had a productive day today!' : null,
      createdAt: date,
      updatedAt: date,
    });
  }

  // Insert check-ins in reverse order (oldest first)
  for (const data of checkInData.reverse()) {
    await prisma.checkIn.create({
      data,
    });
  }

  console.log(`✅ Created ${checkInData.length} sample check-ins`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
