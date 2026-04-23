"use client";

import { useLayoutEffect } from "react";
import { assetUrl } from "@/lib/assetUrl";

const BG_KEYS = [
  "backgroundColor",
  "backgroundImage",
  "backgroundRepeat",
  "backgroundSize",
  "backgroundBlendMode",
] as const;

const PAPER: Record<(typeof BG_KEYS)[number], string> = {
  backgroundColor: "#ffffff",
  backgroundImage: `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "720px 720px",
  backgroundBlendMode: "multiply",
};

function cssPropName(camel: (typeof BG_KEYS)[number]): string {
  return camel.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

/**
 * Mobile Safari/Chrome paint the status-bar strip and overscroll from html/body.
 * Match the about-us main + navbar paper treatment so the top of the screen is not flat white.
 */
export default function AboutUsDocumentPaper() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const snapshot: { el: HTMLElement; name: string; val: string }[] = [];
    for (const el of [root, body]) {
      for (const key of BG_KEYS) {
        const name = cssPropName(key);
        snapshot.push({
          el,
          name,
          val: el.style.getPropertyValue(name),
        });
        el.style.setProperty(name, PAPER[key]);
      }
    }
    return () => {
      for (const { el, name, val } of snapshot) {
        if (val === "") {
          el.style.removeProperty(name);
        } else {
          el.style.setProperty(name, val);
        }
      }
    };
  }, []);

  return null;
}
