import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Hero from "../components/hero/Hero";
import TopBar from "@/components/topBar";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // 🔒 Not logged in → redirect
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <Hero />
    </div>
  );
}
