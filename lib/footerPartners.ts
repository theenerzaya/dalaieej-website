export type FooterPartner = {
  id: string;
  src: string;
  alt: string;
  /** When null, logo is decorative / placeholder (no link). */
  href: string | null;
  ariaLabel?: string;
};

const HA_TRAVEL_URL =
  "https://hatravel.jp/【2026年6月1日8月30日-】フブスグル湖・大自然の癒やし/";

const TELEGRAPH_URL =
  "https://www.telegraph.co.uk/travel/destinations/asia/mongolia/beginners-guide-mongolia/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASIrptleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeEX9tXhL1OaGEKKYVM9yZ8QQWSBGrksXsWj03g8sWgq5NNVMdiP6E46zhh6A_aem_rlItc5q_F7yGawnASnwdkg";

export const FOOTER_PARTNERS: FooterPartner[] = [
  {
    id: "bradt",
    src: "/images/footer/partners/bradt-light.webp",
    alt: "Bradt Travel Guides",
    href: null,
  },
  {
    id: "ha-travel",
    src: "/images/footer/partners/ha-travel-light.webp",
    alt: "H&A Travel",
    href: HA_TRAVEL_URL,
    ariaLabel: "H&A Travel — Khövsgöl tour (opens in new tab)",
  },
  {
    id: "telegraph",
    src: "/images/footer/partners/telegraph-light.webp",
    alt: "The Telegraph",
    href: TELEGRAPH_URL,
    ariaLabel: "The Telegraph — Mongolia travel guide (opens in new tab)",
  },
];
