import HeroSection from "@/components/HeroSection";
import CountdownSection from "@/components/CountdownSection";
import VenueSection from "@/components/VenueSection";
import ScheduleSection from "@/components/ScheduleSection";
import GiftSection from "@/components/GiftSection";
import DressCodeSection from "@/components/DressCodeSection";
import RsvpSection from "@/components/RsvpSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CountdownSection />
      <VenueSection />
      <ScheduleSection />
      <DressCodeSection />
      <GiftSection />
      <RsvpSection />
      <FooterSection />
    </main>
  );
};

export default Index;
