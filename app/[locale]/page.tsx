"use client";

import dynamic from "next/dynamic";
import VideoHero from "../components/home/VideoHero";
import EditorialIntro from "../components/home/EditorialIntro";
import SiloGrid from "../components/home/SiloGrid";
// import OffersCarousel from "../components/home/OffersCarousel";
const PersonaSlider = dynamic(() => import("../components/home/PersonaSlider"));
const InteractiveMap = dynamic(() => import("../components/InteractiveMap"));
const AddressSection = dynamic(() => import("../components/home/AddressSection"));
const AvailabilityBar = dynamic(() => import("../components/AvailabilityBar"));

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