import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { budgets } from "@/utlis/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  // ✅ keep string

  if (!userId) {
    return NextResponse.json({ hasBudgets: false });
  }

  const result = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));

  return NextResponse.json({ hasBudgets: result.length > 0 });
}
