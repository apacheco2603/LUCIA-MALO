import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Boda de Lucía & Malo | Mariage Lucía & Malo",
  description: "Acompáñanos a celebrar nuestra boda. Confirma tu asistencia, comparte tus fotos del evento y añade tus canciones favoritas a nuestra lista de Spotify.",
  keywords: ["Boda Lucía y Malo", "Mariage Lucía et Malo", "Invitación de Boda", "RSVP Boda"],
  authors: [{ name: "Lucía & Malo" }],
  openGraph: {
    title: "Boda de Lucía & Malo | Mariage Lucía & Malo",
    description: "Te invitamos a nuestro gran día. ¡Entra para ver todos los detalles, compartir tus fotos y pedir tus canciones!",
    url: "https://boda-lucia.app",
    siteName: "Boda Lucía & Malo",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Boda Lucía & Malo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased selection:bg-gold-500 selection:text-white bg-[#FAF7F2] text-[#2C2C2C] min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
