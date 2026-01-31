// hono setup
import { auth } from "@clerk/nextjs/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import { communitesApp } from "@/app/server/community-route";
import { getOrCreateUserByClerkId } from "@/lib/user-utils";

type Variables = {

  userId: string;
}

const app = new Hono<{ Variables: Variables }>().basePath("/api");


app.onError((err, c) => {
  console.error('API ERROR: ', err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof Error) {
    if (err.message.includes("violates") || err.message.includes("constraint")) {
      return c.json({ error: "Invalid data provided" }, 400)
    }

    if (err.message.includes("Not found")) {
      return c.json({ error: err.message }, 404)
    }
  }


  return c.json({ error: "Internal Server Error" }, 500)

})


//middleware

app.use("/*", async (c, next) => {
  const publicRoutes = ["/api/communities/all"];

  if (publicRoutes.includes(c.req.path)) {
    return await next();
  }

  const { userId } = await auth();
  if (!userId) {
    throw new HTTPException(401, {
      message: "Unauthorized"
    })
  }

  // Convert Clerk user id -> internal DB user uuid
  const dbUser = await getOrCreateUserByClerkId(userId);
  if (!dbUser) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("userId", dbUser.id);
  return await next();
})

const routes = app.route("/communities", communitesApp)

export type AppType = typeof routes



export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

