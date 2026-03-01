import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utlis/dbConfig";
import { transfers, accounts } from "@/utlis/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await db
    .select()
    .from(transfers)
    .where(eq(transfers.userId, userId));
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { fromAccountId, toAccountId, amount, note } = await req.json();

  // From account balance check করো
  const fromAccount = await db
    .select()
    .from(accounts)
    .where(
      and(eq(accounts.id, Number(fromAccountId)), eq(accounts.userId, userId)),
    );

  if (!fromAccount.length || fromAccount[0].balance < Number(amount)) {
    return NextResponse.json(
      { message: "Insufficient balance" },
      { status: 400 },
    );
  }

  const toAccount = await db
    .select()
    .from(accounts)
    .where(
      and(eq(accounts.id, Number(toAccountId)), eq(accounts.userId, userId)),
    );

  if (!toAccount.length) {
    return NextResponse.json(
      { message: "Destination account not found" },
      { status: 404 },
    );
  }

  // Transfer save করো
  await db.insert(transfers).values({
    userId,
    fromAccountId: Number(fromAccountId),
    toAccountId: Number(toAccountId),
    amount: Number(amount),
    note,
  });

  // Balance update করো
  await db
    .update(accounts)
    .set({ balance: fromAccount[0].balance - Number(amount) })
    .where(eq(accounts.id, Number(fromAccountId)));

  await db
    .update(accounts)
    .set({ balance: toAccount[0].balance + Number(amount) })
    .where(eq(accounts.id, Number(toAccountId)));

  return NextResponse.json({ success: true });
}
