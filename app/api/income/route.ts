import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { income, accounts } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sum } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await db.select().from(income).where(eq(income.userId, userId));
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { title, amount, category, month, year, accountId } = await req.json();

  if (!accountId || Number(accountId) === 0) {
    return NextResponse.json(
      { message: "Please select an account" },
      { status: 400 },
    );
  }
  // Income save করো
  const result = await db
    .insert(income)
    .values({
      userId,
      title,
      category,
      amount: Number(amount),
      month: Number(month),
      year: Number(year),
      accountId: Number(accountId),
    })
    .returning();

  // Account balance update করো
  const accountData = await db
    .select()
    .from(accounts)
    .where(
      and(eq(accounts.id, Number(accountId)), eq(accounts.userId, userId)),
    );

  if (accountData.length > 0) {
    const newBalance = accountData[0].balance + Number(amount);
    await db
      .update(accounts)
      .set({ balance: newBalance })
      .where(eq(accounts.id, Number(accountId)));
  }

  return NextResponse.json({ success: true, data: result[0] });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .delete(income)
    .where(and(eq(income.id, Number(id)), eq(income.userId, userId)));
  return NextResponse.json({ success: true });
}
