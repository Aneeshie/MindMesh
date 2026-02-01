import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth-middleware";
import { aiMatchUsers } from "@/lib/ai";

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
