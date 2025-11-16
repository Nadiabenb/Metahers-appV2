
import { db } from '../../server/db';
import { users, transformationalExperiences, userProgress } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { testUser } from './auth';

export async function setupTestDatabase() {
  // Clear test user data
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, testUser.email))
    .limit(1);

  if (existingUser.length > 0) {
    const userId = existingUser[0].id;
    
    // Delete user progress
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
    
    // Delete user
    await db.delete(users).where(eq(users.id, userId));
  }
}

export async function seedTestData() {
  // Create test user
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  
  const [user] = await db
    .insert(users)
    .values({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
      tier: 'free',
      createdAt: new Date(),
    })
    .returning();

  return user;
}

export async function seedProUser() {
  // Create test pro user
  const hashedPassword = await bcrypt.hash('ProUser123!', 10);
  
  const [user] = await db
    .insert(users)
    .values({
      username: 'prouser',
      email: 'pro@metahers.com',
      password: hashedPassword,
      tier: 'pro',
      createdAt: new Date(),
    })
    .returning();

  return user;
}

export async function cleanupTestData() {
  await setupTestDatabase();
  
  // Clean up pro user
  const proUser = await db
    .select()
    .from(users)
    .where(eq(users.email, 'pro@metahers.com'))
    .limit(1);

  if (proUser.length > 0) {
    await db.delete(userProgress).where(eq(userProgress.userId, proUser[0].id));
    await db.delete(users).where(eq(users.id, proUser[0].id));
  }
}
