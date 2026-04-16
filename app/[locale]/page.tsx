"use client";

import VideoHero from "../components/home/VideoHero";
import EditorialIntro from "../components/home/EditorialIntro";
import SiloGrid from "../components/home/SiloGrid";
// import OffersCarousel from "../components/home/OffersCarousel";
import PersonaSlider from "../components/home/PersonaSlider";
import Testimonials from "../components/home/Testimonials";
import InteractiveMap from "../components/InteractiveMap";
import AvailabilityBar from "../components/AvailabilityBar";

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen">
      <VideoHero />
      <EditorialIntro />
      <SiloGrid />
      {/* <OffersCarousel /> */}
      <PersonaSlider />
      <Testimonials />
      <InteractiveMap />
      <AvailabilityBar />
    </main>
  );
}