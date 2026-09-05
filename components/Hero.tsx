"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Heart, ChevronDown } from "lucide-react";

export default function Hero() {
  // Target wedding date: October 24, 2026
  const weddingDate = new Date("2026-10-24T18:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden"
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.jpg"
          alt="Boda Lucía y Malo"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/90 via-black/40 to-black/60" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white mt-8">
        {/* Monogram Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold-500/40 mb-6 animate-bounce">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-sm tracking-widest uppercase text-gold-200">
            ¡Nos Casamos!
          </span>
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none mb-4 gold-text-gradient drop-shadow-lg">
          Lucía & Malo
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-white/90 mb-8 max-w-2xl mx-auto">
          "Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más queremos los hace eternos."
        </p>

        {/* Event Meta Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm sm:text-base font-medium">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>Sábado, 24 de Octubre de 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>Finca Finca La Gaivota, Madrid</span>
          </div>
        </div>

        {/* Real-Time Dynamic Countdown Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto mb-10 border border-gold-500/40 shadow-2xl">
          <h2 className="text-xs uppercase tracking-widest text-gold-300 font-semibold mb-6">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm tracking-wider uppercase transition-all transform hover:-translate-y-1 shadow-lg shadow-gold-500/30"
          >
            Confirmar Asistencia (RSVP)
          </a>
          <a
            href="#fotos"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-sm tracking-wider uppercase transition-all"
          >
            Ver Fotos y Canciones
          </a>
        </div>
      </div>

      {/* Down Arrow Scroll Indicator */}
      <a
        href="#detalles"
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-gold-400 transition-colors animate-bounce cursor-pointer z-10"
        aria-label="Ir a detalles"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
