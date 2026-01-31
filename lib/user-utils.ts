import { db } from "@/database";
import { users } from "@/database/schema";
import { currentUser, type User } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

type DbUser = typeof users.$inferSelect;

function getBestClerkEmail(clerkUser: User): string | null {
  return (
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    null
  );
}

function getBestClerkName(clerkUser: User): string {
  return (
    clerkUser.fullName ??
    clerkUser.firstName ??
    clerkUser.lastName ??
    clerkUser.username ??
    "MeshMind User"
  );
}

async function upsertUserFromClerk(clerkUser: User): Promise<DbUser | null> {
  const email = getBestClerkEmail(clerkUser);
  if (!email) {
    throw new Error("Clerk user has no email address.");
  }

  const name = getBestClerkName(clerkUser);

  const [row] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      name,
      imageUrl: clerkUser.imageUrl,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        name,
        imageUrl: clerkUser.imageUrl,
        updatedAt: new Date(),
      },
    })
    .returning();

  return row ?? null;
}

export const getOrCreateUserByClerkId = async (
  clerkId: string
): Promise<DbUser | null> => {
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Safety: ensure we don't accidentally create/update the wrong user.
  // if (clerkUser.id !== clerkId) {
  //   throw new Error("Clerk user mismatch: currentUser() id does not match.");
  // }

  return await upsertUserFromClerk(clerkUser);
};