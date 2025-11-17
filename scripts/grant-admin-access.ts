
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function grantAdminAccess() {
  try {
    const email = "nadia@metahers.ai";
    
    console.log(`Granting admin access to ${email}...`);
    
    // Update user to have admin privileges
    const result = await db
      .update(users)
      .set({
        isAdmin: true,
        isPro: true,
        subscriptionTier: "founders_circle",
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();
    
    if (result.length === 0) {
      console.error(`❌ User ${email} not found. Please sign up first.`);
      process.exit(1);
    }
    
    console.log(`✅ Successfully granted admin access to ${email}`);
    console.log(`   - isAdmin: true`);
    console.log(`   - isPro: true`);
    console.log(`   - subscriptionTier: founders_circle`);
    console.log(`\n🎉 You now have full admin access to:`);
    console.log(`   - Admin Dashboard (/admin)`);
    console.log(`   - User Management (/admin/users)`);
    console.log(`   - Experience Management (/admin/experiences)`);
    console.log(`   - All admin endpoints`);
    console.log(`   - All membership features`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error granting admin access:", error);
    process.exit(1);
  }
}

grantAdminAccess();
