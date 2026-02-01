import { getOrCreateUserByClerkId } from "@/lib/user-utils";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

type Variables = {
    userId: string,
    user: NonNullable<Awaited<ReturnType<typeof getOrCreateUserByClerkId>>>
}

export const authMiddleware = async (c: Context<{ Variables: Variables }>, next: Next) => {
    const clerkId = c.get("userId")

    const user = await getOrCreateUserByClerkId(clerkId)

    if (!user) {
        throw new HTTPException(404, { message: "User not authorized" })
    }

    c.set("user", user)

    return next();
}