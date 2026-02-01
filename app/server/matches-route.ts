import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth-middleware";
import { aiMatchUsers, generateConversationInsight } from "@/lib/ai";
import { createMatch, createMessage, getActiveMatchesForUser, getMatchById, getMessages, getPendingMatchesForUser, searchUsers, updateMatchStatus } from "@/lib/db-helpers";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Variables = {
    userId: string
}


export const matchesApp = new Hono<{ Variables: Variables }>().use("/*", authMiddleware)
    .post("/:communityId/aiMatch", async (c) => {
        const communityId = c.req.param("communityId")
        const user = c.get('user')

        const aiMatch = await aiMatchUsers(user, communityId)

        return c.json(aiMatch)

    })
    .get("/pending", async (c) => {
        const user = c.get('user')
        const matches = await getPendingMatchesForUser(user.id)
        return c.json(matches)
    })
    .get("/active", async (c) => {
        const user = c.get('user')
        const matches = await getActiveMatchesForUser(user.id)
        return c.json(matches)
    })
    .get("/users/search", zValidator("query", z.object({
        q: z.string().min(1)
    })), async (c) => {
        const user = c.get('user')
        const { q } = c.req.valid("query")
        const results = await searchUsers(q, user.id)
        return c.json(results)
    })
    .post("/request", zValidator("json", z.object({
        targetUserId: z.string().uuid(),
        communityId: z.string().uuid().optional() // Optional, defaults to a system-picked one or generic if logic allowed
    })), async (c) => {
        const user = c.get('user')
        const { targetUserId, communityId } = c.req.valid("json")

        // For MVP, if no communityId provided, we really should require one or pick a default.
        // Let's assume the frontend passes a communityId for now (perhaps from the user's list or a "General" one).
        // If we strictly need one, I'll temporarily hardcode or find the first common one. 
        // For now, let's require it or find one.

        // Quick hack: Just pick the first community the CURRENT user is in as the context?
        // Better: The user should probably be in a "Global" community.
        // Let's rely on the frontend to pass one for now.
        if (!communityId) {
            return c.json({ error: "Community ID context required for now" }, 400);
        }

        const match = await createMatch(user.id, targetUserId, communityId)
        return c.json(match)
    })
    .post("/:matchId/accept", async (c) => {
        const matchId = c.req.param("matchId")
        const updatedMatch = await updateMatchStatus(matchId, "active")
        return c.json(updatedMatch)
    })
    .get("/:matchId", async (c) => {
        const matchId = c.req.param("matchId")
        const user = c.get('user')

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(matchId)) {
            return c.json({ error: "Invalid match ID format" }, 400);
        }

        const match = await getMatchById(matchId, user.id)

        if (!match) {
            return c.json({ error: "Match not found or unauthorized" }, 404)
        }
        return c.json(match)
    })
    .get("/:matchId/messages", async (c) => {
        const matchId = c.req.param("matchId")
        const user = c.get('user')
        const messages = await getMessages(matchId)

        const messagesWithOwnership = messages.map(msg => ({
            ...msg,
            isMine: msg.senderId === user.id
        }))

        return c.json(messagesWithOwnership)
    })
    .post("/:matchId/messages", zValidator("json", z.object({
        content: z.string().min(1)
    })), async (c) => {
        const matchId = c.req.param("matchId")
        const user = c.get('user')
        const { content } = c.req.valid("json")

        const message = await createMessage(matchId, user.id, content)
        return c.json(message)
    })
    .post("/:matchId/insight", async (c) => {
        const matchId = c.req.param("matchId")
        const user = c.get('user')

        // Fetch last 50 messages for context
        const messages = await getMessages(matchId, 50)

        if (messages.length === 0) {
            return c.json({ error: "No messages to analyze" }, 400)
        }

        // Format for AI
        const formattedMessages = messages.map(m => ({
            sender: m.senderId === user.id ? "Me" : m.senderName || "Partner",
            content: m.content
        }))

        const insight = await generateConversationInsight(formattedMessages)
        return c.json(insight)
    })
