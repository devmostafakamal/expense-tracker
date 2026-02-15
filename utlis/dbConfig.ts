// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import * as schema from "./schema";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL missing! Put it inside .env.local");
// }

// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql, { schema });
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Provide a dummy connection string for build time
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db";

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
