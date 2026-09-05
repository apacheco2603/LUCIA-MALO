"use client";

import { useState } from "react";
import {
  Clock,
  MapPin,
  Sparkles,
  Shirt,
  Gift,
  Check,
  Copy,
  ExternalLink,
  Utensils,
  Wine,
  Music,
  CalendarPlus,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Details() {
  const { t } = useLanguage();
  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const ibanNumber = "ES91 2100 0418 4502 0005 1234";

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIBAN(true);
    setTimeout(() => setCopiedIBAN(false), 3000);
  };

  const googleCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent("Boda Lucía & Malo 💍") +
    "&dates=20261003T173000Z/20261004T040000Z" +
    "&details=" +
    encodeURIComponent("¡Acompáñanos a celebrar nuestra boda! Finca La Gaivota, Madrid.") +
    "&location=" +
    encodeURIComponent("Finca La Gaivota, Carretera de La Coruña Km 22, 28224 Madrid, España");

  const downloadICS = () => {
    const icsData =
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "PRODID:-//Boda Lucia y Malo//ES\n" +
      "BEGIN:VEVENT\n" +
      "SUMMARY:Boda Lucía & Malo 💍\n" +
      "DESCRIPTION:¡Acompáñanos a celebrar nuestra boda! Finca La Gaivota, Madrid.\n" +
      "LOCATION:Finca La Gaivota, Carretera de La Coruña Km 22, 28224 Madrid, España\n" +
      "DTSTART:20261003T173000Z\n" +
      "DTEND:20261004T040000Z\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "boda_lucia_y_malo.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const itinerary = [
    {
      time: "17:30",
      title: t("itinerary_1_title"),
      description: t("itinerary_1_desc"),
      icon: Sparkles,
    },
    {
      time: "18:00",
      title: t("itinerary_2_title"),
      description: t("itinerary_2_desc"),
      icon: Clock,
    },
    {
      time: "19:30",
      title: t("itinerary_3_title"),
      description: t("itinerary_3_desc"),
      icon: Wine,
    },
    {
      time: "21:00",
      title: t("itinerary_4_title"),
      description: t("itinerary_4_desc"),
      icon: Utensils,
    },
    {
      time: "23:30",
      title: t("itinerary_5_title"),
      description: t("itinerary_5_desc"),
      icon: Music,
    },
  ];

  return (
    <section id="detalles" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          {t("details_subtitle")}
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
          {t("details_title")}
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-light">
          {t("details_desc")}
        </p>
      </div>

      {/* Featured Photo Card 2 of Lucía & Malo (Beach Walk) */}
      <div className="mb-20 max-w-4xl mx-auto rounded-3xl overflow-hidden glass-card border border-gold-500/30 p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
          <img
            src="/images/couple/photo_2.jpg"
            alt="Lucía & Malo"
            className="w-full h-full object-cover object-[center_30%]"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
            <span>Lucía & Malo</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-sage-900">
            "Paseos Junto al Mar"
          </h3>
          <p className="text-gray-600 font-light text-sm leading-relaxed">
            Cada viaje y cada paso que hemos dado juntos nos ha conducido a este momento inolvidable. ¡Estamos impacientes por celebrar con todos vosotros!
          </p>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="mb-24">
        <h3 className="font-serif text-2xl sm:text-3xl text-center text-sage-900 mb-12">
          {t("details_itinerary_title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {itinerary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center flex flex-col items-center justify-between border border-gold-500/20 relative group hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-serif text-2xl font-bold text-gold-600 mb-1">
                  {item.time}
                </span>
                <h4 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Buttons Bar */}
      <div className="glass-card rounded-3xl p-6 mb-16 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-sage-900">
              {t("cal_title")}
            </h4>
            <p className="text-xs text-gray-500">
              {t("hero_date")} • 17:30 H
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-sage-900 hover:bg-sage-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t("cal_btn_google")}</span>
            <ExternalLink className="w-4 h-4 text-gold-400" />
          </a>

          <button
            onClick={downloadICS}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t("cal_btn_ical")}</span>
          </button>
        </div>
      </div>

      {/* Location & Dress Code & Gifts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map & Venue Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              {t("venue_title")}
            </h3>
            <p className="text-sm font-semibold text-gold-600 mb-1">
              {t("venue_name")}
            </p>
            <p className="text-xs text-gray-600 mb-6">
              {t("venue_address")}
            </p>

            <div className="bg-sage-100/60 rounded-2xl p-4 text-xs text-gray-700 mb-6 space-y-2">
              <p>🚗 <strong>Parking</strong> {t("venue_parking")}</p>
              <p>🚌 <strong>Autobuses</strong> {t("venue_bus")}</p>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Finca+La+Gaivota+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-900 text-white font-medium text-xs tracking-wider uppercase hover:bg-sage-700 transition-colors shadow-md"
          >
            <span>{t("venue_maps_btn")}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Dress Code Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              {t("dress_title")}
            </h3>
            <p className="text-sm font-semibold text-gold-600 mb-4">
              {t("dress_subtitle")}
            </p>

            <div className="space-y-4 text-xs text-gray-600 font-light">
              <div className="p-3 bg-white/70 rounded-xl border border-gray-100">
                {t("dress_women")}
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-gray-100">
                {t("dress_men")}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gold-700 font-medium italic">
            {t("dress_quote")}
          </div>
        </div>

        {/* Gifts / Bank Account Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              {t("gift_title")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
              {t("gift_desc")}
            </p>

            <div className="bg-sage-900 text-white rounded-2xl p-4 mb-4 text-center relative overflow-hidden">
              <span className="text-[10px] uppercase text-gold-300 tracking-wider block mb-1">
                {t("gift_iban_label")}
              </span>
              <p className="font-mono text-sm tracking-wider font-semibold text-white">
                {ibanNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyIBAN}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              copiedIBAN
                ? "bg-green-600 text-white"
                : "bg-gold-500 hover:bg-gold-600 text-white shadow-md shadow-gold-500/20"
            }`}
          >
            {copiedIBAN ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t("gift_copied_btn")}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t("gift_copy_btn")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
