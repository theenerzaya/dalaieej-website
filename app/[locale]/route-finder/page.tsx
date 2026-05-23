/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from 'react';

export default function RouteFinderPage() {
  const [openRoute, setOpenRoute] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const routes = [
    {
      title: "Route 1: The Sky & Lake Express (Fly-in) – Best for 4-7 Days",
      content: (
        <div className="space-y-4">
          <p><strong>The Strategy:</strong> Maximum serenity. Zero road fatigue. The most direct path to the Blue Pearl.</p>
          <p><strong>For the traveler who values depth over breadth.</strong> Most tourists lose 40% of their vacation staring at the back of a driver&apos;s seat. This route skips the long road entirely. You fly direct to Murun (MXV), giving you more days to explore the Taiga forest, visit the Reindeer tribes, and relax by the lake.</p>
          <p><strong>The &quot;Insider&quot; Bonus: The UB Culture Extension</strong> Because you fly, you &quot;buy back&quot; 4 days of travel time. We recommend using those saved days for a &quot;Civilized Stopover&quot; in Ulaanbaatar:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>History:</strong> Visit the Chinggis Khaan Museum or the massive Genghis Khan Equestrian Statue (paved road).</li>
            <li><strong>Dining:</strong> Eat at The Bull (Hot Pot), Zalaat Garden (KBBQ), or Veranda (Italian with a view).</li>
            <li><strong>Shopping:</strong> Buy cashmere at the source at Gobi or the State Department Store.</li>
          </ul>
          <p className="italic pt-2">Take the quiz above to see if this matches your schedule.</p>
        </div>
      )
    },
    {
      title: "Route 2: The Steppe Voyage (Central Loop) – Best for 8-12 Days",
      content: (
        <div className="space-y-4">
          <p><strong>The Strategy:</strong> The Essential Expedition. The only route that shows you the true scale of the country.</p>
          <p><strong>The Route:</strong> UB → Elsen Tasarkhai (Mini Gobi) → Kharkhorin (Ancient Capital) → Khorgo Volcano → Dalai Eej Resort (3 Nights) → Fly back.</p>
          <p><strong>Why we love it:</strong> This route solves the dilemma of &quot;seeing it all&quot; and ticks off the entire &quot;Classic Mongolia&quot; checklist. Instead of driving days to the deep Gobi, you stop at Elsen Tasarkhai to see sand dunes, ride camels, and gallop on the green steppe right on your path. You stand on the ground of Genghis Khan&apos;s ancient capital at Kharkhorin, exploring the massive monastery built from its rubble, before finishing your journey at the ecological crown of the country: Dalai Eej Resort.</p>
          <p className="italic pt-2">Take the quiz above to see if you have enough days for this loop.</p>
        </div>
      )
    },
    {
      title: "Route 3: The Fire & Ice Expedition (Gobi Combo) – For Tough Adventurers",
      content: (
        <div className="space-y-4">
          <p><strong>The Strategy:</strong> The Ultimate Contrast. From the dinosaur lands of the south to the deep blue north.</p>
          <p><strong>The Route:</strong> Gobi Desert (3 days) → Fly UB → Fly Murun → Dalai Eej Resort (4 Nights).</p>
          <p><strong>The Reality:</strong> We call this &quot;Hard Mode.&quot; This route combines the singing sands of the south with the cooling waters of the north. It requires more time, stamina, and budget (more flights), but for the right person, it is the ultimate experience of Mongolia&apos;s extremes.</p>
        </div>
      )
    }
  ];

  const faqs = [
    {
      q: "Why do you recommend the North over the South?",
      a: "The South (Gobi) is spectacular, but it is an arid, demanding desert. If you want the 'Classic Mongolia' image of green grasslands and galloping horses, you actually find that in the North and Center.\n\nKhövsgöl is a sanctuary—lush alpine forests, reindeer tribes, and massive freshwater reserves. We believe the perfect Mongolia expedition should always end in the North to 'wash off the dust' of the steppe before you fly home."
    },
    {
      q: "Do I need a tour guide?",
      a: "No. If you take the Sky & Lake route, we arrange a private driver for you. If you take the Steppe Voyage, you can simply hire a 'Car and Driver' in Ulaanbaatar without paying for a full tour agency package."
    },
    {
      q: "Why are the Altai Mountains (West) excluded?",
      a: "This is a question of logistics. The Altai Mountains are incredible, but they are over 1,500km away in the far West. Including them requires a completely different itinerary (and usually expensive domestic flights) that doesn't fit neatly with the Central/North axis. This tool focuses on the routes that maximize landscape diversity for the standard 1-2 week trip."
    }
  ];

  return (
    <main id="main-content" className="bg-white min-h-screen text-ink font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center mb-16">
        <div className="absolute inset-0">
          <img 
            src="/images/gallery/the-resort/DBR_7361.webp" 
            alt="Lake Khövsgöl"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for text readability */}
        </div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-serif text-white tracking-wide text-center px-4">
          Mongolia Itinerary Planner
        </h1>
      </section>

      {/* 2. TEXT INTRO */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center space-y-6 text-lg">
        <h2 className="text-2xl font-serif font-medium mb-8">Don&apos;t plan your trip until you check your logic.</h2>
        <p>As locals, we see the same calculation error happen every summer. Travelers arrive with a checklist—ride a camel, see a monastery, gallop on the steppe—only to realize too late that they have left the story unfinished.</p>
        <p>They spend 14 days bouncing in a van through the arid south, missing the ecological crown of the country: The North.</p>
        <p>Full Disclosure: We have one bias. We believe a Mongolian expedition is incomplete without the Taiga. Whether you want a rugged road trip or a luxury flight, all paths generated by this tool ultimately lead North to the &quot;Blue Pearl&quot;.</p>
        <p className="italic font-medium pt-4">Which path is right for you? In 60 seconds, this tool analyzes your travel dates and style to match you with the perfect logistical plan—whether you want the &quot;Greatest Hits&quot; road trip or a direct luxury flight.</p>
      </section>

      {/* 3. TALLY QUIZ EMBED */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <iframe 
          data-tally-src="https://tally.so/embed/XxoEPP?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
          loading="lazy" 
          width="100%" 
          height="700" 
          frameBorder="0" 
          title="What Is Your Mongolia Vibe?"
          className="w-full"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
        `}} />
        <p className="text-center italic text-stone-500 mt-8">Don&apos;t want to take the quiz? Scroll down to browse our 3 recommended routes.</p>
      </section>

      {/* 4. ROUTES ACCORDION */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Preview: The 3 Routes We Compare</h2>
        <div className="border-t border-stone-200">
          {routes.map((route, index) => (
            <div key={index} className="border-b border-stone-200">
              <button 
                onClick={() => setOpenRoute(openRoute === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-stone-600 transition-colors"
              >
                <h3 className="text-lg font-medium pr-8">{route.title}</h3>
                <span className="text-2xl font-light text-stone-400" aria-hidden="true">
                  {openRoute === index ? '−' : '+'}
                </span>
              </button>
              {openRoute === index && (
                <div className="pb-8 text-stone-600 leading-relaxed">
                  {route.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="/images/gallery/adventures/DBR_1996.webp" alt="Mongolia Road Trip" className="w-full aspect-[4/3] object-cover" />
          <img src="/images/gallery/adventures/DBR_3442.webp" alt="Gobi Desert to Khövsgöl" className="w-full aspect-[4/3] object-cover" />
          <img src="/images/gallery/adventures/DBR_5227.webp" alt="Luxury Picnic" className="w-full aspect-[4/3] object-cover" />
          <img src="/images/gallery/the-resort/DBR_6649.webp" alt="Ulaanbaatar City Tour" className="w-full aspect-[4/3] object-cover" />
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Frequently Asked Questions</h2>
        <div className="border-t border-stone-200">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-stone-200">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-stone-600 transition-colors"
              >
                <h3 className="text-lg font-medium pr-8">{faq.q}</h3>
                <span className="text-2xl font-light text-stone-400" aria-hidden="true">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              {openFaq === index && (
                <div className="pb-8 text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER / CONTACT */}
      <footer className="py-20 px-6 bg-main text-center">
        <div className="max-w-3xl mx-auto space-y-4 text-stone-800">
          <h2 className="text-3xl font-serif mb-8">Contact Us</h2>
          <p><strong>Address:</strong> Mergen&apos;s Ridge, Haichin Am, eastern shore of Lake Khövsgöl (13 km from Khatgal), Khövsgöl Province, Mongolia</p>
          <p><strong>Location Notes:</strong> 50.4° N, 100.1° E</p>
          <p><strong>Email:</strong> <a href="mailto:hello@dalaieej.com" className="underline hover:text-stone-500">hello@dalaieej.com</a></p>
          <p className="pt-4 text-sm">For all inquiries: <a href="tel:+97677809010" className="underline hover:text-stone-500">+976 77 809010</a></p>
          <p className="text-sm text-stone-500">Available via Whatsapp, WeChat, Telegram and KakaoTalk</p>
        </div>

        {/* Simple Map Embed matching the original intent */}
        <div className="max-w-6xl mx-auto mt-16 h-[400px] w-full bg-stone-200">
           <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d149097.43058866164!2d100.08115629471131!3d50.48473215568853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d0ee2b5c0c9d9d1%3A0xc34375cc51a4cf13!2sDalai%20Eej%20Resort!5e0!3m2!1sen!2sde!4v1708780000000!5m2!1sen!2sde" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Dalai Eej Resort Map"
            />
        </div>
      </footer>
    </main>
  );
}