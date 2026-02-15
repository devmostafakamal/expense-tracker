import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
