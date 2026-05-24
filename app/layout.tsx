import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Lumina Card – Online Invitations",
  description: "Buat undangan pernikahan digital yang elegan dengan Lumina Card",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Template fonts — loaded once for all invitation templates */}
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Cormorant+Infant:ital,wght@0,300..700;1,300..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Lora:ital,wght@0,400..700;1,400..700&family=DM+Mono:ital,wght@0,300..500;1,300..500&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Great+Vibes&family=Noto+Serif+JP:wght@200..900&family=Inter:wght@100..900&family=Poppins:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light font-display text-navy antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          <NavbarWrapper />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
