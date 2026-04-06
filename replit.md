# Dalai Eej Resort - Luxury Hotel Landing Page

## Overview
This project is a luxury hotel landing page for the Dalai Eej Resort, built with Next.js 16 (App Router). The site aims to deliver a high-end user experience reflecting the resort's heritage luxury brand. Key capabilities include multi-language support (English and Mongolian), a comprehensive multi-room booking system integrated with Cloudbeds, and a split payment gateway supporting both international (Stripe) and Mongolian domestic (QPay) transactions. The design emphasizes a "Luxury Editorial" aesthetic, featuring visual navigation, interactive elements, and detailed content pages for various resort offerings.

## User Preferences
- Flat file structure (no src/ folder)
- Next.js App Router
- Tailwind CSS for styling
- Framer Motion for animations
- No hamburger menu - all navigation links must be visible text
- Luxury resort aesthetic - whitespace, serif fonts, high-quality images

## System Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Fonts**: Playfair Display (headings), Lato (body), Pinyon Script (editorial script), Merriweather (editorial body)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **i18n**: next-intl for English/Mongolian support

### UI/UX and Design Decisions
- **Design System — Nature-Inspired Semantic Tokens (in `app/globals.css`)**: All colors use semantic Tailwind tokens — no arbitrary hex values in components.
  - **Backgrounds**: `main` (#FFFFFF, body), `surface` (#F7FAFC, cards/sections), `surface-alt` (#ECF5FB, booking accents), `muted` (#E5E8EB, borders/dividers)
  - **Text**: `ink` (#0D0F1C, primary text & dark backgrounds), `ink-secondary` (#131D2F, subtle dark)
  - **Accents**: `leaf` (#58725E, accent green for buttons/dark sections), `bark` (#95794E, warm gold), `earth` (#A65C3A, terracotta), `sun` (#96964E, olive gold)
  - **Water**: `water` (#419CDB, links/highlights), `water-deep` (#0F6AA9, strong blue CTA)
  - **IMPORTANT**: Tailwind v4 source scanning uses `@import "tailwindcss" source(none)` with explicit `@source` directives for `app/` and `messages/` only — NEVER revert to `@source "!../.local/**"` (it resolves to wrong path and crashes Tailwind)
- **Navigation**: Simplified Navbar with hover dropdowns and a full-screen curtain navigation overlay. All navigation links are visible as text, with horizontal scrolling on mobile.
- **Homepage Structure ("Luxury Editorial")**: Features a full-screen video hero, an editorial intro, a 4-quadrant `SiloGrid` (stacks on mobile), offers carousel, tabbed journey experiences, and an interactive resort map.
- **Gallery**: Masonry grid with category filtering.
- **Booking Flow**: Multi-room booking with a cart model, capacity validation, automatic guest distribution, and a three-step checkout process (guest info + add-ons → payment → confirmation). Uses brand palette throughout: `ink` (dark navy) backgrounds for search/payment sections, `bark` (warm gold) for all CTA buttons, `ink` for card text. No green (`leaf`) in the booking flow.
- **Payment UI**: Auto-generates QR/payment options on page load without manual button clicks in the checkout flow. Dark navy (`bg-ink`) backgrounds with warm gold (`bg-bark`) CTAs. Stripe theme uses `#95794E` (bark) as primary color.
- **Confirmation Page** (`/[locale]/booking/confirmation`): Unified post-payment landing page. Uses `bg-ink` with gradient overlay. Gold checkmark icon and bark-colored CTA. Handles both the custom Next.js checkout flow (redirected from payment page with `bookingId`, `guestName`, `nights`, `amount` params) and Cloudbeds-native booking engine redirects (with `reservation_id` param). Confirms reservation in Cloudbeds for Stripe payments. Displays booking reference, guest summary, and "What to Expect" section. Fully localized in EN and MN. URL for Cloudbeds "Redirect on confirmation page" setting: `/en/booking/confirmation`.
- **SEO**: JSON-LD Schema markup (type: Resort) in the root layout.

### Key Features
1.  **Video Hero**: Full-screen video/image background with title and scroll indicator.
2.  **Discover Grid**: 4 large visual navigation cards with hover effects.
3.  **Special Offers Carousel**: Locale-specific display (Mongolian locale only) with promo codes.
4.  **Interactive Map**: Resort map with clickable hotspots.
5.  **Multi-Room Booking**: Allows searching by date/guests, adding multiple rooms to a cart, and detailed checkout. Sends room breakdown with per-room pricing to Cloudbeds.
6.  **Split Payment Strategy**:
    *   Mongolian locale (`mn`): QPay QR code generation.
    *   English locale (`en`): Stripe PaymentElement for international cards (MNT to EUR conversion at 1:3700).

## External Dependencies

-   **Cloudbeds API**: For room availability, add-ons, reservation creation, and confirmation.
    *   `GET /api/cloudbeds/availability`
    *   `GET /api/cloudbeds/addons`
    *   `POST /api/cloudbeds/reservation`
    *   `POST /api/cloudbeds/confirm-reservation` — Updates reservation status to "confirmed" after payment
-   **QPay API**: For creating payment invoices and verifying Mongolian domestic payments.
    *   `POST /api/qpay/create-invoice`
    *   `POST /api/qpay/check-payment` — Polls QPay for payment status with token caching
    *   `POST /api/qpay/webhook`
-   **Stripe API**: For processing international card payments.
    *   `POST /api/stripe/payment-intent`
-   **OpenWeatherMap API**: For displaying weather information for Khuvsgul Lake.
    *   `GET /api/weather`
-   **Google Maps API**: (Optional) For displaying a custom-styled resort location map.