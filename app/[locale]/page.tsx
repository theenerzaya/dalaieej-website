"use client";

import VideoHero from "../components/home/VideoHero";
import EditorialIntro from "../components/home/EditorialIntro";
import SiloGrid from "../components/home/SiloGrid";
// import OffersCarousel from "../components/home/OffersCarousel";
import PersonaSlider from "../components/home/PersonaSlider";
import InteractiveMap from "../components/InteractiveMap";
import AddressSection from "../components/home/AddressSection";
import AvailabilityBar from "../components/AvailabilityBar";

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative min-h-screen bg-surface font-body"
    >
      <VideoHero />
      <EditorialIntro />
      <SiloGrid />
      {/* <OffersCarousel /> */}
      <PersonaSlider />
      <InteractiveMap />
      <AddressSection />
      <AvailabilityBar />
    </main>
  );
}