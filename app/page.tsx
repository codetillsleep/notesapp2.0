import Hero from "@/components/hero/Hero";
import TopBar from "@/components/topBar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Hero />
    </div>
  );
}
