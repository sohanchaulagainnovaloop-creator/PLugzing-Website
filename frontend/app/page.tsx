import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SoftwareSection from "@/components/SoftwareSection";
import ToolsSection from "@/components/ToolsSection";
import InstallationSection from "@/components/InstallationSection";
import Activation from '@/components/Activation';
import Download from "@/components/Download";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <Hero />
      <SoftwareSection />
      <ToolsSection />
      <InstallationSection />
      <Activation />
      <Download />
      <Footer />
    </main>
  );
}
