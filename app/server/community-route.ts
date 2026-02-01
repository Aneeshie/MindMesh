import { db } from "@/database"
import { communities, communityMembers, learningGoals } from "@/database/schema"
import { getOrCreateUserByClerkId } from "@/lib/user-utils"

import { and, asc, desc, eq, like } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

type Variables = {
  userId: string,
  user: NonNullable<Awaited<ReturnType<typeof getOrCreateUserByClerkId>>>
}

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
    const user = c.get('user')

    const communityId = c.req.param("communityId");

    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, communityId))

    if (community.length === 0) {
      throw new HTTPException(404, { message: "Community not found." })
    }


    await db.insert(communityMembers).values({
      userId: user.id,
      communityId: communityId
    })

    return c.json({ message: "joined community successfully" }, 200)

  })
  .get('/', async (c) => {
    const user = c.get("user");

    const userCommunities = await db.select({
      id: communityMembers.id,
      userId: communityMembers.userId,
      communityId: communityMembers.communityId,
      joinedAt: communityMembers.joinedAt,
      community: communities
    }).from(communityMembers).innerJoin(communities, eq(communityMembers.communityId, communities.id)).where(eq(communityMembers.userId, user.id))

    return c.json(userCommunities)
  })
  .get("/:communityId/goals", async (c) => {

    const user = c.get("user");

    const communityId = c.req.param("communityId")

    const goals = await db
      .select()
      .from(learningGoals)
      .where(
        and(
          eq(learningGoals.communityId, communityId),
          eq(learningGoals.userId, user.id)
        )
      )
      // Incomplete first, newest first within each group
      .orderBy(asc(learningGoals.isCompleted), desc(learningGoals.createdAt))

    return c.json(goals)
  })
  .post(
    "/:communityId/goals",
    zValidator(
      "json",
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")
      const communityId = c.req.param("communityId")
      const { title, description } = c.req.valid("json")

      const [newGoal] = await db
        .insert(learningGoals)
        .values({
          userId: user.id,
          communityId,
          title,
          description,
        })
        .returning()

      return c.json(newGoal)
    }
  )
  .patch(
    "/:communityId/goals/:goalId",
    zValidator(
      "json",
      z.object({
        isCompleted: z.boolean(),
      })
    ),
    async (c) => {
      const user = c.get("user")
      const goalId = c.req.param("goalId")
      const { isCompleted } = c.req.valid("json")

      const [updatedGoal] = await db
        .update(learningGoals)
        .set({ isCompleted })
        .where(
          and(
            eq(learningGoals.id, goalId),
            eq(learningGoals.userId, user.id) // Ensure ownership
          )
        )
        .returning()

      if (!updatedGoal) {
        throw new HTTPException(404, { message: "Goal not found or unauthorized" })
      }

      return c.json(updatedGoal)
    }
  )


export { communitesApp };



