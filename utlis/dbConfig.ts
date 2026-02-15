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

// Remove the if check that throws the error
const DATABASE_URL = process.env.DATABASE_URL || "";

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
