import { NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { expenses } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, amount, month, year, budgetId } = body;

  if (!title || !amount || !month || !year || !budgetId) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 },
    );
  }

  const newExpense = await db.insert(expenses).values({
    userId: userId,
    // schema এ field name match করতে হবে
    budgetId: Number(budgetId),
    title,
    amount: Number(amount),
    month: Number(month),
    year: Number(year),
  });

  return NextResponse.json(
    { message: "Expense added successfully", newExpense },
    { status: 201 },
  );
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId));

  return NextResponse.json(data);
}
