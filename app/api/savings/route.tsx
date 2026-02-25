import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { savingsGoals } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const goals = await db
    .select()
    .from(savingsGoals)
    .where(eq(savingsGoals.userId, userId));

  return NextResponse.json({ success: true, data: goals });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { title, targetAmount, savedAmount, currency, deadline, category } =
    await req.json();

  const goal = await db
    .insert(savingsGoals)
    .values({
      userId,
      title,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount || 0),
      currency: currency || "BDT",
      deadline,
      category,
    })
    .returning();

  return NextResponse.json({ success: true, data: goal[0] });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id, savedAmount } = await req.json();

  const updated = await db
    .update(savingsGoals)
    .set({ savedAmount: Number(savedAmount) })
    .where(
      and(eq(savingsGoals.id, Number(id)), eq(savingsGoals.userId, userId)),
    )
    .returning();

  return NextResponse.json({ success: true, data: updated[0] });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await db
    .delete(savingsGoals)
    .where(
      and(eq(savingsGoals.id, Number(id)), eq(savingsGoals.userId, userId)),
    );

  return NextResponse.json({ success: true });
}
