import { db } from "@/utlis/dbConfig";
import { budgets } from "@/utlis/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, title, amount, month, year } = body;

    // strict type check
    if (
      typeof userId !== "string" ||
      typeof title !== "string" ||
      typeof amount !== "number" ||
      typeof month !== "number" ||
      typeof year !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input types" },
        { status: 400 },
      );
    }

    const insertedBudget = await db
      .insert(budgets)
      .values({ userId, title, amount, month, year })
      .returning();

    return NextResponse.json({
      success: true,
      data: insertedBudget[0],
    });
  } catch (error) {
    console.error("Budget Insert Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allBudgets = await db.select().from(budgets);

    return NextResponse.json({ success: true, data: allBudgets });
  } catch (error) {
    console.error("Budget Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
