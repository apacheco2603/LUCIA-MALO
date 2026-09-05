"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Heart, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  // Target wedding date: October 3, 2026
  const weddingDate = new Date("2026-10-03T18:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden text-white"
    >
      {/* Full Hero Background Image of Lucía & Malo - Faces 100% visible with object-[center_20%] */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/couple/photo_5.jpg"
          alt="Lucía & Malo"
          className="w-full h-full object-cover object-[center_20%] transition-all duration-700"
        />
        {/* Dark Elegant Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900 via-sage-900/60 to-black/60" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-gold-500/50 mb-6 animate-bounce shadow-lg">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-sm tracking-widest uppercase text-gold-200">
            {t("hero_we_are_getting_married")}
          </span>
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none mb-4 gold-text-gradient drop-shadow-2xl">
          Lucía & Malo
        </h1>

        <p className="text-sm sm:text-lg md:text-xl font-serif italic text-white/95 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          {t("hero_quote")}
        </p>

        {/* Event Meta Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-md">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>{t("hero_date")}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-md">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{t("hero_location")}</span>
          </div>
        </div>

        {/* Countdown Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-xl w-full mx-auto mb-10 border border-gold-500/40 shadow-2xl">
          <h2 className="text-[11px] uppercase tracking-widest text-gold-300 font-semibold mb-4">
            {t("hero_countdown_title")}
          </h2>
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                {t("hero_days")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                {t("hero_hours")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                {t("hero_minutes")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-5xl font-bold text-white mb-1">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold-200">
                {t("hero_seconds")}
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
            {t("hero_btn_rsvp")}
          </a>
          <a
            href="#spotify"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            {t("hero_btn_spotify")}
          </a>
        </div>
      </div>

      <a
        href="#detalles"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-gold-400 transition-colors animate-bounce cursor-pointer z-10"
        aria-label="Detalles"
      >
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
}
