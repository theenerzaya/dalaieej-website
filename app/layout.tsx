import GoogleAnalytics from "./components/GoogleAnalytics";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="relative" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="relative" suppressHydrationWarning>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
