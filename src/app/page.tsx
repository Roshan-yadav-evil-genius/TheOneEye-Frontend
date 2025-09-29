import NavBar from "@/components/global/NavBar";
import FAQSection from "@/components/pages/FAQSection";
import FeaturesSection from "@/components/pages/FeaturesSection";
import HeroSection from "@/components/pages/HeroSection";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 p-5">
      <NavBar/>
      <HeroSection/>
      <FeaturesSection/>
      <FAQSection/>
    </main>
  );
}
