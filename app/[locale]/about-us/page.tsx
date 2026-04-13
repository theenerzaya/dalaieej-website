"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const content = {
  en: {
    heroCaption: "Discover the wildness of the ancient, spring-fed lake.",
    storyHeading: "The Legend of the Source",
    storyBody: "Northern folklore speaks of a traveler led by a deer through the primeval forest to a hidden spring\u2014a source of water so pure it could restore the human spirit. For our family, that spring is Dalai Eej. Our foundation does not begin with a business plan; it is rooted in the deep Khuvsgul taiga. Tracing our ancestry to Rinchinlkhumbe from time immemorial, we have always understood the lake as a life force rather than a mere destination. When we transformed a historic pioneer camp in the quiet fold of the Khaich Valley into this sanctuary, we were not simply building cabins\u2014we were architecting a way to protect our native home. Whether you are seeking the profound silence of the timber walls or navigating the deer paths under the starlight, you are participating in a lifelong mission to respect, protect, and experience the pure force of the North.",
    pillarsTitle: "The Six Pillars",
    pillars: [
      { num: "01", title: "A Legacy of the Taiga", body: "Our family\u2019s roots in the Khuvsgul taiga trace back from time immemorial. For three generations, we have actively stewarded this lakeside sanctuary, opening the doors of our native home to offer an authentic, uncompromised gateway into the North." },
      { num: "02", title: "Built for the Wilderness", body: "We build with breathing timber. Our seasonal cabins are designed to sit quietly within the landscape rather than paving over it, blending rustic immersion with refined comfort so the ancient waters rightfully command the room." },
      { num: "03", title: "Sincere Northern Hospitality", body: "True comfort is rooted in genuine human connection. Our local team delivers the intuitive, warm-hearted hospitality of the Mongolian North, ensuring every need is met with natural grace and sincere care." },
      { num: "04", title: "Effortless Planning", body: "The journey to the edge of the taiga should feel as serene as the destination. From seamless reservations to secure local arrangements, we ensure the process of securing your retreat is swift and perfectly straightforward." },
      { num: "05", title: "Protectors of the Blue Pearl", body: "We actively defend the wilderness we call home. By formally pledging 10% of our annual net profits back into local development, we ensure your stay directly protects Khuvsgul\u2019s fragile ecosystem and empowers the Khatgal community." },
      { num: "06", title: "A Vibrant Summer Crossroads", body: "The northern summer is a brilliant, fleeting pulse of life. Dalai Eej serves as a welcoming crossroads where urban travelers, international explorers, and locals seamlessly mix\u2014sharing stories and drinks under the vast starlight in a vibrant celebration of the season." },
    ],
    accordionTitle: "Our Commitment",
    accordion: [
      { title: "Vision", body: "A world that universally recognizes and respects Khuvsgul Lake as an ecological masterpiece, and the absolute certainty that we exercised every possible measure to protect its ancient waters." },
      { title: "Mission", body: "To serve as the leading operational proponent of Khuvsgul\u2019s preservation. We convert travelers into lifelong champions of the region by introducing them to its primeval reality through transparent, sustainable hospitality." },
      { title: "Core Values", body: "Beauty: We honor the wild, untouched elegance of the Khuvsgul taiga. From the breathing timber of our seasonal cabins to our absolute protection of the pristine waters, we believe in preserving and reflecting the natural majesty of our home.\n\nFriendship: True luxury is genuine connection. We are more than a destination; we are a vibrant gathering place where urban travelers, global explorers, and locals share stories under the starlight, building bonds as enduring as the landscape itself.\n\nTruth: We reject pretense. Whether it is an honest, locally sourced taiga meal, the unscripted sincerity of our northern hospitality, or our transparent 10% pledge back into the community, we operate with absolute, unvarnished integrity." },
    ],
  },
  mn: {
    heroCaption: "\u042d\u0440\u0442\u043d\u0438\u0439 \u0446\u044d\u043d\u0433\u044d\u0433 \u043d\u0443\u0443\u0440\u044b\u043d \u044d\u0440\u044d\u0433 \u0434\u044d\u0445 \u043e\u043d\u0433\u043e\u043d \u0434\u0430\u0433\u0448\u0438\u043d \u0431\u0430\u0439\u0433\u0430\u043b\u044c\u0442\u0430\u0439 \u0442\u0430\u043d\u0438\u043b\u0446\u0430\u0445 \u043d\u044c.",
    storyHeading: "\u0420\u0430\u0448\u0430\u0430\u043d\u044b \u0434\u043e\u043c\u043e\u0433 \u0431\u0430 \u0431\u0438\u0434\u043d\u0438\u0439 \u0442\u04af\u04af\u0445",
    storyBody: "\u042d\u0440\u0442\u043d\u0438\u0439 \u0445\u043e\u0439\u043c\u043e\u0440 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0434\u043e\u043c\u043e\u0433\u0442 \u0442\u0430\u0439\u0433\u044b\u043d \u0431\u0443\u0433\u0430 \u0430\u044f\u043b\u0430\u0433\u0447\u0438\u0439\u0433 \u0441\u044d\u0442\u0433\u044d\u043b \u0441\u044d\u0440\u0433\u044d\u044d\u0436, \u0430\u043c\u044c \u043e\u0440\u0443\u0443\u043b\u0430\u0433\u0447 \u0448\u0438\u0434\u044d\u0442 \u0440\u0430\u0448\u0430\u0430\u043d \u0440\u0443\u0443 \u0445\u04e9\u0442\u04e9\u043b\u0434\u04e9\u0433 \u0442\u0443\u0445\u0430\u0439 \u04e9\u0433\u04af\u04af\u043b\u0434\u044d\u0433. \u201c\u0414\u0430\u043b\u0430\u0439 \u044d\u044d\u0436\u201d \u0440\u0435\u0441\u043e\u0440\u0442 \u0431\u043e\u043b \u0431\u0438\u0434\u043d\u0438\u0439 \u0445\u0443\u0432\u044c\u0434 \u0442\u044d\u0440\u0445\u04af\u04af \u0440\u0430\u0448\u0430\u0430\u043d \u044e\u043c. \u0411\u0438\u0434\u043d\u0438\u0439 \u0442\u04af\u04af\u0445 \u0431\u0438\u0437\u043d\u0435\u0441\u0438\u0439\u043d \u0442\u04e9\u043b\u04e9\u0432\u043b\u04e9\u0433\u04e9\u04e9\u043d\u04e9\u04e9\u0441 \u0431\u0443\u0441, \u0425\u04e9\u0432\u0441\u0433\u04e9\u043b \u0442\u0430\u0439\u0433\u044b\u043d \u0433\u04af\u043d\u044d\u044d\u0441 \u044d\u0445\u0442\u044d\u0439. \u0420\u0435\u043d\u0447\u0438\u043d\u043b\u0445\u04af\u043c\u0431\u044d \u043d\u0443\u0442\u0430\u0433\u0442\u0430\u0439 \u044d\u0440\u0442 \u0434\u044d\u044d\u0440 \u04af\u0435\u044d\u044d\u0441 \u0441\u0430\u043b\u0448\u0433\u04af\u0439 \u0445\u043e\u043b\u0431\u043e\u043e\u0442\u043e\u0439 \u0443\u0443\u0433\u0443\u0443\u043b \u0438\u0440\u0433\u044d\u0434\u0438\u0439\u043d \u0445\u0443\u0432\u044c\u0434 \u0431\u0438\u0434 \u043d\u0443\u0443\u0440\u044b\u0433 \u0437\u04af\u0433\u044d\u044d\u0440 \u043d\u044d\u0433 \u043e\u0447\u0438\u0445 \u0433\u0430\u0437\u0430\u0440 \u0431\u0438\u0448, \u0445\u0430\u0440\u0438\u043d \u0430\u043c\u044c\u0434\u0440\u0430\u043b\u044b\u0433 \u0442\u044d\u0442\u0433\u044d\u0433\u0447 \u0445\u04af\u0447 \u0445\u044d\u043c\u044d\u044d\u043d \u043e\u0439\u043b\u0433\u043e\u0436 \u0438\u0440\u0441\u044d\u043d. \u0425\u0430\u0439\u0447\u0438\u0439\u043d \u0430\u043c\u043d\u044b \u043d\u0430\u043c \u0433\u04af\u043c\u0434 \u043e\u0440\u0448\u0438\u0445 \u0442\u04af\u04af\u0445\u0442 \u043f\u0438\u043e\u043d\u0435\u0440\u0438\u0439\u043d \u0437\u0443\u0441\u043b\u0430\u043d\u0433 \u0430\u043c\u0430\u0440 \u0430\u043c\u0433\u0430\u043b\u0430\u043d\u0433\u0438\u0439\u043d \u04e9\u0440\u0433\u04e9\u04e9 \u0431\u043e\u043b\u0433\u043e\u043d \u0442\u043e\u0445\u0438\u0436\u0443\u0443\u043b\u0430\u0445\u0434\u0430\u0430 \u0431\u0438\u0434 \u0437\u04e9\u0432\u0445\u04e9\u043d \u0431\u0430\u0439\u0448\u0438\u043d \u0431\u0430\u0440\u0438\u0430\u0433\u04af\u0439, \u0442\u04e9\u0440\u04e9\u043b\u0445 \u043d\u0443\u0442\u0433\u0430\u0430 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0445 \u0442\u043e\u0433\u0442\u043e\u043b\u0446\u043e\u043e\u0433 \u0431\u04af\u0440\u0434\u04af\u04af\u043b\u0441\u044d\u043d \u044e\u043c. \u0422\u0430 \u043c\u0430\u043d\u0430\u0439 \u043c\u043e\u0434\u043e\u043d \u0431\u04af\u0445\u044d\u044d\u0433\u0442 \u0442\u0443\u0445\u043b\u0430\u0445\u0434\u0430\u0430, \u044d\u0441\u0432\u044d\u043b \u043e\u0434\u0434\u044b\u043d \u0434\u043e\u0440 \u0434\u043e\u043c\u0433\u0438\u0439\u043d \u0436\u0438\u043c\u044d\u044d\u0440 \u0430\u043b\u0445\u0430\u0445\u0434\u0430\u0430 \u0431\u0430\u0439\u0433\u0430\u043b\u044c \u044d\u0445\u044d\u044d \u0434\u044d\u044d\u0434\u043b\u044d\u043d \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0436, \u0445\u043e\u0439\u0434 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0430\u0440\u0438\u0443\u043d \u0434\u0430\u0433\u0448\u0438\u043d \u044d\u0440\u0447\u0438\u043c\u0442\u044d\u0439 \u043d\u044d\u0433\u0434\u044d\u0445 \u0431\u0438\u0434\u043d\u0438\u0439 \u0430\u043c\u044c\u0434\u0440\u0430\u043b\u044b\u043d \u044d\u0440\u0445\u044d\u043c \u0437\u043e\u0440\u0438\u043b\u0433\u044b\u043d \u043d\u044d\u0433 \u0445\u044d\u0441\u044d\u0433 \u0431\u043e\u043b\u043e\u0445 \u0431\u043e\u043b\u043d\u043e.",
    pillarsTitle: "\u0417\u0443\u0440\u0433\u0430\u0430\u043d \u0442\u0443\u043b\u0433\u0443\u0443\u0440",
    pillars: [
      { num: "01", title: "\u0422\u0430\u0439\u0433\u044b\u043d \u04e9\u0432 \u0443\u043b\u0430\u043c\u0436\u043b\u0430\u043b", body: "\u041c\u0430\u043d\u0430\u0439 \u0433\u044d\u0440 \u0431\u04af\u043b\u0438\u0439\u043d \u0443\u0443\u0433\u0443\u0443\u043b \u04af\u043d\u0434\u044d\u0441 \u0425\u04e9\u0432\u0441\u0433\u04e9\u043b \u0442\u0430\u0439\u0433\u0430\u0442\u0430\u0439 \u044d\u0440\u0442 \u0434\u044d\u044d\u0440 \u04af\u0435\u044d\u044d\u0441 \u0441\u0430\u043b\u0448\u0433\u04af\u0439 \u0445\u043e\u043b\u0431\u043e\u043e\u0442\u043e\u0439. \u0411\u0438\u0434 \u0433\u0443\u0440\u0432\u0430\u043d \u04af\u0435\u0438\u0439\u043d \u0442\u0443\u0440\u0448 \u044d\u043d\u044d\u0445\u04af\u04af \u04e9\u0440\u0433\u04e9\u04e9\u0433\u04e9\u04e9 \u044d\u0440\u0445\u043b\u044d\u043d \u044f\u0432\u0443\u0443\u043b\u0436, \u0445\u043e\u0439\u043c\u043e\u0440 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0436\u0438\u043d\u0445\u044d\u043d\u044d \u0434\u04af\u0440 \u0442\u04e9\u0440\u0445\u0438\u0439\u0433 \u0445\u0443\u0432\u0430\u0430\u043b\u0446\u0430\u0445\u0430\u0430\u0440 \u0442\u04e9\u0440\u04e9\u043b\u0445 \u043d\u0443\u0442\u0433\u0438\u0439\u043d\u0445\u0430\u0430 \u04af\u04af\u0434 \u0445\u0430\u0430\u043b\u0433\u044b\u0433 \u043d\u044d\u044d\u0436 \u0431\u0430\u0439\u043d\u0430." },
      { num: "02", title: "\u0411\u0430\u0439\u0433\u0430\u043b\u044c\u0434 \u0443\u0443\u0441\u0441\u0430\u043d \u0445\u0438\u0439\u0446", body: "\u0411\u0438\u0434 \u201c\u0430\u043c\u044c\u0441\u0433\u0430\u043b\u0434\u0430\u0433\u201d \u043c\u043e\u0434\u043e\u043d \u0445\u0438\u0439\u0446\u0438\u0439\u0433 \u0447\u0443\u0445\u0430\u043b\u0447\u0438\u043b\u0434\u0430\u0433. \u041c\u0430\u043d\u0430\u0439 \u0431\u04af\u0445\u044d\u044d\u0433\u04af\u04af\u0434 \u0431\u0430\u0439\u0433\u0430\u043b\u0438\u0439\u0433 \u0441\u04e9\u0440\u0436 \u0431\u0438\u0448, \u0443\u0443\u0441\u0430\u043d \u043d\u044d\u0433\u0434\u044d\u0445\u044d\u044d\u0440 \u0431\u04af\u0442\u044d\u044d\u0433\u0434\u0441\u044d\u043d \u0431\u04e9\u0433\u04e9\u04e9\u0434 \u044d\u0440\u0442\u043d\u0438\u0439 \u043d\u0443\u0443\u0440\u044b\u043d \u0441\u04af\u0440 \u0445\u04af\u0447\u0438\u0439\u0433 \u043c\u044d\u0434\u0440\u04af\u04af\u043b\u044d\u0445\u0438\u0439\u043d \u0437\u044d\u0440\u044d\u0433\u0446\u044d\u044d \u0446\u044d\u0432\u044d\u0440 \u0446\u044d\u043c\u0446\u0433\u044d\u0440, \u0442\u0430\u0432 \u0442\u0443\u0445\u0442\u0430\u0439 \u043e\u0440\u0447\u043d\u044b\u0433 \u0442\u04e9\u0433\u0441 \u0445\u043e\u0441\u043b\u0443\u0443\u043b\u0436 \u0447\u0430\u0434\u0441\u0430\u043d." },
      { num: "03", title: "\u0425\u043e\u0439\u043c\u043e\u0440 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0447\u0438\u043d \u0441\u044d\u0442\u0433\u044d\u043b", body: "\u0416\u0438\u043d\u0445\u044d\u043d\u044d \u0442\u0430\u0432 \u0442\u0443\u0445 \u0431\u043e\u043b \u0445\u04af\u043d \u0445\u043e\u043e\u0440\u043e\u043d\u0434\u044b\u043d \u0447\u0438\u043d \u0441\u044d\u0442\u0433\u044d\u043b\u0438\u0439\u043d \u0445\u043e\u043b\u0431\u043e\u043e \u044e\u043c. \u041c\u0430\u043d\u0430\u0439 \u043e\u0440\u043e\u043d \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0445\u0430\u043c\u0442 \u043e\u043b\u043e\u043d \u0445\u043e\u0439\u043c\u043e\u0440 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0446\u0430\u0439\u043b\u0433\u0430\u043d, \u043d\u0430\u0439\u0440\u0441\u0430\u0433 \u0437\u0430\u043d\u0433\u0430\u0430\u0440 \u0442\u0430\u043d\u044b \u0445\u044d\u0440\u044d\u0433\u0446\u044d\u044d\u0433 \u0443\u0440\u044c\u0434\u0447\u0438\u043b\u0430\u043d \u043c\u044d\u0434\u044d\u0440\u0447, \u0431\u0430\u0439\u0433\u0430\u043b\u0438\u0439\u043d \u0443\u043d\u0430\u0433\u0430\u043d \u0442\u04e9\u0440\u0445\u04e9\u04e9\u0440\u04e9\u04e9, \u0447\u0438\u043d \u0441\u044d\u0442\u0433\u044d\u043b\u044d\u044d\u0441\u044d\u044d \u04af\u0439\u043b\u0447\u0438\u043b\u043d\u044d." },
      { num: "04", title: "\u0425\u044f\u043b\u0431\u0430\u0440, \u0443\u044f\u043d \u0445\u0430\u0442\u0430\u043d \u0442\u04e9\u043b\u04e9\u0432\u043b\u04e9\u043b\u0442", body: "\u0410\u043b\u0441 \u0445\u043e\u043b\u044b\u043d \u0442\u0430\u0439\u0433\u0430 \u0440\u0443\u0443 \u0445\u0438\u0439\u0445 \u0430\u044f\u043b\u0430\u043b \u0442\u0430\u043d\u044c \u043e\u0447\u0438\u0445 \u0433\u0430\u0437\u0430\u0440 \u0448\u0438\u0433\u044d\u044d \u0430\u043c\u0430\u0440 \u0430\u043c\u0433\u0430\u043b\u0430\u043d \u0431\u0430\u0439\u0445 \u0451\u0441\u0433\u04af\u0439. \u0417\u0430\u0445\u0438\u0430\u043b\u0433\u0430 \u04e9\u0433\u04e9\u0445\u04e9\u04e9\u0441 \u044d\u0445\u043b\u044d\u044d\u0434 \u0442\u04e9\u043b\u0431\u04e9\u0440 \u0442\u043e\u043e\u0446\u043e\u043e \u0445\u0438\u0439\u0445 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0431\u04af\u0445\u0438\u0439 \u043b \u04af\u0439\u043b \u044f\u0432\u0446\u044b\u0433 \u0431\u0438\u0434 \u0445\u0443\u0440\u0434\u0430\u043d, \u043d\u0430\u0439\u0434\u0432\u0430\u0440\u0442\u0430\u0439, \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u0445\u044f\u043b\u0431\u0430\u0440 \u0431\u0430\u0439\u0434\u043b\u0430\u0430\u0440 \u0448\u0438\u0439\u0434\u0441\u044d\u043d." },
      { num: "05", title: "\u0425\u04e9\u0445 \u0441\u0443\u0432\u0434\u044b\u043d \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0433\u0447\u0438\u0434", body: "\u0411\u0438\u0434 \u0442\u04e9\u0440\u04e9\u043b\u0445 \u0443\u0443\u0433\u0443\u0443\u043b \u0431\u0430\u0439\u0433\u0430\u043b\u0438\u0430 \u0442\u0443\u0443\u0448\u0442\u0430\u0439 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0434\u0430\u0433. \u041a\u043e\u043c\u043f\u0430\u043d\u0438\u0439\u043d \u0446\u044d\u0432\u044d\u0440 \u0430\u0448\u0433\u0438\u0439\u043d\u0445\u0430\u0430 10 \u0445\u0443\u0432\u0438\u0439\u0433 \u043e\u0440\u043e\u043d \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0445\u04e9\u0433\u0436\u0438\u043b\u0434 \u0437\u043e\u0440\u0438\u0443\u043b\u0430\u043d \u0430\u043b\u0431\u0430\u043d \u0451\u0441\u043e\u043e\u0440 \u0437\u0430\u0440\u0446\u0443\u0443\u043b\u0441\u043d\u0430\u0430\u0440 \u0442\u0430\u043d\u044b \u0430\u043c\u0440\u0430\u043b\u0442 \u0425\u04e9\u0432\u0441\u0433\u04e9\u043b\u0438\u0439\u043d \u044d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u0438\u0439\u0433 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0436, \u0425\u0430\u0442\u0433\u0430\u043b \u0442\u043e\u0441\u0433\u043e\u043d\u044b \u0438\u0440\u0433\u044d\u0434\u044d\u0434 \u0431\u043e\u0434\u0438\u0442 \u04af\u0440 \u04e9\u0433\u04e9\u04e9\u0436 \u04e9\u0433\u04e9\u0445 \u0431\u043e\u043b\u043d\u043e." },
      { num: "06", title: "\u0417\u0443\u043d\u044b \u044d\u0440\u0447 \u0445\u04af\u0447, \u0430\u043c\u044c\u0434 \u0445\u0430\u0440\u0438\u043b\u0446\u0430\u0430", body: "\u0425\u043e\u0439\u0434 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0437\u0443\u043d \u0431\u043e\u043b \u0430\u043c\u044c\u0434\u0440\u0430\u043b\u044b\u043d \u0431\u0430\u044f\u0440 \u0431\u0430\u044f\u0441\u0433\u0430\u043b\u0430\u043d, \u0446\u043e\u0433\u043b\u043e\u0433 \u0445\u044d\u043c\u043d\u044d\u043b\u044d\u044d\u0440 \u0434\u04af\u04af\u0440\u044d\u043d \u0431\u0430\u0439\u0434\u0430\u0433. \u201c\u0414\u0430\u043b\u0430\u0439 \u044d\u044d\u0436\u201d \u0431\u043e\u043b \u0423\u043b\u0430\u0430\u043d\u0431\u0430\u0430\u0442\u0430\u0440 \u0445\u043e\u0442\u043e\u043e\u0441 \u0437\u043e\u0440\u0438\u043d \u0438\u0440\u044d\u0433\u0441\u044d\u0434, \u043e\u043b\u043e\u043d \u0443\u043b\u0441\u044b\u043d \u0430\u044f\u043b\u0430\u0433\u0447\u0438\u0434 \u0431\u043e\u043b\u043e\u043d \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0438\u0440\u0433\u044d\u0434 \u043d\u044d\u0433\u0434\u044d\u043d \u0447\u0443\u0443\u043b\u0436, \u043e\u0434\u0434\u044b\u043d \u0434\u043e\u0440 \u0442\u04af\u04af\u0445\u044d\u044d \u0445\u0443\u0432\u0430\u0430\u043b\u0446\u0430\u043d, \u0437\u0443\u043d\u044b \u0446\u0430\u0433\u0438\u0439\u0433 \u0445\u0430\u043c\u0442\u0434\u0430\u0430 \u0442\u044d\u043c\u0434\u044d\u0433\u043b\u044d\u0434\u044d\u0433 \u0430\u043c\u044c\u0434 \u0445\u0430\u0440\u0438\u043b\u0446\u0430\u0430\u043d\u044b \u0443\u0443\u043b\u0437\u0432\u0430\u0440 \u044e\u043c." },
    ],
    accordionTitle: "\u0411\u0438\u0434\u043d\u0438\u0439 \u0430\u043c\u043b\u0430\u043b\u0442",
    accordion: [
      { title: "\u0410\u043b\u0441\u044b\u043d \u0445\u0430\u0440\u0430\u0430", body: "\u0414\u044d\u043b\u0445\u0438\u0439 \u043d\u0438\u0439\u0442\u044d\u044d\u0440\u044d\u044d \u0425\u04e9\u0432\u0441\u0433\u04e9\u043b \u043d\u0443\u0443\u0440\u044b\u0433 \u044d\u043a\u043e\u043b\u043e\u0433\u0438\u0439\u043d \u04af\u043d\u044d\u043b\u0436 \u0431\u0430\u0440\u0448\u0433\u04af\u0439 \u04e9\u0432 \u0445\u044d\u043c\u044d\u044d\u043d \u0445\u04af\u043b\u044d\u044d\u043d \u0437\u04e9\u0432\u0448\u04e9\u04e9\u0440\u0447, \u0445\u04af\u043d\u0434\u044d\u0442\u0433\u044d\u0434\u044d\u0433 \u0431\u043e\u043b\u043e\u0445. \u042d\u043d\u044d\u0445\u04af\u04af \u044d\u0440\u0442\u043d\u0438\u0439 \u0446\u044d\u043d\u0433\u044d\u0433 \u043d\u0443\u0443\u0440\u044b\u0433 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0445\u044b\u043d \u0442\u0443\u043b\u0434 \u0431\u0438\u0434 \u04e9\u04e9\u0440\u0441\u0434\u04e9\u04e9\u0441 \u0448\u0430\u043b\u0442\u0433\u0430\u0430\u043b\u0430\u0445 \u0431\u04af\u0445\u043d\u0438\u0439\u0433 \u0431\u04af\u0440\u044d\u043d \u0434\u04af\u04af\u0440\u044d\u043d \u0445\u0438\u0439\u0441\u044d\u043d \u0431\u0430\u0439\u0445 \u043d\u044c \u0431\u0438\u0434\u043d\u0438\u0439 \u0430\u043b\u0441\u044b\u043d \u0445\u0430\u0440\u0430\u0430 \u044e\u043c." },
      { title: "\u042d\u0440\u0445\u044d\u043c \u0437\u043e\u0440\u0438\u043b\u0433\u043e", body: "\u0425\u04e9\u0432\u0441\u0433\u04e9\u043b \u043d\u0443\u0443\u0440\u044b\u0433 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0445 \u04af\u0439\u043b\u0441\u0438\u0439\u043d \u043c\u0430\u043d\u043b\u0430\u0439\u043b\u0430\u0433\u0447 \u0431\u0430\u0439\u0445. \u0417\u043e\u0447\u0438\u0434\u0434\u043e\u043e \u0443\u043d\u0430\u0433\u0430\u043d \u0442\u0430\u0439\u0433\u044b\u043d \u04af\u043d\u044d\u043d\u0438\u0439\u0433 \u0442\u043e\u0433\u0442\u0432\u043e\u0440\u0442\u043e\u0439, \u0438\u043b \u0442\u043e\u0434 \u0437\u043e\u0447\u043b\u043e\u043c\u0442\u0433\u043e\u0439 \u04af\u0439\u043b\u0447\u0438\u043b\u0433\u044d\u044d\u0433\u044d\u044d\u0440 \u0434\u0430\u043c\u0436\u0443\u0443\u043b\u0430\u043d \u043c\u044d\u0434\u0440\u04af\u04af\u043b\u0436, \u0442\u044d\u0434\u043d\u0438\u0439\u0433 \u044d\u043d\u044d \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u04af\u043d\u044d\u043d\u0447 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0433\u0447 \u0431\u043e\u043b\u0433\u043e\u043d \u0445\u0443\u0432\u0438\u0440\u0433\u0430\u0445 \u043d\u044c \u0431\u0438\u0434\u043d\u0438\u0439 \u044d\u0440\u0445\u044d\u043c \u0437\u043e\u0440\u0438\u043b\u0433\u043e \u044e\u043c." },
      { title: "\u04ae\u043d\u0434\u0441\u044d\u043d \u04af\u043d\u044d\u0442 \u0437\u04af\u0439\u043b\u0441", body: "\u0413\u043e\u043e \u0437\u04af\u0439: \u0411\u0438\u0434 \u0425\u04e9\u0432\u0441\u0433\u04e9\u043b \u0442\u0430\u0439\u0433\u044b\u043d \u043e\u043d\u0433\u043e\u043d \u0434\u0430\u0433\u0448\u0438\u043d, \u0437\u044d\u0440\u043b\u044d\u0433 \u0433\u043e\u043e \u04af\u0437\u044d\u0441\u0433\u044d\u043b\u044d\u043d\u0433 \u0434\u044d\u044d\u0434\u044d\u043b\u0434\u044d\u0433. \u201c\u0410\u043c\u044c\u0441\u0433\u0430\u043b\u0434\u0430\u0433\u201d \u043c\u043e\u0434\u043e\u043d \u0431\u04af\u0445\u044d\u044d\u0433\u04af\u04af\u0434\u044d\u044d\u0441 \u044d\u0445\u043b\u044d\u044d\u0434 \u044d\u0440\u0442\u043d\u0438\u0439 \u0446\u044d\u043d\u0433\u044d\u0433 \u043d\u0443\u0443\u0440\u0430\u0430 \u0445\u0430\u043c\u0433\u0430\u0430\u043b\u0430\u0445 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0431\u04af\u0445\u0438\u0439 \u043b \u04af\u0439\u043b \u0445\u044d\u0440\u044d\u0433\u0442\u044d\u044d \u0431\u0438\u0434 \u0443\u0443\u0433\u0443\u0443\u043b \u043d\u0443\u0442\u0433\u0438\u0439\u043d\u0445\u0430\u0430 \u0441\u04af\u0440 \u0445\u04af\u0447, \u0431\u0430\u0439\u0433\u0430\u043b\u0438\u0439\u043d \u0433\u043e\u043e \u0441\u0430\u0439\u0445\u043d\u044b\u0433 \u0445\u0430\u0434\u0433\u0430\u043b\u0430\u043d \u04af\u043b\u0434\u044d\u044d\u0445\u0438\u0439\u0433 \u044d\u0440\u0445\u044d\u043c\u043b\u044d\u043d\u044d.\n\n\u041d\u04e9\u0445\u04e9\u0440\u043b\u04e9\u043b: \u0416\u0438\u043d\u0445\u044d\u043d\u044d \u0442\u0430\u043d\u0441\u0430\u0433 \u0431\u0430\u0439\u0434\u0430\u043b \u0431\u043e\u043b \u0445\u04af\u043d \u0445\u043e\u043e\u0440\u043e\u043d\u0434\u044b\u043d \u0447\u0438\u043d \u0441\u044d\u0442\u0433\u044d\u043b\u0438\u0439\u043d \u0445\u043e\u043b\u0431\u043e\u043e \u044e\u043c. \u0411\u0438\u0434 \u0437\u04af\u0433\u044d\u044d\u0440 \u043d\u044d\u0433 \u0430\u043c\u0440\u0430\u043b\u0442\u044b\u043d \u0433\u0430\u0437\u0430\u0440 \u0431\u0438\u0448, \u0445\u043e\u0442\u043e\u043e\u0441 \u0437\u043e\u0440\u0438\u043d \u0438\u0440\u044d\u0433\u0441\u044d\u0434, \u0434\u044d\u043b\u0445\u0438\u0439\u043d \u0430\u044f\u043b\u0430\u0433\u0447\u0438\u0434 \u0431\u043e\u043b\u043e\u043d \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0438\u0440\u0433\u044d\u0434 \u043e\u0434\u0434\u044b\u043d \u0434\u043e\u0440 \u0442\u04af\u04af\u0445\u044d\u044d \u0445\u0443\u0432\u0430\u0430\u043b\u0446\u0430\u0436, \u0431\u0430\u0439\u0433\u0430\u043b\u044c \u044d\u0445 \u0448\u0438\u0433\u044d\u044d \u0431\u0430\u0442 \u0431\u04e9\u0445 \u043d\u04e9\u0445\u04e9\u0440\u043b\u04e9\u043b\u0438\u0439\u0433 \u0431\u04af\u0442\u044d\u044d\u0434\u044d\u0433 \u0445\u0430\u043b\u0443\u0443\u043d \u0434\u0443\u043b\u0430\u0430\u043d \u0433\u043e\u043b\u043e\u043c\u0442 \u0431\u0438\u043b\u044d\u044d.\n\n\u04ae\u043d\u044d\u043d \u043c\u04e9\u043d \u0447\u0430\u043d\u0430\u0440: \u0411\u0438\u0434 \u0445\u0443\u0443\u0440\u0430\u043c\u0447, \u0434\u04af\u0440 \u044d\u0441\u0433\u044d\u0441\u044d\u043d \u0431\u04af\u0445\u043d\u044d\u044d\u0441 \u0442\u0430\u0442\u0433\u0430\u043b\u0437\u0434\u0430\u0433. \u041d\u0443\u0442\u0433\u0438\u0439\u043d \u043c\u0430\u043b\u0447\u0434\u044b\u043d \u0431\u044d\u043b\u0442\u0433\u044d\u0441\u044d\u043d \u0446\u044d\u0432\u044d\u0440, \u0448\u0443\u0434\u0430\u0440\u0433\u0430 \u0437\u043e\u043e\u0433, \u0445\u043e\u0439\u043c\u043e\u0440 \u043d\u0443\u0442\u0433\u0438\u0439\u043d \u0446\u0430\u0439\u043b\u0433\u0430\u043d \u0437\u043e\u0447\u043b\u043e\u043c\u0442\u0433\u043e\u0439 \u0437\u0430\u043d, \u044d\u0441\u0432\u044d\u043b \u043e\u0440\u043e\u043d \u043d\u0443\u0442\u0430\u0433\u0442\u0430\u0430 \u0437\u043e\u0440\u0438\u0443\u043b\u0434\u0430\u0433 \u0431\u0438\u0434\u043d\u0438\u0439 \u0438\u043b \u0442\u043e\u0434 10 \u0445\u0443\u0432\u0438\u0439\u043d \u0430\u043c\u043b\u0430\u043b\u0442 \u0433\u044d\u044d\u0434 \u0431\u04af\u0445 \u0437\u04af\u0439\u043b \u0434\u044d\u044d\u0440 \u0431\u0438\u0434 \u0437\u04e9\u0432\u0445\u04e9\u043d \u04af\u043d\u044d\u043d \u043c\u04e9\u043d \u0447\u0430\u043d\u0430\u0440, \u0446\u044d\u0432\u044d\u0440 \u0445\u04af\u043d \u0447\u0430\u043d\u0430\u0440\u044b\u0433 \u0431\u0430\u0440\u0438\u043c\u0442\u0430\u043b\u0436 \u0430\u0436\u0438\u043b\u043b\u0430\u0434\u0430\u0433." },
    ],
  },
};

const scrapbookImages = [
  { src: "/images/about-scrapbook-deer.png", alt: "Khuvsgul Lake", rotate: "rotate-2", size: "w-64 h-80" },
  { src: "/images/about-scrapbook-lake.png", alt: "Wooden cabin", rotate: "-rotate-3", size: "w-56 h-72" },
  { src: "/images/about-scrapbook-founder.jpg", alt: "Forest path", rotate: "rotate-1", size: "w-52 h-64" },
];

function AccordionItem({ title, body, isOpen, onToggle }: { title: string; body: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-ink/15">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
      >
        <h3 className="font-heading text-xl md:text-2xl text-ink group-hover:text-leaf transition-colors">
          {title}
        </h3>
        <span className="flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-ink/20">
          {isOpen ? <Minus className="w-4 h-4 text-ink" /> : <Plus className="w-4 h-4 text-ink" />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-8 pr-12">
          {body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="font-editorial text-base md:text-lg leading-relaxed text-ink/80 mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutUsPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = isMn ? content.mn : content.en;
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <main id="main-content" className="bg-main text-ink min-h-screen" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")" }}>

      <section className="pt-28 md:pt-36 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="sr-only">{isMn ? 'Бидний тухай' : 'Our Story'}</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-sm border border-ink/10 shadow-lg">
              <img
                src="/images/about-hero.webp"
                alt="Illustrated map of Khuvsgul region"
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/60 to-transparent" />
            </div>
            <p className="text-center mt-6 font-editorial text-sm md:text-base italic text-ink/60 tracking-wide">
              {t.heroCaption}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-script text-5xl md:text-7xl text-ink mb-8 md:mb-12 leading-tight">
                {t.storyHeading}
              </h2>
              <p className="font-editorial text-base md:text-lg leading-[1.9] text-ink/85">
                {t.storyBody}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] md:h-[550px] hidden lg:block"
            >
              {scrapbookImages.map((img, i) => (
                <div
                  key={i}
                  className={`absolute ${img.rotate} ${img.size} shadow-xl border-[3px] border-white overflow-hidden transition-transform duration-500 hover:scale-105 hover:z-20`}
                  style={{
                    top: i === 0 ? "0" : i === 1 ? "60px" : "180px",
                    left: i === 0 ? "10%" : i === 1 ? "45%" : "5%",
                    zIndex: i === 1 ? 10 : i === 2 ? 5 : 1,
                  }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>

            <div className="lg:hidden grid grid-cols-2 gap-4 mt-4">
              {scrapbookImages.slice(0, 2).map((img, i) => (
                <div key={i} className={`${img.rotate} shadow-xl border-[3px] border-white overflow-hidden`}>
                  <img src={img.src} alt={img.alt} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <div className="flex items-center gap-6 mb-2">
              <div className="h-px flex-1 bg-ink/15" />
              <h2 className="font-heading text-3xl md:text-4xl text-ink tracking-wide">
                {t.pillarsTitle}
              </h2>
              <div className="h-px flex-1 bg-ink/15" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 md:gap-y-16">
            {t.pillars.map((pillar, i) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="font-heading text-5xl md:text-6xl text-ink/10 block mb-2">
                  {pillar.num}
                </span>
                <h3 className="font-heading text-xl md:text-2xl text-ink mb-4">
                  {pillar.title}
                </h3>
                <p className="font-editorial text-base leading-[1.8] text-ink/75">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-6 mb-2">
              <div className="h-px flex-1 bg-ink/15" />
              <h2 className="font-heading text-3xl md:text-4xl text-ink tracking-wide">
                {t.accordionTitle}
              </h2>
              <div className="h-px flex-1 bg-ink/15" />
            </div>
          </motion.div>

          <div className="border-t border-ink/15">
            {t.accordion.map((item, i) => (
              <AccordionItem
                key={i}
                title={item.title}
                body={item.body}
                isOpen={openAccordion === i}
                onToggle={() => setOpenAccordion(openAccordion === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="pb-20" />
    </main>
  );
}
