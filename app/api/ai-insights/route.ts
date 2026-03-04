import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/utlis/dbConfig";
import { budgets, expenses } from "@/utlis/schema";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const budgetData = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));
  const expenseData = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId));

  const summary = budgetData.map((b) => {
    const spent = expenseData
      .filter((e) => e.budgetId === b.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      title: b.title,
      category: b.category,
      budget: b.amount,
      spent,
      remaining: b.amount - spent,
      percentage: Math.round((spent / b.amount) * 100),
      month: b.month,
      year: b.year,
    };
  });

  const totalBudget = summary.reduce((s, b) => s + b.budget, 0);
  const totalSpent = summary.reduce((s, b) => s + b.spent, 0);
  const exceeded = summary.filter((b) => b.percentage >= 100);
  const warning = summary.filter(
    (b) => b.percentage >= 80 && b.percentage < 100,
  );

  const prompt = `
You are a personal finance advisor. Analyze this user's expense data and give practical insights in a friendly tone.

Current Month: ${currentMonth}/${currentYear}
Total Budget: ৳${totalBudget}
Total Spent: ৳${totalSpent}
Remaining: ৳${totalBudget - totalSpent}
Savings Rate: ${totalBudget > 0 ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0}%

Budget Details:
${JSON.stringify(summary, null, 2)}

Exceeded Budgets: ${exceeded.map((b) => b.title).join(", ") || "None"}
Warning Budgets (80%+): ${warning.map((b) => b.title).join(", ") || "None"}

Please provide:
1. A brief overall assessment (2-3 sentences)
2. Top 3 specific actionable tips based on their spending
3. One positive observation if applicable
4. A savings suggestion

Keep response concise, friendly, and specific to their data. Use ৳ for currency. Format with clear sections.
  `;

  // Gemini API call
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const insight = result.response.text();

  return NextResponse.json({ success: true, insight, summary });
}
