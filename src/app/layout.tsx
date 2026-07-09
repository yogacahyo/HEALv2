import type { Metadata } from "next";
import "./globals.css";
import { SIMRSDatasetProvider } from "@/context/SIMRSDatasetProvider";

export const metadata: Metadata = {
  title: "Hermina Employee Allocation Logic",
  description: "Prototype simulasi berbasis database SIMRS untuk membaca beban pasien, ketersediaan dokter dan perawat, risiko fatigue, dan rekomendasi alokasi shift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[var(--clay-bg)] text-on-surface antialiased">
        <SIMRSDatasetProvider>
          {children}
        </SIMRSDatasetProvider>
      </body>
    </html>
  );
}
