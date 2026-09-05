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
      {/* Full Bright Hero Background Image of Lucía & Malo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/couple/photo_5.jpg"
          alt="Lucía & Malo"
          className="w-full h-full object-cover object-[center_20%] brightness-105 contrast-105"
        />
        {/* Subtle, Light Gradient Overlay for Maximum Photo Brightness & Clear Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/90 via-black/20 to-black/35" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-gold-500/60 mb-6 animate-bounce shadow-xl">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-sm tracking-widest uppercase text-gold-200 font-semibold">
            {t("hero_we_are_getting_married")}
          </span>
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none mb-4 gold-text-gradient drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Lucía & Malo
        </h1>

        <p className="text-sm sm:text-lg md:text-xl font-serif italic text-white mb-10 max-w-2xl mx-auto font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {t("hero_quote")}
        </p>

        {/* Event Meta Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-white/30 shadow-xl">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span className="drop-shadow">{t("hero_date")}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-white/30 shadow-xl">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span className="drop-shadow">{t("hero_location")}</span>
          </div>
        </div>

        {/* Countdown Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 max-w-xl w-full mx-auto mb-10 border border-gold-500/50 shadow-2xl">
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
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs tracking-wider uppercase transition-all transform hover:-translate-y-1 shadow-xl shadow-gold-500/40"
          >
            {t("hero_btn_rsvp")}
          </a>
          <a
            href="#spotify"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/45 hover:bg-black/60 text-white border border-white/40 backdrop-blur-md font-semibold text-xs tracking-wider uppercase transition-all shadow-xl"
          >
            {t("hero_btn_spotify")}
          </a>
        </div>
      </div>

      <a
        href="#detalles"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-gold-400 transition-colors animate-bounce cursor-pointer z-10"
        aria-label="Detalles"
      >
        <ChevronDown className="w-7 h-7 drop-shadow" />
      </a>
    </section>
  );
}
