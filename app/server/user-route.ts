import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth-middleware";
import { getUserStats } from "@/lib/db-helpers";

type Variables = {
    userId: string
}

export const userApp = new Hono<{ Variables: Variables }>()
    .use("/*", authMiddleware)
    .get("/stats", async (c) => {
        const user = c.get('user')
        const stats = await getUserStats(user.id)
        return c.json(stats)
    })
