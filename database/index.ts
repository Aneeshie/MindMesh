import { config } from "dotenv"

config({ path: '.env.local' })

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

const URL = process.env.DATABASE_URL

if (!URL) {
  throw new Error("DATABASE_URL not set.")
}

const pool = new Pool({
  connectionString: URL,
  ssl: URL.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000

})

export const db = drizzle(pool, { schema })
