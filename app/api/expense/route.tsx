import { NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { expenses, budgets } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sum } from "drizzle-orm";
import { pusherServer } from "@/utlis/pusherServer";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, amount, month, year, budgetId, category } = body;

  if (!title || !amount || !month || !year || !budgetId) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 },
    );
  }

  // ১. Budget fetch করো
  const budgetResult = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.id, Number(budgetId)), eq(budgets.userId, userId)));

  if (!budgetResult.length) {
    return NextResponse.json({ message: "Budget not found" }, { status: 404 });
  }

  const budget = budgetResult[0];

  // ২. এখন পর্যন্ত কত খরচ হয়েছে
  const existingTotal = await db
    .select({ total: sum(expenses.amount) })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.budgetId, Number(budgetId)),
        eq(expenses.month, Number(month)),
        eq(expenses.year, Number(year)),
      ),
    );

  const alreadySpent = Number(existingTotal[0]?.total ?? 0);
  const remaining = budget.amount - alreadySpent;

  // ৩. Validation: exceed করবে কিনা
  if (Number(amount) > remaining) {
    return NextResponse.json(
      { message: `Budget exceeded! Remaining: ৳${remaining}` },
      { status: 400 },
    );
  }

  // ৪. Expense save করো
  await db.insert(expenses).values({
    userId,
    budgetId: Number(budgetId),
    title,
    amount: Number(amount),
    month: Number(month),
    year: Number(year),
    category: category || "Other",
  });

  // ৫. Updated total spent বের করো
  const totalResult = await db
    .select({ total: sum(expenses.amount) })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.budgetId, Number(budgetId)),
        eq(expenses.month, Number(month)),
        eq(expenses.year, Number(year)),
      ),
    );

  const totalSpent = Number(totalResult[0]?.total ?? 0);
  const budgetAmount = budget.amount;
  const percentage = (totalSpent / budgetAmount) * 100;

  // ৬. Pusher notification পাঠাও
  if (percentage >= 100) {
    await pusherServer.trigger(`user-${userId}`, "budget-alert", {
      type: "EXCEEDED",
      budgetId: budget.id,
      title: budget.title,
      budgetAmount,
      totalSpent,
      percentage: Math.round(percentage),
      message: `🚨 "${budget.title}" budget exceeded! Spent ৳${totalSpent} of ৳${budgetAmount}`,
    });
  } else if (percentage >= 80) {
    await pusherServer.trigger(`user-${userId}`, "budget-alert", {
      type: "WARNING",
      budgetId: budget.id,
      title: budget.title,
      budgetAmount,
      totalSpent,
      percentage: Math.round(percentage),
      message: `🔴 "${budget.title}" is at ${Math.round(percentage)}% of budget!`,
    });
  } else if (percentage >= 60) {
    await pusherServer.trigger(`user-${userId}`, "budget-alert", {
      type: "ALERT_60",
      budgetId: budget.id,
      title: budget.title,
      budgetAmount,
      totalSpent,
      percentage: Math.round(percentage),
      message: `🟡 "${budget.title}" is at ${Math.round(percentage)}% of budget!`,
    });
  }

  return NextResponse.json(
    { message: "Expense added successfully" },
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
