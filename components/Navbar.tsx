"use client";

import { useState, useEffect } from "react";
import { Music, Menu, X, Heart, Sparkles, Share2 } from "lucide-react";

interface NavbarProps {
  isPlayingAudio: boolean;
  toggleAudio: () => void;
}

export default function Navbar({ isPlayingAudio, toggleAudio }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#hero" },
    { name: "Nuestra Historia", href: "#historia" },
    { name: "Detalles & Mapa", href: "#detalles" },
    { name: "Confirmar RSVP", href: "#rsvp" },
    { name: "Fotos", href: "#fotos" },
    { name: "Playlist Spotify", href: "#spotify" },
  ];

  const handleShareWhatsApp = () => {
    const shareText =
      "¡Hola! Te invitamos a celebrar nuestra boda (Lucía & Malo) el 24 de Octubre de 2026. 💍\n\n" +
      "Entra en nuestra web para ver los detalles, confirmar tu asistencia y añadir tus canciones favoritas:\n" +
      "https://boda-lucia.app";

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel py-3 shadow-sm border-b border-gold-500/20"
          : "bg-gradient-to-b from-black/40 to-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-gold-500/60 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:scale-105 transition-transform">
            <span className="font-serif text-lg font-bold gold-text-gradient">
              L&M
            </span>
          </div>
          <span
            className={`font-serif text-xl sm:text-2xl tracking-widest uppercase transition-colors ${
              scrolled ? "text-sage-900" : "text-white"
            }`}
          >
            Lucía & Malo
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:text-gold-500 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500 hover:after:w-full after:transition-all ${
                scrolled ? "text-gray-700" : "text-white/90 drop-shadow-sm"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions: WhatsApp Share, Audio Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider transition-all shadow-sm"
            title="Compartir invitación por WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>

          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
              isPlayingAudio
                ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30 animate-pulse"
                : scrolled
                ? "bg-sage-100 text-sage-900 hover:bg-gold-100"
                : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
            }`}
            title={isPlayingAudio ? "Pausar música de ambiente" : "Reproducir música de ambiente"}
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">
              {isPlayingAudio ? "Música Activa" : "Música Boda"}
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-sage-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
            aria-label="Abrir Menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-dark text-white px-6 py-8 mt-2 mx-4 rounded-2xl border border-gold-500/30 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider text-gold-200 hover:text-gold-400 py-1 border-b border-white/10 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <Sparkles className="w-4 h-4 text-gold-400 opacity-60" />
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleShareWhatsApp();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 mt-4"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir por WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
