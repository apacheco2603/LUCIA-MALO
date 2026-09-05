"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Heart, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function Hero() {
  // Target wedding date: October 24, 2026
  const weddingDate = new Date("2026-10-24T18:00:00").getTime();

  // Dynamic photos array of the couple (currently 5, ready for 12+)
  const couplePhotos = [
    { url: "/images/couple/photo_1.jpg", caption: "Aventuras en el Desierto" },
    { url: "/images/couple/photo_2.jpg", caption: "Paseos Junto al Mar" },
    { url: "/images/couple/photo_3.jpg", caption: "Risas & Complicidad" },
    { url: "/images/couple/photo_4.jpg", caption: "Tardes de Viaje" },
    { url: "/images/couple/photo_5.jpg", caption: "Miradores Inolvidables" },
  ];

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Auto-rotate background couple photos every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % couplePhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [couplePhotos.length]);

  // Countdown timer logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const handlePrevPhoto = () => {
    setCurrentPhotoIdx((prev) =>
      prev === 0 ? couplePhotos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev + 1) % couplePhotos.length);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-sage-900 text-white"
    >
      {/* Dynamic Background Image Crossfade with Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {couplePhotos.map((photo, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentPhotoIdx ? "opacity-40 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ transition: "opacity 1.2s ease-in-out, transform 8s ease-out" }}
          >
            <img
              src={photo.url}
              alt="Lucía & Malo"
              className="w-full h-full object-cover object-[center_25%] filter blur-[3px]"
            />
          </div>
        ))}
        {/* Dark Elegant Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900 via-sage-900/70 to-sage-900/60" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold-500/40 mb-6 animate-bounce">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-sm tracking-widest uppercase text-gold-200">
            ¡Nos Casamos!
          </span>
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none mb-3 gold-text-gradient drop-shadow-2xl">
          Lucía & Malo
        </h1>

        <p className="text-sm sm:text-lg md:text-xl font-serif italic text-white/90 mb-8 max-w-2xl mx-auto font-light">
          "Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más queremos los hace eternos."
        </p>

        {/* Featured Photo Frame Card with Manual Slider Controls - Ensures Faces Are Fully Visible! */}
        <div className="relative w-full max-w-md mx-auto mb-10 group">
          <div className="glass-panel-dark rounded-3xl p-3 sm:p-4 border border-gold-500/40 shadow-2xl overflow-hidden relative">
            
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-black/50">
              <img
                src={couplePhotos[currentPhotoIdx].url}
                alt={couplePhotos[currentPhotoIdx].caption}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 hover:scale-105"
              />

              {/* Photo Caption Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center justify-between text-xs text-white">
                <span className="font-medium tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  {couplePhotos[currentPhotoIdx].caption}
                </span>
                <span className="text-[10px] text-gold-300 font-mono">
                  {currentPhotoIdx + 1} / {couplePhotos.length}
                </span>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-gold-500 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-gold-500 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-3">
            {couplePhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhotoIdx(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentPhotoIdx
                    ? "w-6 bg-gold-400"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Ir a foto ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Event Meta Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>Sábado, 24 de Octubre de 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>Finca La Gaivota, Madrid</span>
          </div>
        </div>

        {/* Real-Time Dynamic Countdown Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-xl w-full mx-auto mb-8 border border-gold-500/40 shadow-2xl">
          <h2 className="text-[11px] uppercase tracking-widest text-gold-300 font-semibold mb-4">
            Cuenta Regresiva para Nuestro Gran Día
          </h2>
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                Días
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                Horas
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                Minutos
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                Segundos
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-1 shadow-lg shadow-gold-500/30"
          >
            Confirmar Asistencia (RSVP)
          </a>
          <a
            href="#spotify"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-xs tracking-wider uppercase transition-all"
          >
            Sugerir Canción Spotify
          </a>
        </div>
      </div>

      {/* Down Arrow Scroll Indicator */}
      <a
        href="#detalles"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-gold-400 transition-colors animate-bounce cursor-pointer z-10"
        aria-label="Ir a detalles"
      >
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
}
