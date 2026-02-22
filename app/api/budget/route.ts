// import { db } from "@/utlis/dbConfig";
import { db } from "@/utlis/dbConfig";
import { budgets } from "@/utlis/schema";
import { sql } from "drizzle-orm";
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

// export async function GET() {
//   try {
//     const allBudgets = await db.select().from(budgets);

//     return NextResponse.json({ success: true, data: allBudgets });
//   } catch (error) {
//     console.error("Budget Fetch Error:", error);
//     return NextResponse.json(
//       { success: false, error: String(error) },
//       { status: 500 },
//     );
//   }
// }
export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT 
        b.id,
        b.title,
        b.amount,
        b.month,
        b.year,
        COALESCE(SUM(e.amount), 0) as total_spent
      FROM budgets b
      LEFT JOIN expenses e ON b.id = e.budget_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);

    const formatted = result.rows.map((b: any) => {
      const totalSpent = Number(b.total_spent);
      const remaining = b.amount - totalSpent;
      const percentage = b.amount > 0 ? (totalSpent / b.amount) * 100 : 0;

      let status = "safe";
      if (percentage >= 100) status = "danger";
      else if (percentage >= 80) status = "warning";

      return {
        ...b,
        totalSpent,
        remaining,
        percentage,
        status,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Budget Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
