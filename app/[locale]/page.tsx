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
      {/**
       * EditorialIntro pins via `sticky top-0` and SiloGrid layers above it
       * with `z-10 bg-surface`, so SiloGrid scrolls up over the pinned
       * EditorialIntro — visually tucking it behind the grid. Wrapping both
       * in a `relative` container scopes the sticky release to the end of
       * SiloGrid, so the editorial doesn't bleed into later sections.
       */}
      <div className="relative">
        <EditorialIntro />
        <SiloGrid />
      </div>
      {/* <OffersCarousel /> */}
      <PersonaSlider />
      <InteractiveMap />
      <AddressSection />
      <AvailabilityBar />
    </main>
  );
}