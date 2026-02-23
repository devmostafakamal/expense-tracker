import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCheckBudgets = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // wait until user is loaded
    if (!user) return; // no user logged in

    // console.log("Clerk userId:", user.id); // ✅ now this will show
    // console.log("Full user object:", user); // ← পুরো user দেখো
    // console.log("user.id:", user.id);
    // console.log("user.primaryEmailAddress:", user.primaryEmailAddress);

    const check = async () => {
      const res = await fetch(`/api/checkBudgets?userId=${user.id}`);
      const data = await res.json();
      console.log("checkBudgets response:", data); // ✅ see API result
      if (!data.hasBudgets) {
        router.push("/dashboard/budgets");
      }
    };

    check();
  }, [isLoaded, user, router]);
};
