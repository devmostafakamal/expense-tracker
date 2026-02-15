import { db } from "@/utlis/dbConfig";
import { budgets } from "@/utlis/schema";

async function insertBudget() {
  await db.insert(budgets).values({
    userId: 1,
    title: "February Budget",
    amount: 20000,
    month: 2,
    year: 2026,
  });

  console.log("Budget inserted successfully!");
}

insertBudget();
