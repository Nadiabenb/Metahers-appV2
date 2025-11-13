
```typescript
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function grantAdminAccess() {
  try {
    const email = "nadia@metahers.ai";
    
    console.log(`Granting full access to ${email}...`);
    
    // Update user to have executive tier (highest level)
    const result = await db
      .update(users)
      .set({
        isPro: true,
        subscriptionTier: "founders_circle", // Highest tier with all features
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();
    
    if (result.length === 0) {
      console.error(`❌ User ${email} not found. Please sign up first.`);
      process.exit(1);
    }
    
    console.log(`✅ Successfully granted full access to ${email}`);
    console.log(`   - isPro: true`);
    console.log(`   - subscriptionTier: founders_circle`);
    console.log(`   - Admin access: enabled (via ADMIN_EMAILS)`);
    console.log(`\n🎉 You now have access to:`);
    console.log(`   - All 54 learning experiences`);
    console.log(`   - Thought Leadership Journey (all 30 days)`);
    console.log(`   - App Atelier (unlimited)`);
    console.log(`   - AI Glow-Up Program`);
    console.log(`   - Admin endpoints`);
    console.log(`   - All membership features`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error granting admin access:", error);
    process.exit(1);
  }
}

grantAdminAccess();
```
