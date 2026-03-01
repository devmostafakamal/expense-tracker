import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { accounts } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, type, balance, currency } = await req.json();

  const result = await db
    .insert(accounts)
    .values({
      userId,
      name,
      type,
      balance: Number(balance),
      currency: currency || "BDT",
    })
    .returning();

  return NextResponse.json({ success: true, data: result[0] });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id, balance } = await req.json();

  const result = await db
    .update(accounts)
    .set({ balance: Number(balance) })
    .where(and(eq(accounts.id, Number(id)), eq(accounts.userId, userId)))
    .returning();

  return NextResponse.json({ success: true, data: result[0] });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .delete(accounts)
    .where(and(eq(accounts.id, Number(id)), eq(accounts.userId, userId)));
  return NextResponse.json({ success: true });
}
