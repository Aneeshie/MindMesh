import { db } from "@/database"
import { communities, communityMembers, learningGoals } from "@/database/schema"
import { getOrCreateUserByClerkId } from "@/lib/user-utils"

import { and, eq } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

type Variables = {
  userId: string
}

import { like, sql } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"


const communitesApp = new Hono<{ Variables: Variables }>()
  .get(
    "/all",
    zValidator(
      "query",
      z.object({
        q: z.string().optional(),
        offset: z.string().optional(),
        limit: z.string().optional(),
      })
    ),
    async (c) => {
      const { q, offset, limit } = c.req.valid("query")

      const offsetNum = parseInt(offset || "0")
      const limitNum = parseInt(limit || "10")

      const conditions = []

      if (q) {
        conditions.push(like(communities.name, `%${q}%`))
      }

      const allCommunities = await db
        .select()
        .from(communities)
        .where(and(...conditions))
        .limit(limitNum)
        .offset(offsetNum)

      return c.json({
        data: allCommunities,
        nextOffset:
          allCommunities.length === limitNum ? offsetNum + limitNum : null,
      })
    }
  )
  .post("/:communityId/join", async (c) => {
    const clerkId = c.get('userId')

    const communityId = c.req.param("communityId");

    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, communityId))

    if (community.length === 0) {
      throw new HTTPException(404, { message: "Community not found." })
    }


    await db.insert(communityMembers).values({
      userId: clerkId,
      communityId: communityId
    })

    return c.json({ message: "joined community successfully" }, 200)

  })
  .get('/', async (c) => {
    const clerkId = c.get('userId');

    const user = await getOrCreateUserByClerkId(clerkId)

    if (!user) {
      return c.json([])
    }

    const userCommunities = await db.select({
      id: communityMembers.id,
      userId: communityMembers.userId,
      communityId: communityMembers.communityId,
      joinedAt: communityMembers.joinedAt,
      community: communities
    }).from(communityMembers).innerJoin(communities, eq(communityMembers.communityId, communities.id)).where(eq(communityMembers.userId, clerkId))

    return c.json(userCommunities)
  })
  .get("/:communityId/goals", async (c) => {

    const clerkId = c.get("userId");

    const communityId = c.req.param("communityId")

    const user = await getOrCreateUserByClerkId(clerkId);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" })
    }

    const goals = await db.select().from(learningGoals).where(
      and(
        eq(learningGoals.communityId, communityId),
        eq(learningGoals.userId, user.id)
      )
    )

    return c.json(goals)
  })


export { communitesApp };



